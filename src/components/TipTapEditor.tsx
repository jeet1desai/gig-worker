'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function TipTapEditor({ value, onChange, placeholder }: Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Paragraph,
      Heading.configure({ levels: [1, 2] }),
      BulletList,
      OrderedList,
      ListItem,
      Placeholder.configure({
        placeholder: placeholder || 'Write something...'
      }),
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-blue-400 underline',
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      })
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert min-h-[150px] p-3 outline-none text-white'
      }
    },
    autofocus: true,
    immediatelyRender: false
  });

  if (!isClient || !editor) return null;

  const buttonClass = (isActive: boolean) =>
    clsx(
      'px-2 py-1 rounded hover:bg-slate-700 transition',
      isActive ? 'bg-slate-700 text-white font-semibold' : 'text-slate-300'
    );

  return (
    <div className="tiptap-editor rounded-md border border-slate-700 bg-slate-800/60">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-700 px-2 py-1 text-sm">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass(editor.isActive('bold'))}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass(editor.isActive('italic'))}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={buttonClass(editor.isActive('underline'))}
        >
          Underline
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={buttonClass(editor.isActive('heading', { level: 1 }))}
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={buttonClass(editor.isActive('heading', { level: 2 }))}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonClass(editor.isActive('bulletList'))}
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={buttonClass(editor.isActive('orderedList'))}
        >
          1. List
        </button>
        <button
          onClick={() => {
            const url = prompt('Enter URL');
            if (url) {
              editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: url })
                .run();
            }
          }}
          className={buttonClass(editor.isActive('link'))}
        >
          Link
        </button>
      </div>

      <EditorContent editor={editor} className="min-h-[180px]" />
    </div>
  );
}
