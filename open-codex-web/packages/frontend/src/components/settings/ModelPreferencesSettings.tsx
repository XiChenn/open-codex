import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react';

const ModelPreferencesSettings: React.FC = () => {
  const [defaultProvider, setDefaultProvider] = useState('openai');
  const [defaultModel, setDefaultModel] = useState('');
  const toast = useToast();

  const handleSave = () => {
    // In a real app, save this to user preferences or a config file.
    console.log(`Saving Model Preferences: Provider - ${defaultProvider}, Model - ${defaultModel}`);
    toast({
      title: 'Model Preferences Placeholder Save',
      description: `Provider: ${defaultProvider}, Model: ${defaultModel} would be saved here.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const providers = ['openai', 'gemini', 'openrouter', 'ollama', 'xai'];

  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} boxShadow="sm" mt={8}>
      <Heading size="md" mb={6}>
        Model Preferences
      </Heading>
      <VStack spacing={4} align="stretch">
        <FormControl id="default-provider">
          <FormLabel>Default AI Provider</FormLabel>
          <Select
            value={defaultProvider}
            onChange={(e) => setDefaultProvider(e.target.value)}
          >
            {providers.map((provider) => (
              <option key={provider} value={provider}>
                {provider.charAt(0).toUpperCase() + provider.slice(1)}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="default-model">
          <FormLabel>Default Model Name</FormLabel>
          <Input
            type="text"
            placeholder="e.g., gpt-4o, gemini-pro, llama3"
            value={defaultModel}
            onChange={(e) => setDefaultModel(e.target.value)}
          />
        </FormControl>

        <Button colorScheme="blue" onClick={handleSave}>
          Save Model Preferences
        </Button>
      </VStack>
    </Box>
  );
};

export default ModelPreferencesSettings;
