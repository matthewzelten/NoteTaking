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
    let noteFolder = (await findFolder(folderName))[0];
    await noteFolder.populate("notes");
    let result = noteFolder.notes.filter(note => note.name === noteName);
    console.log(result);
    if (result.length < 1) {
        return undefined;
    } else {
        return result[0];
    }
}

/**
 * Returns a folder with a populated notes field
 * @param folderName
 * @returns {Promise<[]|[{ref: string, type: *}]|*>}
 */
async function getNotes(folderName) {
    let thisFolder = (await findFolder(folderName))[0];
    await thisFolder.populate('notes');
    return thisFolder;
}
async function getFolderID(folderName){
    let folder = await findFolder(folderName);
    console.log(folder);
    return folder[0]._id;
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
    let thisFolder = (await findFolder(fName))[0];

    await thisFolder.populate('notes');

    let notesList = thisFolder.notes.filter(note => note.name === noteToAdd.name);

    if(notesList.length !== 0) {
        //THIS IS THE SAVE FUNCTION
        //FIX THIS
        notesList[0].contents = noteToAdd.contents;
        notesList[0].save();
        let contents = await getConnection().model("Note", noteSchema).findOne({name: noteToAdd.name}).contents;
        return contents;

    } else {
        try {
            const note = await new Note(noteToAdd);
            await note.save();
            console.log(note);
            thisFolder.notes.push(note._id);
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
    const Note = getConnection().model("Note", noteSchema);
    const tempF = getConnection().model("Folder", folderSchema);
    const folder = (await findFolder(folderToDelete))[0];
    await folder.populate("notes");

    console.log(`Deleting notes in ${folderToDelete}`);
    for (const note of folder.notes) {
        await Note.findOneAndDelete({_id: note._id});
        console.log(`Deleted ${note.name}`);
    }


    let returnval;
    let vals = await tempF.deleteOne({ name: folderToDelete });
    if(vals.deletedCount === 0) {
        returnval = false;
    }
    else {
        returnval = true;
    }
    return returnval;
}

/**
 * Deletes note in given folder with given name
 * @param fName
 * @param nName
 * @returns {Promise<boolean>} whether or note the note seems to have been deleted
 */
async function deleteNote(fName, nName) {
    const Note = getConnection().model("Note", noteSchema);
    let thisFolder = (await findFolder(fName))[0];
    let originalLength = thisFolder.notes.length;
    await thisFolder.populate("notes");

    let id = thisFolder.notes.filter(note => note.name === nName)[0]._id;
    await Note.findOneAndDelete({_id: id});
    thisFolder.notes = thisFolder.notes.filter(note => note.name !== nName);
    await thisFolder.save();
    return thisFolder.notes.length < originalLength;
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
    getNotes,
    getFolderID
};