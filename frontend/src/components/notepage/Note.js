import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import axios from "axios";



function Note(props) {
    let noteContents = "";
    /*
    const [note, setNote] = useState(
        {
            name: null,
            contents: null,
            folder: null,
            color: null,
            isPrivate: null,
            password: null,
            isLocked: null
        }
    );*/

    async function saveNote(){
        console.log(`Saving current note`);

        const tempNote = {
            name: props.noteName,
            folder: props.folderName,
            color: null,
            isPrivate: null,
            password: null,
            contents: noteContents,
            isLocked: null,
            toSave: true
        }

        console.log(`Updating note ${tempNote}`);
        await postNoteUpdate(tempNote);


    }

    /**
     * Post note to the backend
     * @param note The pre-constructed note object to submit to the backend
     * @returns {Promise<boolean|AxiosResponse<unknown>>} the response from the backend
     */
    async function postNoteUpdate(note) {
        console.log(`Updating ${note} in ${props.folderName}`);
        console.log(`Note name: ${props.noteName} contents: ${note.contents}`);
        console.log(`Note name: ${note.name} contents: ${note.contents}`);

        try {
            const response = await axios.post('http://localhost:5000/notes', note);
            console.log(response);
            return response;
        }
        catch (error) {
            console.log(`Error updating note`);
            console.log(error);
            return false;
        }
    }

    function handleUpdate(html) {
        noteContents = html;
    }

    return (
        <div>
            <Link to="/folder">
                <button>Return</button>
            </Link>
            <h1>{props.noteName}</h1>
            <form>
                <Editor handleUpdate={handleUpdate} placeholder={"Write something awesome..."} defaultValue={props.contents} />
                <div>
                    <button onClick={saveNote}>Save Note</button>
                </div>
            </form>
        </div>
    );
}

/**
 * The editor component
 */
class Editor extends React.Component {


    constructor(props) {
        super(props);
        this.state = { editorHtml: "", theme: "snow" };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(html) {
        //noteDelta = this.editor.getContents();
        console.log("CHANGE");
        console.log(html);
        this.props.handleUpdate(html);
        this.setState({ editorHtml: html });

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
