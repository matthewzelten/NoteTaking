const mongoose = require("mongoose");
const collectionName = "Folders";
const Schema = mongoose.Schema;

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
    notes: [{ type: Schema.Types.ObjectId, ref: 'Note'}]
}, {collection : collectionName});

module.exports = folderSchema;