const { test } = require("@jest/globals");
const mongoose = require("mongoose");
const FolderSchema = require("./Database/Models/folderSchema");
const NoteSchema = require("./Database/Models/noteSchema");
const connections = require("./connections");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServerA;
let mongoServerB;
let folderConn;
let noteConn;
let folderModel;

beforeAll(async () => {
    mongoServerA = await MongoMemoryServer.create();
    mongoServerB = await MongoMemoryServer.create();
    const uriA = mongoServerA.getUri();
    const uriB = mongoServerB.getUri();

    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    folderConn = mongoose.createConnection(uriA, mongooseOpts);
    noteConn = mongoose.createConnection(uriB, mongooseOpts);
    folderModel = folderConn.model("Folder", FolderSchema);
    noteModel = noteConn.model("Note", NoteSchema);

    connections.setFolderConnection(folderConn);
    connections.setNoteConnection(noteConn);
});

afterAll(async () => {
    await folderConn.dropDatabase();
    await folderConn.close();
    await mongoServerA.stop();
    await noteConn.dropDatabase();
    await noteConn.close();
    await mongoServerB.stop();
});

beforeEach(async () => {
    let dummyFolder = {
        name: "public_folder_1",
        color: "C83E4D",
        isPrivate: "false",
    };
    let result = new folderModel(dummyFolder);
    await result.save();

    dummyFolder = {
        name: "private_folder_1",
        color: "C83E4D",
        isPrivate: "true",
        password: "password",
    };
    result = new folderModel(dummyFolder);
    await result.save();

    dummyFolder = {
        name: "public_folder_2",
        color: "F4D6CC",
        isPrivate: "false",
    };
    result = new folderModel(dummyFolder);
    await result.save();

    dummyFolder = {
        name: "private_folder_2",
        color: "F4D6CC",
        isPrivate: "true",
        password: "hello",
    };
    result = new folderModel(dummyFolder);
    await result.save();
});

afterEach(async () => {
    await folderModel.deleteMany();
    await noteModel.deleteMany();
});

test("test getAllFolders", async () => {
    let folders = await connections.getAllFolders();
    expect(folders.length).toEqual(4);
    expect(folders[0].name).toEqual("public_folder_1");
    expect(folders[1].name).toEqual("private_folder_1");
    expect(folders[2].name).toEqual("public_folder_2");
    expect(folders[3].name).toEqual("private_folder_2");
});

test("test findFolder", async () => {
    let allFolders = await connections.getAllFolders();

    //find with public folder name
    let pub1 = await connections.findFolder("public_folder_1");
    expect(pub1).toBeDefined();
    expect(pub1[0].name).toEqual("public_folder_1");
    expect(pub1[0].isPrivate).toBeFalsy();
    expect(pub1[0].color).toEqual("C83E4D");

    //find with private folder name
    let priv1 = await connections.findFolder("private_folder_1");
    expect(priv1[0].name).toEqual("private_folder_1");
    expect(priv1[0].isPrivate).toBeTruthy();
    expect(priv1[0].color).toEqual("C83E4D");
    expect(priv1[0].password).toEqual("password");
});

test("test findNote", () => {});

test("test addFolder", async () => {
    let allFolders = await connections.getAllFolders();
    expect(allFolders.length).toEqual(4);

    // add public folder
    let newFolder1 = {
        name: "testFolder1",
        color: "0000FF",
        isPrivate: false,
    };
    connections.addFolder(new connections.Folder(newFolder1));
    allFolders = await connections.getAllFolders();
    expect(allFolders.length).toEqual(5);
    let finder = await connections.findFolder("testFolder1");
    expect(finder.color).toEqual("0000FF");

    //add private folder
    let newFolder2 = {
        name: "testFolder2",
        color: "FF0000",
        isPrivate: true,
        password: "csc307",
    };
    connections.addFolder(new connections.Folder(newFolder2));
    allFolders = await connections.getAllFolders();
    expect(allFolders.length).toEqual(6);
    finder = await connections.findFolder("testFolder2");
    expect(finder.color).toEqual("FF0000");
    expect(finder.isPrivate).toBeTruthy();
    expect(finder.password).toEqual("csc307");
});

test("test addNote", () => {
    //this looks like itll be refactored
});

test("test deleteFolder", async () => {
    let allFolders = await connections.getAllFolders();
    expect(allFolders.length).toEqual(4);

    //basic delete
    await connections.deleteFolder("public_folder_1");
    expect(allFolders.length).toEqual(3);

    //basic delete 2
    await connections.deleteFolder("private_folder_1");
    expect(allFolders.length).toEqual(2);

    //delete previously deleted folder
    await connections.deleteFolder("private_folder_1");
    expect(allFolders.length).toEqual(2);

    //delete non exitent folder
    await connections.deleteFolder("non existent folder");
    expect(allFolders.length).toEqual(2);
});

test("test deleteNote", () => {
    //this might not be implemented...
});
