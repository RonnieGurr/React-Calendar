import React, { useEffect, useState } from 'react';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, convertFromHTML, ContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { Button } from 'react-bootstrap';

import 'draft-js/dist/Draft.css';

function TextEditor( {onMessageData, initialMessage } ) {
  const [editorState, setEditorState] = useState(() => {
    if (initialMessage) {
      const blocksFromHTML = convertFromHTML(initialMessage);
      const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks);
      return EditorState.createWithContent(contentState);
    } else {
      return EditorState.createEmpty();
    }
  });
  
  
  const [preview, setPreview] = useState('');

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const onFontSizeChange = (e) => {
    const fontSize = e.target.value;
    const newEditorState = RichUtils.toggleInlineStyle(
      editorState,
      `FONT_SIZE_${fontSize}`
    );
    setEditorState(newEditorState);
  };

  // Function to get HTML content from EditorState
  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    onMessageData(stateToHTML(contentState))
    setPreview(stateToHTML(contentState));  
  },[editorState])

  // Define keyboard shortcuts for formatting
  const keyBindingFn = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.keyCode) {
        case 66: // B
          return 'bold';
        case 73: // I
          return 'italic';
        case 85: // U
          return 'underline';
        default:
          return getDefaultKeyBinding(e);
      }
    }
    return getDefaultKeyBinding(e);
  };

  return (
    <div>
          <div style={{ marginBottom: '10px' }}>
            <Button onClick={() => toggleInlineStyle('BOLD')}>Bold</Button>
            <Button onClick={() => toggleInlineStyle('ITALIC')}>Italic</Button>
            <Button onClick={() => toggleInlineStyle('UNDERLINE')}>Underline</Button>
            <Button onClick={() => toggleInlineStyle('STRIKETHROUGH')}>Strikethrough</Button>
            <Button onClick={() => toggleBlockType('unordered-list-item')}>Bullet List</Button>
            <Button onClick={() => toggleBlockType('ordered-list-item')}>Numbered List</Button>
            <Button onClick={() => toggleBlockType('blockquote')}>Blockquote</Button>
            <Button onClick={() => toggleBlockType('code-block')}>Code Block</Button>
            <select onChange={onFontSizeChange}>
                {[12, 14, 16, 18, 20].map(size => (
                    <option key={size} value={size}>{`Font Size ${size}`}</option>
                ))}
            </select>
            {/* Add more buttons for other formatting options */}
          </div>

      <div style={{ border: '1px solid #ccc', minHeight: '200px', padding: '10px' }}>
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={keyBindingFn} // Use custom key binding function
          onChange={setEditorState}
        />
      </div>
      {/* Render HTML preview */}
      {/*preview && <div dangerouslySetInnerHTML={{ __html: preview }}></div> */}
    </div>
  );
}

export default TextEditor;
