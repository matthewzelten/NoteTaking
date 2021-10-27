import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';

function Note() {
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );

  return <Editor editorState={editorState} onChange={setEditorState} />;
}

ReactDOM.render(<Note />, document.getElementById('container'));
export default Note