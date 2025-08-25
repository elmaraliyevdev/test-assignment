# Test Assignment - Full-Stack TypeScript Application

This is a modern full-stack web application built with **React + TypeScript + Tailwind CSS** frontend and **Node.js + TypeScript** backend, implementing a form submission system with history tracking and comprehensive unit testing.

## Features

### Frontend (React + TypeScript + Tailwind)
- **Page 1**: Navigation page with links to other pages (React Router)
- **Page 2**: Form submission with real-time validation, loading states, URL serialization, and result display
- **Page 3**: History table showing the last 10 successful submissions
- **Responsive design** with Tailwind CSS
- **Type safety** throughout with TypeScript
- **React Hooks** for state management
- **URL serialization** for form persistence

### Backend (Node.js + TypeScript)
- **POST /submit**: Form submission endpoint with validation and random delay (up to 3 seconds)
- **GET /history**: Returns last 10 submissions sorted by date with count of previous submissions
- **SQLite database** for data persistence
- **Input validation** (no whitespace allowed in first_name and last_name)
- **Full TypeScript** implementation with strict typing

### Testing
- **Backend**: Jest with supertest for API endpoint testing, database testing, and validation testing
- **Frontend**: Jest + React Testing Library for component testing and hooks testing
- **Coverage reports** for both frontend and backend
- **Isolated test databases** to prevent test interference

## Project Structure

```
test-assignment/
├── backend/
│   ├── server.ts              # Main Express server
│   ├── database.ts            # SQLite database operations
│   ├── server.test.ts         # API endpoint tests
│   ├── database.test.ts       # Database operation tests
│   └── dist/                  # Compiled TypeScript output
├── src/                       # React frontend source
│   ├── components/
│   │   ├── Layout.tsx         # Shared layout component
│   │   ├── Spinner.tsx        # Loading spinner component
│   │   └── __tests__/         # Component unit tests
│   ├── pages/
│   │   ├── HomePage.tsx       # Page 1 - Navigation
│   │   ├── FormPage.tsx       # Page 2 - Form submission
│   │   ├── HistoryPage.tsx    # Page 3 - History display
│   │   └── __tests__/         # Page component tests
│   ├── hooks/
│   │   ├── useForm.ts         # Form state management hook
│   │   ├── useHistory.ts      # History data fetching hook
│   │   └── __tests__/         # Hook unit tests
│   ├── utils/
│   │   ├── api.ts             # API communication functions
│   │   ├── url.ts             # URL serialization utilities
│   │   └── __tests__/         # Utility function tests
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── App.tsx                # Main React app with routing
│   ├── index.tsx              # React app entry point
│   ├── index.css              # Tailwind CSS imports
│   └── setupTests.ts          # Jest test setup
├── dist/                      # Built frontend assets
├── coverage/                  # Test coverage reports
│   ├── backend/               # Backend coverage
│   └── frontend/              # Frontend coverage
├── config files...
└── README.md
```

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Start the server:**
   ```bash
   npm start
   ```
   
   For development with hot reload:
   ```bash
   npm run dev
   ```
   This starts both backend (port 3000) and frontend dev server (port 3001) concurrently.

4. **Run tests:**
   ```bash
   npm test              # Run all tests
   npm run test:backend  # Run only backend tests
   npm run test:frontend # Run only frontend tests
   npm run test:watch    # Run tests in watch mode
   ```

5. **Access the application:**
   - **Production:** `http://localhost:3000` (serves built React app)
   - **Development:** `http://localhost:3001` (Vite dev server with proxy to backend)

## API Endpoints

### POST /submit
Submit form data with validation.

**Request:**
```json
{
  "date": "2019-01-02",
  "first_name": "Ivan",
  "last_name": "Ivanov"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2019-01-02",
      "name": "Ivan Ivanov"
    }
  ]
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "first_name": ["No whitespace in first name is allowed"]
  }
}
```

### GET /history
Get the last 10 successful submissions.

**Response:**
```json
[
  {
    "date": "2025-05-12",
    "first_name": "John",
    "last_name": "Smith",
    "count": 1
  }
]
```

## Testing

You can test the API endpoints using curl:

```bash
# Successful submission
curl -X POST -H 'Content-Type: application/json' \
  -d '{"first_name": "Ivan", "last_name": "Ivanov", "date": "2019-01-02"}' \
  http://localhost:3000/submit

# Error case (whitespace in first_name)
curl -X POST -H 'Content-Type: application/json' \
  -d '{"first_name": "Ivan Ivanov", "last_name": "Smith", "date": "2019-01-02"}' \
  http://localhost:3000/submit

# Get history
curl http://localhost:3000/history
```

## Features Implemented

✅ **Page 1**: Simple navigation page  
✅ **Page 2**: Form with validation, loading spinner, URL serialization, and result display  
✅ **Page 3**: History table with sorted data  
✅ **Backend validation**: No whitespace in names  
✅ **Random delay**: Up to 3 seconds response time  
✅ **Database storage**: SQLite with proper schema  
✅ **History sorting**: By date DESC, then by first_name, last_name ASC  
✅ **Count calculation**: Previous submissions by same person before current date  
✅ **URL serialization**: Form data persists in URL and restores on page load  
✅ **Error handling**: Proper error messages and HTTP status codes  

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite3
- **Testing**: Jest + Supertest
- **Build**: TypeScript Compiler

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library

### Development Tools
- **Package Manager**: npm
- **Dev Server**: Vite (frontend) + Nodemon (backend)
- **Type Checking**: TypeScript (strict mode)
- **CSS Processing**: PostCSS + Autoprefixer
- **Testing Framework**: Jest with jsdom environment
- **Coverage**: Jest built-in coverage reports

## Testing

The application includes comprehensive unit tests for both frontend and backend:

### Backend Tests (21 tests)
- **Database tests**: CRUD operations, sorting, counting logic
- **API endpoint tests**: Validation, error handling, response formats
- **Edge cases**: Whitespace validation, database errors, empty responses

### Frontend Tests (45 tests)
- **Component tests**: Layout, Spinner, HomePage rendering and behavior
- **Hook tests**: useForm and useHistory state management
- **Utility tests**: API functions, URL serialization/deserialization
- **Integration tests**: Form submission flow, error handling

### Test Coverage
```bash
npm test                    # Run all tests (backend + frontend)
npm run test:backend       # Run backend tests only
npm run test:frontend      # Run frontend tests only  
npm run test:watch         # Run tests in watch mode
```

Coverage reports are generated in `coverage/backend/` and `coverage/frontend/` directories.