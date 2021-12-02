import React, { useState } from "react";
import { Link } from "react-router-dom";
import FileSettings from "../shared/FileSettings";
import axios from "axios";
import { Button } from "@chakra-ui/button";

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
<<<<<<< HEAD
            contents: [],
            isLocked: false,
        };
        postNewNote(note).then((result) => {
=======
            contents: props.noteContents,
            isLocked: isPrivate

        }

        console.log(`Submitting note ${note.name} to ${note.folder} with ${note.color}`);
        console.log(note);

        postNewNote(note).then( result => {
>>>>>>> origin/main
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
        console.log(`Posting ${note} to ${props.folderName}`);

        try {
<<<<<<< HEAD
            // --------------------this needs to post to /:foldername or something ---------------
            const response = await axios.post(
                "http://localhost:5000/folder",
                note
            );
            return response;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    function verifyMatchingPasswords() {
        if (!isPrivate) {
            return true;
        }
        if (passwordA === passwordB && passwordA.length > 0) {
            return true;
        }
        return false;
=======
            const response = await axios.post('http://localhost:5000/notes', note);
            console.log(response);
            return response;
        }
        catch (error) {
            console.log(`Error posting new note`);
            console.log(error);
            return false;
        }
>>>>>>> origin/main
    }

    return (
        <div>
            <h1>Add New Note</h1>
            <input
                type="text"
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
            <Link to="/note">
<<<<<<< HEAD
                <Button
                    bg={`#${props.folderColor}`}
                    disabled={!verifyMatchingPasswords()}
                    onClick={() => submitNoteName()}
                >
                    {" "}
                    Create Note{" "}
                </Button>
=======
                <button disabled={!verifyMatchingPasswords()} onClick={() => {
                    props.setNoteName(name);
                    submitNote();
                }}>
                    Submit Note
                </button>
>>>>>>> origin/main
            </Link>
        </div>
    );
}

export default CreateNote;
