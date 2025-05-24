import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react';

interface APIKeyInputProps {
  providerName: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  isUrl?: boolean;
}

const APIKeyInput: React.FC<APIKeyInputProps> = ({
  providerName,
  value,
  onChange,
  onSave,
  isUrl = false,
}) => {
  return (
    <FormControl id={`${providerName.toLowerCase()}-key`} mb={4}>
      <FormLabel>{providerName} API Key {isUrl && "(Base URL)"}</FormLabel>
      <Input
        type={isUrl ? "url" : "password"}
        placeholder={`Enter your ${providerName} ${isUrl ? "Base URL" : "API Key"}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Button mt={2} size="sm" colorScheme="blue" onClick={onSave}>
        Save {providerName} Key
      </Button>
    </FormControl>
  );
};

const APIKeySettings: React.FC = () => {
  const [openAIKey, setOpenAIKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [ollamaBaseUrl, setOllamaBaseUrl] = useState('');
  const [xaiKey, setXaiKey] = useState('');
  const toast = useToast();

  const handleSave = (providerName: string, key: string, isUrl: boolean = false) => {
    // In a real app, you would encrypt and save this securely.
    // For now, we'll just log it and show a toast.
    console.log(`Saving ${providerName} ${isUrl ? "Base URL" : "Key"}: ${key}`);
    toast({
      title: `${providerName} ${isUrl ? "Base URL" : "Key"} Placeholder Save`,
      description: `${isUrl ? "Base URL" : "Key"} for ${providerName} would be saved here. Current value: ${key}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} boxShadow="sm">
      <Heading size="md" mb={6}>
        API Key Management
      </Heading>
      <VStack spacing={4} align="stretch">
        <APIKeyInput
          providerName="OpenAI"
          value={openAIKey}
          onChange={setOpenAIKey}
          onSave={() => handleSave('OpenAI', openAIKey)}
        />
        <APIKeyInput
          providerName="Gemini"
          value={geminiKey}
          onChange={setGeminiKey}
          onSave={() => handleSave('Gemini', geminiKey)}
        />
        <APIKeyInput
          providerName="OpenRouter"
          value={openRouterKey}
          onChange={setOpenRouterKey}
          onSave={() => handleSave('OpenRouter', openRouterKey)}
        />
        <APIKeyInput
          providerName="Ollama"
          value={ollamaBaseUrl}
          onChange={setOllamaBaseUrl}
          onSave={() => handleSave('Ollama', ollamaBaseUrl, true)}
          isUrl={true}
        />
        <APIKeyInput
          providerName="XAI"
          value={xaiKey}
          onChange={setXaiKey}
          onSave={() => handleSave('XAI', xaiKey)}
        />
      </VStack>
    </Box>
  );
};

export default APIKeySettings;
