import { Button } from "@chakra-ui/button";
import React from "react";
import { Link } from "react-router-dom";
import { Box, Flex, Wrap, WrapItem } from "@chakra-ui/layout";

function ShowNotes(props) {
    const notes = props.noteData.map((row, index) => {
        const buttonColor =
            row.color === undefined || row.color === ""
                ? "#0000FF"
                : `#${row.color}`;
        return (
            <WrapItem>
                <Link to={`/note`}>
                    <Button
                        style={{
                            width: "200px",
                            height: "50px",
                            background: `${buttonColor}`,
                            margin: "5px",
                        }}
                    >
                        {row.name}
                    </Button>
                </Link>
            </WrapItem>
        );
    });
    return notes;
}

function NoteContainer(props) {
    return (
        <Flex direction="row">
            <Wrap marginLeft="90px" jusitfy="center">
                <ShowNotes
                    noteData={props.noteData}
                />
            </Wrap>
        </Flex>
    );
}

export default NoteContainer;
