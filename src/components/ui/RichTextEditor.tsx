'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Table as TableIcon,
  Plus,
  Minus,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced TypeScript interfaces
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
  readOnly?: boolean;
  showToolbar?: boolean;
  showWordCount?: boolean;
  showCharacterCount?: boolean;
  extensions?: any[];
  theme?: 'light' | 'dark' | 'auto';
  customStyles?: {
    toolbar?: string;
    content?: string;
    button?: string;
    activeButton?: string;
  };
  onFocus?: () => void;
  onBlur?: () => void;
  onSave?: (content: string) => void;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

interface ToolbarButtonProps {
  editor: Editor | null;
  onClick: () => void;
  isActive?: boolean;
  icon: React.ReactNode;
  title: string;
  disabled?: boolean;
}

interface MediaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (url: string, alt?: string) => void;
  type: 'link' | 'image';
}

// Toolbar Button Component
const ToolbarButton: React.FC<ToolbarButtonProps> = ({ 
  editor, 
  onClick, 
  isActive = false, 
  icon, 
  title, 
  disabled = false 
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    disabled={disabled || !editor}
    className={`p-2 rounded transition-all duration-200 ${
      isActive 
        ? 'bg-coral-primary text-white shadow-md' 
        : 'text-gray-700 hover:bg-gray-200 hover:shadow-sm'
    } ${disabled || !editor ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    title={title}
  >
    {icon}
  </motion.button>
);

// Media Dialog Component
const MediaDialog: React.FC<MediaDialogProps> = ({ isOpen, onClose, onConfirm, type }) => {
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onConfirm(url.trim(), alt.trim());
      setUrl('');
      setAlt('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold mb-4">
            Add {type === 'link' ? 'Link' : 'Image'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {type === 'link' ? 'URL' : 'Image URL'}
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral-primary"
                placeholder={type === 'link' ? 'https://example.com' : 'https://example.com/image.jpg'}
                required
              />
            </div>
            {type === 'image' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text (optional)
                </label>
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral-primary"
                  placeholder="Description of the image"
                />
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-coral-primary text-white rounded-md hover:bg-coral-secondary transition-colors"
              >
                Add
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Enhanced Menu Bar Component
const MenuBar: React.FC<{ 
  editor: Editor | null; 
  theme: string;
  customStyles?: RichTextEditorProps['customStyles'];
}> = ({ editor, theme, customStyles }) => {
  const [mediaDialog, setMediaDialog] = useState<{ isOpen: boolean; type: 'link' | 'image' }>({
    isOpen: false,
    type: 'link'
  });

  const handleAddLink = useCallback(() => {
    setMediaDialog({ isOpen: true, type: 'link' });
  }, []);

  const handleAddImage = useCallback(() => {
    setMediaDialog({ isOpen: true, type: 'image' });
  }, []);

  const handleMediaConfirm = useCallback((url: string, alt?: string) => {
    if (!editor) return;
    if (mediaDialog.type === 'link') {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    } else {
      editor.chain().focus().setImage({ src: url, alt }).run();
    }
  }, [editor, mediaDialog.type]);

  const addTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  if (!editor) return null;

  const toolbarClass = `border-b border-gray-200 p-3 bg-gray-50 rounded-t-lg ${customStyles?.toolbar || ''}`;
  const buttonClass = customStyles?.button || '';
  const activeButtonClass = customStyles?.activeButton || '';

  return (
    <>
      <div className={toolbarClass}>
        <div className="flex flex-wrap items-center gap-2">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <ToolbarButton
              editor={editor}
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              icon={<Bold className="w-4 h-4" />}
              title="Bold (Ctrl+B)"
            />
            
            <ToolbarButton
              editor={editor}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              icon={<Italic className="w-4 h-4" />}
              title="Italic (Ctrl+I)"
            />

            <ToolbarButton
              editor={editor}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
              icon={<UnderlineIcon className="w-4 h-4" />}
              title="Underline (Ctrl+U)"
            />

            <ToolbarButton
              editor={editor}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              icon={<Strikethrough className="w-4 h-4" />}
              title="Strikethrough"
            />

            <ToolbarButton
              editor={editor}
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              isActive={editor.isActive('highlight')}
              icon={<Highlighter className="w-4 h-4" />}
              title="Highlight"
            />
          </div>

          {/* Headings */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <ToolbarButton
              editor={editor}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              icon={<Heading1 className="w-4 h-4" />}
              title="Heading 1"
            />
            
            <ToolbarButton
              editor={editor}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              icon={<Heading2 className="w-4 h-4" />}
              title="Heading 2"
            />
            
            <ToolbarButton
              editor={editor}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              icon={<Heading3 className="w-4 h-4" />}
              title="Heading 3"
            />
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <ToolbarButton
              editor={editor}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              icon={<List className="w-4 h-4" />}
              title="Bullet List"
            />
            
            <ToolbarButton
              editor={editor}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              icon={<ListOrdered className="w-4 h-4" />}
              title="Numbered List"
            />
          </div>

          {/* Block Elements */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <ToolbarButton
              editor={editor}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              icon={<Quote className="w-4 h-4" />}
              title="Quote"
            />
            
            <ToolbarButton
              editor={editor}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive('codeBlock')}
              icon={<Code className="w-4 h-4" />}
              title="Code Block"
            />

            <ToolbarButton
              editor={editor}
              onClick={addTable}
              icon={<TableIcon className="w-4 h-4" />}
              title="Insert Table"
            />
          </div>

          {/* Media */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <ToolbarButton
              editor={editor}
              onClick={handleAddLink}
              icon={<LinkIcon className="w-4 h-4" />}
              title="Add Link"
            />
            
            <ToolbarButton
              editor={editor}
              onClick={handleAddImage}
              icon={<ImageIcon className="w-4 h-4" />}
              title="Add Image"
            />
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <ToolbarButton
              editor={editor}
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' })}
              icon={<AlignLeft className="w-4 h-4" />}
              title="Align Left"
            />
            
            <ToolbarButton
              editor={editor}
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              isActive={editor.isActive({ textAlign: 'center' })}
              icon={<AlignCenter className="w-4 h-4" />}
              title="Align Center"
            />
            
            <ToolbarButton
              editor={editor}
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
              icon={<AlignRight className="w-4 h-4" />}
              title="Align Right"
            />
          </div>

          {/* History */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              editor={editor}
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              icon={<Undo className="w-4 h-4" />}
              title="Undo (Ctrl+Z)"
            />
            
            <ToolbarButton
              editor={editor}
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              icon={<Redo className="w-4 h-4" />}
              title="Redo (Ctrl+Y)"
            />
          </div>
        </div>
      </div>

      <MediaDialog
        isOpen={mediaDialog.isOpen}
        onClose={() => setMediaDialog({ isOpen: false, type: 'link' })}
        onConfirm={handleMediaConfirm}
        type={mediaDialog.type}
      />
    </>
  );
};

// Main RichTextEditor Component
export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing your blog post...",
  className = "",
  minHeight = "400px",
  maxHeight = "none",
  readOnly = false,
  showToolbar = true,
  showWordCount = false,
  showCharacterCount = false,
  extensions = [],
  theme = 'light',
  customStyles,
  onFocus,
  onBlur,
  onSave,
  autoSave = false,
  autoSaveInterval = 30000, // 30 seconds
}: RichTextEditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  // Custom styles for better text formatting
  const editorCustomStyles = `
    .rich-text-content {
      line-height: 1.7;
      color: #374151;
    }
    .rich-text-content h1 {
      color: #1f2937;
      font-size: 2.25rem;
      font-weight: 700;
      margin-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 0.5rem;
    }
    .rich-text-content h2 {
      color: #374151;
      font-size: 1.875rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      margin-top: 2rem;
    }
    .rich-text-content h3 {
      color: #4b5563;
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      margin-top: 1.5rem;
    }
    .rich-text-content p {
      margin-bottom: 1rem;
      color: #374151;
    }
    .rich-text-content strong {
      color: #1f2937;
      font-weight: 700;
    }
    .rich-text-content em {
      color: #7c3aed;
      font-style: italic;
    }
    .rich-text-content blockquote {
      border-left: 4px solid #8b5cf6;
      padding-left: 1rem;
      margin: 1.5rem 0;
      background: #f8fafc;
      padding: 1rem;
      border-radius: 0.5rem;
      font-style: italic;
      color: #4b5563;
    }
    .rich-text-content ul, .rich-text-content ol {
      margin: 1rem 0;
      padding-left: 1.5rem;
    }
    .rich-text-content li {
      margin-bottom: 0.5rem;
      color: #374151;
    }
    .rich-text-content table {
      border-collapse: collapse;
      width: 100%;
      margin: 1rem 0;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      overflow: hidden;
    }
    .rich-text-content th {
      background: #f3f4f6;
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 1px solid #e5e7eb;
    }
    .rich-text-content td {
      padding: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
      color: #374151;
    }
    .rich-text-content tr:nth-child(even) {
      background: #f9fafb;
    }
  `;

  // Memoized extensions configuration
  const editorExtensions = useMemo(() => [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      code: {
        HTMLAttributes: {
          class: 'bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono',
          style: 'background-color: #f1f5f9 !important; color: #e11d48 !important;',
        },
      },
      codeBlock: {
        HTMLAttributes: {
          class: 'bg-gray-900 text-white p-4 rounded-lg font-mono text-sm border border-gray-700',
          style: 'background-color: #0d1117 !important; color: #e6edf3 !important;',
        },
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-blue-600 hover:text-blue-800 underline decoration-blue-400',
      },
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded-lg shadow-md',
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Placeholder.configure({
      placeholder,
    }),
    Underline,
    Strike,
    Highlight.configure({
      HTMLAttributes: {
        class: 'bg-gradient-to-r from-pink-200 to-purple-200 text-gray-900 font-medium',
      },
    }),
    Subscript,
    Superscript,
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    ...extensions,
  ], [placeholder, extensions]);

  // Auto-save functionality
  const autoSaveCallback = useCallback(() => {
    if (autoSave && onSave) {
      onSave(value);
    }
  }, [autoSave, onSave, value]);

  // Set up auto-save interval
  React.useEffect(() => {
    if (autoSave && onSave) {
      const interval = setInterval(autoSaveCallback, autoSaveInterval);
      return () => clearInterval(interval);
    }
  }, [autoSave, onSave, autoSaveInterval, autoSaveCallback]);

  const editor = useEditor({
    extensions: editorExtensions,
    content: value,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      
      // Update word and character counts
      const text = editor.getText();
      setWordCount(text.split(' ').filter(word => word.length > 0).length);
      setCharacterCount(text.length);
    },
    onFocus,
    onBlur,
    immediatelyRender: false,
  });

  // Update editor content when value prop changes
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  // Keyboard shortcuts
  React.useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (onSave) {
          onSave(editor.getHTML());
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor, onSave]);

  // Inject custom styles
  React.useEffect(() => {
    const styleId = 'rich-text-editor-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.innerHTML = editorCustomStyles;
      document.head.appendChild(styleElement);
    }

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  const contentClass = `focus:outline-none p-4 text-gray-900 rich-text-content ${customStyles?.content || ''}`;
  const containerClass = `border border-gray-300 rounded-lg overflow-hidden ${className}`;

  return (
    <div className={containerClass}>
      {showToolbar && !readOnly && (
        <MenuBar 
          editor={editor} 
          theme={theme}
          customStyles={customStyles}
        />
      )}
      
      <div 
        style={{ 
          minHeight, 
          maxHeight: maxHeight === 'none' ? undefined : maxHeight,
          overflowY: maxHeight !== 'none' ? 'auto' : 'visible'
        }}
        className={contentClass}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Statistics Bar */}
      {(showWordCount || showCharacterCount) && (
        <div className="border-t border-gray-200 p-2 bg-gray-50 text-sm text-gray-600 flex justify-between items-center">
          <div className="flex gap-4">
            {showWordCount && (
              <span>Words: {wordCount}</span>
            )}
            {showCharacterCount && (
              <span>Characters: {characterCount}</span>
            )}
          </div>
                     {onSave && editor && (
             <button
               onClick={() => onSave(editor.getHTML())}
               className="px-3 py-1 bg-coral-primary text-white rounded text-xs hover:bg-coral-secondary transition-colors"
             >
               Save
             </button>
           )}
        </div>
      )}
    </div>
  );
}
