import React from 'react';
import { Box, Text, Flex, Avatar, VStack, Tag, HStack, Button, Code, Icon } from '@chakra-ui/react';
import { CheckIcon, CloseIcon, InfoIcon } from '@chakra-ui/icons';

// Attempt to import Diff2HtmlUI and its CSS
// If these are not found due to missing package, Diff2HtmlUI might be undefined
let Diff2HtmlUI: any = undefined;
try {
  const diff2htmlUiModule = require('diff2html');
  Diff2HtmlUI = diff2htmlUiModule.Diff2HtmlUI;
  // Dynamically try to import CSS if needed, or ensure your bundler handles this gracefully.
  // For now, we'll assume CSS might fail silently or is handled by bundler if package is missing.
  // A more robust solution for CSS would involve checking if the package exists before importing CSS,
  // or using a bundler feature for optional CSS.
  if (Diff2HtmlUI) {
    require('diff2html/bundles/css/diff2html.min.css');
  }
} catch (e) {
  console.warn('Diff2HtmlUI or its CSS could not be loaded. Diff fallback will be used.', e);
}


// Interface for image attachments
export interface ImageAttachment {
  name: string;
  type: string;
  size: number;
}

// Interface for context file attachments
export interface ContextFileAttachment {
  name: string;
  type: string;
  size: number;
}

// Main message interface
export interface Message {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp?: Date;
  images?: ImageAttachment[];
  contextFiles?: ContextFileAttachment[];
  // New fields for commands and diffs
  contentType?: 'text' | 'command' | 'filePatch';
  command?: string;
  diffString?: string;
  actionId?: string; // Unique ID for the proposed action
  isReviewed?: boolean; // True if user has approved/rejected
  isApproved?: boolean; // True if approved, false if rejected, undefined if not reviewed
}

