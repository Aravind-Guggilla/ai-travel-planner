# AI Travel Planner Backend

## Overview

AI Travel Planner Backend is a REST API built with Node.js and Express.js that allows users to create trips, generate AI-powered travel itineraries, estimate trip budgets, receive hotel recommendations, and modify travel plans dynamically.

## Tech Stack

* Node.js
* Express.js
* PostgreSQL (Neon)
* JWT Authentication
* Gemini AI API

## Features

* User Registration & Login
* JWT-based Authentication
* Trip CRUD Operations
* AI Itinerary Generation
* Budget Estimation
* Hotel Recommendations
* Regenerate Specific Day in Itinerary
* User Data Isolation

## Environment Variables

Create a `.env` file:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_postgresql_connection_string
```

## Installation

```bash
npm install
npm run dev
```

## Production

```bash
npm start
```

## API Endpoints

### Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`

### Trips

* POST `/api/trips/create`
* GET `/api/trips`
* GET `/api/trips/:tripId`
* PUT `/api/trips/:tripId`
* DELETE `/api/trips/:tripId`

### AI Features

* POST `/api/trips/:tripId/generate`
* POST `/api/trips/:tripId/regenerate-day`

## Architecture

```text
Client
   ↓
Express API
   ↓
JWT Authentication
   ↓
PostgreSQL (Neon)
   ↓
Gemini AI
```

## Deployment

* Backend: Render
* Database: Neon PostgreSQL
* AI Service: Gemini API

## Author

Aravind Guggilla
