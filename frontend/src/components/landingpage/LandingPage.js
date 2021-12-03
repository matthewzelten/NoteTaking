import React, { useState } from "react";
import FolderContainer from "./FolderContainer";
import CreateFolder from "./CreateFolder";
import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/modal";

function LandingPage(props) {
    const [showModal, setShowModal] = useState(false);
    return (
        <form>
            <input
                type="text"
                placeholder="search"
                onChange={(e)=>props.setKeyword(e.target.value)}/>
            <input type="button" value="Search" onClick={props.searchFolder}/>
            <input type="button" value="Cancel" onClick={props.cancelSearch}/>
        <Box
            style={{
                display: "flex",
                flexDirection: "row",
            }}
        >
            <FolderContainer
                setFolderURL={props.setFolderURL}
                setFolderName={props.setFolderName}
                folderData={props.folders}
                setShowModal={setShowModal}
                setCheckPass={props.setCheckPass}
            />
            <Modal w="100%" isOpen={showModal}>
                <ModalOverlay />
                <ModalContent>
                    <Box m={3}>
                        <Button onClick={() => setShowModal(false)}>
                            Close Modal
                        </Button>
                        <CreateFolder
                            folderName={props.folderName}
                            setFolderName={props.setFolderName}
                            setCurrentFolder={props.setCurrentFolder}
                            setShowModal={setShowModal}
                            isDuplicate={props.isDuplicate}
                            setFolders={props.setFolders}
                            folders={props.folders}
                        />
                    </Box>
                </ModalContent>
            </Modal>
        </Box>
        </form>
    );
}

export default LandingPage;
