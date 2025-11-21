# SST Announcement System

A comprehensive announcement management system for SCALER School of Technology, featuring Google OAuth authentication, real-time announcements, analytics dashboard, and admin controls.

## 🎯 Overview

The SST Announcement System is a full-stack web application designed to manage and display college announcements. It features a modern React frontend with SCALER branding and a robust Node.js/TypeScript backend API.

## ✨ Features

### Core Features
- **Google OAuth Authentication** - Secure login with Google accounts
- **Announcement Management** - Create, read, update, and delete announcements
- **Category System** - Organize announcements by categories (College, Tech Events, Tech Workshops, Academic, Sports, Emergency)
- **Scheduling** - Schedule announcements for future publication
- **Expiry Management** - Set expiry dates with visual indicators for expired announcements
- **Search & Filter** - Search announcements by title/description and filter by category

### Admin Features
- **User Management** - Manage users and admin privileges
- **Analytics Dashboard** - Track announcement views, engagement, and user activity
- **Top Announcements** - View most viewed announcements with sorting options
- **Engagement Tracking** - Monitor user interactions with announcements

### UI/UX Features
- **SCALER Branding** - Professional login page with SCALER School of Technology branding
- **Dark Theme** - Modern dark mode design with gradient backgrounds
- **Glassmorphism** - Frosted glass effects on cards and panels
- **Responsive Design** - Mobile-first responsive layout
- **Animations** - Smooth transitions and hover effects
- **Loading States** - Skeleton loaders and loading indicators

## 🏗️ Architecture

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui + Radix UI
- **State Management**: React Context API
- **Port**: 3000 (default)

### Backend
- **Framework**: Express 5 + TypeScript
- **Database**: PostgreSQL
- **Authentication**: Passport.js (Google OAuth)
- **Session**: Express Session
- **Port**: 8080 (default)

## 📁 Project Structure

```
sst-announcement-system/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── assets/       # Images and static assets
│   │   ├── components/   # React components
│   │   ├── contexts/     # React Context providers
│   │   ├── services/     # API service layer
│   │   ├── config/       # Configuration files
│   │   ├── App.tsx       # Main app component
│   │   ├── Dashboard.tsx # Dashboard page
│   │   ├── AllAnnouncements.tsx
│   │   └── Login.tsx     # Login page
│   ├── package.json
│   └── README.md
├── backend/              # Node.js backend API
│   ├── src/
│   │   ├── api/          # API route handlers
│   │   ├── routes/       # Express routes
│   │   ├── model/        # Database models
│   │   ├── config/       # Configuration files
│   │   ├── middleware/   # Express middleware
│   │   └── index.ts      # Server entry point
│   ├── package.json
│   └── README.md
├── start_app.bat         # Windows script to start both servers
├── DEPLOYMENT_SWITCH.md  # Deployment configuration guide
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sst-announcement-system
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Create .env file with your configuration
   # Edit .env with your database and OAuth credentials
   ```

3. **Set up Frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env  # Create .env file
   # Edit .env with your configuration
   ```

4. **Start the Application**

   **Windows:**
   ```bash
   # From root directory
   start_app.bat
   ```

   **Manual (Mac/Linux):**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## 📚 Documentation

- [Backend README](backend/README.md) - Backend API documentation
- [Frontend README](frontend/README.md) - Frontend application documentation
- [Deployment Guide](DEPLOYMENT_SWITCH.md) - Deployment configuration guide

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DB_USER=your_db_username
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_db_password
DB_PORT=5432

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8080/auth/google/callback

# Session
SESSION_SECRET=your_super_secret_session_key

# Server
PORT=8080
DEPLOYMENT=local
```

#### Frontend (.env)
```env
VITE_DEPLOYMENT=local
# Or override directly:
# VITE_BACKEND_URL=http://localhost:8080
```

### Deployment Configuration

The system supports easy switching between local and production environments:

- **Local**: `DEPLOYMENT=local` (default)
- **Production**: `DEPLOYMENT=production`

See [DEPLOYMENT_SWITCH.md](DEPLOYMENT_SWITCH.md) for detailed configuration.

## 🎨 Features in Detail

### Announcement Categories
- **College** - General college announcements
- **Tech Events** - Technology-related events
- **Tech Workshops** - Technical workshops and sessions
- **Academic** - Academic-related announcements
- **Sports** - Sports and athletic events
- **Emergency** - Urgent announcements

### Admin Capabilities
- Create, edit, and delete announcements
- Schedule announcements for future publication
- Set reminders for important announcements
- View analytics and engagement metrics
- Manage users and admin privileges
- Search and filter users by email

### User Features
- View all announcements
- Filter by category
- Search announcements
- Expand/collapse announcement details
- Automatic engagement tracking

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:
- **users** - User accounts and authentication
- **announcements** - Announcement data
- **engagements** - User engagement tracking

See [Backend README](backend/README.md) for detailed schema information.

## 🔐 Security

- Google OAuth 2.0 authentication
- Secure session management
- CORS configuration
- SQL injection prevention (parameterized queries)
- Environment variable protection
- HTTPS recommended for production

## 🚀 Deployment

### Production URLs
- Frontend: `https://sst-announcement.vercel.app`
- Backend: `https://sst-announcement.onrender.com`

### Deployment Steps
1. Set `DEPLOYMENT=production` in both `.env` files
2. Configure production database credentials
3. Update Google OAuth redirect URIs
4. Deploy backend to Render (or similar)
5. Deploy frontend to Vercel (or similar)

See [DEPLOYMENT_SWITCH.md](DEPLOYMENT_SWITCH.md) for detailed instructions.

## 🛠️ Development

### Tech Stack

**Frontend:**
- React 19
- TypeScript
- Vite 7
- Tailwind CSS v4
- shadcn/ui
- Radix UI

**Backend:**
- Node.js
- Express 5
- TypeScript
- PostgreSQL
- Passport.js
- Express Session

### Scripts

**Backend:**
```bash
npm run dev    # Development server
npm run build  # Build for production
npm start      # Production server
```

**Frontend:**
```bash
npm run dev      # Development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📊 API Endpoints

### Public
- `GET /api/announcements/` - Get all announcements
- `GET /api/announcements/:id` - Get announcement by ID
- `POST /api/announcements/:id/engagement` - Track engagement

### Authenticated
- `GET /profile` - Get user profile
- `GET /auth/logout` - Logout
- `POST /auth/change-email` - Change email

### Admin
- `POST /api/announcements/` - Create announcement
- `PATCH /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id/admin-status` - Update admin status
- `GET /api/analytics/stats` - Get analytics

See [Backend README](backend/README.md) for complete API documentation.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **OAuth Not Working**
   - Verify Google OAuth credentials
   - Check callback URLs match Google Console
   - Ensure frontend and backend URLs are correct

3. **Port Already in Use**
   - Change ports in `.env` files
   - Kill processes using the ports

4. **CORS Errors**
   - Verify frontend URL in backend CORS config
   - Check `DEPLOYMENT` environment variables match

## 📝 License

ISC License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check the documentation in `backend/README.md` and `frontend/README.md`
- Review the deployment guide in `DEPLOYMENT_SWITCH.md`

## 🙏 Acknowledgments

- SCALER School of Technology for branding and inspiration
- shadcn/ui for component library
- Radix UI for accessible primitives
- All open-source contributors

---

**Built with ❤️ for SCALER School of Technology**

