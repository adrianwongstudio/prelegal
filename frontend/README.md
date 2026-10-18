# Prelegal frontend

Next.js app for Prelegal. `/` is a placeholder sign-in screen (no authentication yet) that leads to
the **Mutual NDA Creator** at `/nda`: fill in the form to see a live preview of a Common Paper Mutual
Non-Disclosure Agreement, then download it as a PDF.

The app is built as a static export (`output: "export"` → `out/`) and served by the FastAPI backend in
the Docker container (see the root README).

## Running

Requires Node 20.9+.

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # Vitest unit tests
npm run lint
npm run build   # static export to out/
```

## How it works

- `src/app/nda/page.tsx` reads `../templates/Mutual-NDA.md` (the repo-root dataset from PL-2) at build
  time and parses it into blocks with `src/lib/nda/parseTerms.ts`.
- `src/lib/nda/coverPage.ts` turns the form data into a renderer-agnostic model of the Cover Page
  (`templates/Mutual-NDA-coverpage.md`). Blank fields fall back to the template's bracketed
  placeholders, which are highlighted in the preview.
- `NdaPreview` (HTML) and `NdaPdf` (`@react-pdf/renderer`) both render from the same model, so the
  preview and the PDF stay in sync. The PDF renderer is loaded only when **Download PDF** is clicked.

The Standard Terms keep Cover Page fields (Purpose, Governing Law, …) as defined terms rather than
substituting values, matching how Common Paper's agreement is meant to be read.
