import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CreateNote from "./CreateNote";
import { Button } from "@chakra-ui/button";
import { Box, Heading } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import axios from "axios";
import NoteContainer from "./NoteContainer";
import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";


function Folder(props) {


    const [showNoteModal, setShowNoteModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [notes, setNotes] = useState([]);
    const [folderName, setFolderName] = useState("");

    useEffect(async () => {
        await getCurrentFolder();
        console.log(`other stuff ${props.folderName}`)
        console.log(`CURRENT FOLDER RETRIEVED ${folderName}`);
        fetchAllNotes().then((result) => {
            if (result) {
                setNotes(result);
            }
        });
    }, []);


    async function getCurrentFolder() {
        const folderURL = window.location.pathname.split("/")[2];
        const replaced = folderURL.split("+").join(" ");
        let folder = await props.getFolder(replaced);
        props.setCurrentFolder(folder);
        props.setFolderName(folder.name);
        setFolderName(folder.name);
        //await props.getFolder(replaced).then(async (data) => await props.setCurrentFolder(data));

    }

    async function fetchAllNotes() {
        try {
            const folderURL = window.location.pathname.split("/")[2];
            const replaced = folderURL.split("+").join(" ");
            const response = await axios.get("http://localhost:5000/" + replaced);
            return response.data.notes;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    let folderColor = (props.currentFolder === undefined ? "white" : props.currentFolder.color)

    return (
        <Box>
            <Link to="/">
                <Button bg={`#${folderColor}`}>Return</Button>
            </Link>
            <Button
                bg={`#${folderColor}`}
                onClick={() => setShowDeleteModal(true)}
            >
                DELETE FOLDER
            </Button>
            <Heading style={{ color: `#${folderColor}` }}>
                {props.currentFolder === undefined
                    ? `${props.folderName.name}`
                    : `${props.currentFolder.name}`}
            </Heading>
            <Input placeholder="Search" />
            <Button
                bg={`#${folderColor}`}
                onClick={() => setShowNoteModal(true)}
            >
                + Add New Note
            </Button>
            <NoteContainer
                folderURL={props.folderURL}
                noteData={notes}
                setNoteName={props.setNoteName}
                setNoteContents={props.setNoteContents}
                setNoteColor={props.setNoteColor}
            />
            <Modal isOpen={showNoteModal}>
                <ModalOverlay />
                <ModalContent>
                    <Box m={3}>
                        <Button
                            bg={`#${folderColor}`}
                            onClick={() => setShowNoteModal(false)}
                        >
                            Close
                        </Button>
                        <CreateNote
                            folderURL={props.folderURL}
                            folderColor={folderColor}
                            setNoteName={props.setNoteName}
                            setShowNoteModal={setShowNoteModal}
                            folderName={props.folderName}
                            noteContents={props.noteContents}
                            setNoteContents={props.setNoteContents}
                            otherNotes={notes}
                        />
                    </Box>
                </ModalContent>
            </Modal>
            <Modal isOpen={showDeleteModal}>
                <ModalOverlay />
                <ModalContent>
                    <Box m={3}>
                        <Text color="brand.100">
                            Are you sure you want to delete this folder? This
                            folder and all its notes will be deleted. This
                            action is non-reversible.
                        </Text>
                        <Link to="/">
                            <Button
                                bg={`#${folderColor}`}
                                onClick={() =>
                                    props.deleteFolder(props.currentFolder)
                                }
                            >
                                Yes, delete this folder
                            </Button>
                        </Link>
                        <Button
                            bg={`#${folderColor}`}
                            onClick={() => setShowDeleteModal(false)}
                        >
                            No, take me back
                        </Button>
                    </Box>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default Folder;
