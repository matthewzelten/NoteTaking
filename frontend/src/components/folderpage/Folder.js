import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CreateNote from "./CreateNote";
import { Button } from "@chakra-ui/button";
import { Flex, Box, Heading } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'

function Folder(props) {
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        props.getCurrentFolder();
    }, []);

    let folderColor =
        props.currentFolder === undefined ? "white" : props.currentFolder.color;

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
                    ? props.folderName
                    : props.currentFolder.name}
            </Heading>
            <Input placeholder="Search" />
            <Button
                bg={`#${folderColor}`}
                onClick={() => setShowNoteModal(true)}
            >
                + Add New Note
            </Button>

            <Modal isOpen={showNoteModal}>
                <Button
                    bg={`#${folderColor}`}
                    onClick={() => setShowNoteModal(false)}
                >
                    Close
                </Button>
                <CreateNote
                    folderColor={folderColor}
                    setNoteName={props.setNoteName}
                    setShowNoteModal={setShowNoteModal}
                />
            </Modal>
            <Modal isOpen={showDeleteModal}>
                <ModalOverlay/>
                <ModalContent>
                    <Box m={3}>
                        <Text color="brand.100">
                            Are you sure you want to delete this folder? This folder and
                            all it's notes will be deleted. This action is
                            non-reversible
                        </Text>
                        <Link to="/">
                            <Button
                                bg={`#${folderColor}`}
                                onClick={() => props.deleteFolder(props.currentFolder)}
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
