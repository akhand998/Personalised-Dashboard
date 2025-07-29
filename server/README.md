# Secure Dashboard API Server

A secure Express.js server with authentication, rate limiting, and API handling for the personalized dashboard.

## 🚀 Features

- **🔐 JWT Authentication** - Secure user registration and login
- **🛡️ Security Middleware** - Helmet, CORS, rate limiting
- **💾 MongoDB Integration** - User data and preferences storage
- **📰 News API Proxy** - Cached news fetching with authentication
- **🎬 Movies API Proxy** - Cached movie data with authentication
- **⚡ Performance** - Response caching and optimization
- **🔒 Input Validation** - Secure data handling

## 📋 Prerequisites

- Node.js >= 16.0.0
- MongoDB (local or cloud)
- News API key (https://newsapi.org/)
- TMDB API key (https://www.themoviedb.org/)

## 🛠️ Installation

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp config.env .env
   ```
   Edit `.env` with your actual values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/dashboard
   JWT_SECRET=your-super-secret-jwt-key
   NEWS_API_KEY=your-news-api-key
   TMDB_API_KEY=your-tmdb-api-key
   CLIENT_URL=http://localhost:3000
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Preferences
- `GET /api/user/preferences` - Get user preferences
- `PUT /api/user/preferences` - Update user preferences

### Content APIs
- `GET /api/news/:category` - Get news by category
- `GET /api/movies` - Get popular movies

### Health Check
- `GET /api/health` - Server health status

## 🔐 Security Features

### Rate Limiting
- 100 requests per 15 minutes per IP
- Configurable via environment variables

### JWT Authentication
- 24-hour token expiration
- Secure password hashing with bcrypt
- Token-based API access

### Input Validation
- Email and password validation
- Request size limits (10MB)
- CORS protection

### Data Protection
- Password hashing with bcrypt
- Secure headers with Helmet
- MongoDB injection protection

## 📊 Database Schema

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  preferences: {
    categories: [String],
    darkMode: Boolean,
    favorites: [Object]
  },
  createdAt: Date
}
```

## 🚀 Usage Examples

### Register a new user
```javascript
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword123'
  })
});
```

### Login
```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword123'
  })
});
```

### Get news (authenticated)
```javascript
const response = await fetch('http://localhost:5000/api/news/technology', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});
```

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NEWS_API_KEY` - News API key
- `TMDB_API_KEY` - TMDB API key
- `CLIENT_URL` - Frontend URL for CORS

### Rate Limiting
- `RATE_LIMIT_WINDOW_MS` - Time window (default: 15 minutes)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 100)

## 🧪 Testing

```bash
npm test
```

## 📝 Logs

The server logs important events:
- Database connections
- Authentication attempts
- API errors
- Rate limiting violations

## 🔄 Caching

- News API responses cached for 5 minutes
- Movies API responses cached for 5 minutes
- Reduces external API calls and improves performance

## 🚨 Error Handling

- Comprehensive error responses
- Detailed logging for debugging
- Graceful handling of external API failures

## 🔒 Production Considerations

1. **Change JWT_SECRET** to a strong, unique key
2. **Use HTTPS** in production
3. **Set up proper MongoDB** with authentication
4. **Configure CORS** for your domain
5. **Set up monitoring** and logging
6. **Use environment-specific** configurations

## 📞 Support

For issues or questions:
1. Check the logs for error details
2. Verify environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check API keys are valid and have proper permissions 