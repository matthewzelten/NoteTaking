import React, { useState } from "react";
import { Link } from "react-router-dom";
import FileSettings from "../shared/FileSettings";
import axios from 'axios'

function CreateFolder(props) {
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewColorFolder] = useState("");
  const [isPrivate, setIsPrivate] = useState(false)

  function submitFolderName() {
    props.setFolderName(newFolderName);
    props.setShowModal(false);
    const folder = {
      name: newFolderName,
      color: newFolderColor,
        isPrivate: isPrivate,
      notes: [],
    }
    postNewFolder(folder).then( result => {
      if (result && result.status === 200)
        props.setFolders([...props.folders, newFolderName]);
        props.setShowModal(false);
      });
  }

  async function postNewFolder(folder) {
    try {
      const response = await axios.post('http://localhost:5000/', folder);
      return response;
   }
   catch (error) {
      console.log(error);
      return false;
   }
  }

  return (
    <form>
      <h1>Add New Folder</h1>
      <input
        type="text"
        placeholder="Enter Folder Name"
        onChange={(e) => setNewFolderName(e.target.value)}
      />
      <FileSettings isPrivate={isPrivate} setIsPrivate={setIsPrivate}/>
      <Link to="/folder">
        <button onClick={() => submitFolderName()}>Create</button>
      </Link>
    </form>
  );
}

export default CreateFolder;
