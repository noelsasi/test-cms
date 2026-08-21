import { useEffect, useId } from 'react'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { cn } from '@/lib/cn'

interface RichTextEditorProps {
  label?: string
  error?: string
  value: string
  onChange: (html: string) => void
  placeholder?: string
  /** Minimum editing height, e.g. 'min-h-40' for a shorter solution box. */
  minHeightClassName?: string
}

export function RichTextEditorImpl({
  label,
  error,
  value,
  onChange,
  placeholder,
  minHeightClassName = 'min-h-56',
}: RichTextEditorProps) {
  const fieldId = useId()
  const errorId = `${fieldId}-error`

  const editor = useEditor({
    extensions: [StarterKit, TextAlign.configure({ types: ['heading', 'paragraph'] })],
    content: value,
    onUpdate: ({ editor: instance }) => {
      const html = instance.getHTML()
      // TipTap represents "empty" as <p></p>; report that as a blank string so
      // required-field validation behaves as expected.
      onChange(instance.isEmpty ? '' : html)
    },
    editorProps: {
      attributes: {
        class: cn(
          minHeightClassName,
          'w-full px-3 py-2 text-sm text-ink-900 focus:outline-none',
          '[&_p]:my-1 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5',
          '[&_a]:text-link [&_a]:underline',
          '[&_blockquote]:border-l-2 [&_blockquote]:border-line [&_blockquote]:pl-3 [&_blockquote]:text-ink-500',
        ),
        'aria-labelledby': label ? `${fieldId}-label` : '',
      },
    },
  })

  // Keep the editor in sync when the parent swaps questions.
  useEffect(() => {
    if (editor && !editor.isDestroyed && value !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [editor, value])

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span id={`${fieldId}-label`} className="text-sm font-medium text-ink-900">
          {label}
        </span>
      )}

      <div
        className={cn(
          'overflow-hidden rounded-[var(--radius-field)] border bg-surface',
          'focus-within:outline-2 focus-within:outline-offset-0 focus-within:outline-brand-600',
          error ? 'border-danger' : 'border-line',
        )}
      >
        {editor && <Toolbar editor={editor} />}
        <div className="relative">
          <EditorContent editor={editor} />
          {/* Rendered manually to avoid pulling in another extension. */}
          {editor?.isEmpty && placeholder && (
            <p className="pointer-events-none absolute left-3 top-2 text-sm text-ink-400">
              {placeholder}
            </p>
          )}
        </div>
      </div>

      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

interface ToolbarButtonProps {
  label: string
  isActive?: boolean
  onClick: () => void
  children: React.ReactNode
}

function ToolbarButton({ label, isActive = false, onClick, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={isActive}
      onClick={onClick}
      className={cn(
        'grid size-7 place-items-center rounded transition-colors',
        isActive
          ? 'bg-brand-100 text-brand-700'
          : 'text-ink-500 hover:bg-brand-50 hover:text-ink-900',
      )}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  function toggleLink() {
    const previous = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL', previous ?? 'https://')

    if (url === null) return
    if (url === '') {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor.chain().focus().setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-line bg-canvas px-2 py-1.5">
      <ToolbarButton
        label="Italic"
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <span className="font-serif text-sm italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        label="Bold"
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <span className="text-sm font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        isActive={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <span className="text-sm underline">U</span>
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough"
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <span className="text-sm line-through">S</span>
      </ToolbarButton>
      <ToolbarButton label="Link" isActive={editor.isActive('link')} onClick={toggleLink}>
        <Icon path="M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.5 1.5M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7L12 19" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        label="Align left"
        isActive={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <Icon path="M3 6h18M3 12h12M3 18h15" />
      </ToolbarButton>
      <ToolbarButton
        label="Align center"
        isActive={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <Icon path="M3 6h18M6 12h12M5 18h14" />
      </ToolbarButton>
      <ToolbarButton
        label="Align right"
        isActive={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <Icon path="M3 6h18M9 12h12M6 18h15" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        label="Bullet list"
        isActive={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <Icon path="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        isActive={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <Icon path="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M4 14h2v4H4z" />
      </ToolbarButton>
      <ToolbarButton
        label="Quote"
        isActive={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Icon path="M6 17h3l2-4V7H5v6h3zM15 17h3l2-4V7h-6v6h3z" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        label="Code"
        isActive={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Icon path="M8 8l-4 4 4 4M16 8l4 4-4 4" />
      </ToolbarButton>
    </div>
  )
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-line" />
}

function Icon({ path }: { path: string }) {
  return (
    <svg
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d={path} />
    </svg>
  )
}
