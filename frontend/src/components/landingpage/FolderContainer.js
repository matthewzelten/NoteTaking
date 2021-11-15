import React from "react";

function ShowFolders(props) {
    const folders = props.folderData.map((row, index) => {
        return (
            <span key={index}>
                <button onClick={openFolder()}>{row.name}</button>
            </span>
        );
    });
    return <div>{folders}</div>;
}

function FolderContainer(props) {
    return (
        <div>
            <ShowFolders folderData={props.folderData} />
            <button class="btn" onClick={() => props.setShowModal(true)}>
                Add New Folder
            </button>
        </div>
    );
}

function openFolder(name) {
    //implement this
}

export default FolderContainer;
