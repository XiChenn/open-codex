import React, { useState, useRef } from 'react';
import {
  Textarea,
  Button,
  Flex,
  Box,
  IconButton,
  Input,
  VStack,
  HStack,
  Text,
  CloseButton,
  Tag,
} from '@chakra-ui/react';
import { AttachmentIcon, CopyIcon } from '@chakra-ui/icons'; // Added CopyIcon

interface MessageInputProps {
  onSendMessage: (text: string, images: File[], contextFiles: File[]) => void; // Updated prop
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedContextFiles, setSelectedContextFiles] = useState<File[]>([]); // Added state
  const imageInputRef = useRef<HTMLInputElement>(null); // Renamed for clarity
  const contextFileInputRef = useRef<HTMLInputElement>(null); // Added ref for context files

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedImages((prevImages) => [...prevImages, ...Array.from(event.target.files!)]);
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleContextFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedContextFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files!)]);
    }
    if (contextFileInputRef.current) {
      contextFileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (imageName: string) => {
    setSelectedImages((prevImages) => prevImages.filter((image) => image.name !== imageName));
  };

  const handleRemoveContextFile = (fileName: string) => {
    setSelectedContextFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const handleSend = () => {
    if ((text.trim() === '' && selectedImages.length === 0 && selectedContextFiles.length === 0) || isLoading) return;
    onSendMessage(text.trim(), selectedImages, selectedContextFiles); // Updated call
    setText('');
    setSelectedImages([]);
    setSelectedContextFiles([]); // Clear context files
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box p="4" borderTopWidth="1px" borderColor="gray.200" bg="gray.50">
      <VStack spacing={3} align="stretch">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here... (Shift+Enter for new line)"
          isDisabled={isLoading}
          bg="white"
          minRows={1}
          maxRows={5}
          resize="none"
        />
        {selectedImages.length > 0 && (
          <Box borderWidth="1px" borderRadius="md" p={2} bg="white">
            <Text fontSize="sm" fontWeight="medium" mb={2}>Selected Images:</Text>
            <VStack align="stretch" spacing={1}>
              {selectedImages.map((image, index) => (
                <HStack key={index} justify="space-between">
                  <Tag size="sm" variant="subtle" colorScheme="blue"> {/* Changed color for distinction */}
                    {image.name} ({(image.size / 1024).toFixed(2)} KB)
                  </Tag>
                  <CloseButton size="sm" onClick={() => handleRemoveImage(image.name)} />
                </HStack>
              ))}
            </VStack>
          </Box>
        )}
        {selectedContextFiles.length > 0 && (
          <Box borderWidth="1px" borderRadius="md" p={2} bg="white" mt={selectedImages.length > 0 ? 2 : 0}>
            <Text fontSize="sm" fontWeight="medium" mb={2}>Selected Context Files:</Text>
            <VStack align="stretch" spacing={1}>
              {selectedContextFiles.map((file, index) => (
                <HStack key={index} justify="space-between">
                  <Tag size="sm" variant="subtle" colorScheme="green"> {/* Changed color for distinction */}
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </Tag>
                  <CloseButton size="sm" onClick={() => handleRemoveContextFile(file.name)} />
                </HStack>
              ))}
            </VStack>
          </Box>
        )}
        <Flex align="center">
          <Input
            type="file"
            multiple
            accept="image/*"
            ref={imageInputRef}
            onChange={handleImageFileChange}
            style={{ display: 'none' }}
            id="image-file-input"
          />
          <IconButton
            aria-label="Attach images"
            icon={<AttachmentIcon />}
            onClick={() => imageInputRef.current?.click()}
            isDisabled={isLoading}
            mr="2"
          />
          <Input
            type="file"
            multiple
            accept=".md,.txt,.js,.ts,.py,.json,.yaml,.html,.css,application/pdf" // Added common text/code extensions and PDF
            ref={contextFileInputRef}
            onChange={handleContextFileChange}
            style={{ display: 'none' }}
            id="context-file-input"
          />
          <IconButton
            aria-label="Attach context files"
            icon={<CopyIcon />} // Placeholder icon
            onClick={() => contextFileInputRef.current?.click()}
            isDisabled={isLoading}
            mr="2"
          />
          <Button
            colorScheme="teal"
            onClick={handleSend}
            isLoading={isLoading}
            isDisabled={(text.trim() === '' && selectedImages.length === 0 && selectedContextFiles.length === 0)}
            flex="1"
          >
            Send
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default MessageInput;
