import React from "react";
import { Link } from 'react-router-dom'
import { Heading, Center } from '@chakra-ui/react'

function Header(props) {
  return (
    <Center h="100px" bg="#216869">
      <Link to="/">
        <Heading color="white">Notes Made Easy</Heading>
      </Link>
    </Center>
  );
}

export default Header;
