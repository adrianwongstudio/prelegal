import {
  describeConfidentialityTerm,
  describeMndaTerm,
  formatLongDate,
} from "./format";
import type { NdaFormData, Party } from "./types";

/**
 * Renderer-agnostic model of the Cover Page in templates/Mutual-NDA-coverpage.md.
 * Both the HTML preview and the PDF render from this, so they can't drift apart.
 */

export const COVER_PAGE_TITLE = "Mutual Non-Disclosure Agreement";

export const COVER_PAGE_INTRO =
  "This Mutual Non-Disclosure Agreement (the “MNDA”) consists of: (1) this Cover Page (“Cover Page”) and (2) the Common Paper Mutual NDA Standard Terms Version 1.0 (“Standard Terms”) identical to those posted at commonpaper.com/standards/mutual-nda/1.0. Any modifications of the Standard Terms should be made on the Cover Page, which will control over conflicts with the Standard Terms.";

export const COVER_PAGE_SIGNING_STATEMENT =
  "By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.";

export const ATTRIBUTION =
  "Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under CC BY 4.0.";

/** A filled-in value, or the template's bracketed placeholder when left blank. */
export interface FieldValue {
  text: string;
  missing: boolean;
}

export interface CoverPageField {
  title: string;
  label?: string;
  values: FieldValue[];
}

export interface PartyRow {
  label: string;
  /** null = left blank for signing (signature, date). */
  party1: FieldValue | null;
  party2: FieldValue | null;
}

export interface CoverPage {
  fields: CoverPageField[];
  partyRows: PartyRow[];
}

function value(text: string, placeholder: string): FieldValue {
  const trimmed = text.trim();
  return trimmed ? { text: trimmed, missing: false } : { text: placeholder, missing: true };
}

function partyRow(label: string, key: keyof Party, placeholder: string, data: NdaFormData): PartyRow {
  return {
    label,
    party1: value(data.party1[key], placeholder),
    party2: value(data.party2[key], placeholder),
  };
}

export function buildCoverPage(data: NdaFormData): CoverPage {
  return {
    fields: [
      {
        title: "Purpose",
        label: "How Confidential Information may be used",
        values: [value(data.purpose, "[Purpose]")],
      },
      {
        title: "Effective Date",
        values: [value(formatLongDate(data.effectiveDate), "[Today’s date]")],
      },
      {
        title: "MNDA Term",
        label: "The length of this MNDA",
        values: [{ text: describeMndaTerm(data), missing: false }],
      },
      {
        title: "Term of Confidentiality",
        label: "How long Confidential Information is protected",
        values: [{ text: describeConfidentialityTerm(data), missing: false }],
      },
      {
        title: "Governing Law & Jurisdiction",
        values: [
          prefixed("Governing Law: ", value(data.governingLaw, "[Fill in state]")),
          prefixed(
            "Jurisdiction: ",
            value(data.jurisdiction, "[Fill in city or county and state, i.e. “courts located in New Castle, DE”]"),
          ),
        ],
      },
      {
        title: "MNDA Modifications",
        values: [value(data.modifications, "None.")],
      },
    ],
    partyRows: [
      { label: "Signature", party1: null, party2: null },
      partyRow("Print Name", "name", "[Name]", data),
      partyRow("Title", "title", "[Title]", data),
      partyRow("Company", "company", "[Company]", data),
      partyRow("Notice Address", "noticeAddress", "[Email or postal address]", data),
      { label: "Date", party1: null, party2: null },
    ],
  };
}

function prefixed(prefix: string, v: FieldValue): FieldValue {
  return { ...v, text: prefix + v.text };
}
