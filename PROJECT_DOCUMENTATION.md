# Personalised Dashboard - Project Documentation

## 📋 Project Overview

**Personalised Dashboard** is a modern, full-stack web application that provides users with a personalized news and movies dashboard. Built with Next.js, React, and Node.js, it features authentication, content aggregation, user preferences, and a responsive design.

### 🎯 Key Features
- **User Authentication** - Secure login/registration with NextAuth.js
- **News Feed** - Real-time news aggregation from multiple sources
- **Movie Recommendations** - Personalized movie suggestions via TMDB API
- **Favorites System** - Save and organize favorite content
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works seamlessly on all devices
- **Drag & Drop** - Interactive content organization
- **Search Functionality** - Find content quickly
- **User Preferences** - Customizable dashboard settings

## 🏗️ Architecture

### Frontend Stack
- **Next.js 15.4.4** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **NextAuth.js** - Authentication
- **@dnd-kit** - Drag and drop functionality

### Backend Stack
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### External APIs
- **News API** - News content aggregation
- **TMDB API** - Movie data and recommendations
- **MongoDB Atlas** - Cloud database hosting

## 📁 Project Structure

```
Personalised-Dashboard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── auth/          # NextAuth.js routes
│   │   ├── auth/              # Authentication pages
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable React components
│   ├── features/              # Feature-based modules
│   │   ├── contentFeed/       # News and movies feeds
│   │   ├── favorites/         # Favorites management
│   │   └── preferences/       # User preferences
│   ├── store/                 # Redux store configuration
│   ├── services/              # API services
│   ├── utils/                 # Utility functions
│   └── types/                 # TypeScript type definitions
├── server/                    # Backend Express server
│   ├── index.js              # Main server file
│   ├── package.json          # Backend dependencies
│   └── env.example          # Environment template
├── cypress/                  # E2E testing
├── public/                   # Static assets
└── docs/                     # Documentation
```

## 🔐 Authentication System

### NextAuth.js Integration
- **Credentials Provider** - Email/password authentication
- **JWT Strategy** - Token-based sessions
- **Backend Integration** - Custom API authentication
- **Session Management** - Secure session handling

### Security Features
- **Password Hashing** - bcryptjs with salt rounds
- **JWT Tokens** - Secure token generation and validation
- **CORS Protection** - Cross-origin request handling
- **Rate Limiting** - API request throttling
- **Input Validation** - Server-side validation
- **Error Handling** - Comprehensive error management

### Authentication Flow
1. User enters credentials on `/auth/signin`
2. NextAuth.js calls backend API for validation
3. Backend verifies credentials and returns JWT token
4. Frontend stores token and redirects to dashboard
5. Protected routes check authentication status

## 📰 Content Management

### News Feed
- **Real-time Updates** - Latest news from multiple sources
- **Category Filtering** - Filter by news categories
- **Search Functionality** - Find specific news articles
- **Responsive Cards** - Beautiful news presentation
- **External Links** - Direct links to full articles

### Movie Recommendations
- **TMDB Integration** - Access to comprehensive movie database
- **Personalized Suggestions** - Based on user preferences
- **Movie Details** - Rich movie information
- **Rating System** - User ratings and reviews
- **Trailer Links** - Direct access to movie trailers

### Favorites System
- **Save Content** - Add articles and movies to favorites
- **Drag & Drop** - Reorder favorites with @dnd-kit
- **Persistent Storage** - Favorites saved in Redux store
- **Quick Access** - Dedicated favorites section
- **Content Organization** - Categorize saved content

## 🎨 User Interface

### Design System
- **Modern UI** - Clean, professional design
- **Responsive Layout** - Works on all screen sizes
- **Dark Mode** - Toggle between light and dark themes
- **Smooth Animations** - CSS transitions and transforms
- **Accessibility** - WCAG compliant design

### Components
- **DashboardLayout** - Main application layout
- **LoginForm** - Authentication forms
- **NewsFeed** - News content display
- **MoviesFeed** - Movie recommendations
- **PreferencesPanel** - User settings
- **DarkModeSync** - Theme synchronization

### Navigation
- **Sidebar Navigation** - Quick access to sections
- **Search Bar** - Global content search
- **User Menu** - Account management
- **Mobile Responsive** - Touch-friendly navigation

## 🧪 Testing Strategy

### Test Coverage
- **Unit Tests** - Jest for component testing
- **Integration Tests** - Redux store testing
- **E2E Tests** - Cypress for user workflows
- **API Tests** - Backend endpoint testing

### Test Structure
```
├── __tests__/
│   ├── components/           # Component tests
│   ├── features/            # Feature tests
│   └── store/              # Redux tests
├── cypress/
│   ├── e2e/               # E2E test scenarios
│   ├── fixtures/          # Test data
│   └── support/           # Custom commands
```

