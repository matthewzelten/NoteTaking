import React from "react";

function FolderContainer(props) {
    return (
        <div>
            <button onClick={() => props.setShowModal(true)}>Add New Folder</button>
        </div>
    );
}

export default FolderContainer;
