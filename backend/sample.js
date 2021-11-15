const express = require("express");
const mongoose = require("mongoose");
const Folder = require("./Database/Models/folderSchema");
const Note = require("./Database/Models/noteSchema");
const app = express();
const cors = require('cors');
const port = 5000;
const { json } = require("express");

const folders = {
  folderList: [
    {
      name: "sampleFolder",
      notes: [{}],
      isPrivate: false,
      password: "",
    },
    {
      name: "folder2",
      notes: null,
    }
  ],
};

app.use(cors());
app.use(express.json());

async function getAllFolders() {
  let result = await Folder.find({})
  return result
}

async function findFolder(name) {
  return Folder.find({'name':name});
}
async function findNotesByFolder(fName){
  return Note.find({'folder':fName});
}
async function findNote(folderName, noteName) {
  return Note.find({'name':noteName, 'folder':folderName});
}
async function addFolder(folder) {
  Folder.insertOne(folder);
}

async function deleteFolder(folderToDelete) {
  const folder = Folder.find({'name':folderToDelete});
  if(folder===undefined||folder.length==0){
    return false;
  }
  else{
    const folderId = folder["id"];
    try{
      if(Folder.findByIdAndDelete(folderId)){
        return true;
      }
    }
    catch(error){
      console.log(error);
      return false;
    }
  }
}
async function deleteNote(fName, noteName) {
  const noteToDelete = Note.find({'name': noteName, 'folder':fName});
  if(noteToDelete===undefined||noteToDelete.length==0){
    return false;
  }
  else{
    const noteId = noteToDelete["id"];
    try{
      if(Note.findByIdAndDelete(noteId)){
        return true;
      }
    }catch(error){
      console.log(error);
      return false;
    }
  }
}
app.use(express.json());
// main page: get all folders
app.get("/", async (req, res) => {
  const allFolders = await getAllFolders()
  res.send(allFolders);
});
// folder page: get all notes
//I use post methods here because it needs to get password for private folders 
//and I can't think of an alternative. 
//Please comment if you have any suggestions or alternative solutions!!!
app.post("/:folderName", (req, res) => {
  const folderName = req.params["folderName"];
  const passw = req.body;
  result = findFolder(folderName);
  if (result === undefined || result.length == 0) {
    res.status(404).send("Folder not found.");
  } else {
    if (!result["isPrivate"]) {
      result = findNotesByFolder(folderName);
      res.status(201).send(result);
    } else {
      if (passw["password"] === result["password"]) {
        res.status(201).send(findNotesByFolder(folderName));
      } else {
        //res.status(404).send(req.body);
        res.status(404).send("Wrong password. Access denied.");
      }
    }
  }
});
//open note
//I use post methods here because it needs to get password for private notes 
//and I can't think of an alternative. 
//Please comment if you have any suggestions or alternative solutions!!!
app.post("/:folderName/:note", (req, res) => {
  const fName = req.params["folderName"];
  const noteToGet = req.params["note"];
  result = findFolder(fName);
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
app.post("/:folderName", (req, res)=>{

})
//add folder
app.post("/", (req, res) => {
  const {name, color, isPrivate} = req.body;
  isDup = findFolder(name);
  if (true) {
    const folderToAdd = new Folder({name, color, isPrivate});
    folderToAdd.save()
    res.status(201).send(folderToAdd).end();
  } else {
    res.status(404).send("Duplicate file name.").end();
  }
});
//add note
async function addNote(note){
  try{
    const noteToAdd = new Note(note);
    if(await noteToAdd.save()){
      return true;
    }
  }catch(error){
    console.log(error);
    return false;
  }
}
app.post("/:folderName", (req, res) => {
  const note = req.body;
  if (addNote(req.body)) {
    res.status(201).end();
  } else {
    res.status(404).end();
  }
});
//delete folder
app.delete("/", (req, res) => {
  const folderToDelete = req.body["name"];
  if (deleteFolder(folderToDelete)) {
    deleteFolder(folderToDelete);
    res.status(204).end();
    
  } else {
    res.status(404).send(folderToDelete);
  }
});
//delete note
app.delete("/:folderName", (req, res) => {
  const noteToDelete = req.body["name"];
  const folderN = req.params["folderName"];
  if (deleteNote(folderN, noteToDelete)) {
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
