import React from "react";
import { Link } from "react-router-dom";
import { Flex, Button } from "@chakra-ui/react";

function ShowFolders(props) {
    const folders = props.folderData.map((row, index) => {
        const buttonColor =
            row.color === undefined || row.color === ""
                ? "#0000FF"
                : `#${row.color}`;
        return (
            <Link to="/folder">
                <button
                    style={{
                        width: "200px",
                        height: "50px",
                        background: `${buttonColor}`,
                    }}
                    onClick={() => props.getFolder(row.name)}
                >
                    {row.name}
                </button>
            </Link>
        );
    });
    return folders;
}

function FolderContainer(props) {
    return (
        <Flex
            paddingTop="8vh"
            paddingLeft="41vh"
            alignItems="center"
            justifyContent="center"
            colorScheme="white"
        >
            <div>
                <ShowFolders
                    getFolder={props.getFolder}
                    folderData={props.folderData}
                />
                <Button
                    mb={10}
                    color="black"
                    fontFamily="Avantgarde"
                    borderColor="black"
                    onClick={() => props.setShowModal(true)}
                >
                    Add New Folder
                </Button>
            </div>
        </Flex>
    );
}

export default FolderContainer;
