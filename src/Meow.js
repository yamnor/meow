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

  const setInfoText = () => {
    const content = "MQAgsgpg9g7ii8G4Lj2BQzigOoAsCGAXEASwGdxoYB+VAKmsllqNJwDsQIdiBPAWjyh4BXYhBD8oAGxAATCMUIBzFhGkgAZlABOIYrk2EWC9VoC2+PCrEQAHngB0IAJpRBIAMasxXAA6iDYrFEVQn5tVlU3CUI3AGsA0QADAGUACQBBACUAUQSQACNBPH42fhAFCGVNfFEcECiWGIcAFSwSOoM4tygWPBwDUggANwhNLjxWwxAuFwByYZAYfSKKgBp2Fhw8+qNp11LdHE0-AhgQrBcCI4kuAyNukFqRTWHNBwBJAm9NKEHCWWYdIQTN4JDUWKoRG5BEcFjguGIoDo9KJdtoLLY7KhnK4PGw3IFYg9Bn0JJtQexpCEtEitHgoXhSABtQJHAC6AAosEVvMQAFwAen5eEI3l63jsskG-OkUDcxH5wVC-K6Rx4XRYbggovlMQgXDyUEO0h4ulp9OIwC+KggagMKh4uv1hs0xtNmjphWIAEo1uMXAosCAWFACDgJFINJozEVbiAoKLCN1mDDiIJvN5aSpMWhQPQ4PBABA7azzCCLIAAioIcITAHwbgDDdmh0ciMGCcIgsYjeQhHVR5eHjUQwCB5B7pkCM2iV6sxWgcrl4HkC-l5CC9OwARyrsTs3hw5R97iO1V78MZAHEoFBVFlg4IAyAADIPgDCc+5fMFCkvslvAbswi9BxsEIclJy3GIZmIRgcHTb5q0DKA1CRQ5Y3VCwehAX5anqGJSE7Q5dVUAciFkWoVwmVRaDzWhfUCQ8QmiMMZEINQ1BGCpNSYAJ8BAKjm2oEBhDkB4QAwRwkjeMSzxAdlqGwHjsRAJIIFEN5SHkghFLPVdqC9CkqU0NYwwkWBY0jEATC0PwekEBjhjWI8JD4IEgkpYVDGzFJYCGEY1j4hgBNwPCoBMUQohMEJ8ETDt3BC3cewRXjqCnWJaEAFAIQhkKA5BYGYCFTdNaXUDg8GhYSol1IgzHKZjO1JLg1jMGJY0y2pLJTPAjxMeoVF9Gw8B4DQoREIjLwkbN0FE85DxKyw8yoZB-JgFs2zcI8LBPccuBwExg00N8Fw-fltt2rQ7FCg9anxCAIuIAga0ARd3AFgCeBABpdnRfDcQgw0IAAvFq2Es0EoVJbR5BMQRSWFe4ol+SZ-AAKRgzxAB4NwB73ZRwBX3feJDdhAXB5lYeFNzkaGO1o-0uWINZqS6ExQp6aniogCMjlEUpGTQ6sCFCg7F0FUFlk0PJu2kOwumOna9r0wBIckAeD+420W1wQs0R7kZAANPmjuscWQsl07NEAoA"
    setContent(decodeContent(content))
  }

  return (
    <main>
      <Box p={8} mb={20}>
        <Editor content={content} setContent={setContent} />
      </Box>
      <Box p={8} textAlign="center" position="sticky" bottom={20}>
        <Button className="button" onClick={shareContent}><Link2 size={28} /></Button>
        <Button className="button" onClick={cleanContent}><FilePlus size={28} /></Button>
        <Button className="button" onClick={setInfoText}><Info size={28} /></Button>
      </Box>
    </main>
  )
}

export default Meow
