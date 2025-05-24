import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Configuration Management
interface AppConfiguration {
  apiKeyOpenAI?: string;
  apiKeyGemini?: string;
  apiKeyOpenRouter?: string;
  ollamaBaseUrl?: string;
  apiKeyXAI?: string;
  defaultProvider?: string;
  defaultModel?: string;
  instructions?: string;
  approvalMode?: 'suggest' | 'auto-edit' | 'full-auto';
}

const configFilePath = path.join(__dirname, 'temp.config.json');
let currentConfig: AppConfiguration = { approvalMode: 'suggest', defaultProvider: 'openai', defaultModel: 'o4-mini' };

// Load config from file on startup
const loadConfig = () => {
  try {
    if (fs.existsSync(configFilePath)) {
      const fileContent = fs.readFileSync(configFilePath, 'utf-8');
      currentConfig = JSON.parse(fileContent);
      console.log('Configuration loaded from temp.config.json');
    } else {
      // Save initial default config if file doesn't exist
      saveConfig();
    }
  } catch (error) {
    console.error('Error loading configuration:', error);
    // Fallback to default if loading fails, and try to save it
    saveConfig();
  }
};

// Save config to file
const saveConfig = () => {
  try {
    fs.writeFileSync(configFilePath, JSON.stringify(currentConfig, null, 2), 'utf-8');
    console.log('Configuration saved to temp.config.json');
  } catch (error) {
    console.error('Error saving configuration:', error);
  }
};

// Load initial config
loadConfig();

// Config Endpoints
app.get('/api/config', (req, res) => {
  res.json(currentConfig);
});

app.post('/api/config', (req, res) => {
  const newConfigParts = req.body as Partial<AppConfiguration>;
  currentConfig = { ...currentConfig, ...newConfigParts };
  saveConfig(); // Save after update
  console.log('Configuration updated:', currentConfig);
  res.json(currentConfig);
});

// Chat Endpoints
app.post('/api/chat/prompt', (req, res) => {
  const {
    prompt,
    images, // We'll just log presence for now
    contextFiles, // Log presence
    provider = currentConfig.defaultProvider,
    model = currentConfig.defaultModel,
    sessionId, // Can be used for more advanced stateful interactions later
  } = req.body;

  console.log(`Received prompt: "${prompt}"`);
  console.log(`Provider: ${provider}, Model: ${model}, SessionID: ${sessionId}`);
  if (images && images.length > 0) {
    console.log(`Received ${images.length} image(s).`);
  }
  if (contextFiles && contextFiles.length > 0) {
    console.log(`Received ${contextFiles.length} context file(s).`);
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // Flush headers to establish SSE connection

  let messageCount = 0;

  const sendEvent = (data: Record<string, any>) => {
    res.write(`id: ${messageCount++}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // 1. Thinking...
  sendEvent({ type: 'status', content: 'Thinking...' });

  // 2. Simulated text response after a delay
  setTimeout(() => {
    sendEvent({ type: 'text', content: `This is a simulated AI response to: "${prompt}" from ${provider}/${model}` });
  }, 1000);

  // 3. Simulate a command proposal after another delay
  setTimeout(() => {
    const actionId = `cmd_${Date.now()}`;
    sendEvent({
      type: 'action',
      action: { // Encapsulate action details under an 'action' key
        contentType: 'command',
        command: `echo "Hello from backend! You said: ${prompt}" && date`,
        actionId: actionId,
      }
    });
  }, 2500);
  
  // 3.5 Simulate a file patch proposal after another delay
  setTimeout(() => {
    const actionId = `diff_${Date.now()}`;
    const sampleDiff = `--- a/example.txt
+++ b/example.txt
@@ -1 +1,2 @@
-Hello world
+Hello backend world!
+This is a new line.
`;
    sendEvent({
      type: 'action',
      action: { // Encapsulate action details
        contentType: 'filePatch',
        diffString: sampleDiff,
        actionId: actionId,
        fileName: "example.txt" // Good to include for UI
      }
    });
  }, 4000);


  // 4. End the stream after all simulated messages
  setTimeout(() => {
    sendEvent({ type: 'done' });
    res.end();
  }, 5500);

  // Keep connection open for SSE, but handle client disconnect
  req.on('close', () => {
    console.log('Client disconnected from SSE');
    res.end();
  });
});

app.post('/api/chat/decision', (req, res) => {
  const { actionId, approved, messageId } = req.body;
  console.log('Decision received for action:', { actionId, approved, messageId });
  // In a real app, you might trigger command execution or file patching here
  // based on the decision.
  res.json({
    status: 'decision_received',
    actionId,
    approved,
    messageId,
    confirmation: `Backend acknowledged ${approved ? 'approval' : 'rejection'} of action ${actionId}`,
  });
});

// Basic root route
app.get('/', (req, res) => {
  res.send('Open Codex Web Backend is running!');
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
