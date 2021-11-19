const mongoose = require("mongoose");
const {folderConnection} = require("../../connections")
const collectionName = "Folders";
const noteSchema = require("./noteSchema").noteSchema;

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    color: {
      type: String,
      required: false
    },
    isPrivate: {
      type: Boolean,
        required: true
    },
    password: {
      type: String,
        required: false,
        trim: true
    },
    notes: [noteSchema]
}, {collection : collectionName});

const Folder = folderConnection.model("Folder", folderSchema);
//const Folder = mongoose.model("Folder", folderSchema);

exports.folder = Folder;