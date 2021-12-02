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

    function getCurrentFolder() {
        const folderURL = window.location.pathname.split("/")[2];
        const replaced = folderURL.split("+").join(" ");
        getFolder(replaced).then((data) => setCurrentFolder(data));
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
                <Switch>
                    <Route exact path="/">
                        <LandingPage 
                            folders={folders}
                            setFolderName={setFolderName}
                            folderName={folderName}
                            setCurrentFolder={setCurrentFolder}
                            isDuplicate={isDuplicate}
                            />
                    </Route>
                    <Route path={`/folder/`}>
                        <Folder
                            setNoteName={setNoteName}
                            setNoteContents={setNoteContents}
                            setFolderName={setFolderName}
                            folderName={folderName}
                            noteName={noteName}
                            getFolder={getFolder}
                            deleteFolder={deleteFolder}
                            currentFolder={currentFolder}
                            getCurrentFolder={getCurrentFolder}
                            setCurrentFolder={setCurrentFolder}
                        />
                    </Route>
                    <Route path="/note">
                        <Note noteName={noteName} noteContents={noteContents} folderName={folderName} contents={noteContents}/>
                    </Route>
                </Switch>
            </Router>
        </Box>
    );
}

export default App;
