const mongoose = require("mongoose");
const {folderConnection} = require("../../connections")
const collectionName = "Folders";

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    color: {
      type: String,
      required: true
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
}, {collection : collectionName});

const Folder = folderConnection.model("Folder", folderSchema);

module.exports = Folder;