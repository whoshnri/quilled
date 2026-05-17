import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code as CodeIcon,
  Heading1 as H1Icon,
  Heading2 as H2Icon,
  Italic,
  Link as LinkIcon,
  List as BulletIcon,
  ListOrdered as OrderedIcon,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  TextCursorInput as ParagraphIcon,
  Underline as UnderlineIcon,
  Unlink as UnlinkIcon,
} from "lucide-react";

function ToolButton({ icon, onClick, active, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`shrink-0 rounded border border-neutral-800 p-1.5 transition-colors ${
        active ? "text-white bg-neutral-800" : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900"
      }`}
    >
      {icon}
    </button>
  );
}

export default function EditorToolbar({ editor }) {
  if (!editor) {
    return null;
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-y border-neutral-800 bg-black/95 p-3 md:sticky md:top-0 md:inset-x-auto md:bottom-auto md:border md:bg-black"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + env(keyboard-inset-height, 0px))" }}
    >
      <div className="no-scrollbar mx-auto flex max-w-5xl flex-nowrap gap-2 overflow-x-auto md:max-w-none md:flex-wrap md:overflow-visible">
      <ToolButton icon={<Bold size={16} />} title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
      <ToolButton icon={<Italic size={16} />} title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
      <ToolButton icon={<UnderlineIcon size={16} />} title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} />
      <ToolButton icon={<CodeIcon size={16} />} title="Code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()} />
      <ToolButton icon={<SuperscriptIcon size={16} />} title="Superscript" active={editor.isActive("superscript")} onClick={() => editor.chain().focus().toggleSuperscript().run()} />
      <ToolButton icon={<SubscriptIcon size={16} />} title="Subscript" active={editor.isActive("subscript")} onClick={() => editor.chain().focus().toggleSubscript().run()} />
      <ToolButton icon={<BulletIcon size={16} />} title="Bullet List" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} />
      <ToolButton icon={<OrderedIcon size={16} />} title="Ordered List" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
      <ToolButton icon={<AlignLeft size={16} />} title="Align Left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} />
      <ToolButton icon={<AlignCenter size={16} />} title="Align Center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} />
      <ToolButton icon={<AlignRight size={16} />} title="Align Right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} />
      <ToolButton icon={<AlignJustify size={16} />} title="Justify" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()} />
      <ToolButton icon={<H1Icon size={16} />} title="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
      <ToolButton icon={<H2Icon size={16} />} title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
      <ToolButton icon={<ParagraphIcon size={16} />} title="Paragraph" active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()} />
      <input
        type="color"
        title="Text color"
        onInput={(event) => editor.chain().focus().setColor(event.target.value).run()}
        className="h-8 w-8 shrink-0 cursor-pointer border border-neutral-800 bg-black p-0.5"
      />
      <select
        onChange={(event) => editor.chain().focus().setFontFamily(event.target.value).run()}
        defaultValue="default"
        className="shrink-0 border border-neutral-800 bg-black px-2 py-1 text-xs text-neutral-200"
      >
        <option value="default">Font</option>
        <option value="serif">Serif</option>
        <option value="monospace">Monospace</option>
        <option value="Georgia">Georgia</option>
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times</option>
      </select>
      <ToolButton
        icon={<LinkIcon size={16} />}
        title="Insert Link"
        onClick={() => {
          const url = window.prompt("Enter URL");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
      />
      <ToolButton icon={<UnlinkIcon size={16} />} title="Remove Link" onClick={() => editor.chain().focus().unsetLink().run()} />
      </div>
    </div>
  );
}
