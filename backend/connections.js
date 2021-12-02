const mongoose = require("mongoose");
const dotenv = require("dotenv");
const folderSchema = require("./Database/Models/folderSchema");
const noteSchema = require("./Database/Models/noteSchema");
dotenv.config();

let folderConn;
let noteConn;

function setFolderConnection(newConn) {
    return (folderConn = newConn);
}

function setNoteConnection(newConn) {
    return (noteConn = newConn);
}

function getFolderConnection() {
    if (!folderConn) {
        let uri = "mongodb+srv://" +
            process.env.MONGO_USER +
            ":" +
            process.env.MONGO_PWD +
            "@cluster0.yohuh.mongodb.net/Folders?retryWrites=true&w=majority";
        let params = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        folderConn = mongoose.createConnection(uri, params);
    }
    return folderConn;
}

function getNoteConnection() {
    if(!noteConn) {
        let uri = "mongodb+srv://" +
            process.env.MONGO_USER +
            ":" +
            process.env.MONGO_PWD +
            "@cluster0.yohuh.mongodb.net/Notes?retryWrites=true&w=majority";
        let params = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        noteConn = mongoose.createConnection(uri, params);
    }
    return noteConn;
}

async function getAllFolders() {
    const tempF = getFolderConnection().model("Folder", folderSchema);
    let result = await tempF.find({});
    return result;
}

async function findFolder(name) {
    const tempF = getFolderConnection().model("Folder", folderSchema);
    const result = await tempF.find({ name: name });
    return result;
}

async function findNote(folderName, noteName) {
    const result = await Note.find({name: noteName});
    return result;
}

async function addNote(note){
    try{
      //const folder = findFolder(note["folder"]);
      const noteToAdd = new Note(note);
      if(await noteToAdd.save()){
      //if(await folder["notes"].insertOne(noteToAdd)){
        return true;
      }
    }catch(error){
      console.log(error);
      return false;
    }
}
/*async function addNote(fName, noteToAdd) {
    folders["folderList"]
        .find((fold) => fold.name === fName)
        .notes.push(noteToAdd);
}*/

async function deleteFolder(folderToDelete) {
    Folder.deleteOne({ name: folderToDelete }, function (err, result) {
        if (err) {
            console.log(err);
            throw err;
            //return false;
        }
    });
    return true;
}
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
}

const Folder = getFolderConnection().model("Folder", folderSchema);
const Note = getNoteConnection().model("Note", noteSchema);

module.exports = {
    Folder,
    Note,
    getAllFolders,
    findFolder,
    findNote,
    //addFolder,
    addNote,
    deleteFolder,
    deleteNote,
    setFolderConnection,
    setNoteConnection,
};
