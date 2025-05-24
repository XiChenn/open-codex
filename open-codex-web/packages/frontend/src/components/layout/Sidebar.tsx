import React from 'react';
import { Box, VStack, Link as ChakraLink } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <Box bg="gray.100" w="200px" p="4">
      <VStack align="stretch" spacing="4">
        <ChakraLink as={RouterLink} to="/">
          Chat
        </ChakraLink>
        <ChakraLink as={RouterLink} to="/settings">
          Settings
        </ChakraLink>
      </VStack>
    </Box>
  );
};

export default Sidebar;
