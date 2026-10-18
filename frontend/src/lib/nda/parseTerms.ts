/**
 * Parses the Common Paper Standard Terms markdown (templates/Mutual-NDA.md) into a
 * small block model. Only the constructs that template uses are supported:
 * a "# " heading, numbered clauses, plain paragraphs, **bold**, markdown links and
 * <span class="coverpage_link">…</span> references to Cover Page defined terms.
 */

export type Inline =
  | { type: "text"; text: string }
  | { type: "bold"; text: string }
  /** A defined term whose value lives on the Cover Page (e.g. "Purpose"). */
  | { type: "term"; text: string }
  | { type: "link"; text: string; href: string };

export type Block =
  | { type: "heading"; text: string }
  | { type: "clause"; number: number; content: Inline[] }
  | { type: "paragraph"; content: Inline[] };

const INLINE_PATTERN =
  /\*\*(.+?)\*\*|<span class="coverpage_link">(.+?)<\/span>|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function parseInlines(source: string): Inline[] {
  const result: Inline[] = [];
  let last = 0;
  for (const match of source.matchAll(INLINE_PATTERN)) {
    const index = match.index;
    if (index > last) result.push({ type: "text", text: source.slice(last, index) });
    const [, bold, term, linkText, href] = match;
    if (bold !== undefined) result.push({ type: "bold", text: bold });
    else if (term !== undefined) result.push({ type: "term", text: term });
    else result.push({ type: "link", text: linkText, href });
    last = index + match[0].length;
  }
  if (last < source.length) result.push({ type: "text", text: source.slice(last) });
  return result;
}

export function parseTerms(markdown: string): Block[] {
  return markdown
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim().replace(/\s*\n\s*/g, " "))
    .filter(Boolean)
    .map((chunk): Block => {
      const heading = /^#+\s+(.*)$/.exec(chunk);
      if (heading) return { type: "heading", text: heading[1] };
      const clause = /^(\d+)\.\s+(.*)$/.exec(chunk);
      if (clause) {
        return { type: "clause", number: Number(clause[1]), content: parseInlines(clause[2]) };
      }
      return { type: "paragraph", content: parseInlines(chunk) };
    });
}
