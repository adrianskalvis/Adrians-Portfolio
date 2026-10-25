import type { DriftLayers } from "./sky";

/* Draws the drifting hero sky with WebGL2: for every pixel, the still's light (plate) plus the
   cloud strip shifted sideways by the drift, faded behind the text by a mask:

     colour = plate(x, y) + (clouds(x - drift, y) - 128) * mix(floor, 1, mask)

   The strip repeats (texture wrap), so the loop has no seam and no end. Motion is computed
   from the clock on every frame, so it stays smooth at any refresh rate. */

type Mode = "light" | "dark";
const MODES: Mode[] = ["light", "dark"];

export type DriftOptions = {
  scenes: Partial<Record<Mode, DriftLayers>>;
  /** px of the still per second */
  speed: number;
  focus: readonly [number, number];
  mask: {
    ramp: readonly [number, number];
    band: readonly [number, number];
    portraitBand: readonly [number, number];
  };
  /** true once the canvas shows a frame of the current theme; false while it cannot */
  onVisible: (visible: boolean) => void;
};

const VERT = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D u_plate0;
uniform sampler2D u_clouds0;
uniform sampler2D u_plate1;
uniform sampler2D u_clouds1;
uniform vec2 u_canvas;
uniform vec2 u_image;
uniform vec2 u_strip;
uniform vec2 u_focus;
uniform float u_offset;
uniform float u_mix;
uniform vec4 u_mask;
uniform vec2 u_floor;
in vec2 v_uv;
out vec4 outColor;

vec3 scene(sampler2D plate, sampler2D clouds, vec2 q, float strip, float floorAmount, float m) {
  vec3 sky = texture(plate, q / u_image).rgb;
  vec3 cloud = texture(clouds, vec2((q.x - u_offset) / strip, q.y / u_image.y)).rgb - 128.0 / 255.0;
  return sky + cloud * mix(floorAmount, 1.0, m);
}

