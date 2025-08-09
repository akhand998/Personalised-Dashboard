import { API_CONFIG } from '../config/api';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.maxRetries = API_CONFIG.MAX_RETRIES;
    this.retryDelay = API_CONFIG.RETRY_DELAY;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get token from NextAuth session if available
    let token = null;
    if (typeof window !== 'undefined') {
      // Try to get token from session storage or localStorage
      token = sessionStorage.getItem('next-auth.session-token') || 
               localStorage.getItem('next-auth.session-token') ||
               localStorage.getItem('authToken');
    }
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    };

    const fetchOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    let lastError;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(url, fetchOptions);
        
        if (!response.ok) {
          if (response.status === 401) {
            // Clear invalid token
            if (typeof window !== 'undefined') {
              localStorage.removeItem('authToken');
              sessionStorage.removeItem('next-auth.session-token');
            }
            throw new Error('Authentication required');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        lastError = error;
        
        if (attempt < this.maxRetries) {
          console.log(`Attempt ${attempt + 1} failed, retrying in ${this.retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        }
      }
    }
    
    throw lastError;
  }

  // Authentication methods
  async login(email, password) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      // Store token
      if (typeof window !== 'undefined' && response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(email, password) {
    try {
      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      // Store token
      if (typeof window !== 'undefined' && response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('next-auth.session-token');
    }
  }

  isAuthenticated() {
    if (typeof window !== 'undefined') {
      return !!(localStorage.getItem('authToken') || 
                sessionStorage.getItem('next-auth.session-token'));
    }
    return false;
  }

  // User preferences
  async getUserPreferences() {
    return this.request('/user/preferences');
  }

  async updateUserPreferences(preferences) {
    return this.request('/user/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  // Content APIs
  async getNews(category = 'general') {
    return this.request(`/api/news/${category}`);
  }

  async getMovies() {
    console.log('API Service: Making request to /movies');
    try {
      const result = await this.request('/api/movies');
      console.log('API Service: Movies response:', result);
      return result;
    } catch (error) {
      console.error('API Service: Error fetching movies:', error);
      throw error;
    }
  }
}

const apiService = new ApiService();
export default apiService; 