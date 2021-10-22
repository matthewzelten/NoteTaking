import React from "react";
import { Link } from "react-router-dom"

function FolderContainer(props) {
    return (
        <div>
            <Link to="/create-folder">
                <button>Add New Folder</button>
            </Link>
        </div>
    );
}

export default FolderContainer;
