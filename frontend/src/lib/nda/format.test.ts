import { describe, expect, it } from "vitest";
import {
  describeConfidentialityTerm,
  describeMndaTerm,
  formatLongDate,
  pdfFileName,
  todayIso,
  years,
} from "./format";
import { createDefaultFormData } from "./types";

const base = createDefaultFormData("2026-10-16");

describe("todayIso", () => {
  it("formats a local date as YYYY-MM-DD with zero padding", () => {
    expect(todayIso(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("formatLongDate", () => {
  it("formats an ISO date without shifting the day", () => {
    expect(formatLongDate("2026-10-16")).toBe("October 16, 2026");
    expect(formatLongDate("2026-01-01")).toBe("January 1, 2026");
  });

  it("returns an empty string for empty or invalid input", () => {
    expect(formatLongDate("")).toBe("");
    expect(formatLongDate("not-a-date")).toBe("");
    expect(formatLongDate("2026-02-31")).toBe("");
  });
});

describe("years", () => {
  it("pluralises", () => {
    expect(years(1)).toBe("1 year");
    expect(years(3)).toBe("3 years");
  });
});

describe("term descriptions", () => {
  it("describes a fixed MNDA term", () => {
    expect(describeMndaTerm({ ...base, mndaTermYears: 2 })).toBe("Expires 2 years from Effective Date.");
  });

  it("describes an MNDA that continues until terminated", () => {
    expect(describeMndaTerm({ ...base, mndaTermType: "untilTerminated" })).toBe(
      "Continues until terminated in accordance with the terms of the MNDA.",
    );
  });

  it("describes a fixed confidentiality term with the trade-secret carve-out", () => {
    expect(describeConfidentialityTerm(base)).toMatch(/^1 year from Effective Date, but in the case of trade secrets/);
  });

  it("describes a perpetual confidentiality term", () => {
    expect(describeConfidentialityTerm({ ...base, confidentialityTermType: "perpetual" })).toBe("In perpetuity.");
  });
});

describe("pdfFileName", () => {
  it("falls back to a generic name when companies are blank", () => {
    expect(pdfFileName(base)).toBe("Mutual-NDA.pdf");
  });

  it("includes sanitised company names", () => {
    expect(
      pdfFileName({
        ...base,
        party1: { ...base.party1, company: " Acme, Inc. " },
        party2: { ...base.party2, company: "Globex/Corp" },
      }),
    ).toBe("Mutual-NDA-Acme-Inc-Globex-Corp.pdf");
  });
});
