import React, { useState } from "react";
import { Link } from "react-router-dom";
import FileSettings from "../shared/FileSettings";
import axios from "axios";
import { Button, Box, Heading, Input } from "@chakra-ui/react";
import { Text } from "@chakra-ui/layout";
import { useHistory } from 'react-router-dom';

const letters = /^[0-9a-zA-Z\s]+$/;

function CreateNoteError(props) {
    return <Text color="red">{props.errorMessage}</Text>;
}

function CreateNote(props) {
    const [name, setName] = useState("");
    const [color, setColor] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [passwordA, setPasswordA] = useState("");
    const [passwordB, setPasswordB] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [validNote, setValidNote] = useState(false);

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

    /**
     * Construct note for submission to backend
     */
    async function submitNote() {
        props.setNoteName(name);
        props.setShowNoteModal(false);
        const note = {
            name: name,
            folder: props.folderName,
            color: color,
            isPrivate: isPrivate,
            password: passwordA,
            contents: props.noteContents,
            isLocked: isPrivate

        }

        postNewNote(note).then( result => {
            if (result && result.status === 200) {
                props.setShowNoteModal(false);
            } else {
                if (result.data) {
                    throw result.data;
                } else {
                    throw "unknown error";
                }

            }
                //props.setFolders([...props.folders, newFolderName]);
                // add this to the list of notes within the folder we are in

        });

    }


    /**
     * Post note to the backend
     * @param note The pre-constructed note object to submit to the backend
     * @returns {Promise<boolean|AxiosResponse<unknown>>} the response from the backend
     */
    async function postNewNote(note) {
        if(letters.test(name) &&
            name !== "" &&
            color !== ""
        ) {
            setErrorMessage("Submitting note...");

            try {
                const response = await axios.post('http://localhost:5000/notes', note);
                console.log(response);
                return response;
            }
            catch (error) {
                console.log(`Error posting new note`);
                console.log(error);
                return false;
            }
        }
    }

    function updateNoteName(testName) {
        let err = "";
        setValidNote(false);
        if (testName.length > 20) {
            err = "Name is too long";
        } else if (!letters.test(testName)) {
            err = "Name contains invalid character(s)";
        } else if (isDuplicate(testName)) {
            err = "A note with this name already exists in this folder";
        } else {
            err = "";
        }

        switch (err) {
            case "Name is too long":
            case "Name contains invalid character(s)" :
            case "A note with this name already exists in this folder":
                break;
            case "":
                setValidNote(true);
                setName(testName);
                break;
            default:
                err = "Unknown error";
                break;
        }
        setErrorMessage(err);
    }

    function isDuplicate(testName) {
        for (const otherNote of props.otherNotes) {
            if(otherNote.name === testName) {
                return true;
            }
        }
        return false;
    }

    return (
        <Box>
            <Heading>Add New Note</Heading>
            <Input
                placeholder="Enter Note Name"
                onChange={(e) => updateNoteName(e.target.value)}
                size="lg"
                isRequired={true}
                isInvalid={!validNote}
                errorBorderColor="red.300"
            />
            <FileSettings
                isPrivate={isPrivate}
                setIsPrivate={setIsPrivate}
                color={color}
                setColor={setColor}
                setPasswordA={setPasswordA}
                setPasswordB={setPasswordB}
                isFolderCreate={false}
            />

            <CreateNoteError
                errorMessage={errorMessage}
            />
            <Button
                disabled={
                    !verifyMatchingPasswords() ||
                    color === "" ||
                    isDuplicate(name) ||
                        !validNote
                }
                bg="brand.100"
                color="brand.300"
                colorScheme="brand"
                onClick={async () => {
                    try {
                        if (!props.folderURL.length > 0) {
                            throw "Unable to retrieve URL. Please return to homepage."
                        }
                        await submitNote();
                        props.setNoteName(name);
                        props.setNoteContents("");
                        props.setNoteColor(color);
                        history.push(`/folder/${props.folderURL}/note/${name.split(" ").join("+")}`);
                    } catch (e) {
                        setErrorMessage(e);
                    }

                }}
            >
                Create
            </Button>
        </Box>
    );
}

export default CreateNote;
