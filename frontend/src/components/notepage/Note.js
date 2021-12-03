import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";
import "react-quill/dist/quill.snow2.css";
import { Button } from "@chakra-ui/button";
import axios from "axios";
import { Heading } from "@chakra-ui/layout";


const loadState = () => {
    try {
        const data = localStorage.getItem('state');
        if (data) {
            return JSON.parse(data);
        } else {
            return undefined;
        }
    } catch (e) {
        return undefined;
    }
}

const saveState = (state) => {
    try {
        if (state.name && state.name.length > 0) {
            localStorage.setItem('state', JSON.stringify({
                name: state.name,
                contents: state.contents,
                folder: state.folder,
                color: state.color
            }));
        }

    } catch (e) {
    }
}

const persistedState = loadState();

function Note(props) {

    let stateValue;

    if(props.noteName && props.noteName.length > 0) {
        stateValue = {
            name:props.noteName,
            contents: props.noteContents,
            folder: props.folderName,
            color: props.noteColor
        }
        console.log(`Saving state`);
        saveState(stateValue);
    } else {
        stateValue = persistedState;
    }

    const [state, setState] = useState(stateValue);
    console.log(`TEST ${state.name} ${state.folder} ${state.color} `);


    async function saveNote(){

        const tempNote = {
            name: state.name,
            folder: state.folder,
            color: null,
            isPrivate: null,
            password: null,
            contents: state.contents,
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
            return await axios.post('http://localhost:5000/notes', note);
        }
        catch (error) {
            return false;
        }
    }

    function handleUpdate(html) {
        state.contents = html;
        saveState(state);
    }

    //placeholder={"Write something awesome..."}

    return (
        <div>
            <Link to={`/folder/${state.folder.split(" ").join("+")}`}>
                <Button bg={`#${state.color}`}>Return</Button>
            </Link>
            <Heading style={{ color: `#${state.color}` }}>
                {state.name}
            </Heading>
            <Editor handleUpdate={handleUpdate} value={state.contents} placeholder={"Write something awesome..."}/>
            <div>
                <Button bg={`#${state.color}`} onClick={saveNote}>Save Note</Button>
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
            <div style={{backgroundColor: "white", width: "95%", margin: "auto"}}>
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
