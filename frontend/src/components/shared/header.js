import React from "react";
import { Link } from "react-router-dom";
import { Heading, Center } from "@chakra-ui/react";
import { Box, Flex } from "@chakra-ui/layout";

function Header(props) {
    return (
        <Flex   as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        w="100%"
        mb={8}
        p={8}
        bg="brand.100">
                <Link to="/">
                    <Heading as="h1" size="3xl" color="brand.300">
                        Notes Made Easy
                    </Heading>
                </Link>
        </Flex>
    );
}

export default Header;
