import React, { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Highlight from '@tiptap/extension-highlight'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { Mathematics } from '@tiptap-pro/extension-mathematics'
import 'katex/dist/katex.min.css'
import { Markdown } from 'tiptap-markdown';
import { Link2, Eye, Code, Info, Cat } from 'lucide-react'
import LZString from 'lz-string'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const encodeContent = (content) => {
  const encodedContent = LZString.compressToEncodedURIComponent(content)
  return encodedContent
}

const decodeContent = (encodedContent) => {
  const decodedContent = LZString.decompressFromEncodedURIComponent(encodedContent)
  return decodedContent || ''
}

const TextArea = ({ content, setContent }) => {
  return (
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Type or paste markdown code here..."
    />
  );
}

const Editor = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight,
      Superscript,
      Subscript,
      Mathematics,
      Markdown,
      Link.configure({
        autoLink: true,
        defaultProtocol: 'https',
      }),
      Placeholder.configure({
        placeholder: 'Type or paste your text here...',
        emptyNodeClass: 'my-custom-is-empty-class',
      }),
    ],
    content: content,
    autofocus: true,
    onUpdate({ editor }) {
      setContent(editor.storage.markdown.getMarkdown())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.storage.markdown.getMarkdown()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) { return null }

  return (
    <EditorContent editor={editor} />
  );
}

const App = () => {
  const [mode, setMode] = useState('view');
  const [content, setContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const decodedContent = decodeContent(hash);
      if (decodedContent) {
        setContent(decodedContent);
      }
      setMode('view');
    } else {
      setMode('code');
    }
  }, []);

  const handleLinkButton = () => {
    const encodedContent = encodeContent(content);
    const url = `${window.location.origin}/#${encodedContent}`;
    window.location.hash = `#${encodedContent}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 600);
  }

  const handleInfoButton = () => {
    const content = "MQAgsgpg9g7ii8G4Lj2BQzigOoAsCGAXEASwGdxoYB+VAKmsllqNJwDsQIdiBPAWjyh4BXYhBD8oAGxAATCMUIBzFhGkgAZlABOIYrk2EWC9VoC2+PCrEQAHngB0IAJpRBIAMasxXAA6iDYrFEVQn5tVlU3CUI3AGsA0QADABkASQA5AGkEkAAjQTx+Nn4QBQhlTXxRHBAolhiHABUsEhqDOLcoFjwcA1IIADcITS48ZsMQLhcAckGQGH0CsoAadhYcHNqjSddi3RxNPwIYEKwXAgOJLgMjTpBqkU1BzQcUgm9NKH7CWWYdQhNvBIqixVCI3IIDnMcFwxFAdHpRNttBZbHZUM5XB42G5ArE7v0ehJ1kD2NIQlp4Vo8OC8KQANqBA4AXQAFFgCt5iAAuAD0PLwhG83W8dlk-R50igbmIPOCoR5HQOPA6LDcECFMpiEC4OSg+2kPF0VJpxGA7xUEDUBhUPC1Or1mgNRs01PyxAAlCtRi4FFgQCwoAQcBIpBpNGYCtcQFAhYROsxIcRBN5vFSVGi0KB6HB4IAIHZW2YQ+ZAAEVBDg8YA+DcAYbs0OjkRgwThEFjEbyEA6qHIw0aiGAQHJ3FMgOm0MsVmK0VnsvCc3k8nIQbp2ACO5didm8OFKnvcB0qXZhdIA4lAoKoAKIBwS+kBJJIAYWnHO5fIUZ9k199dmE7oc2EIEkx3XGIpmIRgcBTD4Kz9KA1HhfYoxVCwuhAL5qlqGJSDbfYtVUXsiFkapFzGVRaGzWgvUCPcQmiYMZEINQ1CGMo1SYAJ8BAciG2oEBhDkO4QAwRwAGUUmE48QBZahsE4jEQBEiBRBSUhZIIeTjyXah3VJclNBWYMJFgKMwxAEwtD8LpBFowYVn3CQ+H+IIyQFQwMwACVgAYhhWbiGF43BsKgExRCiEwQnwONW3cYKt07WEuOocdYloQAUAhCGQoDkFgpgIJMUypdQODwCEBKiLUiDMUoGLbIkuBWMwYijDLqnMxM8H3ExahUL0bDwHgNHBER8LPCQM3QITTj3YrLGzKhkD8mBG2bNx9wsQ8Ry4HATADTRn1nV8eS2natDsELd2qHEIHC4gCErQBF3cAWAJ4EAGl2dF8NxCGDQgAC9mrYcygXBIltHkExBCJAVbiiL5xn8AApSDPEAHg3AHvd5HAFfdl54O2EBcFmVgYTXOQodbKifXZYgVgpDoTBCroqaKiBQwOURijpZCKwIEL9rnPkgUWTQcg7aQ7A6I7tt2nTAEhyQB4P+jbQrRBMzRFuOkAA1ecO6wxeCiWTs0P8gA"
    setContent(decodeContent(content))
  }

  return (
    <main>
      <div className='buttonContainer'>
        {mode === 'view' ? (
          <button onClick={() => setMode('code')}>
            <Code size={28} />
          </button>
        ) : (
          <button onClick={() => setMode('view')}>
            <Eye size={28} />
          </button>
        )}
        {isCopied ? (
          <Tippy content="Copied!">
            <button>
              <Cat size={28} />
            </button>
          </Tippy>
        ) : (
          <button onClick={handleLinkButton}>
            <Link2 size={28} />
          </button>
        )}
        <button onClick={handleInfoButton}>
          <Info size={28} />
        </button>
      </div>
      {mode === 'view' ? (
        <Editor content={content} setContent={setContent} />
      ) : (
        <TextArea content={content} setContent={setContent} />
      )}
    </main>
  )
}

export default App
