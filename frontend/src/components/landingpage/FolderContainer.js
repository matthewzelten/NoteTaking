import React from "react";
import { Link } from "react-router-dom";

function ShowFolders(props) {
  const folders = props.folderData.map((row, index) => {
    const buttonColor = (row.color === undefined || row.color === "") ? "#0000FF" : `#${row.color}`
    return (
        <Link to="/folder">
            <button style={{width:"200px", height:"50px", background:`${buttonColor}`}} onClick={() => props.getFolder(row.name)}>{row.name}</button>
        </Link>
    );
  });
  return folders;
}

function FolderContainer(props) {
  return (
    <div style={{display:"grid"}}>
      <ShowFolders getFolder={props.getFolder} folderData={props.folderData}/>
      <button onClick={() => props.setShowModal(true)}>Add New Folder</button>
    </div>
  );
}

export default FolderContainer;
