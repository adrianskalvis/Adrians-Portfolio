import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { LanguageProvider } from "@/contexts/LanguageContext";
import SkillsSection from "./SkillsSection";

const renderSkills = () =>
  render(
    <LanguageProvider>
      <SkillsSection />
    </LanguageProvider>,
  );

describe("SkillsSection", () => {
  beforeEach(() => localStorage.clear());

  it("lists the AI tools with the products used inside Claude and ChatGPT", () => {
    renderSkills();

    const group = screen.getByRole("heading", { name: /AI tools/i }).closest(".skills-group") as HTMLElement;
    expect(group).not.toBeNull();
    const items = within(group).getAllByRole("listitem").map((item) => item.textContent);
    expect(items).toEqual([
      "ClaudeCode · Duet · Cowork",
      "ChatGPTChat · Codex",
      "Higgsfield",
      "Gemini",
      "Suno",
      "ElevenLabs",
    ]);
  });

  it("numbers every group in the site's roman numerals", () => {
    renderSkills();

    const numerals = [...document.querySelectorAll(".skills-group__numeral")].map((n) => n.textContent);
    expect(numerals).toEqual(["I", "II", "III", "IV", "V"]);
  });

  it("keeps the note under R", () => {
    renderSkills();

    expect(screen.getByText("Currently studying")).toBeInTheDocument();
  });
});
