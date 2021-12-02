import React from "react";
import { Link } from "react-router-dom";
import { Heading, Center } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Box, Flex } from "@chakra-ui/react";

function Header(props) {
    return (
        // <Flex
        //     w="100%"
        //     as="nav"
        //     align="center"
        //     justify="space-between"
        //     wrap="wrap"
        //     padding={6}
        //     bg="brand.100"
        //     color="white"
        //     {...props}
        // >
        //     <Flex align="center" mr={5}>

        //     </Flex>
        //     <Box display={{ base: "block", md: "none" }}>
        //         <Text
        //     </Box>
        // </Flex>
        <Center h="100px" bg="brand.100">
            <Link to="/">
                <Heading as="h1" size="3xl" color="brand.300">
                    Notes Made Easy
                </Heading>
            </Link>
        </Center>
    );
}

export default Header;
