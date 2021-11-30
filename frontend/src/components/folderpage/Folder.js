import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import CreateNote from "./CreateNote";
import { Button } from "@chakra-ui/button";
import { Center, Box } from "@chakra-ui/layout";

function Folder(props) {
    const [currentFolder, setCurrentFolder] = useState({
        color:"FFFFFF"
    });
    const [showNoteModal, setShowNoteModal] = useState(false);

    useEffect(() => {
        getCurrentFolder();
    }, []);

    function getCurrentFolder() {
        const folderURL = window.location.pathname.split("/")[2];
        const replaced = folderURL.split("+").join(" ");
        props.getFolder(replaced).then((data) => setCurrentFolder(data));
    }

    return (
        <Box>
            <Link to="/">
                <Button
                    style={{
                        width: "200px",
                        height: "50px",
                        background: `#${currentFolder === undefined ? "white": currentFolder.color}`,
                        color: "black",
                        margin: "5px",
                    }}
                >
                    Return
                </Button>
            </Link>
            <h2>
                {currentFolder === undefined
                    ? props.folderName
                    : currentFolder.name}
            </h2>
            <input type="text" placeholder="Search" />
            <Button
                style={{
                    width: "200px",
                    height: "50px",
                    background: `#${currentFolder.color}`,
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
                        width: "200px",
                        height: "50px",
                        background: `#${currentFolder.color}`,
                        color: "000000",
                        margin: "5px",
                    }}
                    onClick={() => setShowNoteModal(false)}
                >
                    Close Modal
                </Button>
                <CreateNote
                    setNoteName={props.setNoteName}
                    setShowNoteModal={setShowNoteModal}
                    folderName = {props.folderName}
                    noteContents={props.noteContents}
                />
            </Modal>
        </Box>
    );
}

export default Folder;
