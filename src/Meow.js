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
    const content = "MQAgsgpg9g7ii8G4Lj2BQzigOoAsCGAXEASwGdxoYB+VAKmsllqNJwDsQIdiBPAWjyh4BXYhBD8oAGxAATCMUIBzFhGkgAZlABOIYrk2EWC9VoC2+PCrEQAHngB0IAJpRBIAMasxXAA6iDYrFEVQn5tVlU3CUI3AGsA0QADAGUACQBBACUAUQSQACNBPH42fhAFCGVNfFEcECiWGIcAFSwSOoM4tygWPBwDUggANwhNLjxWwxAuFwByYZAYfSKKgBp2Fhw8+qNp11LdHE0-AhgQrBcCI4kuAyNukFqRTWHNBwBJAm9NKEHCWWYdIQTN4JDUWKoRG5BEcFjguGIoDo9KJdtoLLY7Kh0GRYA9wSAAIqCHCxGh0ciMGCcIgsYjeQhHVR5eHjUQwCB5B7ebwgWhEkkxRgACgAPFgit5iAAuAD0MryEF6dgAjsTYnZvDhygA+ACUazcR2qTPh1AA4lAoKosiwXAosCAADKOgDC1BAovFeElsplCktsltgntdmEeoc2EIoN51H5sVoM2Y3O+JIdUDUSMOt3c3QsPRAv1q9RipDphxillZRFktQVE1UtHoMFoayrhpC0RwUmkhDUahGFTcflI43wMabjGEcgeIAwjiSbznZo91GwY+criSEFEb1Ia4IG5AZsV1F17B7oTWXYksGzGm0Ji0fh6gg7wzWRokfCBQQvt0xyApLAQwjGsjYUu6uCllAJiiFEJghPghDdKQXTAoclaInyaqCtQgAoBCEMhQHILAzAQxCCNyWgEP2+DQtOUQVkQZjlDIJAgnCaxmDE2aEbUj4wsQeBGiY9QqK2Nh4DwGhQiIqjiBIdhAA"
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
