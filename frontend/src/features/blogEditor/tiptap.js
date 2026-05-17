import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import FontFamily from "@tiptap/extension-font-family";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";

export const editorExtensions = [
  StarterKit.configure({ codeBlock: false }),
  Underline,
  TextStyle,
  Color,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Link.configure({ openOnClick: true, autolink: true, linkOnPaste: true }),
  FontFamily.configure({ types: ["textStyle"] }),
  Subscript,
  Superscript,
];

export const editorClassName =
  "prose prose-invert max-w-none min-h-[18rem] focus:outline-none text-neutral-100";
