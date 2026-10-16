"use client";

import { useMemo, useState } from "react";
import { buildCoverPage } from "@/lib/nda/coverPage";
import { pdfFileName, todayIso } from "@/lib/nda/format";
import type { Block } from "@/lib/nda/parseTerms";
import { createDefaultFormData } from "@/lib/nda/types";
import { NdaForm } from "./NdaForm";
import { NdaPreview } from "./NdaPreview";

export function NdaCreator({ terms }: { terms: Block[] }) {
  // Reads the current date, so the parent page renders this inside <Suspense>.
  const [data, setData] = useState(() => createDefaultFormData(todayIso()));
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const coverPage = useMemo(() => buildCoverPage(data), [data]);

  async function handleDownload() {
    setDownloading(true);
    setError(null);
    try {
      // Load the PDF renderer only when needed; it's a large dependency.
      const [{ pdf }, { NdaPdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./NdaPdf"),
      ]);
      const blob = await pdf(<NdaPdf coverPage={coverPage} terms={terms} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = pdfFileName(data);
      link.click();
      // Revoking synchronously can cancel the download in Safari/Firefox.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      console.error(e);
      setError("Sorry, the PDF couldn't be generated. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="grid flex-1 gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
      <aside className="space-y-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-2">
        <NdaForm data={data} onChange={setData} />
        <div className="space-y-2 border-t border-slate-200 pt-6">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 disabled:cursor-wait disabled:opacity-60"
          >
            {downloading ? "Generating PDF…" : "Download PDF"}
          </button>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          <p className="text-xs text-slate-500">
            Highlighted fields in the preview haven’t been filled in yet.
          </p>
        </div>
      </aside>

      <section aria-label="Document preview" className="min-w-0">
        <NdaPreview coverPage={coverPage} terms={terms} />
      </section>
    </div>
  );
}
