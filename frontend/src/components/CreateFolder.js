import React, { useState } from "react";
import { Link } from "react-router-dom"

function CreateFolder(props) {
    const [newFolderName, setNewFolderName] = useState("")
    return (
        <div>
            <h1>Add New Folder</h1>
            <input type="text" placeholder="Enter Folder Name" onChange={(e) => setNewFolderName(e.target.value)}/>
            <Link to="/folder">
                <button onClick={() => props.setFolderName(newFolderName)}>Create</button>
            </Link>
        </div>
    );
}

export default CreateFolder;
