import React, { useState } from "react";
import { Link } from "react-router-dom";
import FileSettings from "../shared/FileSettings";
import axios from "axios";

function CreateNote(props) {
    const [newNoteName, setNewNoteName] = useState("");
    const [color, setColor] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);



    function submitNote() {
        const note = {
            name: newNoteName,
            color: color,
            isPrivate: isPrivate
        }

        postNewNote(note).then( result => {
        });
    }



    async function postNewNote(note) {
        console.log(`Posting ${note}`);

        try {
            const response = await axios.post('http://localhost:5000/' + props.folderName, note);
            console.log(response);
            return response;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }

    return (
        <div>
            <h1>Add New Note</h1>
            <input
                type="text"
                placeholder="Enter Note Name"
                onChange={(e) => setNewNoteName(e.target.value)}
            />
            <FileSettings isPrivate={isPrivate} setIsPrivate={setIsPrivate} color={color} setColor={setColor}/>
            <Link to="/note">
                <button onClick={() => {
                    props.setNoteName(newNoteName);
                    submitNote();
                }}>
                    {" "}
                    Create Note{" "}
                </button>
            </Link>
        </div>
    );
}

export default CreateNote;
