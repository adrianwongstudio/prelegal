"use client";

import type { ReactNode } from "react";
import { years } from "@/lib/nda/format";
import type { NdaFormData, Party } from "@/lib/nda/types";

interface NdaFormProps {
  data: NdaFormData;
  onChange: (data: NdaFormData) => void;
}

const YEAR_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200";

export function NdaForm({ data, onChange }: NdaFormProps) {
  const set = <K extends keyof NdaFormData>(key: K, value: NdaFormData[K]) =>
    onChange({ ...data, [key]: value });

  const setParty = (key: "party1" | "party2", field: keyof Party, value: string) =>
    onChange({ ...data, [key]: { ...data[key], [field]: value } });

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      <Section title="Agreement">
        <Field label="Purpose" hint="How Confidential Information may be used">
          <textarea
            className={inputClass}
            rows={3}
            value={data.purpose}
            onChange={(e) => set("purpose", e.target.value)}
          />
        </Field>

        <Field label="Effective Date">
          <input
            type="date"
            className={inputClass}
            value={data.effectiveDate}
            onChange={(e) => set("effectiveDate", e.target.value)}
          />
        </Field>

        <TermChoice
          legend="MNDA Term"
          hint="The length of this MNDA"
          name="mndaTermType"
          value={data.mndaTermType}
          years={data.mndaTermYears}
          options={[
            { value: "expires", label: "Expires after", withYears: true },
            { value: "untilTerminated", label: "Continues until terminated" },
          ]}
          onTypeChange={(v) => set("mndaTermType", v)}
          onYearsChange={(n) => set("mndaTermYears", n)}
        />

        <TermChoice
          legend="Term of Confidentiality"
          hint="How long Confidential Information is protected"
          name="confidentialityTermType"
          value={data.confidentialityTermType}
          years={data.confidentialityTermYears}
          options={[
            { value: "years", label: "Protected for", withYears: true },
            { value: "perpetual", label: "In perpetuity" },
          ]}
          onTypeChange={(v) => set("confidentialityTermType", v)}
          onYearsChange={(n) => set("confidentialityTermYears", n)}
        />
      </Section>

      <Section title="Governing Law & Jurisdiction">
        <Field label="Governing Law" hint="State whose laws govern the MNDA">
          <input
            className={inputClass}
            placeholder="e.g. Delaware"
            value={data.governingLaw}
            onChange={(e) => set("governingLaw", e.target.value)}
          />
        </Field>
        <Field label="Jurisdiction" hint="City or county and state of the courts">
          <input
            className={inputClass}
            placeholder="e.g. courts located in New Castle, DE"
            value={data.jurisdiction}
            onChange={(e) => set("jurisdiction", e.target.value)}
          />
        </Field>
        <Field label="MNDA Modifications" hint="Optional changes to the Standard Terms">
          <textarea
            className={inputClass}
            rows={3}
            placeholder="None"
            value={data.modifications}
            onChange={(e) => set("modifications", e.target.value)}
          />
        </Field>
      </Section>

      {(["party1", "party2"] as const).map((key, i) => (
        <Section key={key} title={`Party ${i + 1}`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Print Name">
              <input
                className={inputClass}
                autoComplete="off"
                value={data[key].name}
                onChange={(e) => setParty(key, "name", e.target.value)}
              />
            </Field>
            <Field label="Title">
              <input
                className={inputClass}
                autoComplete="off"
                value={data[key].title}
                onChange={(e) => setParty(key, "title", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Company">
            <input
              className={inputClass}
              autoComplete="off"
              value={data[key].company}
              onChange={(e) => setParty(key, "company", e.target.value)}
            />
          </Field>
          <Field label="Notice Address" hint="Use either email or postal address">
            <input
              className={inputClass}
              autoComplete="off"
              value={data[key].noticeAddress}
              onChange={(e) => setParty(key, "noticeAddress", e.target.value)}
            />
          </Field>
        </Section>
      ))}
    </form>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="block text-sm font-medium text-slate-800">{label}</span>
      {hint && <span className="block text-xs text-slate-500">{hint}</span>}
      {children}
    </label>
  );
}

interface TermOption<T extends string> {
  value: T;
  label: string;
  withYears?: boolean;
}

function TermChoice<T extends string>(props: {
  legend: string;
  hint: string;
  name: string;
  value: T;
  years: number;
  options: TermOption<T>[];
  onTypeChange: (value: T) => void;
  onYearsChange: (years: number) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-slate-800">{props.legend}</legend>
      <p className="text-xs text-slate-500">{props.hint}</p>
      {props.options.map((option) => (
        <label key={option.value} className="flex items-center gap-2 text-sm text-slate-800">
          <input
            type="radio"
            name={props.name}
            checked={props.value === option.value}
            onChange={() => props.onTypeChange(option.value)}
          />
          {option.label}
          {option.withYears && (
            <>
              <select
                aria-label={`${props.legend} in years`}
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm disabled:bg-slate-100 disabled:text-slate-400"
                value={props.years}
                disabled={props.value !== option.value}
                onChange={(e) => props.onYearsChange(Number(e.target.value))}
              >
                {YEAR_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {years(n)}
                  </option>
                ))}
              </select>
            </>
          )}
        </label>
      ))}
    </fieldset>
  );
}
