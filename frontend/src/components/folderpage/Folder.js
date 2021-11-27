import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import CreateNote from "./CreateNote";
import { Button } from "@chakra-ui/button";
import { Spinner } from "@chakra-ui/spinner";
import { Center } from "@chakra-ui/layout";

function Folder(props) {
    const [currentFolder, setCurrentFolder] = useState({});
    const [showNoteModal, setShowNoteModal] = useState(false);

    useEffect(() => {
        getCurrentFolder();
    }, []);

    function getCurrentFolder() {
        const folderURL = window.location.pathname.split("/")[2]
        const replaced = folderURL.split("+").join(" ");
        props
            .getFolder(replaced)
            .then((data) => setCurrentFolder(data));
    }

    return (
        <div>
            <Link to="/">
                <Button>Return</Button>
            </Link>
            <h2>{currentFolder === undefined ? props.folderName : currentFolder.name}</h2>
            <input type="text" placeholder="Search" />
            <Button onClick={() => setShowNoteModal(true)}>
                + Add New Note
            </Button>
            <Modal isOpen={showNoteModal}>
                <Button onClick={() => setShowNoteModal(false)}>
                    Close Modal
                </Button>
                <CreateNote setNoteName={props.setNoteName} setShowNoteModal={setShowNoteModal}/>
            </Modal>
        </div>
    );
}

export default Folder;
