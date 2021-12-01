import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import CreateNote from "./CreateNote";
import { Button } from "@chakra-ui/button";
import { Center, Box, Heading } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";

function Folder(props) {
    const [currentFolder, setCurrentFolder] = useState({
        color: "white",
    });
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        getCurrentFolder();
    }, []);

    function getCurrentFolder() {
        const folderURL = window.location.pathname.split("/")[2];
        const replaced = folderURL.split("+").join(" ");
        props.getFolder(replaced).then((data) => setCurrentFolder(data));
    }

    let folderColor = currentFolder === undefined ? "white" : currentFolder.color

    return (
        <Box>
            <Link to="/">
                <Button
                    style={{
                        height: "50px",
                        background: `#${folderColor}`,
                        color: "black",
                        margin: "5px",
                    }}
                >
                    Return
                </Button>
            </Link>
            <Button
                style={{
                    height: "50px",
                    background: `#${folderColor}`,
                    color: "black",
                    margin: "5px",
                }}
                onClick={() => setShowDeleteModal(true)}
            >
                DELETE FOLDER
            </Button>
            <Heading style={{color: "white"}}>
                {currentFolder === undefined
                    ? props.folderName
                    : currentFolder.name}
            </Heading>
            <Input placeholder="Search" />
            <Button
                style={{
                    height: "50px",
                    background: `#${folderColor}`,
                    color: "black",
                    margin: "5px",
                }}
                onClick={() => setShowNoteModal(true)}
            >
                + Add New Note
            </Button>

            <Modal isOpen={showNoteModal}>
                <Button
                    style={{
                        height: "50px",
                        background: `#${folderColor}`,
                        color: "black",
                        margin: "5px",
                    }}
                    onClick={() => setShowNoteModal(false)}
                >
                    Close
                </Button>
                <CreateNote
                    setNoteName={props.setNoteName}
                    setShowNoteModal={setShowNoteModal}
                    folderName = {props.folderName}
                    noteContents={props.noteContents}
                />
            </Modal>
            <Modal
                style={{ overlay: { left: "30%", right: "30%", bottom:"50%" } }}
                isOpen={showDeleteModal}
            >
                <Text>
                    Are you sure you want to delete this folder? This folder and
                    all it's notes will be deleted. This action is
                    non-reversible
                </Text>
                <Link to="/">
                    <Button
                        style={{
                            height: "50px",
                            background: `#${folderColor}`,
                            color: "black",
                            margin: "5px",
                        }}
                        onClick={() => props.deleteFolder(currentFolder)}
                    >
                        Yes, delete this folder
                    </Button>
                </Link>

                <Button
                    style={{
                        height: "50px",
                        background: `#${folderColor}`,
                        color: "black",
                        margin: "5px",
                    }}
                    onClick={() => setShowDeleteModal(false)}
                >
                    No, take me back
                </Button>
            </Modal>
        </Box>
    );
}

export default Folder;
