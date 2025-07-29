# Personalised Dashboard with NextAuth Authentication

A beautiful, personalized dashboard with secure authentication using NextAuth.js and a secure API server.

## Features

- ✨ **Secure Authentication** with NextAuth.js
- 🔒 **Protected API Endpoints** with JWT tokens
- 📰 **News Feed** with category filtering
- 🎬 **Movie Recommendations** from TMDB
- 🌙 **Dark Mode** with persistent preferences
- ❤️ **Favorites System** with drag-and-drop reordering
- 📱 **Responsive Design** with modern UI
- ⚡ **Real-time Updates** with Redux state management

## Tech Stack

### Frontend
- **Next.js 14** - React framework
- **NextAuth.js** - Authentication
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

### Backend
- **Express.js** - API server
- **MongoDB** - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## Quick Start

### 1. Install Dependencies

```bash
# Frontend dependencies
cd personalised-dashboard
npm install

# Backend dependencies
cd server
npm install
```

### 2. Environment Setup

Create `.env.local` in the frontend directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-secret-key-here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Create `.env` in the server directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/dashboard

# JWT Secret
JWT_SECRET=your-jwt-secret-here

# Client URL
CLIENT_URL=http://localhost:3002

# API Keys
NEWS_API_KEY=your-news-api-key
TMDB_API_KEY=your-tmdb-api-key
```

### 3. Start the Servers

```bash
# Start the backend server (in server directory)
cd server
npm run dev

# Start the frontend (in another terminal)
cd personalised-dashboard
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## Authentication Flow

1. **Registration**: Users can create accounts with email/password
2. **Login**: Secure authentication with NextAuth.js
3. **Session Management**: Automatic token handling
4. **Protected Routes**: API endpoints require authentication
5. **Logout**: Secure session termination

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Data
- `GET /api/user/preferences` - Get user preferences
- `PUT /api/user/preferences` - Update user preferences

### Content (Protected)
- `GET /api/news/:category` - Get news by category
- `GET /api/movies` - Get popular movies

## Security Features

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcryptjs for password security
- ✅ **Rate Limiting** - Prevent abuse
- ✅ **CORS Protection** - Cross-origin security
- ✅ **Helmet Security** - HTTP headers protection
- ✅ **API Key Protection** - Keys stored server-side only

## Dashboard Features

### News Feed
- Real-time news from NewsAPI
- Category filtering (general, technology, sports, etc.)
- "View More" functionality
- Dark mode support

### Movie Recommendations
- Popular movies from TMDB
- Movie ratings and descriptions
- "View More" functionality
- Responsive grid layout

### Preferences Panel
- Category selection
- Dark mode toggle
- Persistent settings

### Favorites System
- Save articles and movies
- Drag-and-drop reordering
- Persistent storage

## Development

### Adding New Features

1. **Frontend Components**: Add to `src/components/`
2. **API Routes**: Add to `server/index.js`
3. **State Management**: Add to Redux slices
4. **Styling**: Use Tailwind CSS classes

### Testing Authentication

```bash
# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test protected endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/news/general
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   lsof -ti:5000 | xargs kill -9
   ```

2. **MongoDB Connection**
   - Ensure MongoDB is running
   - Check connection string in `.env`

3. **Authentication Errors**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Clear browser localStorage

4. **API Key Issues**
   - Verify API keys in server `.env`
   - Check API quotas

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
