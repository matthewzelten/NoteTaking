import React from "react";
import { Link } from "react-router-dom";

function FolderContainer(props) {
  return (
    <div>
      <button onClick={() => props.setShowModal(true)}>Add New Folder</button>
    </div>
  );
}

export default FolderContainer;
