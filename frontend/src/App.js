import React from "react";
import FolderContainer from "./components/landingpage/FolderContainer";
import "./App.css";
import Header from "./components/shared/header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CreateFolder from "./components/landingpage/CreateFolder";
import Folder from "./components/folderpage/Folder";
import { useState, useEffect } from "react";
import CreateNote from "./components/folderpage/CreateNote";
import Modal from "react-modal";
import Note from "./components/notepage/Note";
import axios from 'axios';

function App() {
  const [folderName, setFolderName] = useState("");
  const [noteName, setNoteName] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [folders, setFolders] = useState([])

  useEffect(() => {
    fetchAllFolders().then(result => {
      if(result){
        setFolders(result)
      }
    });
  }, [])

  async function fetchAllFolders() {
    try {
      const response = await axios.get('http://localhost:4000/');
      return response.data;
    }
    catch(error) {
      console.log(error);
      return false;
    }
  }

  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                width: "40%",
              }}
            >
              <FolderContainer folderData={folders} setShowModal={setShowModal} />
            </div>
          </Route>
          <Route exact path="/folder">
            <Folder folderName={folderName} noteName={noteName} />
          </Route>
          <Route path="/note">
            <Note />
          </Route>
        </Switch>
        <Modal isOpen={showModal}>
          <button onClick={() => setShowModal(false)}>Close Modal</button>
          <CreateFolder
            setFolderName={setFolderName}
            setShowModal={setShowModal}
          />
        </Modal>
      </Router>
    </div>
  );
}

export default App;
