import FolderContainer from "./components/FolderContainer";
import "./App.css";
import Header from "./shared/header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CreateFolder from "./components/CreateFolder";
function App() {
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
                      <CreateFolder/>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
