import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react';

type ApprovalMode = 'suggest' | 'auto-edit' | 'full-auto';

const ApprovalModeSettings: React.FC = () => {
  const [approvalMode, setApprovalMode] = useState<ApprovalMode>('suggest');
  const toast = useToast();

  const handleSave = () => {
    // In a real app, save this to user preferences or a config file.
    console.log(`Saving Approval Mode: ${approvalMode}`);
    toast({
      title: 'Approval Mode Placeholder Save',
      description: `Approval Mode: ${approvalMode} would be saved here.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} boxShadow="sm" mt={8}>
      <Heading size="md" mb={6}>
        Approval Mode
      </Heading>
      <VStack spacing={4} align="stretch">
        <FormControl as="fieldset">
          <FormLabel as="legend">Select Default Approval Mode</FormLabel>
          <RadioGroup onChange={setApprovalMode as (value: string) => void} value={approvalMode}>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <Radio value="suggest">Suggest Mode (Prompt for all actions)</Radio>
              <Radio value="auto-edit">Auto-Edit Mode (Approve file edits automatically)</Radio>
              <Radio value="full-auto">Full Auto Mode (Approve edits and sandbox commands)</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        <Button colorScheme="blue" onClick={handleSave}>
          Save Approval Mode
        </Button>
      </VStack>
    </Box>
  );
};

export default ApprovalModeSettings;
