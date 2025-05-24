import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

const Navbar: React.FC = () => {
  return (
    <Box bg="teal.500" p="4" color="white">
      <Heading size="md">Open Codex Web</Heading>
    </Box>
  );
};

export default Navbar;
