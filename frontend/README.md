# Prelegal frontend

Next.js prototype of the **Mutual NDA Creator** (PL-3). Fill in the form to see a live preview of a
Common Paper Mutual Non-Disclosure Agreement, then download it as a PDF.

## Running

Requires Node 20.9+.

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # Vitest unit tests
npm run lint
npm run build
```

## How it works

- `src/app/page.tsx` reads `../templates/Mutual-NDA.md` (the repo-root dataset from PL-2) at build
  time and parses it into blocks with `src/lib/nda/parseTerms.ts`.
- `src/lib/nda/coverPage.ts` turns the form data into a renderer-agnostic model of the Cover Page
  (`templates/Mutual-NDA-coverpage.md`). Blank fields fall back to the template's bracketed
  placeholders, which are highlighted in the preview.
- `NdaPreview` (HTML) and `NdaPdf` (`@react-pdf/renderer`) both render from the same model, so the
  preview and the PDF stay in sync. The PDF renderer is loaded only when **Download PDF** is clicked.

The Standard Terms keep Cover Page fields (Purpose, Governing Law, …) as defined terms rather than
substituting values, matching how Common Paper's agreement is meant to be read.
