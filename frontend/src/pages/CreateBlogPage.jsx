import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import { Helmet } from "react-helmet-async";
import ConfirmDialog from "../features/blogEditor/components/ConfirmDialog";
import EditorToolbar from "../features/blogEditor/components/EditorToolbar";
import { editorClassName, editorExtensions } from "../features/blogEditor/tiptap";
import { BLOG_CATEGORIES, hasMeaningfulContent } from "../features/blogEditor/constants";
import { BlogEditorProvider, useBlogEditorForm } from "../features/blogEditor/context/BlogEditorContext";
import useDraftAutosave from "../features/blogEditor/hooks/useDraftAutosave";
import { createBlog } from "../services/blogApi";

function CreateBlogPageInner() {
  const navigate = useNavigate();
  const { username, uuid } = useParams();
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const { title, setTitle, category, setCategory, content, setContent, resetForm, hydrateForm } =
    useBlogEditorForm();

  const autosaveKey = useMemo(
    () => `draft:create:${username || "unknown"}:${uuid || "unknown"}`,
    [username, uuid],
  );

  const { restoredDraft, lastSavedAt, restoreError, clearDraft } = useDraftAutosave({
    key: autosaveKey,
    draft: { title, category, content },
    enabled: true,
  });

  const editor = useEditor({
    extensions: editorExtensions,
    content: content || "<p></p>",
    onUpdate: ({ editor: currentEditor }) => {
      setContent(currentEditor.getHTML());
    },
    editorProps: {
      attributes: { class: editorClassName },
    },
  });

  useEffect(() => {
    if (!restoredDraft) {
      return;
    }
    hydrateForm({
      title: restoredDraft.title || "",
      category: restoredDraft.category || "",
      content: restoredDraft.content || "",
    });
  }, [restoredDraft, hydrateForm]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "<p></p>", false);
    }
  }, [editor, content]);

  const backTo = `/dashboard/${username}/${uuid}`;

  const discardDraft = () => {
    resetForm();
    clearDraft();
    if (editor) {
      editor.commands.setContent("<p></p>", false);
    }
    setStatus("");
    navigate(backTo);
  };

  const publishPost = async () => {
    setStatus("");

    if (!title.trim() || !category || category === "Select Category" || !hasMeaningfulContent(content)) {
      setStatus("Title, category, and content are required.");
      setShowPublishConfirm(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("You need to log in before publishing.");
      setShowPublishConfirm(false);
      return;
    }

    setSubmitting(true);
    const result = await createBlog({ title, category, content, username }, token);
    setSubmitting(false);
    setShowPublishConfirm(false);

    if (!result.ok) {
      setStatus(result.error);
      return;
    }

    clearDraft();
    resetForm();
    if (editor) {
      editor.commands.setContent("<p></p>", false);
    }
    navigate(backTo);
  };

  return (
    <>
      <Helmet>
        <title>Create Post | Henry&apos;s Journal</title>
      </Helmet>

      <main className="min-h-screen bg-[#0a0a0a] px-4 py-6 text-neutral-100 sm:px-8">
        <section className="mx-auto max-w-5xl">
          <header className="mb-6 flex items-center justify-between border border-neutral-800 p-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(backTo)}
                className="border border-neutral-700 p-2 text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-neutral-100"
              >
                <ChevronLeft size={18} />
              </button>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Henry&apos;s Journal</p>
                <h1 className="text-2xl font-semibold">Create Post</h1>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowDiscardConfirm(true)}
              className="border border-neutral-700 p-2 text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-red-300"
              title="Discard draft"
            >
              <Trash2 size={18} />
            </button>
          </header>

          <section className="space-y-4 border border-neutral-800 p-4 pb-24 md:pb-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
              <label className="md:col-span-4 text-xs uppercase tracking-[0.14em] text-neutral-500">
                Title
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Enter blog title..."
                  className="mt-2 w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-neutral-100 focus:border-neutral-300 focus:outline-none"
                />
              </label>
              <label className="md:col-span-3 text-xs uppercase tracking-[0.14em] text-neutral-500">
                Category
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="mt-2 w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-neutral-100 focus:border-neutral-300 focus:outline-none"
                >
                  {BLOG_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">Content</p>
              <EditorToolbar editor={editor} />
              <div className="min-h-[22rem] border border-neutral-800 bg-black p-4">
                <EditorContent editor={editor} />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-neutral-500">
                {restoreError
                  ? restoreError
                  : lastSavedAt
                    ? `Draft autosaved ${new Date(lastSavedAt).toLocaleTimeString()}`
                    : "Autosave ready"}
              </div>
              <button
                type="button"
                disabled={submitting}
                onClick={() => setShowPublishConfirm(true)}
                className="border border-neutral-100 px-4 py-2 text-xs uppercase tracking-[0.18em] text-neutral-100 transition-colors hover:bg-neutral-100 hover:text-black disabled:opacity-60"
              >
                {submitting ? "Publishing..." : "Publish"}
              </button>
            </div>

            {status ? <p className="text-sm text-neutral-300">{status}</p> : null}
          </section>
        </section>
      </main>

      <ConfirmDialog
        open={showDiscardConfirm}
        title="Discard draft?"
        message="This will clear the editor and remove the local autosave."
        confirmLabel="Discard"
        confirmTone="danger"
        onCancel={() => setShowDiscardConfirm(false)}
        onConfirm={discardDraft}
      />

      <ConfirmDialog
        open={showPublishConfirm}
        title="Publish post?"
        message="Your post will be visible once published."
        confirmLabel="Publish"
        busy={submitting}
        onCancel={() => setShowPublishConfirm(false)}
        onConfirm={publishPost}
      />
    </>
  );
}

export default function CreateBlogPage() {
  return (
    <BlogEditorProvider>
      <CreateBlogPageInner />
    </BlogEditorProvider>
  );
}
