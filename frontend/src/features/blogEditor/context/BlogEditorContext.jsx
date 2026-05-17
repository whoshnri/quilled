import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { EMPTY_BLOG_FORM } from "../constants";

const BlogEditorContext = createContext(null);

export function BlogEditorProvider({ children, initialValues = EMPTY_BLOG_FORM }) {
  const [title, setTitle] = useState(initialValues.title ?? "");
  const [category, setCategory] = useState(initialValues.category ?? "");
  const [content, setContent] = useState(initialValues.content ?? "");

  const resetForm = useCallback(() => {
    setTitle("");
    setCategory("");
    setContent("");
  }, []);

  const hydrateForm = useCallback((payload = EMPTY_BLOG_FORM) => {
    setTitle(payload.title ?? "");
    setCategory(payload.category ?? "");
    setContent(payload.content ?? "");
  }, []);

  const value = useMemo(
    () => ({
      title,
      setTitle,
      category,
      setCategory,
      content,
      setContent,
      resetForm,
      hydrateForm,
    }),
    [title, category, content, resetForm, hydrateForm],
  );

  return <BlogEditorContext.Provider value={value}>{children}</BlogEditorContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBlogEditorForm() {
  const context = useContext(BlogEditorContext);
  if (!context) {
    throw new Error("useBlogEditorForm must be used inside BlogEditorProvider.");
  }
  return context;
}
