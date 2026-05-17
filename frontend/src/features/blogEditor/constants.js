export const BLOG_CATEGORIES = [
  "Select Category",
  "Tech",
  "Life",
  "Code",
  "Opinion",
  "Life Experiences",
  "Other",
];

export const EMPTY_BLOG_FORM = {
  title: "",
  category: "",
  content: "",
};

export function hasMeaningfulContent(html = "") {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 0;
}
