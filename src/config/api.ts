// API Configuration
export const API_CONFIG = {
  // Base URL for the secure API server
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  
  // Timeout settings
  TIMEOUT: 10000,
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};

// Note: API keys are now stored securely on the server
// and are not exposed to the frontend 