import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { Database } from './database';
import { validateSubmission } from './validation';
import { simulateProcessingDelay, createSampleResponseData } from './utils';
import { UserSubmission, ApiResponse } from './types';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Middleware setup
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../dist')));

// Database instance
const database = new Database();

// Handle form submission with validation and processing
app.post('/submit', async (req: Request, res: Response) => {
  try {
    // Simulate real-world processing time
    await simulateProcessingDelay();
    
    const submissionData: UserSubmission = req.body;
    
    // Validate input data
    const validationErrors = validateSubmission(submissionData);
    if (validationErrors) {
      return res.status(400).json({
        success: false,
        error: validationErrors
      });
    }
    
    // Store in database
    await database.saveSubmission(submissionData);
    
    // Generate response data
    const responseData = createSampleResponseData(submissionData);
    
    const response: ApiResponse = {
      success: true,
      data: responseData
    };
    
    res.json(response);
    
  } catch (err) {
    console.error('Submission processing failed:', err);
    res.status(500).json({
      success: false,
      error: { general: ['Something went wrong. Please try again.'] }
    });
  }
});

// Retrieve submission history
app.get('/history', async (req: Request, res: Response) => {
  try {
    const submissions = await database.getSubmissionHistory();
    res.json(submissions);
  } catch (err) {
    console.error('Failed to retrieve history:', err);
    res.status(500).json({ 
      error: 'Unable to load submission history. Please try again later.' 
    });
  }
});

// Serve React app for all other routes (SPA fallback)
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});