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

/**
 * Returns all folders
 * @returns {Promise<*>} Array of all folders
 */
async function getAllFolders() {
    const tempF = getConnection().model("Folder", folderSchema);
    return tempF.find({});
}

/**
 * Finds the folders with the specified name
 * @param name
 * @returns {Promise<*>} Array of found folders
 */
async function findFolder(name) {
    const tempF = getConnection().model("Folder", folderSchema);
    return tempF.find({ name: name });
}



/**
 * Returns the note with the given name in the given folder
 * @param folderName
 * @param noteName
 * @returns {Promise<undefined|T>} the found note
 */
async function findNote(folderName, noteName) {
    const Note = getConnection().model("Note", noteSchema);

    let noteFolder = (await findFolder(folderName))[0];

    console.log(`populating in findNote`);
    await noteFolder.populate("notes");

    let result = noteFolder.notes.filter(note => note.name === noteName);

    if (result.length < 1) {
        return undefined;
    } else {
        return result[0];
    }
}

/**
 * Adds a new folder to the database. Folder must be structured correctly.
 * @param folder
 * @returns {Promise<boolean|(Document<any, any, unknown> & Require_id<unknown>)>}
 */
async function addFolder(folder) {
    const Folder = getConnection().model("Folder", folderSchema);
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


/**
 * Adds a new note to the database
 * @param fName
 * @param noteToAdd
 * @returns {Promise<boolean>} whether the note was added
 */
async function addNote(fName, noteToAdd) {
    const Note = getConnection().model("Note", noteSchema);

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
        //THIS IS THE SAVE FUNCTION
        //FIX THIS
        notesList[0].contents = noteToAdd.contents;
        notesList[0].save();
        //console.log(`UPDATED ${notesList[0].name}`);
        let contents = await getConnection().model("Note", noteSchema).findOne({name: noteToAdd.name}).contents;
        //console.log(`NEW CONTENTS: ${contents}`);

        return contents;

    } else {
        //console.log(`Checkpoint 1`);
        try {
            const note = await new Note(noteToAdd);
            await note.save();
            //console.log(`Checkpoint 2`);
            console.log(note);
            thisFolder.notes.push(note._id);
            //console.log(`Checkpoint 3`);
            return await thisFolder.save();
        } catch(e) {
            console.log(e);
            return false;
        }

    }
}

/**
 * Deletes the given folder
 * @param folderToDelete name of folder to delete
 * @returns {Promise<void>}
 */
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

/*
async function deleteFolder(folderToDelete) {
    for (var i = 1; i < folders["folderList"].length; i++) {
        if (folders["folderList"][i].name === folderToDelete) {
            result = folders["folderList"].splice(i, 1);
            return;
        }
    }
}*/

/**
 * Deletes note in given folder with given name
 * @param fName
 * @param nName
 * @returns {Promise<boolean>} whether or note the note seems to have been deleted
 */
async function deleteNote(fName, nName) {
    let thisFolder = await findFolder(fName);
    let originalLength = this.folder.notes.length;
    thisFolder.notes = thisFolder.notes.filter(note => note.name !== nName);
    thisFolder.save();
    return this.folder.notes.length < originalLength;
}

const Folder = getConnection().model("Folder", folderSchema);
const Note = getConnection().model("Note", noteSchema);

module.exports = {
    Folder,
    Note,
    getAllFolders,
    findFolder,
    findNote,
    addFolder,
    addNote,
    deleteFolder,
    deleteNote,
    setConnection,
};
