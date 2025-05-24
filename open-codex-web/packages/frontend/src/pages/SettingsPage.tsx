import React from 'react';
import { Box, Heading, VStack, ScrollView } from '@chakra-ui/react'; // Added ScrollView for potentially long content
import APIKeySettings from '../components/settings/APIKeySettings';
import ModelPreferencesSettings from '../components/settings/ModelPreferencesSettings';
import InstructionsSettings from '../components/settings/InstructionsSettings';
import ApprovalModeSettings from '../components/settings/ApprovalModeSettings';

const SettingsPage: React.FC = () => {
  return (
    <ScrollView width="100%"> {/* Optional: Use ScrollView if content might exceed viewport height */}
      <Box p={{ base: 4, md: 6 }}>
        <Heading as="h1" size="xl" mb={8} textAlign="center">
          Application Settings
        </Heading>
        <VStack spacing={10} align="stretch" maxWidth="800px" margin="0 auto">
          <APIKeySettings />
          <ModelPreferencesSettings />
          <InstructionsSettings />
          <ApprovalModeSettings />
        </VStack>
      </Box>
    </ScrollView>
  );
};

export default SettingsPage;
