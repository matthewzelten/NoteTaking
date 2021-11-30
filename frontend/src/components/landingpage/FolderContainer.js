import { Button } from "@chakra-ui/button";
import React from "react";
import { Link } from "react-router-dom";
import { Box, Wrap, WrapItem } from "@chakra-ui/layout";

function ShowFolders(props) {
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
                        style={{
                            width: "200px",
                            height: "50px",
                            background: `${buttonColor}`,
                            margin: "5px",
                        }}
                        onClick={() => props.redirectFolder(row.name)}
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
        <Box style={{ display: "flex", flexDirection: "row" }}>
            <Wrap marginLeft="90px" width="1300px" jusitfy="center">
                <ShowFolders
                    redirectFolder={props.redirectFolder}
                    folderData={props.folderData}
                />
                <WrapItem>
                    <Button
                        colorScheme="brand.200"
                        style={{
                            width: "200px",
                            height: "50px",
                            margin: "5px",
                        }}
                        onClick={() => props.setShowModal(true)}
                    >
                        Add New Folder
                    </Button>
                </WrapItem>
            </Wrap>
        </Box>
    );
}

export default FolderContainer;
