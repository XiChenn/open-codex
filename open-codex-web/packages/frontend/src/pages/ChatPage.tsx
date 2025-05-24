import React, { useState, useEffect } from 'react';
import { Box, Flex, VStack } from '@chakra-ui/react';
import ConversationDisplay from '../components/chat/ConversationDisplay';
import MessageInput from '../components/chat/MessageInput';
import SessionSettingsBar from '../components/chat/SessionSettingsBar';
import { Message, ImageAttachment, ContextFileAttachment } from '../components/chat/ChatMessage';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionProvider, setSessionProvider] = useState('openai');
  const [sessionModel, setSessionModel] = useState('o4-mini');

  const availableProviders = ['openai', 'gemini', 'openrouter', 'ollama', 'xai'];

  const handleSessionProviderChange = (newProvider: string) => {
    setSessionProvider(newProvider);
  };

  const handleSessionModelChange = (newModel: string) => {
    setSessionModel(newModel);
  };

  useEffect(() => {
    setMessages([
      {
        id: 'welcome-message',
        sender: 'system',
        text: 'Welcome! Send a message to get started. Some responses might include actions.',
        timestamp: new Date(),
        contentType: 'text',
      },
    ]);
  }, []);

  const handleDecision = (messageId: string, actionId: string | undefined, approved: boolean) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, isReviewed: true, isApproved: approved } : msg
      )
    );
    console.log(`User decided on action ${actionId}: ${approved ? 'Approved' : 'Rejected'}`);

    const systemMessageText = actionId?.startsWith('cmd_')
      ? `Command ${approved ? 'approved' : 'rejected'} by user.`
      : `File patch ${approved ? 'approved' : 'rejected'} by user.`;
    
    const systemConfirmationMessage: Message = {
      id: `system-${Date.now()}`,
      sender: 'system',
      text: systemMessageText,
      contentType: 'text',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, systemConfirmationMessage]);
  };

  const handleSendMessage = (text: string, images: File[], contextFiles: File[]) => {
    const imageAttachments: ImageAttachment[] = images.map(file => ({
      name: file.name, type: file.type, size: file.size,
    }));
    const contextFileAttachments: ContextFileAttachment[] = contextFiles.map(file => ({
      name: file.name, type: file.type, size: file.size,
    }));

    console.log(
      `Sending message with Provider: ${sessionProvider}, Model: ${sessionModel}, Message: ${text}, Images:`,
      imageAttachments, `Context Files:`, contextFileAttachments
    );

    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      images: imageAttachments.length > 0 ? imageAttachments : undefined,
      contextFiles: contextFileAttachments.length > 0 ? contextFileAttachments : undefined,
      timestamp: new Date(),
      contentType: 'text',
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);

    // Simulate AI response with occasional actions
    setTimeout(() => {
      const randomNumber = Math.random();
      let aiResponse: Message;

      if (randomNumber < 0.33 && text.toLowerCase().includes("command")) { // ~33% chance for a command
        const actionId = `cmd_${Date.now()}`;
        aiResponse = {
          id: `ai-${actionId}`,
          sender: 'ai',
          text: 'I can run this command for you:',
          contentType: 'command',
          command: 'echo "Hello from simulated command!" && ls -l',
          actionId: actionId,
          isReviewed: false,
          timestamp: new Date(),
        };
      } else if (randomNumber < 0.66 && text.toLowerCase().includes("diff")) { // ~33% chance for a diff
        const actionId = `diff_${Date.now()}`;
        const sampleDiff = `--- a/original_file.txt
+++ b/modified_file.txt

-This is the first line.
-This is the second line, it will be removed.
+This is the new first line.
 This is the third line, it remains unchanged.
+This is a new fourth line, added at the end.
`;
        aiResponse = {
          id: `ai-${actionId}`,
          sender: 'ai',
          text: 'Here is the proposed file change:',
          contentType: 'filePatch',
          diffString: sampleDiff,
          actionId: actionId,
          isReviewed: false,
          timestamp: new Date(),
        };
      } else { // Default text response
        let aiText = `AI response to: "${text}" (Provider: ${sessionProvider}, Model: ${sessionModel})`;
        if (imageAttachments.length > 0) {
          aiText += `\nI see you've uploaded ${imageAttachments.length} image(s): ${imageAttachments.map(img => img.name).join(', ')}.`;
        }
        if (contextFileAttachments.length > 0) {
          aiText += `\nAnd ${contextFileAttachments.length} context file(s): ${contextFileAttachments.map(file => file.name).join(', ')}.`;
        }
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiText,
          contentType: 'text',
          timestamp: new Date(),
        };
      }
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Flex direction="column" h="calc(100vh - 72px)"> {/* Adjust height based on Navbar height */}
      <SessionSettingsBar
        currentProvider={sessionProvider}
        onProviderChange={handleSessionProviderChange}
        currentModel={sessionModel}
        onModelChange={handleSessionModelChange}
        availableProviders={availableProviders}
      />
      <ConversationDisplay messages={messages} onDecision={handleDecision} /> {/* Pass handleDecision */}
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </Flex>
  );
};

export default ChatPage;
