const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3002','https://personalised-dashboard.vercel.app', 'http://localhost:3004', 'http://localhost:3005', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    categories: [String],
    darkMode: { type: Boolean, default: false },
    favorites: [Object]
  },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      preferences: {
        categories: ['general'],
        darkMode: false,
        favorites: []
      }
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user preferences
app.get('/api/user/preferences', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user preferences
app.put('/api/user/preferences', authenticateToken, async (req, res) => {
  try {
    const { categories, darkMode, favorites } = req.body;

    const updateData = {};
    if (categories !== undefined) updateData['preferences.categories'] = categories;
    if (darkMode !== undefined) updateData['preferences.darkMode'] = darkMode;
    if (favorites !== undefined) updateData['preferences.favorites'] = favorites;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateData },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// News API proxy with caching
const newsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

app.get('/api/news/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const cacheKey = `news_${category}`;
    const cached = newsCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return res.json(cached.data);
    }

    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'News API key not configured' });
    }

    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache the result
    newsCache.set(cacheKey, {
      data: data.articles,
      timestamp: Date.now()
    });

    res.json(data.articles);

  } catch (error) {
    console.error('News API error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Movies API proxy with caching
const moviesCache = new Map();

app.get('/api/movies', async (req, res) => {
  try {
    const cacheKey = 'movies_popular';
    const cached = moviesCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return res.json(cached.data);
    }

    // Try to fetch from TMDB first
    const apiKey = process.env.TMDB_API_KEY;
    console.log('TMDB API Key:', apiKey ? 'Present' : 'Missing');
    
    if (apiKey) {
      try {
        console.log('Attempting to fetch from TMDB...');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`,
          {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
            }
          }
        );
        
        clearTimeout(timeoutId);

        console.log('TMDB Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('TMDB API successful, returning real data');
          
          // Cache the result
          moviesCache.set(cacheKey, {
            data: data.results,
            timestamp: Date.now()
          });

          return res.json(data.results);
        } else {
          console.error('TMDB API failed with status:', response.status);
          const errorText = await response.text();
          console.error('TMDB API error response:', errorText);
        }
      } catch (error) {
        console.error('TMDB API error:', error);
      }
    } else {
      console.log('No TMDB API key found, using mock data');
    }

    // Fallback to mock data if TMDB fails
    const mockMovies = [
      {
        id: 1,
        title: "The Matrix Resurrections",
        overview: "Neo returns to the Matrix to face his greatest challenge yet.",
        poster_path: "/8c4a8kE7PizaGQQnditMmI1xbRp.jpg",
        vote_average: 8.5,
        release_date: "2021-12-22"
      },
      {
        id: 2,
        title: "Dune",
        overview: "Feature adaptation of Frank Herbert's science fiction novel about the son of a noble family entrusted with the protection of a desert planet.",
        poster_path: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
        vote_average: 8.0,
        release_date: "2021-10-22"
      },
      {
        id: 3,
        title: "Spider-Man: No Way Home",
        overview: "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero.",
        poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
        vote_average: 8.2,
        release_date: "2021-12-17"
      },
      {
        id: 4,
        title: "The Batman",
        overview: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family.",
        poster_path: "/74xTEgt7R36Fpooo50r9T25onhq.jpg",
        vote_average: 7.8,
        release_date: "2022-03-04"
      },
      {
        id: 5,
        title: "Black Widow",
        overview: "Natasha Romanoff confronts the darker parts of her ledger when a dangerous conspiracy with ties to her past arises.",
        poster_path: "/qAZ0pZV4M9OSdU0PIYL9Z2LWfC.jpg",
        vote_average: 7.4,
        release_date: "2021-07-09"
      },
      {
        id: 6,
        title: "Shang-Chi and the Legend of the Ten Rings",
        overview: "Shang-Chi, the master of weaponry-based Kung Fu, is forced to confront his past after being drawn into the Ten Rings organization.",
        poster_path: "/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg",
        vote_average: 7.6,
        release_date: "2021-09-03"
      },
      {
        id: 7,
        title: "Eternals",
        overview: "The Eternals are a team of ancient aliens who have been living on Earth in secret for thousands of years.",
        poster_path: "/6AdXwufTRSRlsD2e2tXW8XfOyAy.jpg",
        vote_average: 6.8,
        release_date: "2021-11-05"
      },
      {
        id: 8,
        title: "No Time to Die",
        overview: "Bond has left active service and is enjoying a tranquil life in Jamaica. His peace is short-lived when his old friend Felix Leiter from the CIA turns up asking for help.",
        poster_path: "/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg",
        vote_average: 7.3,
        release_date: "2021-10-08"
      }
    ];

    // Cache the mock data
    moviesCache.set(cacheKey, {
      data: mockMovies,
      timestamp: Date.now()
    });

    res.json(mockMovies);

  } catch (error) {
    console.error('Movies API error:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 
