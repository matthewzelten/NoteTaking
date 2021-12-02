const mongoose = require("mongoose");
const collectionName = "Notes";
const {noteConnection} = require("../../connections");
const Schema = mongoose.Schema;
const Folder = require("./folderSchema").folder;

//https://stackoverflow.com/questions/18001478/referencing-another-schema-in-mongoose

const noteSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    contents: {
        type: String,
        required: false
    },
    folder: {
        type: Schema.Types.ObjectId, ref: 'Folder',
        required: true
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
}, {collection : collectionName});

module.exports = noteSchema;
