import React, { useState } from "react";
import { Link } from "react-router-dom";
import FileSettings from "../shared/FileSettings";
import axios from "axios";
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    ModalFooter,
    ModalContent,
    ModalOverlay,
    Button,
    useDisclosure,
    Input,
} from "@chakra-ui/react";

function CreateFolder(props) {
    const [newFolderName, setNewFolderName] = useState("");
    const [color, setColor] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    function submitFolderName() {
        props.setFolderName(newFolderName);
        props.setShowModal(false);
        const folder = {
            name: newFolderName,
            color: color,
            isPrivate: isPrivate,
            notes: [],
        };
        postNewFolder(folder).then((result) => {
            if (result && result.status === 200)
                props.setFolders([...props.folders, newFolderName]);
            props.setShowModal(false);
        });
    }

    async function postNewFolder(folder) {
        try {
            const response = await axios.post("http://localhost:5000/", folder);
            return response;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    return (
        <form>
            <h1>Add New Folder</h1>
            <Input
                type="text"
                placeholder="Enter Folder Name"
                variant="filled"
                mb={3}
                onChange={(e) => setNewFolderName(e.target.value)}
            />
            <FileSettings
                isPrivate={isPrivate}
                setIsPrivate={setIsPrivate}
                color={color}
                setColor={setColor}
            />
            <Link to="/folder">
                <Button
                    color="black"
                    marginTop="2vh"
                    onClick={() => submitFolderName()}
                >
                    Create
                </Button>
            </Link>
        </form>
    );
}

export default CreateFolder;
