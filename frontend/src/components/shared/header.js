import React from "react";
import { Link } from "react-router-dom";
import { Heading, Flex } from "@chakra-ui/react";

function Header(props) {
    return (
        <Flex
            height="10vh"
            width="100vh"
            alignItems="center"
            justifyContent="center"
        >
            <Flex
                direction="column"
                background="gray.100"
                p={8}
                rounded={6}
                marginTop={75}
            >
                <Link to="/">
                    <Heading fontFamily="Apple Chancery" color="black.60">
                        Notes Made Easy
                    </Heading>
                </Link>
            </Flex>
        </Flex>
    );
}

export default Header;
