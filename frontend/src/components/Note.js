<<<<<<< HEAD
import React, { useState } from 'react';
import {EditorState} from "draft-js";
import {Editor} from "react-draft-wysiwyg"

function Note(props) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState)
  }
  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}    
        toolbar={{
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
        }}
        placeholder="Write something awesome!"
      />
    </div>
  )
}

export default Note
=======
import React from "react";
import PropTypes from "prop-types";

function Note(props) {
  return (
    <div>
      <input style={{ width: "100%", height: "200px" }} placeholder={"Notes"} />
    </div>
  );
}

export default Note;
>>>>>>> origin/main
