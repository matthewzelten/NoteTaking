import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import CreateNote from "./CreateNote";

function Folder(props) {
  const [showNoteModal, setShowNoteModal] = useState(false);
  return (
    <div>
      <Link to="/">
        <button>Return</button>
      </Link>
      <h2>{props.folderName}</h2>
      <input type="text" placeholder="Search" />
      <button onClick={() => setShowNoteModal(true)}>+ Add New Note</button>
      <Modal isOpen={showNoteModal}>
        <button onClick={() => setShowNoteModal(false)}>Close Modal</button>
        <CreateNote setNoteData={props.setNoteData} folderName={props.folderName} setNoteName={props.setNoteName}/>
      </Modal>
    </div>
  );
}

export default Folder;
