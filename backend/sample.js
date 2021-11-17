const express = require("express");
const mongoose = require("mongoose");
const Folder = require("./Database/Models/folderSchema").folder;
const Note = require("./Database/Models/noteSchema").note;
const app = express();
const cors = require("cors");
const port = 5000;
const { json } = require("express");
const { note } = require("./Database/Models/noteSchema");

/*
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
        },
    ],
};
 */

app.use(cors());
app.use(express.json());

async function getAllFolders() {
  return Folder.find({});
}

/*
async function findFolder(name) {
  return folders["folderList"].find((fold) => fold["name"] === name);
}*/

async function findFolder(name) {
  return Folder.findOne({"name": name});
  //return folders["folderList"].find((fold) => fold["name"] === name);
}

/*
async function findNote(folderName, noteName) {
  let result = folders["folderList"].find(
    (fold) => fold["name"] === folderName
  ).notes;
  if (result === null) {
    return undefined;
  } else {
    return result.find((note) => note["name"] === noteName);
  }
}*/

async function findNote(folderName, noteName) {
  let noteFolder = await findFolder(folderName);

  let result = noteFolder.notes.filter(note => note.name === noteName);

  if (result.length < 1) {
    return undefined;
  } else {
    return result[0];
  }
}

async function addFolder(folder) {
  let existingFolder = await Folder.findOne({"name" : folder.name});
  if(existingFolder) {
    throw `addFolder: folder with name "${folder.name}" already exists.`;
  } else {
    try {
      const folderToAdd = new Folder(folder);
      return folderToAdd.save();
    } catch(e) {
      console.log(e);
      return false;
    }

  }
}

/*
async function addNote(fName, noteToAdd) {
  folders["folderList"]
    .find((fold) => fold.name === fName)
    .notes.push(noteToAdd);
}*/

async function addNote(fName, noteToAdd) {
  console.log(`Adding note to ${fName}`);

  let thisFolder = await findFolder(fName);
  let notesList = thisFolder.notes.filter(note => note.name === noteToAdd.name);

  if(notesList.length !== 0) {
    throw `addNote: note with name "${noteToAdd.name}" already exists in folder "${fName}".`;
  } else {
    try {
      const note = await new Note(noteToAdd);
      console.log(note);
      thisFolder.notes.push(note);
      await thisFolder.save();
    } catch(e) {
      console.log(e);
      return false;
    }

  }
}

/*
async function deleteFolder(folderToDelete) {
  for (var i = 1; i < folders["folderList"].length; i++) {
    if (folders["folderList"][i].name === folderToDelete) {
      result = folders["folderList"].splice(i, 1);
      return;
    }
  }
}*/

async function deleteFolder(folderName) {
  Folder.findOneAndDelete({"name": folderName});
}

/*
async function deleteNote(fName, nName) {
  let noteList = folders["folderList"].find(
    (folder) => folder["name"] === fName
  ).notes;
  for (var i = 1; i < noteList.length; i++) {
    if (noteList[i].name === nName) {
      result = noteList.splice(i, 1);
      return;
    }
  }
}*/

async function deleteNote(fName, nName) {
  let thisFolder = findFolder(fName);
  let newNotes = thisFolder.notes.filter(note => note.name !== nName);
  thisFolder.notes = newNotes;
  thisFolder.save();
}

app.use(express.json());
// main page: get all folders
app.get("/", async (req, res) => {
    const allFolders = await getAllFolders();
    res.send(allFolders);
});


/*
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
*/

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
app.get("/:folderName", (req, res)=>{});

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

  /*isDup = findFolder(name);
  if (true) {
    const folderToAdd = new Folder({name, color, isPrivate});
    folderToAdd.save()
    res.status(201).send(folderToAdd).end();
  } else {
    res.status(404).send("Duplicate file name.").end();
  }
   */
});

//add note
app.post("/notes", async (req, res) => {
  const noteToAdd = req.body;

  console.log(`Posting note to ${noteToAdd.folder}`);

  console.log(`Random data ${noteToAdd.name} ${noteToAdd.isPrivate} ${noteToAdd.color}`);

  try {
    let newNote = {
      "name": noteToAdd.name,
      "contents": [{}],
      "folder": noteToAdd.folder,
      "color": noteToAdd.color,
      "isPrivate" : noteToAdd.isPrivate,
      "password": noteToAdd.password,
      "isLocked": noteToAdd.isLocked
    };

    let result = await addNote(noteToAdd.folder, newNote);
    res.status(201).send(result).end();
  } catch(e) {
    console.log(e);
    res.status(404).send(e).end();
  }
});

/*
//add note
app.post("/:folderName", (req, res) => {
  const noteToAdd = req.body;
  const fName = req.params["folderName"];
  let result = findNote(fName, noteToAdd["name"]);
  if (result === undefined || result.length == 0) {
    noteToAdd.noteContent = [{}];
    addNote(fName, noteToAdd);
    res.status(201).send(noteToAdd).end();
  } else {
    res.status(404).send("Duplicate note name.").end();
  }
});*/

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
