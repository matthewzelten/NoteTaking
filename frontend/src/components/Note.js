import React, { useState } from "react";
import PropTypes from 'prop-types'
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

let noteDelta = null;

function Note(props) {
    const [note, setNote] = useState(
        {
            delta: null,
            noteID: null
        }
    );

    function saveNote(noteDelta){
        setNote({
            delta: noteDelta,
            noteID: props.noteID
        });
        props.handleSubmit(note);

        setNote({
            delta: null,
            noteID: null
        });
    }

    return (
        <div>
            <Link to="/folder">
                <button>Return</button>
            </Link>
             <form>
                <Editor handleUpdate={saveNote} placeholder={"Write something awesome..."} />
                <div>
                    <button onClick={saveNote}>Save Note</button>
                </div>
            </form>
        </div>
    );


}



class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { editorHtml: "", theme: "snow" };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(html) {
        this.setState({ editorHtml: html });
        noteDelta = this.editor.getContents();
        this.handleUpdate(noteDelta);
    }

    render() {
        return (
            <div>
                <ReactQuill
                    theme={this.state.theme}
                    onChange={this.handleChange}
                    value={this.state.editorHtml}
                    modules={Editor.modules}
                    formats={Editor.formats}
                    bounds={".app"}
                    placeholder={this.props.placeholder}
                />
            </div>
        );
    }
}

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
    toolbar: [
        [{ header: "1" }, { header: "2" }, { size: [] }, { font: [] }],
        [{ color: [] }, { background: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ script: "sub" }, { script: "super" }],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
            "code-block",
        ],
        [{ align: [] }],
        ["link", "image"],
        ["clean"],
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
    "header",
    "font",
    "size",
    "color",
    "background",
    "bold",
    "italic",
    "underline",
    "strike",
    "script",
    "list",
    "bullet",
    "indent",
    "code-block",
    "align",
    "link",
    "image",
    "blockquote",
];

/*
 * PropType validation
 */
Editor.propTypes = {
    placeholder: PropTypes.string,
};

export default Note;
