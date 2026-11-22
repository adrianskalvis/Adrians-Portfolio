import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProjectsScatter from "./ProjectsScatter";

const renderProjects = () =>
  render(
    <LanguageProvider>
      <ProjectsScatter />
    </LanguageProvider>,
  );

describe("ProjectsScatter", () => {
  beforeEach(() => localStorage.clear());

  it("lists Swipegami, Mini Game, KiberDrošs and the Windows 95 Blog without the career assistant", () => {
    renderProjects();

    const section = document.getElementById("projects")!;
    expect(within(section).getAllByRole("button", { name: /play video/i })).toHaveLength(4);
    expect(section).toHaveTextContent("Swipegami");
    expect(section).toHaveTextContent("Mini Game");
    expect(section).toHaveTextContent("KiberDrošs");
    expect(section).toHaveTextContent("Windows 95 Blog");
    expect(section).not.toHaveTextContent(/career assistant/i);
  });

  it("titles the section Explore my work", () => {
    renderProjects();

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Explore my work");
  });

  it("numbers the projects Swipegami, Windows 95 Blog, KiberDrošs, Mini Game", () => {
    renderProjects();

    const numeralFor = (title: string) =>
      [...document.querySelectorAll(".project-shard__name")]
        .find((name) => name.textContent?.includes(title))
        ?.querySelector(".project-shard__numeral")?.textContent;
    expect(numeralFor("Swipegami")).toBe("I");
    expect(numeralFor("Windows 95 Blog")).toBe("II");
    expect(numeralFor("KiberDrošs")).toBe("III");
    expect(numeralFor("Mini Game")).toBe("IV");
  });

  it("invites a tap on the whole frame with an expand badge", () => {
    renderProjects();

    const frame = screen.getByRole("button", { name: /Swipegami.*play video/i });
    expect(frame.querySelector(".project-shard__expand svg.lucide-maximize2")).toBeInTheDocument();
    expect(frame).toHaveTextContent("Watch with sound");
  });

  it("shows each ad as a muted live cover over a lazy poster", () => {
    renderProjects();

    const frame = screen.getByRole("button", { name: /Swipegami.*play video/i });
    const poster = frame.querySelector("img")!;
    const video = frame.querySelector("video")!;
    expect(poster).toHaveAttribute("src", "/project-videos/swipegami-poster.jpg");
    expect(poster).toHaveAttribute("loading", "lazy");
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("preload", "none");
    expect(video.muted).toBe(true);
  });

  it("keeps a link to each live project", () => {
    renderProjects();

    expect(screen.getByRole("link", { name: /view game/i })).toHaveAttribute("href", "https://adrianskalvis.github.io/minigame/");
    expect(screen.getByRole("link", { name: /visit blog/i })).toHaveAttribute("href", "https://window95.projekts.area.lv/");
  });

  it("opens the full ad with sound when a frame is tapped and closes it again", async () => {
    renderProjects();

    fireEvent.click(screen.getByRole("button", { name: /Mini Game.*play video/i }));

    const dialog = await screen.findByRole("dialog", { name: "Mini Game" });
    const video = dialog.querySelector("video")!;
    expect(video).toHaveAttribute("src", "/project-videos/mini-game.mp4");
    expect(video).toHaveAttribute("controls");
    expect(video.muted).toBe(false);

    const pause = vi.spyOn(video, "pause");
    fireEvent.click(within(dialog).getByRole("button", { name: /close video/i }));
    // Sound stops at once; the dialog itself fades out over 0.2 s.
    expect(pause).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("stays open when a seek drag on the player ends over the backdrop", async () => {
    renderProjects();
    fireEvent.click(screen.getByRole("button", { name: /Swipegami.*play video/i }));
    const dialog = await screen.findByRole("dialog", { name: "Swipegami" });

    fireEvent.pointerDown(dialog.querySelector("video")!);
    fireEvent.click(dialog);
    // Longer than the 0.2 s exit fade, so a wrongly closed dialog would be gone by now.
    await act(() => new Promise((resolve) => setTimeout(resolve, 600)));

    expect(screen.getByRole("dialog", { name: "Swipegami" })).toBeInTheDocument();
  });

  it("closes when the backdrop itself is tapped", async () => {
    renderProjects();
    fireEvent.click(screen.getByRole("button", { name: /Swipegami.*play video/i }));
    const dialog = await screen.findByRole("dialog", { name: "Swipegami" });

    fireEvent.pointerDown(dialog);
    fireEvent.click(dialog);

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
