import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import {
  ATTRIBUTION,
  COVER_PAGE_INTRO,
  COVER_PAGE_SIGNING_STATEMENT,
  COVER_PAGE_TITLE,
  type CoverPage,
} from "@/lib/nda/coverPage";
import type { Block, Inline } from "@/lib/nda/parseTerms";

/**
 * PDF rendering of the NDA. Only loaded on demand (see NdaCreator) because
 * @react-pdf/renderer is large. Keep in sync visually with NdaPreview.
 * Uses the built-in Times fonts, which cover the template's curly quotes.
 */

const styles = StyleSheet.create({
  page: { paddingVertical: 60, paddingHorizontal: 64, fontFamily: "Times-Roman", fontSize: 11, lineHeight: 1.4 },
  title: { fontFamily: "Times-Bold", fontSize: 18, textAlign: "center", marginBottom: 14 },
  paragraph: { marginBottom: 10, textAlign: "justify" },
  fieldTitle: { fontFamily: "Times-Bold", fontSize: 12, marginTop: 6 },
  fieldLabel: { fontFamily: "Times-Italic", fontSize: 9, color: "#555" },
  fieldValue: { marginBottom: 4 },
  table: { marginTop: 8, borderTopWidth: 1, borderLeftWidth: 1, borderColor: "#999" },
  row: { flexDirection: "row" },
  cell: { flex: 1, minHeight: 26, padding: 5, borderRightWidth: 1, borderBottomWidth: 1, borderColor: "#999", fontSize: 10, textAlign: "center" },
  labelCell: { flex: 0.7, fontFamily: "Times-Bold", textAlign: "left" },
  bold: { fontFamily: "Times-Bold" },
  term: { textDecoration: "underline" },
  small: { fontSize: 8, color: "#555", marginTop: 6 },
});

export function NdaPdf({ coverPage, terms }: { coverPage: CoverPage; terms: Block[] }) {
  return (
    <Document title={COVER_PAGE_TITLE} creator="Prelegal" producer="Prelegal">
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>{COVER_PAGE_TITLE}</Text>
        <Text style={styles.paragraph}>{COVER_PAGE_INTRO}</Text>

        {coverPage.fields.map((field) => (
          <View key={field.title} wrap={false}>
            <Text style={styles.fieldTitle}>{field.title}</Text>
            {field.label && <Text style={styles.fieldLabel}>{field.label}</Text>}
            {field.values.map((v, i) => (
              <Text key={i} style={styles.fieldValue}>
                {v.text}
              </Text>
            ))}
          </View>
        ))}

        <Text style={[styles.paragraph, { marginTop: 8 }]}>{COVER_PAGE_SIGNING_STATEMENT}</Text>

        <View style={styles.table} wrap={false}>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.labelCell]} />
            <Text style={[styles.cell, styles.bold]}>PARTY 1</Text>
            <Text style={[styles.cell, styles.bold]}>PARTY 2</Text>
          </View>
          {coverPage.partyRows.map((row) => (
            <View key={row.label} style={styles.row}>
              <Text style={[styles.cell, styles.labelCell]}>{row.label}</Text>
              <Text style={styles.cell}>{row.party1?.text ?? ""}</Text>
              <Text style={styles.cell}>{row.party2?.text ?? ""}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.small}>{ATTRIBUTION}</Text>
      </Page>

      <Page size="LETTER" style={styles.page}>
        {terms.map((block, i) => {
          if (block.type === "heading") {
            return (
              <Text key={i} style={styles.title}>
                {block.text}
              </Text>
            );
          }
          if (block.type === "clause") {
            return (
              <Text key={i} style={styles.paragraph}>
                {block.number}. <Inlines content={block.content} />
              </Text>
            );
          }
          return (
            <Text key={i} style={styles.small}>
              <Inlines content={block.content} />
            </Text>
          );
        })}
      </Page>
    </Document>
  );
}

function Inlines({ content }: { content: Inline[] }) {
  return content.map((inline, i) => {
    switch (inline.type) {
      case "bold":
        return (
          <Text key={i} style={styles.bold}>
            {inline.text}
          </Text>
        );
      case "term":
        return (
          <Text key={i} style={styles.term}>
            {inline.text}
          </Text>
        );
      case "link":
        return (
          <Link key={i} src={inline.href}>
            {inline.text}
          </Link>
        );
      default:
        return inline.text;
    }
  });
}
