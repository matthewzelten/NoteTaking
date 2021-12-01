const mongoose = require("mongoose");
const dotenv = require("dotenv");
const folderSchema = require("./Database/Models/folderSchema");
const noteSchema = require("./Database/Models/noteSchema")
dotenv.config();

async function getAllFolders() {
    const Folder = folderConnection.model("Folder", folderSchema);
    let result = await Folder.find({});
    return result;
}

async function findFolder(name) {
    const Folder = folderConnection.model("Folder", folderSchema);
    const result = await Folder.find({name: name})
    return result
}

async function findNote(folderName, noteName) {
    const result = await Note.find({name: noteName});
    return result;
}
async function addFolder(folder) {
    folderModel.insertOne(folder);
}
//add note
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

async function deleteFolder(folderToDelete) {
    for (var i = 1; i < folders["folderList"].length; i++) {
        if (folders["folderList"][i].name === folderToDelete) {
            result = folders["folderList"].splice(i, 1);
            return;
        }
    }
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

function makeNewConnection(URI) {
    const db = mongoose.createConnection(URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    );
    db.on("connected", function () {
        console.log(`MongoDB :: connected ${this.name}`);
    });
    db.on("error", function (error) {
        console.log(
            `MongoDB :: connection ${this.name} ${JSON.stringify(error)}`
        );
        db.close().catch(() =>
            console.log(`MongoDB :: failed to close connection ${this.name}`)
        );
    });
    return db
}

const folderConnection = makeNewConnection(
    "mongodb+srv://" +
        process.env.MONGO_USER +
        ":" +
        process.env.MONGO_PWD +
        "@cluster0.yohuh.mongodb.net/Folders?retryWrites=true&w=majority"
);

const noteConnection = makeNewConnection(
    "mongodb+srv://" +
        process.env.MONGO_USER +
        ":" +
        process.env.MONGO_PWD +
        "@cluster0.yohuh.mongodb.net/Notes?retryWrites=true&w=majority"
);

const Folder = folderConnection.model("Folder", folderSchema);
const Note = noteConnection.model("Note", noteSchema);

module.exports = {
    Folder,
    noteConnection,
    getAllFolders,
    findFolder,
    findNote,
    addFolder,
    addNote,
    deleteFolder,
    deleteNote
}