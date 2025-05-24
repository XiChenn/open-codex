import React, { useEffect, useRef } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import ChatMessage, { Message } from './ChatMessage';

interface ConversationDisplayProps {
  messages: Message[];
  onDecision?: (messageId: string, actionId: string | undefined, approved: boolean) => void; // Added onDecision
}

const ConversationDisplay: React.FC<ConversationDisplayProps> = ({ messages, onDecision }) => { // Added onDecision
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      flex="1"
      overflowY="auto"
      p="4"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="md"
      bg="white"
      h="calc(100vh - 200px)" // Adjust height as needed, considering Navbar and MessageInput
    >
      <VStack spacing="4" align="stretch">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} onDecision={onDecision} /> // Pass onDecision
        ))}
        <div ref={messagesEndRef} />
      </VStack>
    </Box>
  );
};

export default ConversationDisplay;
