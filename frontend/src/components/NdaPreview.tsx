import {
  ATTRIBUTION,
  COVER_PAGE_INTRO,
  COVER_PAGE_SIGNING_STATEMENT,
  COVER_PAGE_TITLE,
  type CoverPage,
  type FieldValue,
} from "@/lib/nda/coverPage";
import type { Block, Inline } from "@/lib/nda/parseTerms";

interface NdaPreviewProps {
  coverPage: CoverPage;
  terms: Block[];
}

/** HTML rendering of the NDA. Keep in sync visually with NdaPdf. */
export function NdaPreview({ coverPage, terms }: NdaPreviewProps) {
  return (
    <article className="mx-auto max-w-[8.5in] space-y-10 bg-white px-10 py-12 font-serif text-[15px] leading-relaxed text-slate-900 shadow-lg ring-1 ring-slate-200 sm:px-16">
      <section className="space-y-6">
        <h1 className="text-center text-2xl font-bold">{COVER_PAGE_TITLE}</h1>
        <p>{COVER_PAGE_INTRO}</p>

        {coverPage.fields.map((field) => (
          <div key={field.title} className="space-y-1">
            <h2 className="text-base font-bold">{field.title}</h2>
            {field.label && <p className="text-xs italic text-slate-500">{field.label}</p>}
            {field.values.map((v, i) => (
              <p key={i} className="whitespace-pre-wrap">
                <Value value={v} />
              </p>
            ))}
          </div>
        ))}

        <p>{COVER_PAGE_SIGNING_STATEMENT}</p>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-1/4 border border-slate-300 p-2" />
              <th className="border border-slate-300 p-2">PARTY 1</th>
              <th className="border border-slate-300 p-2">PARTY 2</th>
            </tr>
          </thead>
          <tbody>
            {coverPage.partyRows.map((row) => (
              <tr key={row.label}>
                <th className="border border-slate-300 p-2 text-left font-semibold">{row.label}</th>
                {[row.party1, row.party2].map((v, i) => (
                  <td key={i} className="h-10 border border-slate-300 p-2 text-center">
                    {v && <Value value={v} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-xs text-slate-500">{ATTRIBUTION}</p>
      </section>

      <hr className="border-slate-300" />

      <section className="space-y-4">
        {terms.map((block, i) => {
          if (block.type === "heading") {
            return (
              <h2 key={i} className="text-center text-xl font-bold">
                {block.text}
              </h2>
            );
          }
          if (block.type === "clause") {
            return (
              <p key={i} className="text-justify">
                {block.number}. <Inlines content={block.content} />
              </p>
            );
          }
          return (
            <p key={i} className="text-xs text-slate-500">
              <Inlines content={block.content} />
            </p>
          );
        })}
      </section>
    </article>
  );
}

function Value({ value }: { value: FieldValue }) {
  return value.missing ? (
    <span className="rounded bg-amber-100 px-1 text-amber-800">{value.text}</span>
  ) : (
    <>{value.text}</>
  );
}

function Inlines({ content }: { content: Inline[] }) {
  return content.map((inline, i) => {
    switch (inline.type) {
      case "bold":
        return <strong key={i}>{inline.text}</strong>;
      case "term":
        return (
          <span key={i} className="underline decoration-slate-400 decoration-dotted underline-offset-2" title="Defined on the Cover Page">
            {inline.text}
          </span>
        );
      case "link":
        return (
          <a key={i} href={inline.href} target="_blank" rel="noreferrer" className="underline">
            {inline.text}
          </a>
        );
      default:
        return inline.text;
    }
  });
}
