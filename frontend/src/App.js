import React from "react";
import FolderContainer from "./components/landingpage/FolderContainer";
import "./App.css";
import Header from "./components/shared/header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CreateFolder from "./components/landingpage/CreateFolder";
import Folder from "./components/folderpage/Folder";
import { useState, useEffect } from "react";
import CreateNote from "./components/folderpage/CreateNote";
import { ChakraProvider } from "@chakra-ui/react"
import Modal from "react-modal";
import Note from "./components/notepage/Note";
import axios from 'axios';

function App() {
  const [folderName, setFolderName] = useState("");
  const [noteName, setNoteName] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [folders, setFolders] = useState([])
  const [noteData, setNoteData] = useState({
    name: null,
    folder: null,
    color: null,
    isPrivate: null,
    password: null,
    isLocked: null
  });

  useEffect(() => {
    fetchAllFolders().then(result => {
      if(result){
        setFolders(result)
      }
    });
  }, [])

  async function fetchAllFolders() {
    try {
      const response = await axios.get('http://localhost:5000/');
      return response.data;
    }
    catch(error) {
      console.log(error);
      return false;
    }
  }

  function updateNote(note) {
    makePostCall(note).then( result => {
      //if(result && result.status === 201) setCharacters([...characters, result.data]);
    });
  }

  async function makePostCall(note) {
    try {
      return await axios.post('http://localhost:5000/notes', note);
      console.log(`Posted ${note}`);
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function getFolder(name) {
    try {
      const response = await axios.get(`http://localhost:5000/${name}`)
      console.log(`Got folder name: ${response.data.folder.name}`);
      setFolderName(response.data.folder.name)

    }
    catch(error) {
      console.log(`Error in getFolder: ${error}`);
    }
  }

  return (
    <ChakraProvider>
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
              <FolderContainer getFolder={getFolder} folderData={folders} setShowModal={setShowModal} />
            </div>
          </Route>
          <Route exact path="/folder">
            <Folder setNoteData={setNoteData} setNoteName={setNoteName} folderName={folderName} noteName={noteName} />
          </Route>
          <Route path="/note">
            <Note handleSubmit={updateNote} folderName={folderName} noteData={noteData}/>
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
    </ChakraProvider>
  );
}

export default App;
