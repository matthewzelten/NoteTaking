const mongoose = require("mongoose");
const noteSchema = require("noteSchema");

const collectionName = "placeholder";

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
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
    notes: {
        type: [noteSchema],
        required: true
    },
    isLocked: {
        type: Boolean,
        required: true
    }
}, {collection : collectionName});

const User = mongoose.model("Folder", folderSchema);

module.exports = User;