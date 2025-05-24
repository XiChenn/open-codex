import React from 'react';
import {
  Flex,
  FormControl,
  FormLabel,
  Select,
  Input,
  Box,
} from '@chakra-ui/react';

interface SessionSettingsBarProps {
  currentProvider: string;
  onProviderChange: (provider: string) => void;
  currentModel: string;
  onModelChange: (model: string) => void;
  availableProviders: string[];
}

const SessionSettingsBar: React.FC<SessionSettingsBarProps> = ({
  currentProvider,
  onProviderChange,
  currentModel,
  onModelChange,
  availableProviders,
}) => {
  return (
    <Box p="4" borderBottomWidth="1px" borderColor="gray.200" bg="gray.50">
      <Flex align="center" justify="space-between" wrap="wrap">
        <FormControl id="session-provider" mr={{ base: 0, md: 4 }} mb={{ base: 2, md: 0 }} minW="200px">
          <FormLabel fontSize="sm" mb="1">AI Provider</FormLabel>
          <Select
            size="sm"
            value={currentProvider}
            onChange={(e) => onProviderChange(e.target.value)}
            bg="white"
          >
            {availableProviders.map((provider) => (
              <option key={provider} value={provider}>
                {provider.charAt(0).toUpperCase() + provider.slice(1)}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="session-model" minW="200px">
          <FormLabel fontSize="sm" mb="1">Model Name</FormLabel>
          <Input
            size="sm"
            type="text"
            placeholder="e.g., o4-mini, gemini-pro"
            value={currentModel}
            onChange={(e) => onModelChange(e.target.value)}
            bg="white"
          />
        </FormControl>
      </Flex>
    </Box>
  );
};

export default SessionSettingsBar;