### Testing Tools
- **Jest** - Unit and integration testing
- **@testing-library/react** - React component testing
- **Cypress** - End-to-end testing
- **MSW** - API mocking

## 🚀 Deployment

### Frontend Deployment
- **Vercel** - Next.js hosting platform
- **Environment Variables** - Secure configuration
- **Build Optimization** - Production-ready builds
- **CDN** - Global content delivery

### Backend Deployment
- **Railway** - Node.js hosting platform
- **MongoDB Atlas** - Cloud database
- **Environment Configuration** - Secure secrets management
- **API Endpoints** - RESTful API design

### Environment Setup
```bash
# Frontend Environment
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
BACKEND_URL=http://localhost:5000

# Backend Environment
MONGODB_URI=your-mongodb-connection-string
TMDB_API_KEY=your-tmdb-api-key
JWT_SECRET=your-jwt-secret
PORT=5000
```

## 📊 Performance Optimization

### Frontend Optimization
- **Code Splitting** - Lazy loading of components
- **Image Optimization** - Next.js image optimization
- **Bundle Analysis** - Webpack bundle optimization
- **Caching** - Browser and CDN caching
- **Minification** - Code and asset compression

### Backend Optimization
- **Database Indexing** - MongoDB query optimization
- **Connection Pooling** - Efficient database connections
- **Rate Limiting** - API request throttling
- **Caching** - Redis for session storage
- **Compression** - Gzip response compression

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account
- News API key
- TMDB API key

### Installation
```bash
# Clone repository
git clone https://github.com/akhand998/Personalised-Dashboard.git
cd Personalised-Dashboard

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Set up environment variables
cp env.example env.local
cp server/env.example server/config.env

# Start development servers
npm run dev          # Frontend (port 3000)
cd server && npm run dev  # Backend (port 5000)
```

### Available Scripts
```bash
# Frontend Scripts
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint checking
npm run test         # Run tests
npm run test:watch   # Watch mode tests
npm run test:coverage # Coverage report

# Backend Scripts
cd server
npm run dev          # Development server
npm run start        # Production server
npm run test         # Run tests
```

## 🛠️ API Documentation

### Authentication Endpoints
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User authentication
GET  /api/user/preferences # Get user preferences
PUT  /api/user/preferences # Update user preferences
```

### Content Endpoints
```
GET /api/news/:category    # Get news by category
GET /api/movies           # Get movie recommendations
GET /api/health           # Health check endpoint
```

### Request/Response Examples
```json
// Registration Request
{
  "email": "user@example.com",
  "password": "securepassword123"
}

// Registration Response
{
  "message": "User created successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "preferences": {
      "categories": ["general"],
      "darkMode": false,
      "favorites": []
    }
  }
}
```

## 🔒 Security Considerations

### Data Protection
- **Password Hashing** - bcryptjs with salt rounds
- **JWT Security** - Secure token generation
- **Input Validation** - Server-side validation
- **SQL Injection** - MongoDB query sanitization
- **XSS Protection** - Content Security Policy

### API Security
- **CORS Configuration** - Controlled cross-origin access
- **Rate Limiting** - Request throttling
- **Authentication** - JWT token validation
- **Error Handling** - Secure error responses
- **Logging** - Security event logging

### Environment Security
- **Secret Management** - Environment variables
- **Git Protection** - .gitignore for sensitive files
- **Deployment Security** - Platform-specific security
- **SSL/TLS** - HTTPS encryption

## 📈 Future Enhancements

### Planned Features
- **Real-time Notifications** - WebSocket integration
- **Social Features** - User sharing and comments
- **Advanced Search** - Elasticsearch integration
- **Content Curation** - AI-powered recommendations
- **Mobile App** - React Native application
- **Offline Support** - Service Worker caching
- **Analytics Dashboard** - User behavior tracking
- **Multi-language Support** - Internationalization

### Technical Improvements
- **GraphQL API** - More efficient data fetching
- **Microservices** - Scalable architecture
- **Docker Containerization** - Easy deployment
- **CI/CD Pipeline** - Automated testing and deployment
- **Performance Monitoring** - Real-time metrics
- **Error Tracking** - Comprehensive error monitoring

## 🤝 Contributing

### Development Guidelines
- **Code Style** - ESLint and Prettier configuration
- **TypeScript** - Strict type checking
- **Testing** - Comprehensive test coverage
- **Documentation** - Clear code documentation
- **Git Workflow** - Feature branch development

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Update documentation
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Lead Developer** - Akhand
- **UI/UX Design** - Modern responsive design
- **Testing** - Comprehensive test suite
- **Documentation** - Complete project documentation

## 📞 Support

For support and questions:
- **GitHub Issues** - Report bugs and feature requests
- **Documentation** - Comprehensive setup guides
- **Testing** - Automated test suite
- **Security** - Responsible disclosure policy

---

**Last Updated**: July 2024  
**Version**: 1.0.0  
**Status**: Production Ready 