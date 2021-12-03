const { test } = require("@jest/globals");
const mongoose = require("mongoose");
const FolderSchema = require("./Database/Models/folderSchema");
const NoteSchema = require("./Database/Models/noteSchema");
const connections = require("./connections");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Folder = require('./connections');

let mongoServerA;
let conn;
let folderModel;
let dummyNote1;

beforeAll(async () => {
    mongoServerA = await MongoMemoryServer.create();
    const uriA = await mongoServerA.getUri();

    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    conn = mongoose.createConnection(uriA, mongooseOpts);
    folderModel = conn.model("Folder", FolderSchema);
    noteModel = conn.model("Note", NoteSchema);

    connections.setConnection(conn);
});

afterAll(async () => {
    await conn.dropDatabase();
    await conn.close();
    await mongoServerA.stop();
});

beforeEach(async () => {
    let id1 = new mongoose.Types.ObjectId();
    let dummyFolder = {
        name: "public_folder_1",
        color: "C83E4D",
        isPrivate: "false",
        _id: id1
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



    //notes
    dummyNote1 = {
      name: "note_1",
      contents: "",
      color: "C83E4D",
      folder: id1,
      isPrivate: "false",
      isLocked: "false"
    };
    let x = new noteModel(dummyNote1);
    await x.save();

    let dummyNote2 = {
      name: "note_2",
      contents: "some content",
      color: "C83E4D",
      folder: id1,
      isPrivate: "true",
      password: "password",
      isLocked: "false"
    };
    x = new noteModel(dummyNote2);
    await x.save();

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

test("test findNote", async () => {
  console.log('this folder value should be equal to the next things id\n', dummyNote1);
  let result = await connections.findNote('public_folder_1', 'note_3');
  expect(result.name).toEqual('note_1');

});

test('test addFolder', async () => {
    let allFolders = await connections.getAllFolders();
    expect(allFolders.length).toEqual(4);

    // add public folder
    let newFolder1 = {
        name: "testFolder1",
        color: "0000FF",
        isPrivate: false,
    };
    newFolder1 = new connections.Folder(newFolder1);
    await connections.addFolder(newFolder1);
    allFolders = await connections.getAllFolders();
    expect(allFolders.length).toEqual(5);
    let finder = await connections.findFolder("testFolder1");
    expect(finder[0].color).toEqual("0000FF");
    
    //add private folder
    let newFolder2 = {
        name: "testFolder2",
        color: "FF0000",
        isPrivate: true,
        password: "csc307",
    };
    newFolder2 = new connections.Folder(newFolder2);
    await connections.addFolder(newFolder2);
    allFolders = await connections.getAllFolders();
    expect(allFolders.length).toEqual(6);
    finder = await connections.findFolder("testFolder2");
    expect(finder[0].color).toEqual("FF0000");
    expect(finder[0].isPrivate).toBeTruthy();
    expect(finder[0].password).toEqual('csc307');
});

test("test addNote", () => {
    //this looks like itll be refactored
});

test("test deleteFolder", async () => {
    let allFolders = await connections.getAllFolders();
    expect(allFolders.length).toEqual(4);

    //basic delete
    let res = await connections.deleteFolder('public_folder_1');
    expect(res).toBeTruthy();
    allFolders = await connections.getAllFolders();
    expect(allFolders.length).toEqual(3);

    //basic delete 2
    let res2 = await connections.deleteFolder('private_folder_1');
    expect(res2).toBeTruthy();
    allFolders = await connections.getAllFolders();
    expect(allFolders.length).toEqual(2);

    //delete previously deleted folder (shouldnt do anything)
    expect((res = await connections.deleteFolder('private_folder_1'))).toBeFalsy();
    allFolders = await connections.getAllFolders();
    expect(allFolders.length).toEqual(2);

    //delete non exitent folder
    let res4 = await connections.deleteFolder('non existent folder');
    expect(res4).toBeFalsy();
    allFolders = await connections.getAllFolders();
    expect(allFolders.length).toEqual(2);
});

test("test deleteNote", () => {
    //this might not be implemented...
});
