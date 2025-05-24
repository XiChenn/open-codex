import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react';

const InstructionsSettings: React.FC = () => {
  const [instructions, setInstructions] = useState('');
  const toast = useToast();

  const handleSave = () => {
    // In a real app, save this to user preferences or a config file.
    console.log(`Saving Global Instructions: ${instructions}`);
    toast({
      title: 'Global Instructions Placeholder Save',
      description: `Instructions would be saved here. Current value: ${instructions.substring(0, 100)}${instructions.length > 100 ? '...' : ''}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} boxShadow="sm" mt={8}>
      <Heading size="md" mb={6}>
        Global Instructions
      </Heading>
      <VStack spacing={4} align="stretch">
        <FormControl id="global-instructions">
          <FormLabel>Custom Instructions for the AI</FormLabel>
          <Textarea
            placeholder="e.g., Always respond in Markdown. Be concise. Prioritize Python for coding tasks."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={8}
          />
        </FormControl>

        <Button colorScheme="blue" onClick={handleSave}>
          Save Instructions
        </Button>
      </VStack>
    </Box>
  );
};

export default InstructionsSettings;
