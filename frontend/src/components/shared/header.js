import React from "react";
import { Link } from "react-router-dom";
import { Heading, Center } from "@chakra-ui/react";
import { Box, Flex } from "@chakra-ui/layout";

function Header(props) {
    return (
        <Center w="100%" h="100px" bg="brand.100">
            <Link to="/">
                <Heading as="h1" size="3xl" color="brand.300">
                    Notes Made Easy
                </Heading>
            </Link>
        </Center>
    );
}

export default Header;
