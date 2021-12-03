import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Box,
    Text,
    Flex,
    Wrap,
    WrapItem,
    Button,
    Input,
    Checkbox,
} from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";

function PirvateFolder(props) {
    const [showPassModal, setShowPassModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    if (props.isPrivate) {
        return (
            <Box>
                <Button
                    w="200px"
                    h="100px"
                    bg={`${props.buttonColor}`}
                    onClick={() => setShowPassModal(true)}
                >
                    {props.name}
                </Button>
                <Modal isOpen={showPassModal}>
                    <ModalOverlay />
                    <ModalContent>
                        <Box m={3}>
                            <Box>
                                <Text color="brand.100">
                                    This folder is private. Please enter the
                                    password to gain access
                                </Text>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter Password"
                                    onChange={(e) => props.setCheckPass(e.target.value)}
                                />
                                <Checkbox
                                    onChange={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    Show Password
                                </Checkbox>
                            </Box>
                            <Link to={`/folder/${props.replaced}`}>
                                <Button
                                    onClick={() =>
                                        props.setFolderName(props.name)
                                    }
                                >
                                    Submit Password
                                </Button>
                            </Link>
                            <Button onClick={() => setShowPassModal(false)}>
                                Close
                            </Button>
                        </Box>
                    </ModalContent>
                </Modal>
            </Box>
        );
    } else {
        return (
            <Link to={`/folder/${props.replaced}`}>
                <Button
                    w="200px"
                    h="100px"
                    bg={`${props.buttonColor}`}
                    onClick={() => props.setFolderName(props.name)}
                >
                    {props.name}
                </Button>
            </Link>
        );
    }
}

function ShowFolders(props) {
    function updateNameAndURL(name, URL) {
        props.setFolderName(name);
        props.setFolderURL(URL);
    }

    return props.folderData.map((row, index) => {
        const buttonColor =
            row.color === undefined || row.color === ""
                ? "#0000FF"
                : `#${row.color}`;
        const replaced = row.name.split(" ").join("+");
        return (
            <WrapItem>
                <PirvateFolder
                    buttonColor={buttonColor}
                    updateNameAndURL={updateNameAndURL}
                    setFolderName={props.setFolderName}
                    name={row.name}
                    replaced={replaced}
                    isPrivate={row.isPrivate}
                    setCheckPass={props.setCheckPass}
                />
            </WrapItem>
        );
    });
}

function FolderContainer(props) {
    return (
        <Flex direction="row">
            <Wrap justify="center">
                <ShowFolders
                    setFolderName={props.setFolderName}
                    setFolderURL={props.setFolderURL}
                    redirectFolder={props.redirectFolder}
                    folderData={props.folderData}
                    setCheckPass={props.setCheckPass}
                />
                <WrapItem>
                    <Button
                        colorScheme="brand.200"
                        w="200px"
                        h="100px"
                        onClick={() => props.setShowModal(true)}
                    >
                        Add New Folder
                    </Button>
                </WrapItem>
            </Wrap>
        </Flex>
    );
}

export default FolderContainer;
