import type { NdaFormData } from "./types";

/** Today's date as YYYY-MM-DD in the user's local time zone. */
export function todayIso(now: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** "2026-10-16" -> "October 16, 2026". Returns "" for empty or invalid input. */
export function formatLongDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return "";
  const [, y, m, d] = match.map(Number);
  // Build in UTC and format in UTC so the calendar date never shifts by time zone.
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCMonth() !== m - 1) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function years(n: number): string {
  return `${n} ${n === 1 ? "year" : "years"}`;
}

export function describeMndaTerm(data: NdaFormData): string {
  return data.mndaTermType === "expires"
    ? `Expires ${years(data.mndaTermYears)} from Effective Date.`
    : "Continues until terminated in accordance with the terms of the MNDA.";
}

export function describeConfidentialityTerm(data: NdaFormData): string {
  return data.confidentialityTermType === "years"
    ? `${years(data.confidentialityTermYears)} from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.`
    : "In perpetuity.";
}

/** e.g. "Mutual-NDA-Acme-Inc-Globex.pdf"; falls back to "Mutual-NDA.pdf". */
export function pdfFileName(data: NdaFormData): string {
  const slug = (s: string) =>
    s
      .trim()
      .replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const parts = [data.party1.company, data.party2.company].map(slug).filter(Boolean);
  return ["Mutual-NDA", ...parts].join("-") + ".pdf";
}
