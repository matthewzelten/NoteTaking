import React, { useState } from "react";
import { Link } from "react-router-dom";
import FileSettings from "../shared/FileSettings";
import axios from "axios";
import { Button, Box, Heading, Input } from "@chakra-ui/react";

function CreateNote(props) {
    const [name, setName] = useState("");

    const [color, setColor] = useState("");

    const [isPrivate, setIsPrivate] = useState(false);

    const [passwordA, setPasswordA] = useState("");
    const [passwordB, setPasswordB] = useState("");



    function verifyMatchingPasswords(){
        if(!isPrivate){
          return true;
        }
        if(passwordA === passwordB && passwordA.length > 0) {
          return true;
        }
        return false;
    }

    /**
     * Construct note for submission to backend
     */
    function submitNote() {
        props.setNoteName(name);
        props.setShowNoteModal(false);
        const note = {
            name: name,
            folder: props.folderName,
            color: color,
            isPrivate: isPrivate,
            password: passwordA,
            contents: props.noteContents,
            isLocked: isPrivate

        }

        postNewNote(note).then( result => {
            if (result && result.status === 200)
                //props.setFolders([...props.folders, newFolderName]);
                // add this to the list of notes within the folder we are in
                props.setShowNoteModal(false);
        });

    }


    /**
     * Post note to the backend
     * @param note The pre-constructed note object to submit to the backend
     * @returns {Promise<boolean|AxiosResponse<unknown>>} the response from the backend
     */
    async function postNewNote(note) {

        try {
            const response = await axios.post('http://localhost:5000/notes', note);
            return response;
        }
        catch (error) {
            return false;
        }
    }

    return (
        <Box>
            <Heading>Add New Note</Heading>
            <Input
                placeholder="Enter Note Name"
                onChange={(e) => setName(e.target.value)}
            />
            <FileSettings
                isPrivate={isPrivate}
                setIsPrivate={setIsPrivate}
                color={color}
                setColor={setColor}
                setPasswordA={setPasswordA}
                setPasswordB={setPasswordB}
            />
            <Link to={`/folder/${props.folderURL}/note/${name.split(" ").join("+")}`}>
                <Button disabled={!verifyMatchingPasswords()} onClick={() => {
                    props.setNoteName(name);
                    submitNote();
                }}>
                    Submit Note
                </Button>
            </Link>
        </Box>
    );
}

export default CreateNote;
