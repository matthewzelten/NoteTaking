const mongoose = require("mongoose");
const dotenv = require("dotenv");
const folderSchema = require("./Database/Models/folderSchema");
const noteSchema = require("./Database/Models/noteSchema");
dotenv.config();

let conn;

function setConnection(newConn) {
    return (conn = newConn);
}

function getConnection() {
    if (!conn) {
        let uri = "mongodb+srv://" +
            process.env.MONGO_USER +
            ":" +
            process.env.MONGO_PWD +
            "@cluster0.yohuh.mongodb.net/Folders?retryWrites=true&w=majority";
        let params = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        conn = mongoose.createConnection(uri, params);
    }
    return conn;
}

/*function getNoteConnection() {
    if(!conn) {
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
}*/

async function getAllFolders() {
    const tempF = getConnection().model("Folder", folderSchema);
    let result = await tempF.find({});
    //console.log(result);
    return result;
}

async function findFolder(name) {
    const tempF = getConnection().model("Folder", folderSchema);
    const result = await tempF.find({ name: name });
    return result;
}
async function findNote(folderName, noteName) {
    let result = folders["folderList"].find(
        (fold) => fold["name"] === folderName
    ).notes;
    if (result === null) {
        return undefined;
    } else {
        return result.find((note) => note["name"] === noteName);
    }
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
    const tempF = getConnection().model("Folder", folderSchema);
    tempF.deleteOne({ name: folderToDelete }, function (err, result) {
        //console.log(folderToDelete);
        //console.log(result.deletedCount);
        if (result.deletedCount === 0 || result.deletedCount === undefined) {
            console.log(folderToDelete, ' + ', result.deletedCount, ' returning false');
            //console.log(err);
            //throw err;
            return false;
        }
    });
    console.log(folderToDelete, ' returning true');
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

const Folder = getConnection().model("Folder", folderSchema);
const Note = getConnection().model("Note", noteSchema);

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
    setConnection,
};
