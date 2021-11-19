const mongoose = require("mongoose");
const {folderConnection} = require("../../connections")
const collectionName = "Folders";
const noteSchema = require("./noteSchema").noteSchema;
const Schema = mongoose.Schema;
const Note = require("./noteSchema").note;

const folderSchema = new Schema({
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
    notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }]
}, {collection : collectionName});

const Folder = folderConnection.model("Folder", folderSchema);
//const Folder = mongoose.model("Folder", folderSchema);

exports.folder = Folder;