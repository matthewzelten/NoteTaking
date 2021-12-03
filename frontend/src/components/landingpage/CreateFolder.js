import React, { useState } from "react";
import FileSettings from "../shared/FileSettings";
import axios from "axios";
import { Heading, Text } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { useHistory } from 'react-router-dom';

const letters = /^[0-9a-zA-Z\s]+$/;

function CreateFolderError(props) {
<<<<<<< HEAD

    return <Text color="red">{props.errorMessage}</Text>;

    /*let message = <Box/>;
    if (props.isDuplicate(props.newFolderName)) {
        message = <Text color="red">{props.errorMessage}</Text>;
    }
    return message;*/
=======
    return <Text color="red">{props.errorMessage}</Text>;
>>>>>>> 08e44ae69a5e4027af9180d3fc2bebd93b44805f
}

function CreateFolder(props) {
    const [newFolderName, setNewFolderName] = useState("");
    const [validFolder, setValidFolder] = useState(false);
    const [color, setColor] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [passwordA, setPasswordA] = useState("");
    const [passwordB, setPasswordB] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const history = useHistory();

    function verifyMatchingPasswords() {
        if (!isPrivate) {
            return true;
        }
        if (passwordA === passwordB && passwordA.length > 0) {
            return true;
        }
        return false;
    }

    async function submitFolderName() {
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
                password: passwordA,
                notes: [],
            };
            setErrorMessage("Submitting folder...");
            let result = await postNewFolder(folder)
            if (result && result.status === 201) {
                props.setFolders([...props.folders, result.data]);
                //props.setShowModal(false);

                props.setFolderName(newFolderName);
                //props.setShowModal(false);
                props.setCurrentFolder({
                    name: newFolderName,
                    color: color,
                    password: passwordA,
                });
                setErrorMessage("");
                return true;
            } else {
                setErrorMessage("Folder creation failed")
                throw "Folder creation failed";
            }
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
                isFolderCreate={true}
            />
            <CreateFolderError
                isDuplicate={props.isDuplicate}
                newFolderName={newFolderName}
                errorMessage={errorMessage}
            />
<<<<<<< HEAD
            <CreateFolderError
                isDuplicate={props.isDuplicate}
                newFolderName={newFolderName}
                errorMessage={errorMessage}
            />
=======
>>>>>>> 08e44ae69a5e4027af9180d3fc2bebd93b44805f

                <Button
                    disabled={
                        !verifyMatchingPasswords() ||
                        !validFolder ||
                        color === "" ||
                        props.isDuplicate(newFolderName)
                    }
                    colorScheme="brand"
                    onClick={async () => {
                        try {
                            await submitFolderName();
                            props.setShowModal(false);
                            history.push(`/folder/${newFolderName.split(" ").join("+")}`);
                        } catch (e) {
                            setErrorMessage(e);
                        }

                    }}
                >
                    Create
                </Button>

        </form>
    );
}

export default CreateFolder;
