import React, { useState } from "react";
import { Link, Redirect} from "react-router-dom";
import FileSettings from "../shared/FileSettings";
import axios from "axios";
import { Heading } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";

function CreateFolder(props) {
    const [newFolderName, setNewFolderName] = useState("");
    const [color, setColor] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);

    function submitFolderName() {
        props.setFolderName(newFolderName);
        props.setShowModal(false);
        if (newFolderName !== "" && color !== "") {
            const folder = {
                name: newFolderName,
                color: color,
                isPrivate: isPrivate,
                notes: [],
            };
            postNewFolder(folder).then((result) => {
                if (result && result.status === 200) {
                    props.setFolders([...props.folders, newFolderName]);
                    props.setShowModal(false);
                }
            })
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

    return (
        <form margin="5px">
            <Heading as="h2" size="2xl">
                Add New Folder
            </Heading>
            <Input
                placeholder="Enter Folder Name"
                onChange={(e) => setNewFolderName(e.target.value)}
                size="lg"
            />
            <FileSettings
                isPrivate={isPrivate}
                setIsPrivate={setIsPrivate}
                color={color}
                setColor={setColor}
            />
            <Link to={`/folder/${newFolderName}`}>
                <Button colorScheme="brand" onClick={() => submitFolderName()}>
                    Create
                </Button>
            </Link>
        </form>
    );
}

export default CreateFolder;
