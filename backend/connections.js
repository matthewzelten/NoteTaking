const mongoose = require("mongoose");
const dotenv = require("dotenv");
const folderSchema = require("./Database/Models/folderSchema");
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
    let result = folders["folderList"].find(
        (fold) => fold["name"] === folderName
    ).notes;
    if (result === null) {
        return undefined;
    } else {
        return result.find((note) => note["name"] === noteName);
    }
}
async function addFolder(folder) {
    folderModel.insertOne(folder);
}
async function addNote(fName, noteToAdd) {
    folders["folderList"]
        .find((fold) => fold.name === fName)
        .notes.push(noteToAdd);
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

module.exports = {
    folderConnection,
    noteConnection,
    getAllFolders,
    findFolder,
    findNote,
    addFolder,
    addNote,
    deleteFolder,
    deleteNote
}