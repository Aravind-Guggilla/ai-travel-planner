# AI Travel Planner

🚀 Live Demo: https://ai-travel-planner-ten-pied.vercel.app/login

AI Travel Planner is a full-stack web application that helps users create personalized travel plans using AI. Users can create trips, generate day-wise itineraries, estimate budgets, get hotel recommendations, and regenerate specific travel days based on custom preferences.

## Live Links

### Frontend
https://ai-travel-planner-ten-pied.vercel.app/login

### Backend API
https://your-render-backend-url.onrender.com

---

## Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes

### Trip Management
- Create Trip
- View All Trips
- View Trip Details
- Update Trip
- Delete Trip

### AI Features
- Generate AI Travel Itinerary
- Budget Estimation
- Hotel Recommendations
- Regenerate Specific Day Plan

## Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- Google Gemini AI

### Database
- PostgreSQL (Neon)

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

## Environment Variables

### Backend

```env
PORT=5000
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_postgresql_connection_string
```

### Frontend

```env
VITE_API_URL=https://your-render-backend-url.onrender.com
```

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login

### Trips
- POST /api/trips/create
- GET /api/my-trips
- GET /api/trips/:tripId
- PUT /api/trips/:tripId
- DELETE /api/trips/:tripId

### AI Features
- POST /api/trips/:tripId/generate
- POST /api/trips/:tripId/regenerate-day

## Author

Aravind Guggilla