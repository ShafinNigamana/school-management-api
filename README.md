# School Management API

A Node.js + Express + MySQL backend for managing school records and finding nearby schools by proximity.

## Project Description

The School Management API lets clients add school records with geographic coordinates and retrieve schools sorted by distance from a user-supplied location. It is useful for location-aware systems such as school discovery apps, student onboarding tools, admissions portals, and administrative dashboards.

## Tech Stack

- Node.js
- Express.js
- MySQL

## Features

- Add School API
- List Schools API
- Proximity-based sorting using the Haversine formula
- Input validation and centralized error handling
- Optional `limit` query parameter for result control
- Health check endpoint for quick service verification

## API Documentation

### Base URL

```text
/api
```

### 1) POST /api/addSchool

Add a new school record to the database.

#### Request Body

```json
{
  "name": "Green Valley High School",
  "address": "12 Park Avenue, Springfield",
  "latitude": 28.6139,
  "longitude": 77.209
}
```

#### Success Response

```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "Green Valley High School",
    "address": "12 Park Avenue, Springfield",
    "latitude": 28.6139,
    "longitude": 77.209
  }
}
```

#### Error Response

```json
{
  "success": false,
  "message": "All fields are required"
}
```

Validation errors also return `400 Bad Request` with a descriptive message.

---

### 2) GET /api/listSchools

Return all schools sorted by distance from the supplied coordinates.

#### Query Parameters

- `latitude` - required user latitude
- `longitude` - required user longitude
- `limit` - optional maximum number of schools to return

#### Example Request

```text
GET /api/listSchools?latitude=28.6139&longitude=77.209&limit=5
```

#### Example Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Green Valley High School",
      "address": "12 Park Avenue, Springfield",
      "latitude": 28.6139,
      "longitude": 77.209,
      "distance": 0
    },
    {
      "id": 2,
      "name": "Riverdale Public School",
      "address": "45 Lake Road, Springfield",
      "latitude": 28.6201,
      "longitude": 77.2154,
      "distance": 1.12
    }
  ]
}
```

If `limit` is omitted, the API returns the full sorted list.

---

### 3) GET /health

Simple health check endpoint.

#### Example Response

```json
{
  "status": "ok"
}
```

## System Architecture

```text
      ┌──────────────┐
      │   Client     │
      └──────┬───────┘
        │ HTTP Request
        ▼
      ┌──────────────┐
      │    Routes    │
      └──────┬───────┘
        ▼
      ┌──────────────┐
      │ Controllers  │
      └──────┬───────┘
        ▼
      ┌──────────────┐
      │   Services   │
      │ (Validation, │
      │  Logic)      │
      └──────┬───────┘
        ▼
      ┌──────────────┐
      │   Models     │
      │ (DB Queries) │
      └──────┬───────┘
        ▼
      ┌──────────────┐
      │   MySQL DB   │
      └──────────────┘
```

- Client: Sends HTTP requests to the API.
- Routes: Map endpoints to controller handlers.
- Controllers: Read request data and return HTTP responses.
- Services: Handle validation, business logic, and distance-based sorting.
- Models: Execute database queries.
- Database: Stores school records in MySQL.

## Request Flow

### Add School Flow

```text
Client -> Route -> Controller -> Service (Validation) -> Model -> Database -> Response
```

### List Schools Flow

```text
Client -> Route -> Controller -> Service
→ Fetch Schools from DB
→ Calculate Distance (Haversine)
→ Sort by Distance
→ Apply Limit (optional)
→ Response
```

## Engineering Decisions

- Used layered architecture (`Controller -> Service -> Model`) for separation of concerns.
- Implemented centralized error handling middleware for cleaner controllers.
- Used parameterized queries to reduce SQL injection risk.
- Chose the Haversine formula for accurate geographic distance calculation.
- Added input validation to ensure data integrity before database writes.
- Included an optional `limit` parameter for better response control.

## Distance Calculation & Sorting

The system uses the Haversine formula to calculate the distance between the user's location and each school.

Process:

1. Fetch all schools from the database
2. Calculate distance for each school
3. Sort schools by nearest distance
4. Apply optional limit parameter

This approach ensures accurate proximity-based results.

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd school-management-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the MySQL database

Create a database and a `schools` table.

```sql
CREATE DATABASE school_management;
USE school_management;

CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Create the `.env` file

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
```

### 5. Start the server

```bash
npm run dev
```

The API will start on the configured port and expose the endpoints under `/api`.

## Environment Variables

- `PORT` - server port
- `DB_HOST` - MySQL host
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - MySQL database name

Optional:

- `DB_CONNECTION_LIMIT` - connection pool size

## Testing

Use Postman to verify the API endpoints.

Example requests:

- `POST /api/addSchool`
- `GET /api/listSchools?latitude=28.6139&longitude=77.209`
- `GET /health`

## Health Check

A simple endpoint to verify if the service is running:

```text
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

## Deployment

This API can be deployed on platforms such as Render or Railway.

Before deployment, configure the production environment variables and point the app to a managed MySQL instance.

## Deliverables

As required by the assignment, the submission should include:

- Source Code Repository: this project repository
- Live API Endpoints: deployed URLs for the add and list school APIs
- Postman Collection: a collection covering the main API requests for evaluation

## Author

- Name: Your Name
- Contact: your.email@example.com
