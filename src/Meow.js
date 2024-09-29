import React, { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import { Markdown } from 'tiptap-markdown';
import { Link2, FilePlus, Info } from 'lucide-react'
import { Button, Box } from "@kuma-ui/core"
import LZString from 'lz-string'

import './Meow.css';

const encodeContent = (content) => {
  const encodedContent = LZString.compressToEncodedURIComponent(content)
  return encodedContent
}

const decodeContent = (encodedContent) => {
  const decodedContent = LZString.decompressFromEncodedURIComponent(encodedContent)
  return decodedContent || ''
}

const Editor = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
      Link.configure({
        autoLink: true,
        defaultProtocol: 'https',
      }),
      Placeholder.configure({
        placeholder: 'Write here...',
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

const Meow = () => {
  const encodedContent = window.location.hash.slice(1)
  const [content, setContent] = useState(decodeContent(encodedContent))

  const shareContent = () => {
    const encodedContent = encodeContent(content)
    const url = `${window.location.origin}/#${encodedContent}`
    window.location.hash = `#${encodedContent}`
    navigator.clipboard.writeText(url).then(() => {
      alert("URL copied!")
    })
  }

  const cleanContent = () => {
    window.location.hash = ''
    setContent('')
  }

  const openInfo = () => {
    const content = "MQAgsgpg9g7gUHYoDqALAhgFxASwM7jQwD8CAVGZLBbgegHYgTp4CeAtJlOwK54QguUADYgAJhDw4A5vQhiQAMygAnEHgwqc9aUtUBbLJnmCIAD0wA6EAE0oPEAGMGg1gAcB2wagHycXNQYFR2EcRwBrbwEAAwBlAAkAQQAlAFFokAAjHkwuRi4QaQg5FSwBdBBQ+nDrABVUfErtSMcoekx0bQIIADcIFVZMBp0QVnsAcj6QGC1c4oAaJnp0TKrdMYcCjXQVT2wYf1R7bF3hVm1dNpAK-hU+lWsASWw3FSgenAk6dRx9N2FyvQFPxHDxdtN0KxBFB1JoBBs1MYLJYEEgQGgoVQSORKEQaDAWLh6Hg3DhdgpMlChgIYBBMtc3G4QABFHjoCIgAAUAB5ULk3HgAFwAemFmQgHUsAEc2RFLG50EUAHwASkWjl2ZQpUIA4lAoApUvR7NJUCAADLmgDCXN5-KFouk+okxp4pssfFV1jQOABLNl4XGdEZb3ZZqgilhOwuTjaxnaIA+FSq4QIJJ24RM1NwEgq4uGCgoWIoi2zGv8YXQojEOEUin6xUcngIQywICLeLIID4kmu6JssUeyBsOq5ZDQbbsDliEAEjwIE+wU5AOolZBVTBrAUWVeEsBjyjU+lUnnaPArfUWmuEnF+vi3FxRcHisF6-UWHeoXYwaag+gEoT6P4WA4G0BCtH8OxZjCrLsuEgAoBP44hQJI9DjNgeA8IyqjYPWWBgr2oSZrghhFOI+D-JCiyGOEMZIRUx7gngmCavoVTyKW5iYOwyigvwChCMIlhAA"
    setContent(decodeContent(content))
  }

  return (
    <main>
      <Box p={8} mb={20}>
        <Editor content={content} setContent={setContent} />
      </Box>
      <Box p={8} textAlign="center" position="sticky" bottom={20}>
        <Button className="button" onClick={shareContent}>
          <Link2 size={24} />
        </Button>
        <Button className="button" onClick={cleanContent}>
          <FilePlus size={24} />
        </Button>
        <Button className="button" onClick={openInfo}>
          <Info size={24} />
        </Button>
      </Box>
    </main>
  )
}

export default Meow
