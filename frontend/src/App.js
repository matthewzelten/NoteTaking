import React from 'react';
import FolderContainer from "./components/FolderContainer";
import "./App.css";
import Header from "./components/shared/header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CreateFolder from "./components/CreateFolder";
import Folder from "./components/Folder";
import { useState } from "react";
import CreateNote from "./components/CreateNote";
import Modal from 'react-modal';
import Note from "./components/Note";

function App() {
    const [folderName, setFolderName] = useState("");
    const [noteName, setNoteName] = useState([]);
    const [showModal, setShowModal] = useState(false);

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
                            <FolderContainer setShowModal={setShowModal}/>
                        </div>
                    </Route>
                    <Route exact path="/folder">
                        <Folder folderName={folderName} noteName={noteName}/>
                    </Route>
                    <Route path="/note">
                        <Note />
                    </Route>
                </Switch>
                <Modal isOpen={showModal}>
                    <button onClick={() => setShowModal(false)}>Close Modal</button>
                    <CreateFolder setFolderName={setFolderName} setShowModal={setShowModal}/>
                </Modal>
            </Router>
        </div>
    );
}

export default App;
