import React, { useState } from "react";
import { Link } from "react-router-dom";
import FileSettings from "../shared/FileSettings";
import axios from 'axios'
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function CreateFolder(props) {
  const [newFolderName, setNewFolderName] = useState("");

  const [color, setColor] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [passwordA, setPasswordA] = useState("");
  const [passwordB, setPasswordB] = useState("");

  const history = useHistory();

  function submitFolderName() {
    props.setFolderName(newFolderName);
    props.setShowModal(false);
    const folder = {
      name: newFolderName,
      color: color,
      isPrivate: isPrivate,
      password: passwordA,
      notes: [],
    }
    postNewFolder(folder).then( result => {
      if (result && result.status === 200)
        props.setFolders([...props.folders, newFolderName]);
        props.setShowModal(false);
      });
  }

  function verifyMatchingPasswords(){
    if(!isPrivate){
      return true;
    }
    if(passwordA === passwordB && passwordA.length > 0) {
      return true;
    }
    return false;
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
      <FileSettings
        isPrivate={isPrivate}
        setIsPrivate={setIsPrivate}
        color={color} setColor={setColor}
        setPasswordA={setPasswordA}
        setPasswordB={setPasswordB}
        />
      <Link to="/folder">
        <button disabled={!verifyMatchingPasswords()} onClick={() => submitFolderName()}>Create</button>
      </Link>
    </form>
  );
}

export default CreateFolder;
