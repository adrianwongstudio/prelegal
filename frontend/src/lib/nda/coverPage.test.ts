import { describe, expect, it } from "vitest";
import { buildCoverPage } from "./coverPage";
import { createDefaultFormData } from "./types";

const base = createDefaultFormData("2026-10-16");

describe("buildCoverPage", () => {
  it("lists the cover page sections in template order", () => {
    expect(buildCoverPage(base).fields.map((f) => f.title)).toEqual([
      "Purpose",
      "Effective Date",
      "MNDA Term",
      "Term of Confidentiality",
      "Governing Law & Jurisdiction",
      "MNDA Modifications",
    ]);
  });

  it("uses filled-in values and formats the effective date", () => {
    const { fields } = buildCoverPage({ ...base, governingLaw: "Delaware" });
    expect(fields[1].values).toEqual([{ text: "October 16, 2026", missing: false }]);
    expect(fields[4].values[0]).toEqual({ text: "Governing Law: Delaware", missing: false });
  });

  it("falls back to the template placeholders for blank fields", () => {
    const { fields, partyRows } = buildCoverPage({ ...base, purpose: "  ", effectiveDate: "" });
    expect(fields[0].values[0]).toEqual({ text: "[Purpose]", missing: true });
    expect(fields[1].values[0]).toEqual({ text: "[Today’s date]", missing: true });
    expect(fields[4].values[0]).toEqual({ text: "Governing Law: [Fill in state]", missing: true });
    expect(partyRows.find((r) => r.label === "Company")?.party1).toEqual({ text: "[Company]", missing: true });
  });

  it("leaves signature and date rows blank for signing", () => {
    const { partyRows } = buildCoverPage(base);
    expect(partyRows.map((r) => r.label)).toEqual([
      "Signature",
      "Print Name",
      "Title",
      "Company",
      "Notice Address",
      "Date",
    ]);
    for (const label of ["Signature", "Date"]) {
      const row = partyRows.find((r) => r.label === label);
      expect(row?.party1).toBeNull();
      expect(row?.party2).toBeNull();
    }
  });

  it("fills each party's details into its own column", () => {
    const { partyRows } = buildCoverPage({
      ...base,
      party1: { ...base.party1, name: "Ada Lovelace" },
      party2: { ...base.party2, name: "Alan Turing" },
    });
    const nameRow = partyRows.find((r) => r.label === "Print Name");
    expect(nameRow?.party1?.text).toBe("Ada Lovelace");
    expect(nameRow?.party2?.text).toBe("Alan Turing");
  });
});
