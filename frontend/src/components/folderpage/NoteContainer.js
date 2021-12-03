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
                        onClick={() => {
                            props.setNoteName(row.name);
                            props.setNoteContents(row.contents);
                            props.setNoteColor(row.color);
                        }}
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
            <Wrap justify="center">
                <ShowNotes
                    noteData={props.noteData}
                    setNoteName={props.setNoteName}
                    setNoteContents={props.setNoteContents}
                    setNoteColor={props.setNoteColor}
                />
            </Wrap>
        </Flex>
    );
}

export default NoteContainer;
