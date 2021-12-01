const mongoose = require("mongoose");
const {noteConnection} = require("../../connections")
const collectionName = "Notes";

//https://stackoverflow.com/questions/18001478/referencing-another-schema-in-mongoose

const noteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    contents: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder'
    },
    color: {
        type: String,
        required: false,
        trim: true,
        //validate(value) {
        //    if (value.length !==6) throw new Error("Invalid hex code.");
        //},
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
    isLocked: {
        type: Boolean,
        required: true
    }
});

module.exports = noteSchema;
