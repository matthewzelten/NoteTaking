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

function App() {
    const [folderName, setFolderName] = useState("");
    const [folderURL, setFolderURL] = useState("");
    const [currentFolder, setCurrentFolder] = useState({});
    const [noteName, setNoteName] = useState([]);
    const [showModal, setShowModal] = useState(false);
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
            const data = response.data[0];
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

    function redirectFolder(name) {
        const replaced = name.split(" ").join("+");
        setFolderName(name);
        setFolderURL(replaced);
    }

    return (
        <Box className="App" h="100%" bg="#216869">
            <Router>
                <Header />
                <Switch>
                    <Route exact path="/">
                        <Box
                            style={{
                                display: "flex",
                                flexDirection: "row",
                            }}
                        >
                            <FolderContainer
                                redirectFolder={redirectFolder}
                                folderData={folders}
                                setShowModal={setShowModal}
                            />
                        </Box>
                    </Route>
                    <Route path={`/folder/`}>
                        <Folder
                            setNoteName={setNoteName}
                            setFolderName={setFolderName}
                            folderName={folderName}
                            noteName={noteName}
                            getFolder={getFolder}
                            deleteFolder={deleteFolder}
                            currentFolder={currentFolder}
                            getCurrentFolder={getCurrentFolder}
                        />
                    </Route>
                    <Route path="/note">
                        <Note noteName={noteName} />
                    </Route>
                </Switch>
                <Modal isOpen={showModal}>
                    <Button onClick={() => setShowModal(false)}>
                        Close Modal
                    </Button>
                    <CreateFolder
                        folderName={folderName}
                        setFolderName={setFolderName}
                        setCurrentFolder={setCurrentFolder}
                        setShowModal={setShowModal}
                    />
                </Modal>
            </Router>
        </Box>
    );
}

export default App;
