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

// handle open folder, add folder and search folder
//I use post methods here because it needs to get password for private folders
//and I can't think of an alternative.
//Please comment if you have any suggestions or alternative solutions!!!
app.post("/", async (req, res)=>{
  const folder = req.body["folderName"];
  const keyword = req.body["keyword"];
  if((folder===undefined||folder.length==0)&&(keyword===undefined||keyword.length==0)){
    let isDup = await findFolder(req.body["name"]);
    if (isDup===undefined||isDup.length==0) {
      try{const folderToAdd = new Folder(req.body);
      folderToAdd.save()
      res.status(200).send(folderToAdd).end();}catch(error) {
        console.log(error);
        res.status(404).end();
    }
    } else {
      res.status(404).send("Duplicate file name. "+isDup).end();
    }
  }
  else if(keyword===undefined||keyword.length==0){
    let result = await findFolder(folder);
    if (result === undefined || result.length == 0) {
      res.status(404).send("Folder not found.");
    } else {
      if (!result["isPrivate"]) {
        res.status(200).send(result);
      } else {
        let passw = req.body["password"];
        if (passw["password"] === result["password"]) {
          //res.status(200).send(result);
          res.status(200).send("get notes");
          //res.status(200).send(findNotesByFolder(folderName));
        } else {
          //res.status(404).send(req.body);
          res.status(404).send("Wrong password. Access denied.");
        }
      }
    }
  }
  else{
    //search folder
    Folder.find({"name":{"$regex": keyword, "$options":"i"}}).exec(function (err, docs) {
      if (err){
          console.log(err);
      }else{
        res.status(200).send(docs).end();
      }});
    //res.status(200).send(result).end();
  }
})


//handle open note and add note
//I use post methods here because it needs to get password for private notes
//and I can't think of an alternative.
//Please comment if you have any suggestions or alternative solutions!!!
app.post("/:folderName", async (req, res) => {
  const fName = req.params["folderName"];
  const note = req.body["noteName"];
  const keyword = req.body["keyword"];
  if((note===undefined||note.length==0)&&(keyword===undefined||keyword.length==0)){
    //add note
    const noteToAdd = req.body;
    let result = await findNote(fName, req.body["name"]);
    if(result===undefined||result.length==0){
      if(addNote(noteToAdd)){
        res.status(201).send(noteToAdd).end();
      }
      else{
        res.status(404).end();
      }
    }
    else{
      res.status(404).send("Duplicate file name.").end();
    }
  }
  else if(keyword===undefined||keyword.length==0){
    result = await findFolder(fName);
    if (result === undefined || result.length == 0) {
      res.status(404).send("Folder not found.");
    } else {
      result = await findNote(fName, noteToGet);
      if (result === undefined || result.length == 0) {
        res.status(404).send("Note not found.");
      } else {
        if (!result["isPrivate"]) {
          res.status(200).send(result).end();
        } else {
          const passw = req.body;
          if (passw["password"] === result["password"]) {
            res.status(200).send(result).end();
          } else {
            res.status(404).send("Wrong password. Access denied.");
          }
        }
      }
    }

  }
  else{
    //search note
    Note.find({"name":{"$regex": keyword, "$options":"i"}}).exec(function (err, docs) {
      if (err){
          console.log(err);
      }else{
        res.status(200).send(docs).end();
      }});
  }
});

/* merged into one post function. but I keep this for now just in case.
app.post("/:folderName", async (req, res) => {
  const noteToAdd = req.body;
  const fName = req.params["folderName"];
  let result = await findNote(fName, req.body["name"]);
  if(result===undefined||result.length==0){
    if(addNote(noteToAdd)){
      res.status(201).send(noteToAdd).end();
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
  }
  else{
    res.status(404).send("Duplicate file name.").end();
  }
});*/

/*
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
*/

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
