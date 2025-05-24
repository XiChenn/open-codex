import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Simple health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Backend is healthy' });
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
