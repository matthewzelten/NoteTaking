const express = require("express");
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

app.use(cors())
app.use(express.json());


function findFolder(name) {
  return folders["folderList"].find((fold) => fold["name"] === name);
}

function findNote(folderName, noteName) {
  let result = folders["folderList"].find(
    (fold) => fold["name"] === folderName
  ).notes;
  if (result === null) {
    return undefined;
  } else {
    return result.find((note) => note["name"] === noteName);
  }
}

function addFolder(folderName) {
  folders["folderList"].push(folderName);
}

function addNote(fName, noteToAdd) {
  folders["folderList"]
    .find((fold) => fold.name === fName)
    .notes.push(noteToAdd);
}

function deleteFolder(folderToDelete) {
  for (var i = 1; i < folders["folderList"].length; i++) {
    if (folders["folderList"][i].name === folderToDelete) {
      result = folders["folderList"].splice(i, 1);
      return;
    }
  }
}
function deleteNote(fName, nName) {
  let noteList = folders["folderList"].find(
    (folder) => folder["name"] === fName
  ).notes;
  for (var i = 1; i < noteList.length; i++) {
    if (noteList[i].name === nName) {
      result = noteList.splice(i, 1);
      return;
    }
  }
}
app.use(express.json());
// main page: get all folders
app.get("/", (req, res) => {
  //res.send('Note App');
  res.send(folders);
});
// folder page: get all notes
app.get("/:folderName", (req, res) => {
  const folderName = req.params["folderName"];
  result = findFolder(folderName);
  if (result === undefined || result.length == 0) {
    res.status(404).send("Folder not found.");
  } else {
    if (!result["isPrivate"]) {
      result = result.notes;
      res.status(201).send(result);
    } else {
      let passw = req.params["password"];
      if (passw === result["password"]) {
        res.status(201).send(result.notes);
      } else {
        res.status(404).send("Wrong password. Access denied.");
      }
    }
  }
});
//open note
app.get("/:folderName/:note", (req, res) => {
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
        const passw = req.params["password"];
        if (passw === result.password) {
          res.status(201).send(result).end();
        } else {
          res.status(404).send("Wrong password. Access denied.");
        }
      }
    }
  }
});
//add folder
app.post("/", (req, res) => {
  const folderToAdd = req.body;
  const fName = folderToAdd.name;
  isDup = findFolder(fName);
  if (isDup === undefined || isDup.length == 0) {
    folderToAdd.name = fName;
    folderToAdd.color = folderToAdd.color
    folderToAdd.notes = folderToAdd.notes;
    addFolder(folderToAdd);
    res.status(201).send(folderToAdd).end();
  } else {
    res.status(404).send("Duplicate file name.").end();
  }
});
//add note
app.post("/:folderName", (req, res) => {
  const noteToAdd = req.body;
  const fName = req.params["folderName"];
  let result = findNote(fName, noteToAdd["name"]);
  if (result === undefined || result.length == 0) {
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
