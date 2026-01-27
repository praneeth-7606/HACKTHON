# 🏛️ CivicConnect - Bridging Citizens and Governance

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

CivicConnect is a comprehensive full-stack web application designed to revolutionize civic engagement by empowering citizens to directly interact with their local government. The platform enables users to report community concerns, track policy changes, participate in public discourse, and leverage AI-powered insights for better governance.

---

## 🎥 Demo Video

[![Watch Demo Video](https://img.shields.io/badge/Watch-Demo%20Video-red?style=for-the-badge&logo=google-drive)](https://drive.google.com/file/d/1JbJlX18sVAe_7Vw-ypwcGVW9QUdEeo5x/view?usp=sharing)

👉 **[Click here to watch the full demo video](https://drive.google.com/file/d/1JbJlX18sVAe_7Vw-ypwcGVW9QUdEeo5x/view?usp=sharing)**

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Backend Documentation](#-backend-documentation)
- [Frontend Documentation](#-frontend-documentation)
- [Database Models](#-database-models)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)

---

## ✨ Features

### 👥 For Citizens
- **Concern Reporting**: Report civic issues with images, location (map integration), and detailed descriptions
- **Policy Tracking**: View, search, and filter government policies by category and status
- **Community Engagement**: Upvote concerns, comment on issues, and track resolution progress
- **AI Chatbot**: Ask questions about policies and get instant AI-powered responses
- **Interactive Dashboard**: Visualize your reported concerns and community statistics
- **Profile Management**: Update personal information and track your civic contributions

### 👨‍💼 For Administrators
- **Policy Management**: Create, edit, and manage policies with PDF uploads and rich text descriptions
- **Concern Moderation**: Review, update status, and respond to citizen concerns
- **Analytics Dashboard**: View comprehensive statistics on citizen engagement and policy performance
- **Budget Planning**: Manage and visualize municipal budgets
- **Idea Management**: Review and evaluate citizen-submitted ideas for civic improvements
- **Settings**: Configure platform parameters and administrative preferences

### 🤖 AI-Powered Features
- **Policy Summarization**: Automatically generate concise summaries of complex policy documents
- **RAG Chatbot**: Context-aware chatbot that answers questions based on policy content
- **Smart Caching**: Improved performance with intelligent response caching

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication (Access & Refresh tokens) |
| **bcryptjs** | Password hashing |
| **Multer** | File upload handling |
| **Google Gemini AI** | AI-powered features (Chatbot & Summarization) |
| **LangChain** | AI orchestration and RAG implementation |
| **pdf-parse** | PDF text extraction |
| **express-validator** | API validation |
| **express-rate-limit** | API rate limiting |
| **cookie-parser** | Cookie handling |
| **cors** | Cross-origin resource sharing |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **Vite** | Build tool and dev server |
| **React Router DOM** | Client-side routing |
| **Axios** | HTTP client |
| **Framer Motion** | Animations |
| **Leaflet & React-Leaflet** | Interactive maps |
| **React Icons** | Icon library |
| **React Hot Toast** | Toast notifications |
| **Recharts** | Data visualization |
| **Headless UI** | Unstyled UI components |
| **Heroicons** | Icon components |
| **Tailwind Merge** | Utility class merging |

---

## 📦 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - Option 1: Local MongoDB installation
  - Option 2: MongoDB Atlas (Cloud database)
- **npm** or **yarn** (comes with Node.js)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository_url>
cd civicconnect
```

### 2. Backend Setup (Server)

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

#### Create Environment File

Create a `.env` file in the `server` directory:

```env
# Environment Variables
NODE_ENV=development
PORT=5000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/civicconnect

# JWT Secrets (CHANGE THESE IN PRODUCTION!)
JWT_ACCESS_SECRET=your_strong_access_secret_key_here
JWT_REFRESH_SECRET=your_strong_refresh_secret_key_here

# JWT Expiration
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Google Gemini API Key
GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key
```

#### Obtain Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and paste it in your `.env` file

### 3. Frontend Setup (Client)

Navigate to the client directory and install dependencies:

```bash
cd ../client
npm install
```

The client uses Vite's proxy configuration, so no additional environment file is needed for local development.

### 4. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:**
- Update `MONGODB_URI` in server `.env` with your Atlas connection string

---

## 🖥️ Backend Documentation

### Project Structure

```
server/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/
│   ├── authController.js     # Authentication logic (login, register, profile)
│   ├── policyController.js   # Policy CRUD operations
│   ├── concernController.js  # Concern management
│   ├── commentController.js  # Comment handling
│   ├── aiController.js       # AI features (chatbot, summarization)
│   └── ideaController.js     # Citizen ideas management
├── middleware/
│   ├── authMiddleware.js     # JWT verification & role checks
│   ├── roleMiddleware.js     # Role-based access control
│   └── uploadMiddleware.js   # Multer file upload configuration
├── models/
│   ├── User.js              # User schema
│   ├── Policy.js            # Policy schema
│   ├── Concern.js           # Concern schema
│   ├── Comment.js           # Comment schema
│   └── Notification.js      # Notification schema
├── routes/
│   ├── authRoutes.js        # /api/auth routes
│   ├── policyRoutes.js      # /api/policies routes
│   ├── concernRoutes.js     # /api/concerns routes
│   ├── commentRoutes.js     # /api/comments routes
│   ├── aiRoutes.js          # /api/ai routes
│   └── userRoutes.js        # /api/users routes
├── utils/
│   └── pdfUtils.js          # PDF processing utilities
├── uploads/                 # File storage directory
├── .env                     # Environment variables
├── package.json
└── server.js                # Application entry point
```

### Key Features

#### Authentication & Authorization
- **JWT-based authentication** with access and refresh tokens
- **Role-based access control** (Citizen, Admin)
- **Password hashing** with bcryptjs
- **Secure cookie handling**

#### File Upload System
- **Multer middleware** for handling multipart/form-data
- **Support for images and PDFs**
- **File validation** (size limits, file types)
- **Organized storage** in `/uploads` directory

#### AI Integration
- **Google Gemini AI** for natural language processing
- **LangChain** for RAG (Retrieval-Augmented Generation)
- **Caching mechanism** for improved performance
- **PDF text extraction** for policy analysis

#### Security Features
- **Rate limiting** to prevent abuse
- **CORS** configuration for cross-origin requests
- **Input validation** with express-validator
- **SQL injection** protection via Mongoose
- **XSS protection** through proper data sanitization

---

## 🎨 Frontend Documentation

### Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx           # Login form component
│   │   │   ├── Register.jsx        # Registration form
│   │   │   └── ProtectedRoute.jsx  # Route protection wrapper
│   │   ├── layout/
│   │   │   ├── Navbar.jsx          # Top navigation bar
│   │   │   └── Sidebar.jsx         # Side navigation menu
│   │   └── ui/
│   │       └── Notification.jsx    # Toast notifications
│   ├── context/
│   │   └── AuthContext.jsx         # Global auth state management
│   ├── hooks/
│   │   └── useAuth.js              # Custom auth hook
│   ├── pages/
│   │   ├── Home.jsx                # Landing page
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx  # Admin overview
│   │   │   ├── AdminStats.jsx      # Analytics & statistics
│   │   │   ├── CreatePolicy.jsx    # Policy creation form
│   │   │   ├── EditPolicy.jsx      # Policy editing
│   │   │   ├── PolicyList.jsx      # List of all policies
│   │   │   ├── ManageConcerns.jsx  # Concern moderation
│   │   │   ├── ManageIdeas.jsx     # Idea management
│   │   │   ├── BudgetPlanner.jsx   # Budget visualization
│   │   │   └── Settings.jsx        # Admin settings
│   │   └── citizen/
│   │       ├── CitizenDashboard.jsx  # Citizen overview
│   │       ├── ConcernList.jsx       # View all concerns
│   │       ├── ReportConcern.jsx     # Report new concern
│   │       ├── ConcernMap.jsx        # Map view of concerns
│   │       ├── Policies.jsx          # View policies
│   │       ├── PolicyDetail.jsx      # Single policy view with AI chat
│   │       └── Profile.jsx           # User profile management
│   ├── services/
│   │   ├── api.js              # Axios instance with interceptors
│   │   ├── authAPI.js          # Auth API calls
│   │   ├── policyAPI.js        # Policy API calls
│   │   └── concernAPI.js       # Concern API calls
│   ├── styles/
│   │   └── index.css           # Global styles
│   ├── App.jsx                 # Main app component with routing
│   └── main.jsx                # React entry point
├── public/
│   └── vite.svg
├── index.html
├── vite.config.js              # Vite configuration
└── package.json
```

### Key Features

#### Routing
- **Protected Routes** for authenticated users
- **Role-based routing** (Admin vs Citizen dashboards)
- **Lazy loading** for code splitting

#### State Management
- **AuthContext** for global authentication state
- **Local state** with React hooks
- **Persistent login** with localStorage

#### API Integration
- **Axios interceptors** for automatic token injection
- **Error handling** with toast notifications
- **Request/response transformation**

#### UI/UX
- **Responsive design** for all screen sizes
- **Smooth animations** with Framer Motion
- **Interactive maps** using Leaflet
- **Data visualization** with Recharts
- **Modern glassmorphism** design aesthetics

---

## 🗄️ Database Models

### User Model
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (enum: ['citizen', 'admin'], default: 'citizen'),
  avatar: String (URL),
  phone: String,
  address: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Policy Model
```javascript
{
  title: String (required, 10-200 chars),
  description: String (required, min 50 chars),
  category: String (enum: [Health, Education, Infrastructure, etc.]),
  status: String (enum: ['draft', 'under-review', 'active', 'archived']),
  documentUrl: String,
  pdfFilePath: String,
  pdfContent: String (extracted text),
  effectiveDate: Date,
  expiryDate: Date,
  tags: [String],
  supportCount: Number (default: 0),
  supporters: [ObjectId -> User],
  createdBy: ObjectId -> User (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Concern Model
```javascript
{
  title: String (required, max 100 chars),
  description: String (required, max 1000 chars),
  category: String (enum: [Infrastructure, Environment, Safety, etc.]),
  status: String (enum: ['pending', 'acknowledged', 'in-progress', 'resolved', 'closed']),
  priority: String (enum: ['low', 'medium', 'high', 'urgent']),
  imageUrl: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  address: String,
  upvotes: [ObjectId -> User],
  upvoteCount: Number (default: 0),
  comments: [{
    user: ObjectId -> User,
    text: String,
    createdAt: Date
  }],
  user: ObjectId -> User (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model
```javascript
{
  text: String (required, max 500 chars),
  concern: ObjectId -> Concern (required),
  user: ObjectId -> User (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Model
```javascript
{
  user: ObjectId -> User (required),
  type: String (enum: ['concern_update', 'policy_update', 'comment', etc.]),
  title: String (required),
  message: String (required),
  link: String,
  isRead: Boolean (default: false),
  createdAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login user |
| POST | `/logout` | Private | Logout user |
| POST | `/refresh-token` | Public | Refresh access token |
| GET | `/profile` | Private | Get user profile |
| PUT | `/profile` | Private | Update user profile |

### Policy Routes (`/api/policies`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all policies (with filters) |
| GET | `/:id` | Public | Get single policy |
| POST | `/` | Admin | Create policy (with PDF upload) |
| PUT | `/:id` | Admin | Update policy |
| DELETE | `/:id` | Admin | Delete policy |
| POST | `/:id/support` | Private | Support a policy |
| GET | `/admin/stats` | Admin | Get policy statistics |

### Concern Routes (`/api/concerns`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all concerns (with filters) |
| GET | `/:id` | Public | Get single concern |
| GET | `/my/all` | Private | Get user's concerns |
| GET | `/citizen/stats` | Private | Get citizen statistics |
| POST | `/` | Private | Create concern (with image upload) |
| PUT | `/:id/status` | Admin | Update concern status |
| PUT | `/:id/upvote` | Private | Upvote a concern |
| POST | `/:id/comments` | Private | Add comment to concern |
| DELETE | `/:id` | Private | Delete own concern |

### Comment Routes (`/api/comments`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/:concernId` | Private | Get comments for a concern |
| POST | `/:concernId` | Private | Add comment |
| DELETE | `/item/:id` | Private | Delete own comment |

### AI Routes (`/api/ai`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/chat` | Private | Chat with policy AI |
| POST | `/summarize` | Private | Summarize policy content |

### User Routes (`/api/users`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Admin | Get all users |
| GET | `/:id` | Admin | Get single user |
| PUT | `/:id/role` | Admin | Update user role |

---

## 🔐 Environment Variables

### Server (.env)

```env
# Server Configuration
NODE_ENV=development              # development | production
PORT=5000                         # Server port

# Database
MONGODB_URI=mongodb://localhost:27017/civicconnect

# JWT Configuration
JWT_ACCESS_SECRET=<strong-secret-key>
JWT_REFRESH_SECRET=<strong-secret-key>
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# CORS
CLIENT_URL=http://localhost:5173

# AI Services
GOOGLE_GEMINI_API_KEY=<your-api-key>
```

### Client (.env - Optional)

```env
VITE_API_URL=/api
```

---

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server runs at: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Client runs at: `http://localhost:5173`

### Production Build

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

### Seeding Database

```bash
cd server

# Seed policies
npm run seed:policies

# Seed new policies
npm run seed:new-policies

# Seed ideas
npm run seed:ideas
```

---

## 🧪 Testing the Application

### Default Admin Account
After seeding, you can create an admin account by:
1. Registering a new user
2. Manually updating the role in MongoDB to 'admin'

### API Testing
Use tools like:
- **Postman** - [Download](https://www.postman.com/downloads/)
- **Thunder Client** (VS Code extension)
- **curl** (command line)

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Authors

DevVoid Hackathon Team

---

## 🙏 Acknowledgments

- Google Gemini AI for intelligent features
- MongoDB for robust database solutions
- React community for excellent tooling
- Leaflet for mapping capabilities

---

**CivicConnect** - Empowering Communities Through Technology 🚀
