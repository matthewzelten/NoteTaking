import React from "react";
import "./App.css";
import Header from "./components/shared/header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Folder from "./components/folderpage/Folder";
import { useState, useEffect } from "react";
import Note from "./components/notepage/Note";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import LandingPage from "./components/landingpage/LandingPage";

function App() {
    const [folderName, setFolderName] = useState("");
    const [currentFolder, setCurrentFolder] = useState({});
    const [folderURL, setFolderURL] = useState("");
    const [noteURL, setNoteURL] = useState("")
    const [noteName, setNoteName] = useState([]);
    const [noteColor, setNoteColor] = useState("white");
    const [noteContents, setNoteContents] = useState("");
    const [checkPass, setCheckPass] = useState("")
    const [folders, setFolders] = useState([]);
    const [keyword, setKeyword] = useState("");

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

    async function getFolder(name,password="") {
        try {
            const response = await axios.get(`http://localhost:5000/${name}?pass=${password}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    async function deleteFolder(folder) {
        try {
            await axios
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
    async function cancelSearch(){
        setKeyword("");
        window.location.reload();
    }
    async function searchFolder() {
        const search = { keyword: keyword };
        let result = await getSearch(search);
        if (result && result.status === 200) {
            setFolders(result.data);
        }
    }

    async function getSearch(search){
        try{
            const result = await axios.post("http://localhost:5000/", search);
            return result;
        }
        catch(error){
            console.log(error);
        }
    }

    async function deleteNote(noteName, folderName) {
        console.log(`Deleting note ${noteName} in folder ${folderName}`);

        try {
            await axios
                .delete(`http://localhost:5000/${folderName}`, {
                        data: {
                            name: noteName
                        }
                    }
                )
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
            if (folder.name === name) {
                return true;
            }
        }
        return false;
    }

    return (
        <Box className="App">
            <Router>
                <Header />
                <Box style={{ width:"90%", margin:"auto", maxWidth:"1500px" }}>
                    <Switch>
                        <Route exact path="/">
                            <LandingPage
                                folders={folders}
                                setFolderName={setFolderName}
                                setFolderURL={setFolderURL}
                                folderName={folderName}
                                setCurrentFolder={setCurrentFolder}
                                isDuplicate={isDuplicate}
                                setFolders={setFolders}
                                setKeyword={setKeyword}
                                cancelSearch={cancelSearch}
                                searchFolder={searchFolder}setCheckPass={setCheckPass}
                            />
                        </Route>
                        <Route exact path={`/folder/:folder`}>
                            <Folder
                                setNoteName={setNoteName}
                                setNoteContents={setNoteContents}
                                setFolderName={setFolderName}
                                folderName={folderName}
                                noteName={noteName}
                                folderURL={folderURL}
                                getFolder={getFolder}
                                deleteFolder={deleteFolder}
                                currentFolder={currentFolder}
                                setCurrentFolder={setCurrentFolder}
                                setNoteColor={setNoteColor}
                                checkPass={checkPass}
                            />
                        </Route>
                        <Route exact path={`/folder/:folder/note/:note`}>
                            <Note
                                folderURL={folderURL}
                                noteName={noteName}
                                noteContents={noteContents}
                                contents={noteContents}
                                folderName={folderName}
                                noteColor={noteColor}
                                deleteNote={deleteNote}
                            />
                        </Route>
                    </Switch>
                </Box>
            </Router>
        </Box>
    );
}

export default App;
