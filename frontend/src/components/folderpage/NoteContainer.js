import React from "react";
import { Link } from "react-router-dom";
import { Button, Flex, Wrap, WrapItem } from "@chakra-ui/react";

function ShowNotes(props) {
    const notes = props.noteData.map((row, index) => {
        const buttonColor =
            row.color === undefined || row.color === ""
                ? "#0000FF"
                : `#${row.color}`;
        const replaced = row.name.split(" ").join("+");
        return (
            <WrapItem>
                <Link to={`/folder/${props.folderURL}/note/${replaced}`}>
                    <Button
                        w="200px"
                        h='100px'
                        bg={`${buttonColor}`}
                        m={2}
                        onClick={() => {
                            props.setNoteName(row.name);
                            props.setNoteContents(row.contents);
                            props.setNoteColor(row.color);
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
                    folderURL={props.folderURL}
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
