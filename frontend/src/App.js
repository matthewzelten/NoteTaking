import FolderContainer from "./components/FolderContainer";
import "./App.css";
import Header from "./components/shared/header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CreateFolder from "./components/CreateFolder";
import Folder from "./components/Folder";
import { useState } from "react";
import CreateNote from "./components/CreateNote";

function App() {
    const [folderName, setFolderName] = useState("");
    const [noteName, setNoteName] = useState([]);

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
                            <FolderContainer />
                            <FolderContainer />
                            <FolderContainer />
                            <FolderContainer />
                            <FolderContainer />
                            <FolderContainer />
                        </div>
                    </Route>
                    <Route path="/create-folder">
                        <CreateFolder setFolderName={setFolderName} />
                    </Route>
                    <Route exact path="/folder">
                        <Folder folderName={folderName} noteName={noteName} />
                    </Route>
                    <Route path="/folder/create-note">
                        <CreateNote />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