void main() {
  // object-fit: cover with the focus point, like the poster image underneath
  float s = max(u_canvas.x / u_image.x, u_canvas.y / u_image.y);
  vec2 q = (v_uv * u_canvas - (u_canvas - u_image * s) * u_focus) / s;
  float ramp = u_mask.y > u_mask.x ? smoothstep(u_mask.x, u_mask.y, v_uv.x) : 0.0;
  float m = max(ramp, smoothstep(u_mask.z, u_mask.w, v_uv.y));
  vec3 a = vec3(0.0);
  vec3 b = vec3(0.0);
  if (u_mix < 0.999) a = scene(u_plate0, u_clouds0, q, u_strip.x, u_floor.x, m);
  if (u_mix > 0.001) b = scene(u_plate1, u_clouds1, q, u_strip.y, u_floor.y, m);
  outColor = vec4(mix(a, b, u_mix), 1.0);
}`;

const MIX_MS = 700;

type SceneTextures = { plate: WebGLTexture; clouds: WebGLTexture; state: "idle" | "loading" | "ready" | "failed" };

const loadImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`could not load ${url}`));
    img.src = url;
  });

export class SkyDrift {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private buffer: WebGLBuffer;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private tex = {} as Record<Mode, SceneTextures>;
  private mode: Mode;
  private mix: number;
  private mixFrom = 0;
  private mixTo = 0;
  private mixStart = -1;
  private playing = false;
  private raf = 0;
  private t0 = -1;
  private lastDraw = -1;
  private lastFrame = -1;
  private interval = 16.7;
  private parity = 0;
  private visible = false;
  private dead = false;
  private prefetch = 0;
  private resizeObserver: ResizeObserver;

  /** Returns null when WebGL2 is not available; the poster then stays. */
  static create(canvas: HTMLCanvasElement, options: DriftOptions, mode: Mode) {
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: "low-power",
      // Software WebGL (no usable GPU) would burn CPU for a background: keep the poster then.
      failIfMajorPerformanceCaveat: true,
    });
    if (!gl) return null;
    try {
      return new SkyDrift(canvas, gl, options, mode);
    } catch {
      return null;
    }
  }

  private constructor(
    private canvas: HTMLCanvasElement,
    gl: WebGL2RenderingContext,
    private options: DriftOptions,
    mode: Mode,
  ) {
    this.gl = gl;
    this.mode = mode;
    this.mix = this.mixFrom = this.mixTo = mode === "dark" ? 1 : 0;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "shader");
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "program");
    this.program = program;
    gl.useProgram(program);
    for (const name of ["u_canvas", "u_image", "u_strip", "u_focus", "u_offset", "u_mix", "u_mask", "u_floor"]) {
      this.u[name] = gl.getUniformLocation(program, name);
    }
    ["u_plate0", "u_clouds0", "u_plate1", "u_clouds1"].forEach((name, unit) => {
      gl.uniform1i(gl.getUniformLocation(program, name), unit);
    });

    // One triangle that covers the whole canvas.
    this.buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    for (const m of MODES) {
      this.tex[m] = { plate: this.placeholder(), clouds: this.placeholder(), state: "idle" };
    }

    canvas.addEventListener("webglcontextlost", this.onLost);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();
    this.load(mode);
  }

  setMode(mode: Mode) {
    if (this.dead || mode === this.mode) return;
    this.mode = mode;
    const target = mode === "dark" ? 1 : 0;
    if (this.tex[mode].state === "ready") {
      this.mixFrom = this.mix;
      this.mixTo = target;
      this.mixStart = -1;
      this.kick();
    } else {
      // Not loaded yet: hide the canvas so the posters crossfade, show it again once ready.
      this.mix = this.mixFrom = this.mixTo = target;
      this.setVisible(false);
      this.load(mode);
    }
  }

  setPlaying(playing: boolean) {
    if (this.dead) return;
    this.playing = playing;
    if (playing) this.kick();
  }

  destroy() {
    if (this.dead) return;
    this.dead = true;
    cancelAnimationFrame(this.raf);
    window.clearTimeout(this.prefetch);
    this.resizeObserver.disconnect();
    this.canvas.removeEventListener("webglcontextlost", this.onLost);
    const gl = this.gl;
    if (!gl.isContextLost()) {
      for (const m of MODES) {
        gl.deleteTexture(this.tex[m].plate);
        gl.deleteTexture(this.tex[m].clouds);
      }
      gl.deleteBuffer(this.buffer);
      gl.deleteProgram(this.program);
    }
  }

  private onLost = (event: Event) => {
    event.preventDefault();
    this.setVisible(false);
    this.destroy();
  };

  private placeholder() {
    const gl = this.gl;
    const t = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB8, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([128, 128, 128]));
    return t;
  }

  private async load(mode: Mode) {
    const scene = this.options.scenes[mode];
    const slot = this.tex[mode];
    if (!scene || slot.state !== "idle") return;
    slot.state = "loading";
    try {
      const [plate, clouds] = await Promise.all([loadImage(scene.plate), loadImage(scene.clouds)]);
      if (this.dead) return;
      this.upload(slot.plate, plate, false);
      this.upload(slot.clouds, clouds, true);
      slot.state = "ready";
    } catch {
      slot.state = "failed";
      return;
    }
    if (mode === this.mode) {
      this.mix = mode === "dark" ? 1 : 0;
      this.mixStart = -1;
      this.mixTo = this.mix;
      this.draw(performance.now());
      this.setVisible(true);
      this.kick();
      // Fetch the other theme a little later, so the first switch crossfades at once.
      const other = mode === "dark" ? "light" : "dark";
      this.prefetch = window.setTimeout(() => this.load(other), 2500);
    }
  }

  private upload(texture: WebGLTexture, image: HTMLImageElement, clouds: boolean) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // The strip holds differences, not colours: no colour management may touch it.
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB8, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, clouds ? gl.REPEAT : gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    if (clouds) {
      // Mipmaps keep fine cloud detail from shimmering while it moves on smaller screens.
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  }

  private setVisible(visible: boolean) {
    if (visible === this.visible) return;
    this.visible = visible;
    this.options.onVisible(visible);
  }

  private resize() {
    if (this.dead) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(this.canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    if (this.tex[this.mode].state === "ready") this.draw(performance.now());
  }

  private kick() {
    if (!this.raf && !this.dead) this.raf = requestAnimationFrame(this.frame);
  }

  private frame = (now: number) => {
    this.raf = 0;
    if (this.dead) return;
    const mixing = this.mix !== this.mixTo;
    if (this.playing || mixing) this.raf = requestAnimationFrame(this.frame);
    if (this.lastFrame >= 0) this.interval += (Math.min(now - this.lastFrame, 50) - this.interval) * 0.1;
    this.lastFrame = now;
    // On 120 Hz and faster screens every other frame is drawn: still an even cadence, half the work.
    this.parity ^= 1;
    if (!mixing && this.interval < 10.5 && this.parity) return;
    this.draw(now);
  };

  private draw(now: number) {
    const gl = this.gl;
    if (gl.isContextLost()) return;
    const cur = this.options.scenes[this.mode];
    if (!cur || this.tex[this.mode].state !== "ready") return;
    this.lastDraw = now;
    if (this.t0 < 0) this.t0 = now;

    if (this.mix !== this.mixTo) {
      if (this.mixStart < 0) this.mixStart = now;
      const t = Math.min(1, (now - this.mixStart) / MIX_MS);
      const eased = t * t * (3 - 2 * t);
      this.mix = t >= 1 ? this.mixTo : this.mixFrom + (this.mixTo - this.mixFrom) * eased;
    }

    const light = this.options.scenes.light ?? cur;
    const dark = this.options.scenes.dark ?? cur;
    const { ramp, band, portraitBand } = this.options.mask;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const portrait = w / h <= 4 / 5;
    // Both scenes share one clock and one strip width, so the theme crossfade lines up.
    const offset = (((now - this.t0) / 1000) * this.options.speed) % cur.strip;

    gl.viewport(0, 0, w, h);
    gl.useProgram(this.program);
    gl.uniform2f(this.u.u_canvas, w, h);
    gl.uniform2f(this.u.u_image, cur.width, cur.height);
    gl.uniform2f(this.u.u_strip, light.strip, dark.strip);
    gl.uniform2f(this.u.u_focus, this.options.focus[0], this.options.focus[1]);
    gl.uniform1f(this.u.u_offset, offset);
    gl.uniform1f(this.u.u_mix, this.mix);
    // Phones held upright (same 4:5 limit as the CSS): no fade across, a band from the middle down.
    if (portrait) gl.uniform4f(this.u.u_mask, 1, 0, portraitBand[0], portraitBand[1]);
    else gl.uniform4f(this.u.u_mask, ramp[0], ramp[1], band[0], band[1]);
    gl.uniform2f(this.u.u_floor, light.floor, dark.floor);
    MODES.forEach((m, i) => {
      gl.activeTexture(gl.TEXTURE0 + i * 2);
      gl.bindTexture(gl.TEXTURE_2D, this.tex[m].plate);
      gl.activeTexture(gl.TEXTURE1 + i * 2);
      gl.bindTexture(gl.TEXTURE_2D, this.tex[m].clouds);
    });
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
