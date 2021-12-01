const express = require("express");
const {
    Folder,
    getAllFolders,
    findFolder,
    findNote,
    addFolder,
    addNote,
    deleteFolder,
    deleteNote} = require('./connections');
const mongoose = require("mongoose");
const Note = require("./Database/Models/noteSchema").note;
const app = express();
const cors = require("cors");
const port = 5000;
const { json } = require("express");
const { note } = require("./Database/Models/noteSchema");


app.use(cors());
app.use(express.json());


app.use(express.json());
// main page: get all folders
app.get("/", async (req, res) => {
  const allFolders = await getAllFolders();
  res.send(allFolders);
});

/**
 * Get all notes for the given folders
 * req parameters:
 * string folderName: name of the folder
 * string pass: given password
 */
app.get("/:folderName", async (req, res) => {
  const folderName = req.params["folderName"];
  const passw = req.query["pass"];
  const result = await findFolder(folderName);
  if (result === undefined || result.length === 0) {
      res.status(404).send("Folder not found.");
  } else {
      if (!result["isPrivate"]) {
          res.status(201).send(result);
      } else {
          if (passw["password"] === result["password"]) {
              res.status(201).send(result);
          } else {
              //res.status(404).send(req.body);
              res.status(404).send("Wrong password. Access denied.");
          }
      }
  }
});


// handle open folder, add folder and search folder
//I use post methods here because it needs to get password for private folders
//and I can't think of an alternative.
//Please comment if you have any suggestions or alternative solutions!!!
/**
 * req parameters:
 * string folderName: name of folder to add, open or search
 * string keyword: keyword to search for
 */
app.post("/", async (req, res)=>{
  const folder = req.body["folderName"];
  const keyword = req.body["keyword"];

  if((folder===undefined||folder.length==0)&&(keyword===undefined||keyword.length==0)){
      // if no folder
      await addFolderPost(req, res);
  }else if(keyword===undefined||keyword.length==0){
      //open folder
      await openFolderPost(req, res, folder);
  }else{
    //search folder
    await searchFolderPost(req, res, keyword);
  }
});

async function addFolderPost(req, res) {
    let isDup = await findFolder(req.body["name"]);
    if (isDup === undefined || isDup.length===0) {

        try {
            let result = await addFolder(req.body)
            if (result) {
                res.status(200).send(result).end();
            } else {
                res.status(404).end();
            }
        }catch(error) {
            res.status(404).end();
        }

        /*try{
            const folderToAdd = new Folder(req.body);
            await folderToAdd.save();
            res.status(200).send(folderToAdd).end();
        }catch(error) {
            console.log(error);
            res.status(404).end();
        }*/
    } else {
        res.status(404).send("Duplicate file name. "+isDup).end();
    }
}

async function openFolderPost(req, res, folder) {
    let result = await findFolder(folder);
    if (result === undefined || result.length === 0) {
        res.status(404).send("Folder not found.");
    } else {
        if (!result["isPrivate"]) {
            res.status(200).send(result);
        } else {
            let passw = req.body["password"];
            if (passw["password"] === result["password"]) {
                //res.status(200).send(result);
                res.status(200).send("get notes");
                //res.status(200).send(findNotesByFolder(folderName));
            } else {
                //res.status(404).send(req.body);
                res.status(404).send("Wrong password. Access denied.");
            }
        }
    }
}

async function searchFolderPost(req, res, keyword) {
    Folder.find({"name":{"$regex": keyword, "$options":"i"}}).exec(function (err, docs) {
        if (err){
            console.log(err);
        }else{
            res.status(200).send(docs).end();
        }});
    //res.status(200).send(result).end();
}


/**
 * add/save note, open note, and search note
 * presence of "keyword" parameter indicates search
 * presence of "note" parameter indicates open
 * else, assume add or save
 */
app.post("/:folderName", async (req, res) => {
  const fName = req.params["folderName"];
  const note = req.body["noteName"];
  const keyword = req.body["keyword"];
  if((note===undefined ||note.length===0) && (keyword===undefined||keyword.length==0)){
    //add/save note
      console.log(`ADD/SAVE NOTE`);
      await addNotePost(req, res);
  }
  else if(keyword===undefined||keyword.length===0){
        //open note
      console.log(`OPEN NOTE`);
      await openNotePost(req, res, fName)
  }
  else{
    //search note
      console.log(`SEARCH NOTE`);
      searchNotePost(req, res, keyword);
  }
});

async function openNotePost(req, res, fName) {
    let result = await findFolder(fName);
    if (result === undefined || result.length === 0) {
        res.status(404).send("Folder not found.");
    } else {
        result = await findNote(fName, noteToGet);

        if (result === undefined || result.length == 0) {
            res.status(404).send("Note not found.");
        } else {
            if (!result["isPrivate"]) {
                res.status(200).send(result).end();
            } else {
                const passw = req.body;
                if (passw["password"] === result["password"]) {
                    res.status(200).send(result).end();
                } else {
                    res.status(404).send("Wrong password. Access denied.");
                }
            }
        }
    }
}

/**
 * Add or save note
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function addNotePost(req, res) {
    const noteToAdd = req.body;

    console.log(`Posting note to ${noteToAdd.folder}`);
    console.log(`Random data ${noteToAdd.name} ${noteToAdd.isPrivate} ${noteToAdd.color} \"${noteToAdd.contents}\"`);

    let folder = await findFolder(noteToAdd.folder);
    console.log(`FOLDER ID: ${folder[0]._id}`);

    let result = await findNote(noteToAdd.folder, noteToAdd.name);
    console.log(`Duplicate? ${result!==undefined}, Save? ${noteToAdd.toSave !==undefined}`);
    if(result===undefined || noteToAdd.toSave !== undefined){
        console.log(`No duplicate OR Saving`);

        let newNote = {
            "name": noteToAdd.name,
            "contents": noteToAdd.contents,
            "folder": folder[0]._id,
            "color": noteToAdd.color,
            "isPrivate": noteToAdd.isPrivate,
            "password": noteToAdd.password,
            "isLocked": noteToAdd.isLocked
        };

        let result = await addNote(noteToAdd.folder, newNote);

        if(result){
            res.status(201).send(result).end();
            //res.status(201).send(noteToAdd).end();
        }
        else{
            res.status(404).end();
        }
    }else{
        console.log(`Duplicate note & not saving`);
        res.status(404).send("Duplicate note name.").end();
    }
}

function searchNotePost(req, res, keyword) {
    Note.find({"name":{"$regex": keyword, "$options":"i"}}).exec(function (err, docs) {
        if (err){
            console.log(err);
        }else{
            res.status(200).send(docs).end();
        }});
}


/**
 * delete folder
 */
app.delete("/", async (req, res) => {
    const folderToDelete = req.body["name"];
    let result = findFolder(folderToDelete);
    if (result === undefined || result.length === 0) {
        res.status(404).send(folderToDelete);
    } else {
        await deleteFolder(folderToDelete);
        res.status(204).end();
    }
});

/**
 * Delete note with given name in given folder
 */
app.delete("/:folderName", async (req, res) => {
    const noteToDelete = req.body["name"];
    const folderN = req.params["folderName"];
    let noteDeleted = await deleteNote(folderN, noteToDelete);
    if (noteDeleted) {
        res.status(204).end();
    } else {
        res.status(404).end();
    }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
