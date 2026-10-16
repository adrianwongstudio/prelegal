import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseInlines, parseTerms } from "./parseTerms";

describe("parseInlines", () => {
  it("splits bold, defined terms and links out of plain text", () => {
    expect(
      parseInlines(
        'Use for the <span class="coverpage_link">Purpose</span> (“**MNDA**”), see [CC BY 4.0](https://example.com).',
      ),
    ).toEqual([
      { type: "text", text: "Use for the " },
      { type: "term", text: "Purpose" },
      { type: "text", text: " (“" },
      { type: "bold", text: "MNDA" },
      { type: "text", text: "”), see " },
      { type: "link", text: "CC BY 4.0", href: "https://example.com" },
      { type: "text", text: "." },
    ]);
  });

  it("returns plain text untouched", () => {
    expect(parseInlines("No markup here.")).toEqual([{ type: "text", text: "No markup here." }]);
  });

  it("returns an empty list for an empty string", () => {
    expect(parseInlines("")).toEqual([]);
  });
});

describe("parseTerms", () => {
  it("parses headings, numbered clauses and paragraphs", () => {
    const blocks = parseTerms(
      "# Standard Terms\n\n1. **Intro**. First.\n\n2. **Next**. Second\ncontinued.\n\nFooter.",
    );
    expect(blocks).toEqual([
      { type: "heading", text: "Standard Terms" },
      {
        type: "clause",
        number: 1,
        content: [
          { type: "bold", text: "Intro" },
          { type: "text", text: ". First." },
        ],
      },
      {
        type: "clause",
        number: 2,
        content: [
          { type: "bold", text: "Next" },
          { type: "text", text: ". Second continued." },
        ],
      },
      { type: "paragraph", content: [{ type: "text", text: "Footer." }] },
    ]);
  });

  it("parses the real Mutual NDA Standard Terms template", () => {
    const markdown = fs.readFileSync(
      path.resolve(__dirname, "../../../../templates/Mutual-NDA.md"),
      "utf-8",
    );
    const blocks = parseTerms(markdown);

    expect(blocks[0]).toEqual({ type: "heading", text: "Standard Terms" });

    const clauses = blocks.filter((b) => b.type === "clause");
    expect(clauses.map((c) => c.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

    const terms = new Set(
      clauses.flatMap((c) => c.content).filter((i) => i.type === "term").map((i) => i.text),
    );
    expect(terms).toEqual(
      new Set(["Purpose", "Effective Date", "MNDA Term", "Term of Confidentiality", "Governing Law", "Jurisdiction"]),
    );

    // No raw markup should survive parsing.
    const allText = blocks
      .flatMap((b) => (b.type === "heading" ? [b.text] : b.content.map((i) => i.text)))
      .join("");
    expect(allText).not.toMatch(/\*\*|<span|<\/span>|\]\(/);
  });
});
