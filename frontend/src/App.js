import React from "react";
import FolderContainer from "./components/landingpage/FolderContainer";
import "./App.css";
import Header from "./components/shared/header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CreateFolder from "./components/landingpage/CreateFolder";
import Folder from "./components/folderpage/Folder";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import Note from "./components/notepage/Note";
import axios from "axios";
import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import { Flex } from "@chakra-ui/layout";
import LandingPage from "./components/landingpage/LandingPage";

function App() {

    const [folderName, setFolderName] = useState("");
    const [currentFolder, setCurrentFolder] = useState({});
    const [noteName, setNoteName] = useState([]);
    const [noteColor, setNoteColor] = useState("white");
    const [noteContents, setNoteContents] = useState("");
    const [folders, setFolders] = useState([]);



    useEffect(() => {
        fetchAllFolders().then((result) => {
            if (result) {
                setFolders(result);
            }
        });

    }, []);

    async function fetchAllFolders() {
        try {
            const response = await axios.get("http://localhost:5000/");
            return response.data;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async function getFolder(name) {
        try {
            const response = await axios.get(`http://localhost:5000/${name}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    async function deleteFolder(folder) {
        try {
            const response = await axios
                .delete(`http://localhost:5000/`, {
                    data: folder,
                })
                .then(() => {
                    window.location.reload();
                });
        } catch (error) {
            console.log(error);
        }
    }

    function isDuplicate(name) {
        for (let i = 0; i < folders.length; i++) {
            const folder = folders[i];
            if(folder.name === name) {
                return true
            }
        }
        return false
    }

    return (
        <Box className="App">
            <Router>
                <Header />
                <div style={{width: "95%", margin: "auto", maxWidth: "1200px"}}>
                    <Switch>
                        <Route exact path="/">
                            <LandingPage
                                folders={folders}
                                setFolderName={setFolderName}
                                folderName={folderName}
                                setCurrentFolder={setCurrentFolder}
                                isDuplicate={isDuplicate}
                                setFolders={setFolders}
                            />
                        </Route>
                        <Route path={`/folder/`}>
                            <Folder
                                setNoteName={setNoteName}
                                setNoteContents={setNoteContents}
                                setNoteColor={setNoteColor}
                                setFolderName={setFolderName}
                                folderName={folderName}
                                noteName={noteName}
                                getFolder={getFolder}
                                deleteFolder={deleteFolder}
                                currentFolder={currentFolder}
                                setCurrentFolder={setCurrentFolder}
                            />
                        </Route>
                        <Route path="/note">
                            <Note
                                noteName={noteName}
                                noteContents={noteContents}
                                folderName={folderName}
                                noteColor={noteColor}/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        </Box>
    );
}

export default App;
