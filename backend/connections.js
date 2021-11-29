const mongoose = require("mongoose");
const dotenv = require("dotenv");
const folderSchema = require("./Database/Models/folderSchema");
const Folder = require("./Database/Models/folderSchema");
const noteSchema = require("./Database/Models/noteSchema");
dotenv.config();

async function getAllFolders() {
    const Folder = folderConnection.model("Folder", folderSchema);
    return await Folder.find({});
}


async function findFolder(name) {
    const Folder = folderConnection.model("Folder", folderSchema);
    let folder = await Folder.findOne({"name": name});
    console.log(`Found folder ${folder}`);
    return folder;
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
    const Folder = folderConnection.model("Folder", folderSchema);
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
    console.log(`Note: ${noteToAdd}`);

    let thisFolder = await findFolder(fName);

    console.log("About to try and populate");
    await thisFolder.populate("notes");
    console.log(`POPULATED! ${thisFolder.populated("notes")}`);

    let notesList = thisFolder.notes.filter(note => note.name === noteToAdd.name);

    if(notesList.length !== 0) {
        throw `addNote: note with name "${noteToAdd.name}" already exists in folder "${fName}".`;
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