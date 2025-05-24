import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Flex direction="column" h="100vh">
      <Navbar />
      <Flex flex="1">
        <Sidebar />
        <Box flex="1" p="4">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default MainLayout;
