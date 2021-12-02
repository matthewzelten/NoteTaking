import React, { useState } from "react";
import { Link } from "react-router-dom";
import FileSettings from "../shared/FileSettings";
import axios from "axios";
import { Heading } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/layout";

const letters = /^[0-9a-zA-Z\s]+$/;

function CreateFolderError(props) {
    let message = <Box></Box>;
    if (props.isDuplicate(props.newFolderName)) {
        message = <Text color="red">Folder name is a duplicate</Text>;
    }
    return message;
}

function CreateFolder(props) {
    const [newFolderName, setNewFolderName] = useState("");
    const [validFolder, setValidFolder] = useState(false);
    const [color, setColor] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [passwordA, setPasswordA] = useState("");
    const [passwordB, setPasswordB] = useState("");

    function verifyMatchingPasswords() {
        if (!isPrivate) {
            return true;
        }
        if (passwordA === passwordB && passwordA.length > 0) {
            return true;
        }
        return false;
    }

    function submitFolderName() {
        if (
            letters.test(newFolderName) &&
            newFolderName !== "" &&
            color !== ""
        ) {
            props.setFolderName(newFolderName);
            props.setShowModal(false);
            props.setCurrentFolder({
                name: newFolderName,
                color: color,
                password: passwordA,
            });
            setValidFolder(true);
            const folder = {
                name: newFolderName,
                color: color,
                isPrivate: isPrivate,
                notes: [],
            };
            postNewFolder(folder)
                .then((result) => {
                    if (result && result.status === 200) {
                        props.setFolders([...props.folders, newFolderName]);
                        props.setShowModal(false);
                    }
                })
                .then(() => {
                    window.location.reload();
                });
        }
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

    function updateFolderName(name) {
        if (letters.test(name)) {
            setValidFolder(true);
            setNewFolderName(name);
        } else {
            setValidFolder(false);
        }
    }

    return (
        <form margin="5px">
            <Heading size="xl">Add New Folder</Heading>
            <Input
                placeholder="Enter Folder Name"
                onChange={(e) => updateFolderName(e.target.value)}
                size="lg"
                isRequired={true}
                isInvalid={!validFolder}
                errorBorderColor="red.300"
            />
            <FileSettings
                isPrivate={isPrivate}
                setIsPrivate={setIsPrivate}
                color={color}
                setColor={setColor}
                setPasswordA={setPasswordA}
                setPasswordB={setPasswordB}
            />
            <CreateFolderError
                isDuplicate={props.isDuplicate}
                newFolderName={newFolderName}
            />
            <Link to={`/folder/${newFolderName.split(" ").join("+")}`}>
                <Button
                    disabled={
                        !verifyMatchingPasswords() ||
                        !validFolder ||
                        color === "" ||
                        props.isDuplicate(newFolderName)
                    }
                    colorScheme="brand"
                    onClick={() => submitFolderName()}
                >
                    Create
                </Button>
            </Link>
        </form>
    );
}

export default CreateFolder;
