const express = require("express");
const app = express();
const port = 5000;
const { json } = require("express");

const folders = {
  folderList: [
    {
      name: "sampleFolder",
      notes: null,
    },
  ],
};
function findFolder(name) {
  return folders["folderList"].find((fold) => fold["name"] === name);
}
function addFolder(folderName) {
  folders["folderList"].push(folderName);
}
function addNote(fName, noteToAdd) {
  folders["folderList"]
    .find((fold) => fold.name === fName)
    .notes.push(noteToAdd);
}

app.use(express.json());

app.get("/", (req, res) => {
  //res.send('Note App');
  res.send(folders);
});

app.get("/:folderName", (req, res) => {
  const folderName = req.params["folderName"];
  result = findFolder(folderName);
  if (result === undefined || result.length == 0) {
    res.status(404).send("Folder not found.");
  } else {
    result = { folderList: result };
    res.status(201).send(result);
  }
});

app.post("/", (req, res) => {
  const folderToAdd = req.body;
  const fName = folderToAdd.name;
  isDup = findFolder(fName);
  if (isDup === undefined || isDup.length == 0) {
    folderToAdd.notes = null;
    addFolder(folderToAdd);
    res.status(201).send(folderToAdd).end();
  } else {
    res.status(404).send("Duplicate file name.").end();
  }
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
