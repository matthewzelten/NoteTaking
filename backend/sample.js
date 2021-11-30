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
const mongoose = require("mongoose");
const Note = require("./Database/Models/noteSchema").note;
const app = express();
const cors = require("cors");
const port = 5000;
const { json } = require("express");
const { note } = require("./Database/Models/noteSchema");

app.use(cors());
app.use(express.json());

// main page: get all folders
app.get("/", async (req, res) => {
    const allFolders = await getAllFolders();
    res.send(allFolders);
});


//open note
app.post("/:folderName/:note", (req, res) => {
    const fName = req.params["folderName"];
    const noteToGet = req.params["note"];
    let result = findFolder(fName);
    if (result === undefined || result.length === 0) {
        res.status(404).send("Folder not found.");
    } else {
        result = findNote(fName, noteToGet);
        if (result === undefined || result.length === 0) {
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

//getFolder
app.get("/:folderName", async (req, res) => {
    console.log(`getFolder: ${req.params.folderName}`)
    let result = await findFolder(req.params.folderName);
    if (result === undefined || result.length === 0) {
        res.status(404).send(`Folder ${req.params.folderName} not found.`);
    }else {
        result = {folder: result};
        console.log(`Found folder: ${result.folder}`);
        res.send(result.folder);
    }
});

//add folder
app.post("/", async (req, res) => {

  const {name, color, isPrivate} = req.body;

  console.log(`Adding folder ${name}`);

  try {
    let result = await addFolder({
      "name": name,
      "color": color,
      "isPrivate" : isPrivate,
      "notes": []
    });
    res.status(201).send(result).end();
  } catch(e) {
    console.log(e);
    res.status(404).send(e).end();
  }

});

//add note
app.post("/notes", async (req, res) => {
    const noteToAdd = req.body;

    console.log(`Posting note to ${noteToAdd.folder}`);
    console.log(`Random data ${noteToAdd.name} ${noteToAdd.isPrivate} ${noteToAdd.color} \"${noteToAdd.contents}\"`);

    let folder = await findFolder(noteToAdd.folder);
    console.log(`FOLDER ID: ${folder[0]._id}`);

    try {
        let newNote = {
            "name": noteToAdd.name,
            "contents": noteToAdd.contents,
            "folder": folder[0]._id,
            "color": noteToAdd.color,
            "isPrivate": noteToAdd.isPrivate,
            "password": noteToAdd.password,
            "isLocked": noteToAdd.isLocked
        };

        let result = await addNote(noteToAdd.folder, newNote);
        res.status(201).send(result).end();
    } catch (e) {
        console.log(e);
        res.status(404).send(e).end();
    }


});


//delete folder
app.delete("/", (req, res) => {
    const folderToDelete = req.body["name"];
    let result = findFolder(folderToDelete);
    if (result === undefined || result.length === 0) {
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
    if (result === undefined || result.length === 0) {
        res.status(404).send(noteToDelete);
    } else {
        deleteNote(folderName, noteToDelete);
        res.status(204).end();
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
