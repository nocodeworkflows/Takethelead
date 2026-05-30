// Convert *asterisk* spans in CMS text into <em> tags for headings, while
// escaping all other HTML. Use with set:html in .astro templates.
export function emphasis(input: string | null | undefined): string {
  const s = String(input ?? "");
  const escaped = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\*([^*]+)\*/g, "<em>$1</em>");
}