interface ChatMessageProps {
  message: Message;
  onDecision?: (messageId: string, actionId: string | undefined, approved: boolean) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onDecision }) => {
  const {
    sender,
    text,
    timestamp,
    images,
    contextFiles,
    contentType = 'text', // Default to text
    command,
    diffString,
    actionId,
    isReviewed,
    isApproved,
  } = message;

  const isUser = sender === 'user';
  const isSystem = sender === 'system';

  let alignment: 'flex-start' | 'flex-end' = 'flex-start';
  let bgColor = 'gray.100';
  let textColor = 'black';
  let avatarLabel = 'AI';

  if (isUser) {
    alignment = 'flex-end';
    bgColor = 'blue.500';
    textColor = 'white';
    avatarLabel = 'You';
  } else if (isSystem) {
    alignment = 'center';
    bgColor = 'gray.300'; 
    textColor = 'black';
    avatarLabel = 'SYS';
     if (text.includes("approved") || text.includes("rejected")) {
       bgColor = text.includes("approved") ? "green.100" : "red.100";
     }

    return (
      <Flex justify="center" my="2">
        <Box
          bg={bgColor}
          color={textColor}
          px="3"
          py="1"
          borderRadius="md"
          maxWidth="80%"
          textAlign="center"
          fontStyle="italic"
        >
          <Text fontSize="sm">{text}</Text>
          {timestamp && (
            <Text fontSize="xs" color="gray.500" mt="1">
              {timestamp.toLocaleTimeString()}
            </Text>
          )}
        </Box>
      </Flex>
    );
  }

  const handleDecisionClick = (approved: boolean) => {
    if (onDecision && actionId) {
      onDecision(message.id, actionId, approved);
    }
  };
  
  const proposalOpacity = isReviewed ? 0.6 : 1;

  return (
    <Flex direction="column" alignSelf={alignment} my="2" w="full">
      <Flex
        direction={isUser ? 'row-reverse' : 'row'}
        alignItems="flex-start"
        w="full"
      >
        <Avatar
          size="sm"
          name={avatarLabel}
          bg={isUser ? 'blue.300' : 'teal.300'}
          color="white"
          ml={isUser ? 2 : 0}
          mr={isUser ? 0 : 2}
        />
        <VStack
          alignItems={isUser ? 'flex-end' : 'flex-start'}
          spacing={1}
          maxWidth={{ base: "90%", md: "70%"}}
        >
          <Box
            bg={bgColor}
            color={textColor}
            px="4"
            py="2"
            borderRadius="lg"
            boxShadow="sm"
            w="auto"
            opacity={proposalOpacity}
          >
            <Text>{text}</Text> 
          </Box>

          {contentType === 'command' && command && (
            <Box
              mt={2}
              p={3}
              borderWidth="1px"
              borderColor="orange.300"
              borderRadius="md"
              bg="orange.50"
              w="full" 
              opacity={proposalOpacity}
            >
              <Text fontSize="sm" fontWeight="bold" mb={2} color="orange.700">Proposed Command:</Text>
              <Code p={2} display="block" whiteSpace="pre-wrap" bg="gray.800" color="gray.100" borderRadius="md">
                {command}
              </Code>
            </Box>
          )}

          {contentType === 'filePatch' && diffString && (
             <Box
              mt={2}
              p={3}
              borderWidth="1px"
              borderColor="purple.300"
              borderRadius="md"
              bg="purple.50"
              w="full" 
              opacity={proposalOpacity}
              overflowX="auto" 
            >
              <Text fontSize="sm" fontWeight="bold" mb={2} color="purple.700">Proposed File Edit:</Text>
              <Box bg="white" p={1} borderRadius="md">
                {typeof Diff2HtmlUI === 'function' ? (
                  <Diff2HtmlUI diff={diffString} config={{ drawFileList: false, outputFormat: 'line-by-line', matching: 'lines' }} />
                ) : (
                  <Code display="block" whiteSpace="pre" p={2} overflowX="auto">
                    {diffString}
                  </Code>
                )}
              </Box>
            </Box>
          )}
          
          {(contentType === 'command' || contentType === 'filePatch') && actionId && (
            <Box mt={2} alignSelf={isUser ? "flex-end" : "flex-start"}>
              {!isReviewed ? (
                <HStack spacing={3}>
                  <Button
                    size="sm"
                    colorScheme="green"
                    leftIcon={<CheckIcon />}
                    onClick={() => handleDecisionClick(true)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    leftIcon={<CloseIcon />}
                    onClick={() => handleDecisionClick(false)}
                  >
                    Reject
                  </Button>
                </HStack>
              ) : (
                <Tag size="md" colorScheme={isApproved ? 'green' : 'red'} variant="subtle">
                  <Icon as={isApproved ? CheckIcon : CloseIcon} mr={2} />
                  User {isApproved ? 'Approved' : 'Rejected'}
                </Tag>
              )}
            </Box>
          )}

          {images && images.length > 0 && (
             <Box
              mt={contentType === 'command' || contentType === 'filePatch' ? 1 : 2} 
              p="2"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              bg={isUser ? "blue.50" : "gray.50"}
              w="auto"
              alignSelf={isUser ? "flex-end" : "flex-start"}
            >
              <Text fontSize="xs" fontWeight="medium" mb="1" color={isUser ? "blue.700" : "gray.700"}>
                Image Attachments:
              </Text>
              <VStack align="stretch" spacing="1">
                {images.map((image, index) => (
                  <Tag key={`img-${index}`} size="sm" variant="subtle" colorScheme={isUser ? "blue" : "gray"}>
                    {image.name} ({(image.size / 1024).toFixed(2)} KB)
                  </Tag>
                ))}
              </VStack>
            </Box>
          )}

          {contextFiles && contextFiles.length > 0 && (
            <Box
              mt={1}
              p="2"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              bg={isUser ? "green.50" : "gray.50"}
              w="auto"
              alignSelf={isUser ? "flex-end" : "flex-start"}
            >
              <Text fontSize="xs" fontWeight="medium" mb="1" color={isUser ? "green.700" : "gray.700"}>
                Context File Attachments:
              </Text>
              <VStack align="stretch" spacing="1">
                {contextFiles.map((file, index) => (
                  <Tag key={`file-${index}`} size="sm" variant="subtle" colorScheme={isUser ? "green" : "gray"}>
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </Tag>
                ))}
              </VStack>
            </Box>
          )}
        </VStack>
      </Flex>
      {timestamp && (
        <Text
          fontSize="xs"
          color="gray.500"
          mt="1"
          textAlign={isUser ? 'right' : 'left'}
          pl={isUser ? 0 : "44px"}
          pr={isUser ? "44px" : 0}
        >
          {timestamp.toLocaleTimeString()}
        </Text>
      )}
    </Flex>
  );
};

export default ChatMessage;
