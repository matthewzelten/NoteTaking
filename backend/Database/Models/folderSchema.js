const mongoose = require("mongoose");
const collectionName = "Folders";

const folderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        color: {
            type: String,
            required: false,
        },
        isPrivate: {
            type: Boolean,
            required: true,
        },
        password: {
            type: String,
            required: false,
            trim: true,
        },
    },
    { collection: collectionName }
);

module.exports = folderSchema;
