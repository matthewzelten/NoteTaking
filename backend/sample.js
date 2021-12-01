const express = require("express");
const {
    Folder,
    getAllFolders,
    findFolder,
    findNote,
    addFolder,
    addNote,
    deleteFolder,
    deleteNote} = require('./connections');
const app = express();
const cors = require("cors");
const port = 5000;

app.use(cors());
app.use(express.json());

// main page: get all folders
app.get("/", async (req, res) => {
    const allFolders = await getAllFolders();
    res.send(allFolders);
});

// folder page: get all notes
app.get("/:folderName", async (req, res) => {
    const folderName = req.params["folderName"];
    const passw = req.query["pass"];
    const result = await findFolder(folderName);
    if (result === undefined || result.length == 0) {
        res.status(404).send("Folder not found.");
    } else {
        if (!result["isPrivate"]) {
            res.status(201).send(result);
        } else {
            if (passw["password"] === result["password"]) {
                res.status(201).send(result);
            } else {
                //res.status(404).send(req.body);
                res.status(404).send("Wrong password. Access denied.");
            }
        }
    }
});
//open note
app.post("/:folderName/:note", (req, res) => {
    const fName = req.params["folderName"];
    const noteToGet = req.params["note"];
    const result = findFolder(fName);
    if (result === undefined || result.length == 0) {
        res.status(404).send("Folder not found.");
    } else {
        result = findNote(fName, noteToGet);
        if (result === undefined || result.length == 0) {
            res.status(404).send("Note not found.");
        } else {
            if (!result["isPrivate"]) {
                res.status(201).send(result).end();
            } else {
                const passw = req.body;
                if (passw["password"] === result["password"]) {
                    res.status(201).send(result).end();
                } else {
                    res.status(404).send("Wrong password. Access denied.");
                }
            }
        }
    }
});

//search note
app.get("/:folderName", (req, res) => {});
//add folder
app.post("/", (req, res) => {
    const { name, color, isPrivate, password } = req.body;
    isDup = findFolder(name);
    if (true) {
        const folderToAdd = new Folder({ name, color, isPrivate, password });
        addFolder(folderToAdd);
        //folderToAdd.save();
        res.status(201).send(folderToAdd).end();
    } else {
        res.status(404).send("Duplicate file name.").end();
    }
});
//add note
app.post("/:folderName/:noteName", (req, res) => {
    const noteToAdd = req.params["noteName"];
    const fName = req.params["folderName"];
    let result = findNote(fName, noteToAdd["name"]);
    if (result === undefined || result.length == 0) {
        noteToAdd.noteContent = [{}];
        addNote(fName, noteToAdd);
        res.status(201).send(noteToAdd).end();
    } else {
        res.status(404).send("Duplicate note name.").end();
    }
});
//delete folder
app.delete("/", (req, res) => {
    const folderToDelete = req.body["name"];
    let result = findFolder(folderToDelete);
    if (result === undefined || result.length == 0) {
        res.status(404).send(folderToDelete);
    } else {
        deleteFolder(folderToDelete);
        res.status(204).end();
    }
});
//delete note
app.delete("/:folderName", (req, res) => {
    const noteToDelete = req.body["name"];
    let result = findNote(folderName, noteToDelete);
    if (result === undefined || result.length == 0) {
        res.status(404).send(noteToDelete);
    } else {
        deleteNote(folderName, noteToDelete);
        res.status(204).end();
    }
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
