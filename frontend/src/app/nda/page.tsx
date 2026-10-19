import { Suspense } from "react";
import { NdaCreator } from "@/components/NdaCreator";
import { parseTerms } from "@/lib/nda/parseTerms";
import { readTemplate } from "@/lib/nda/templates";

// Read once at module scope: the template is static, so the page is prerendered.
const terms = parseTerms(readTemplate("Mutual-NDA.md"));

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-1">
        <p className="text-sm font-semibold tracking-wide text-slate-500">Prelegal</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mutual NDA Creator</h1>
        <p className="max-w-2xl text-slate-600">
          Fill in the details on the left to draft a Common Paper Mutual Non-Disclosure Agreement,
          then download it as a PDF ready to sign.
        </p>
      </header>

      <Suspense fallback={<p className="text-slate-500">Loading…</p>}>
        <NdaCreator terms={terms} />
      </Suspense>
    </div>
  );
}
