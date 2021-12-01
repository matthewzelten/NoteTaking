const mongoose = require("mongoose");
const dotenv = require("dotenv");
const folderSchema = require("./Database/Models/folderSchema");
const noteSchema = require("./Database/Models/noteSchema")
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
        folderConn = makeNewConnection(
            "mongodb+srv://" +
                process.env.MONGO_USER +
                ":" +
                process.env.MONGO_PWD +
                "@cluster0.yohuh.mongodb.net/Folders?retryWrites=true&w=majority"
        );
    }
    return folderConn;
}

function getNoteConnection() {
    if(!noteConn) {
        noteConn = makeNewConnection(
            "mongodb+srv://" +
                process.env.MONGO_USER +
                ":" +
                process.env.MONGO_PWD +
                "@cluster0.yohuh.mongodb.net/Notes?retryWrites=true&w=majority"
        );
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
    const result = await tempF.find({name: name})
    return result
}

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
    const Folder = getFolderConnection().model("Folder", folderSchema);
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

async function addNote(fName, noteToAdd) {
    folders["folderList"]
        .find((fold) => fold.name === fName)
        .notes.push(noteToAdd);
}

async function addNote(fName, noteToAdd) {
    const Note = folderConnection.model("Note", noteSchema);

    console.log(`Adding note to ${fName}`);
    console.log(`Note: ${noteToAdd.name} ${noteToAdd.folder}`);

    let thisFolder = (await findFolder(fName))[0];

    console.log("About to try and populate");
    console.log(thisFolder);
    console.log(typeof thisFolder);
    console.log(thisFolder.constructor);
    await thisFolder.populate('notes');
    //console.log(`POPULATED! ${thisFolder.populated("notes")}`);

    let notesList = thisFolder.notes.filter(note => note.name === noteToAdd.name);

    if(notesList.length !== 0) {
        //throw `addNote: note with name "${noteToAdd.name}" already exists in folder "${fName}".`;
        notesList[0].contents = noteToAdd.contents;
        notesList[0].save();
        console.log(`UPDATED ${notesList[0].name}`);
        let contents = await noteConnection.model("Note", noteSchema).findOne({name: noteToAdd.name}).contents;
        console.log(`NEW CONTENTS: ${contents}`);
    } else {
        console.log(`Checkpoint 1`);

        try {
            const note = await new Note(noteToAdd);
            await note.save();

            console.log(`Checkpoint 2`);
            console.log(note);

            thisFolder.notes.push(note._id);

            console.log(`Checkpoint 3`);

            await thisFolder.save();
        } catch(e) {
            console.log(e);
            return false;
        }

    }
}


async function deleteFolder(folderName) {
    Folder.findOneAndDelete({"name": folderName});
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

async function deleteNote(fName, nName) {
    let thisFolder = findFolder(fName);
    thisFolder.notes = thisFolder.notes.filter(note => note.name !== nName);
    thisFolder.save();
}


function makeNewConnection(URI) {
    const db = mongoose.createConnection(URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    );
    db.on("connected", function () {
        //console.log(`MongoDB :: connected ${this.name}`);
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

/*const folderConnection = makeNewConnection(
    "mongodb+srv://" +
        process.env.MONGO_USER +
        ":" +
        process.env.MONGO_PWD +
        "@cluster0.yohuh.mongodb.net/Folders?retryWrites=true&w=majority"
);*/

const noteConnection = makeNewConnection(
    "mongodb+srv://" +
        process.env.MONGO_USER +
        ":" +
        process.env.MONGO_PWD +
        "@cluster0.yohuh.mongodb.net/Notes?retryWrites=true&w=majority"
);

const Folder = getFolderConnection().model("Folder", folderSchema);
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
    deleteNote,
    setFolderConnection,
    setNoteConnection
}