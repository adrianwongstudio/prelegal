export interface Party {
  name: string;
  title: string;
  company: string;
  noticeAddress: string;
}

export type MndaTermType = "expires" | "untilTerminated";
export type ConfidentialityTermType = "years" | "perpetual";

export interface NdaFormData {
  purpose: string;
  /** ISO date (YYYY-MM-DD). */
  effectiveDate: string;
  mndaTermType: MndaTermType;
  mndaTermYears: number;
  confidentialityTermType: ConfidentialityTermType;
  confidentialityTermYears: number;
  governingLaw: string;
  jurisdiction: string;
  modifications: string;
  party1: Party;
  party2: Party;
}

const emptyParty: Party = { name: "", title: "", company: "", noticeAddress: "" };

/** Defaults mirror the bracketed suggestions in templates/Mutual-NDA-coverpage.md. */
export function createDefaultFormData(today: string): NdaFormData {
  return {
    purpose:
      "Evaluating whether to enter into a business relationship with the other party.",
    effectiveDate: today,
    mndaTermType: "expires",
    mndaTermYears: 1,
    confidentialityTermType: "years",
    confidentialityTermYears: 1,
    governingLaw: "",
    jurisdiction: "",
    modifications: "",
    party1: { ...emptyParty },
    party2: { ...emptyParty },
  };
}
