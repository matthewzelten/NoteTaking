import React, { useState } from "react";
import { Link } from "react-router-dom";
import FileSettings from "../components/shared/FileSettings";

function CreateNote() {
  const [disablePassword, setDisablePassword] = useState(true);

  return (
    <div>
      <h1>Add New Note</h1>
      <input type="text" placeholder="Enter Note Name" />
      <FileSettings />
      <Link to="/note">
        <button> Create Note </button>
      </Link>
    </div>
  );
}

export default CreateNote;
