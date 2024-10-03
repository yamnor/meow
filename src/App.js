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
  const hash = window.location.hash.slice(1);
  const sample = "MQAgsgpg9g7ii8G4Lj2BQzigOoAsCGAXEASwGdxoYB+VAWhACo7JYGjScQYIAjEHABz4gAJhGKEA5gDsIQkHiggAjgFdCAYwDWAGwCeIYrgBOEEADMohgLb48MuRAAeeAHTJaAUUm3DIa4Y1CsJL2TkTBeFgmAAYAwgDyACLuUb5QIgA0cpHBalrqGlnRAGoAku4YKVzKePLhCkIkfFo4ehEm5lY2drZOrrQAmlDKIGo4wTKEBGOyHdYEPQQQAG4QwYThkSBRpeUplmkQriAgtDGRmrxLOITNXFomE-I+BhZ4atWkANqRxgC6ABRYGp8YgALgA9OC8IQ+Hh+M4REtwYE1MRwY8LOC1BYINRsZI1BBYWiNBAdFwoDhDEJqC9DG8PsA+MYRKZ1jJqKTyZTqbSsK93nhiABKTIRIbiLAgSRQKZaLRmCxzaGScQgKCwwhQSRsYz6ZQCV4yPogGJ5C5tLYAGRKADkANKVaq1OQKcSrCCGfAmdh5SQFfFw9brNXLT06CIhkA6IYAchWHEMk1skhNAGVVrJLe7pF7bLI-QV5Oq2oZSMQFG09KNgktCBA4DHlD5maJVnDodqOJN+dUQMZdFGu+xiJ6VoZXGhQEw4PBABA7mRnCAXIAAisocBdAHwbgDDd1AMGcsGA4UjrYh8QgskBcVqbTg8fiCT4MdebjQMAFAvAgiHgrgQOFnBUN9nD4HB3VFEZjG9WQbxAT4AHEoDSEBPAlKUrStGJP2BMFIXEZCRBlZRJWcZQRWcEBsBuEwXw3TRY2IFhH0MSk1ClKBTH0Iwo0DdsQDrX11g0cswP8bpNkIER2H-LB1lkA9yAYMVNjUJNoVGBUGlMUxPVWQlWCyfB6EYJS6BAcjRF4Kj+jTEoMH6BCQH+OhsGMwZhgzEwSlINyCA8kAEIAuhhRADFDEyHB5VgKMOlSPV1jwVRoRWTJoK0ahoUsB4GhVcRJwACVgMMIpMw9zNwcsoGykA8ksSZ8C1HURmqsTugUOi3wYQAUAkmYQoFESRYwIYgDT4V4zAgfBmysvJSSIax3WERpmh0TJrA0KM+vYfY9WIPBoMsP0ZDFRw8Gocx3lHLNkK0Sd0Co-koKm-MyFgKhkEU5hzOPUg1Jeuw4M+HQcEsGVDBw788PBEGwYsZxssg9h2Iger9pALdAEXdwBYAngQAaXf0PgIDUQgosIAAvLbgn2e53maZ5CEsZRmk7YI8jrVUwhAAApfgxhAQAeDcAe92BcAV93KJKLimxAXAEzGPQVFEVniBU9ChUyCwWssbKvBVyaIAVUxjBMYtPkDTcCGyyGf0he4ak9LhLyEZxsRh0HwdCwBIckAeD-1R8NlJFkGqu0+AANa3oYcF3qrduHDGFZwgA"

  useEffect(() => {
    console.log(hash)
    if (hash) {
      const decodedContent = decodeContent(hash);
      if (decodedContent) {
        setContent(decodedContent);
      }
      setMode('view');
    } else {
      setMode('code');
    }
  }, [hash]);

  const generateLink = () => {
    const encodedContent = encodeContent(content);
    return `${window.location.origin}/#${encodedContent}`;
  }

  const handleLinkButton = () => {
    navigator.clipboard.writeText(generateLink());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 600);
  }

  const handleInfoButton = () => {
    setContent(decodeContent(sample))
  }

  const copyMarkdown = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 600);
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
        <div className="article">
          <section className="content">
            <Editor content={content} setContent={setContent} />
          </section>
        </div>
      ) : (
        <TextArea content={content} setContent={setContent} />
      )}
    </main>
  )
}

export default App
