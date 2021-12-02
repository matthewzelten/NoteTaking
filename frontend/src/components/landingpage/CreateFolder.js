import React, { useState } from "react";
import FileSettings from "../shared/FileSettings";
import axios from "axios";
import { Box, Heading, Text } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";

const letters = /^[0-9a-zA-Z\s]+$/;

function CreateFolderError(props) {

    return <Text color="red">{props.errorMessage}</Text>;

    /*let message = <Box/>;
    if (props.isDuplicate(props.newFolderName)) {
        message = <Text color="red">{props.errorMessage}</Text>;
    }
    return message;*/
}

function CreateFolder(props) {
    const [newFolderName, setNewFolderName] = useState("");
    const [validFolder, setValidFolder] = useState(false);
    const [color, setColor] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [passwordA, setPasswordA] = useState("");
    const [passwordB, setPasswordB] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

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
            setValidFolder(true);
            const folder = {
                name: newFolderName,
                color: color,
                isPrivate: isPrivate,
                notes: [],
            };
            postNewFolder(folder)
                .then((result) => {
                    if (result && result.status === 201) {
                        props.setFolders([...props.folders, result.data]);
                        props.setShowModal(false);
                    } else {
                        throw "unable to create folder";
                    }
                })
                .then(() => {
                    props.setFolderName(newFolderName);
                    props.setShowModal(false);
                    props.setCurrentFolder({
                        name: newFolderName,
                        color: color,
                        password: passwordA,
                    });

                    //window.location.reload();
                });
        }
    }

    async function postNewFolder(folder) {
        try {
            return await axios.post("http://localhost:5000/", folder);
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    function updateFolderName(name) {
        let err = "";
        setValidFolder(false);
        if (!letters.test(name)) {
            err = "Name contains invalid character(s)";
        } else if (props.isDuplicate(name)) {
            err = "A folder with this name already exists";
        }

        switch (err) {
            case "Name contains invalid character(s)" :
                break;
            case "A folder with this name already exists":
                break;
            case "":
                setValidFolder(true);
                setNewFolderName(name);
                break;
            default:
                err = "Unknown error";
                break;
        }
        setErrorMessage(err);
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
                errorMessage={errorMessage}
            />

                <Button
                    disabled={
                        !verifyMatchingPasswords() ||
                        !validFolder ||
                        color === "" ||
                        props.isDuplicate(newFolderName)
                    }
                    colorScheme="brand"
                    onClick={() => {
                        try {
                            submitFolderName();
                            props.router.push(`/folder/${newFolderName.split(" ").join("+")}`);
                            window.location.reload();
                        } catch (e) {

                        }

                    }}
                >
                    Create
                </Button>

        </form>
    );
}

export default CreateFolder;
