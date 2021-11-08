const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

function makeNewConnection(URI) {
    const db = mongoose.createConnection(URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    );
    db.on("connected", function () {
        console.log(`MongoDB :: connected ${this.name}`);
    });
    db.on("error", function (error) {
        console.log(
            `MongoDB :: connection ${this.name} ${JSON.stringify(error)}`
        );
        db.close().catch(() =>
            console.log(`MongoDB :: failed to close connection ${this.name}`)
        );
    });
    return db
}

const folderConnection = makeNewConnection(
    "mongodb+srv://" +
        process.env.MONGO_USER +
        ":" +
        process.env.MONGO_PWD +
        "@cluster0.yohuh.mongodb.net/Folders?retryWrites=true&w=majority"
);

module.exports = {
    folderConnection
}