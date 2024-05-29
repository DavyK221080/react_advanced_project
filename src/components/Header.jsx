// src/components/Header.jsx
import React from "react";
import { Box, Flex, Heading, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Box as="header" bg="teal.500" color="white" p={4} mb={6}>
      <Flex justify="space-between" align="center">
        <Heading as="h1" size="lg">
          <Link to="/">Event App</Link>
        </Heading>
        <Button as={Link} to="/add" colorScheme="teal">
          Add Event
        </Button>
      </Flex>
    </Box>
  );
};

export default Header;
