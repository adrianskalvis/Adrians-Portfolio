import { act, render } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { triggerIntersection } from "@/test/intersection-observer";
import { useInViewPlayback } from "./use-in-view-playback";

const SRC = "/project-videos/swipegami.mp4";

const Player = ({ active }: { active: boolean }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const playing = useInViewPlayback(ref, SRC, active);
  return <video ref={ref} data-testid="video" data-playing={String(playing)} />;
};

const setup = (active = true) => {
  const view = render(<Player active={active} />);
  const video = view.getByTestId("video") as HTMLVideoElement;
  return { ...view, video };
};

describe("useInViewPlayback", () => {
  afterEach(() => {
    vi.mocked(HTMLMediaElement.prototype.play).mockClear();
    vi.mocked(HTMLMediaElement.prototype.pause).mockClear();
  });

  it("does not download the video until it is on screen", () => {
    const { video } = setup();

    expect(video.getAttribute("src")).toBeNull();
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it("loads and plays the video muted once it is on screen", async () => {
    const { video } = setup();

    await act(async () => triggerIntersection(video, true));

    expect(video.getAttribute("src")).toBe(SRC);
    expect(video.muted).toBe(true);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    expect(video.dataset.playing).toBe("true");
  });

  it("pauses the video when it leaves the screen", async () => {
    const { video } = setup();
    await act(async () => triggerIntersection(video, true));

    await act(async () => triggerIntersection(video, false));

    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    expect(video.dataset.playing).toBe("false");
  });

  it("uses the newest state when a fast scroll delivers enter and exit together", async () => {
    const { video } = setup();

    await act(async () => triggerIntersection(video, [true, false]));

    expect(video.getAttribute("src")).toBeNull();
    expect(video.dataset.playing).toBe("false");
  });

  it("shows the poster again when the browser pauses the video itself", async () => {
    const { video } = setup();
    await act(async () => triggerIntersection(video, true));

    await act(async () => video.dispatchEvent(new Event("pause")));

    expect(video.dataset.playing).toBe("false");
  });

  it("keeps the poster when the browser blocks autoplay", async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockImplementationOnce(() => Promise.reject(new Error("blocked")));
    const { video } = setup();

    await act(async () => triggerIntersection(video, true));

    expect(video.dataset.playing).toBe("false");
  });

  it("never loads the video while inactive", async () => {
    const { video } = setup(false);

    await act(async () => triggerIntersection(video, true));

    expect(video.getAttribute("src")).toBeNull();
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it("resumes when it becomes active again while still on screen", async () => {
    const { video, rerender } = setup(true);
    await act(async () => triggerIntersection(video, true));

    await act(async () => rerender(<Player active={false} />));
    expect(video.dataset.playing).toBe("false");

    await act(async () => rerender(<Player active />));
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
    expect(video.dataset.playing).toBe("true");
  });
});
