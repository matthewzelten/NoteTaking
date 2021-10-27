import React, { useState } from "react";
import { Link } from "react-router-dom"
import FileSettings from "../components/shared/FileSettings"

function CreateFolder(props) {
    const [newFolderName, setNewFolderName] = useState("")

    function submitFolderName() {
        props.setFolderName(newFolderName)
        props.setShowModal(false)
    }

    return (
        <div>
            <h1>Add New Folder</h1>
            <input type="text" placeholder="Enter Folder Name" onChange={(e) => setNewFolderName(e.target.value)}/>
            <FileSettings/>
            <Link to="/folder">
                <button onClick={() => submitFolderName()}>Create</button>
            </Link>
        </div>
    );
}

export default CreateFolder;
