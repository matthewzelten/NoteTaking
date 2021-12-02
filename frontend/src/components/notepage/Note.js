import React from "react";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { Button } from "@chakra-ui/button";
import axios from "axios";



function Note(props) {
    let noteContents = props.noteContents;
    const folderPath = props.folderName.split(" ").join("+");
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
        await postNoteUpdate(tempNote);


    }

    /**
     * Post note to the backend
     * @param note The pre-constructed note object to submit to the backend
     * @returns {Promise<boolean|AxiosResponse<unknown>>} the response from the backend
     */
    async function postNoteUpdate(note) {

        try {
            const response = await axios.post('http://localhost:5000/notes', note);
            return response;
        }
        catch (error) {
            return false;
        }
    }

    function handleUpdate(html) {
        noteContents = html;
    }

    //placeholder={"Write something awesome..."}

    return (
        <div>
            <Link to={`/folder/${props.folderURL}`}>
                <Button>Return</Button>
            </Link>
            <h1>{props.noteName}</h1>

            <Editor handleUpdate={handleUpdate} value={noteContents} placeholder={"Write something awesome..."}/>
            <div>
                <button onClick={saveNote}>Save Note</button>
            </div>
        </div>
    );
}

/**
 * The editor component
 */
class Editor extends React.Component {


    constructor(props) {
        super(props);
        this.state = { editorHtml: props.value, theme: "snow" };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(html) {
        //noteDelta = this.editor.getContents();
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
