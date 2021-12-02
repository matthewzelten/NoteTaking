import { Button } from "@chakra-ui/button";
import React from "react";
import { Link } from "react-router-dom";
import { Flex, Wrap, WrapItem } from "@chakra-ui/layout";

function ShowFolders(props) {
    function updateNameAndURL(name, URL) {
        props.setFolderName(name)
        props.setFolderURL(URL)
    }
    const folders = props.folderData.map((row, index) => {
        const buttonColor =
            row.color === undefined || row.color === ""
                ? "#0000FF"
                : `#${row.color}`;
        const replaced = row.name.split(" ").join("+");
        return (
            <WrapItem>
                <Link to={`/folder/${replaced}`}>
                    <Button
                        w="200px"
                        h="100px"
                        bg={`${buttonColor}`}
                        onClick={() => updateNameAndURL(row.name, replaced)}
                    >
                        {row.name}
                    </Button>
                </Link>
            </WrapItem>
        );
    });
    return folders;
}

function FolderContainer(props) {
    return (
        <Flex direction="row">
            <Wrap marginLeft="90px" jusitfy="center">
                <ShowFolders
                    setFolderName={props.setFolderName}
                    setFolderURL={props.setFolderURL}
                    redirectFolder={props.redirectFolder}
                    folderData={props.folderData}
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
