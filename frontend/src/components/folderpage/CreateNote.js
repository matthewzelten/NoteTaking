import React, { useState } from "react";
import { Link } from "react-router-dom";
import FileSettings from "../shared/FileSettings";
import axios from 'axios'

function CreateNote(props) {
    const [name, setName] = useState("");

    const [color, setColor] = useState("");

    const [isPrivate, setIsPrivate] = useState(false);

    const [passwordA, setPasswordA] = useState("");
    const [passwordB, setPasswordB] = useState("");

    function submitNoteName() {
        props.setNoteName(name);
        props.setShowNoteModal(false);
        const note = {
            name: name,
            color: color,
            isPrivate: isPrivate,
            password: passwordA,
            contents: [],
            isLocked: false
        }
        postNewNote(note).then( result => {
        if (result && result.status === 200)
            //props.setFolders([...props.folders, newFolderName]);
            // add this to the list of notes within the folder we are in
            props.setShowNoteModal(false);
        });
    }

    async function postNewNote(note) {
        try {
            // --------------------this needs to post to /:foldername or something ---------------
            const response = await axios.post('http://localhost:5000/folder', note);
            return response;
       }
       catch (error) {
            console.log(error);
            return false;
       }
      }

    function verifyMatchingPasswords(){
        if(!isPrivate){
          return true;
        }
        if(passwordA === passwordB && passwordA.length > 0) {
          return true;
        }
        return false;
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
                color={color} setColor={setColor} 
                setPasswordA={setPasswordA} 
                setPasswordB={setPasswordB}
            />
            <Link to="/note">
                <button disabled={!verifyMatchingPasswords()} onClick={() => submitNoteName()}>
                    {" "}
                    Create Note{" "}
                </button>
            </Link>
        </div>
    );
}

export default CreateNote;
