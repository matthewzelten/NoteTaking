import React, { useState } from "react";
import { Link } from "react-router-dom";
import FileSettings from "../shared/FileSettings";

function CreateNote(props) {
    const [name, setName] = useState("");
    return (
        <div>
            <h1>Add New Note</h1>
            <input type="text" placeholder="Enter Note Name" onChange={(e) => setName(e.target.value)}/>
            <FileSettings />
            <Link to="/note">
                <button onClick={() => props.setNoteName(name)}> Create Note </button>
            </Link>
        </div>
    );
}

export default CreateNote;
