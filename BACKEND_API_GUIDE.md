# Backend Implementation Guide - Admin Dashboard API

## Overview
This guide provides specifications for implementing backend API endpoints for the Qubitium admin dashboard. All endpoints require JWT authentication and admin role verification.

---

## Authentication

### Token Requirements
- **Header**: `Authorization: Bearer <jwt_token>`
- **Token Source**: JWT token returned from `/auth/admin/login` endpoint
- **Token Storage**: Raw JWT (no "Bearer " prefix in storage)
- **Verification**: Verify user role is "admin" before processing requests

---

## API Endpoints

### 1. Admin Login
**Endpoint**: `POST /auth/admin/login`

**Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "user_id",
    "email": "admin@example.com",
    "role": "admin",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

**Error** (401 Unauthorized):
```json
{
  "message": "Invalid credentials or user is not an admin"
}
```

---

### 2. Get All Users with Filters & Pagination
**Endpoint**: `GET /auth/admin/users`

**Query Parameters**:
- `search` (string, optional): Search by email or user ID (case-insensitive)
- `role` (string, optional): Filter by role - "user", "creator", or "admin"
- `dateFilter` (string, optional): Filter by creation date
  - `today`: Users created today
  - `yesterday`: Users created yesterday
  - `7days`: Users created in last 7 days
  - `30days`: Users created in last 30 days
  - `90days`: Users created in last 90 days
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Example Request**:
```
GET /auth/admin/users?search=john&role=creator&dateFilter=7days&page=1&limit=10
```

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**Response** (200 OK):
```json
{
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "role": "creator",
      "name": "John Doe",
      "createdAt": "2025-01-02T10:30:00Z",
      "updatedAt": "2025-01-05T15:45:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "email": "jane@example.com",
      "role": "user",
      "name": "Jane Smith",
      "createdAt": "2025-01-01T08:20:00Z",
      "updatedAt": "2025-01-04T12:10:00Z"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 10,
  "pages": 1
}
```

**Filtering Logic**:
- Search: Match email or user ID partially (case-insensitive)
- Role: Exact match on the role field
- Date filters: Compare `createdAt` field with current date
- Combine all filters with AND logic (all conditions must match)

**Error** (401 Unauthorized):
```json
{
  "message": "Unauthorized - Admin access required"
}
```

---

### 3. Get User Statistics
**Endpoint**: `GET /auth/admin/stats`

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**Response** (200 OK):
```json
{
  "totalUsers": 2847,
  "activeUsers": 2756,
  "creators": 342,
  "bannedUsers": 0
}
```

**Field Descriptions**:
- `totalUsers`: Total count of all users in the database
- `activeUsers`: Count of users with status "active" (or where status is not "banned")
- `creators`: Count of users with role "creator"
- `bannedUsers`: Count of users with status "banned" (should return 0 as ban feature is removed)

**Calculation Logic**:
```
totalUsers = COUNT(all users in User collection)
activeUsers = COUNT(users where status != "banned")
creators = COUNT(users where role == "creator")
bannedUsers = 0 (ban feature removed)
```

**Error** (401 Unauthorized):
```json
{
  "message": "Unauthorized - Admin access required"
}
```

---

### 4. Create New User
**Endpoint**: `POST /auth/admin/users`

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "role": "user"
}
```

**Response** (201 Created):
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "email": "newuser@example.com",
  "role": "user",
  "createdAt": "2025-01-06T10:00:00Z",
  "updatedAt": "2025-01-06T10:00:00Z"
}
```

**Validation**:
- Email must be unique
- Email must be valid format
- Password must be at least 6 characters
- Role must be one of: "user", "creator", "admin"
- Password should be hashed using bcrypt before storage

**Error** (400 Bad Request):
```json
{
  "message": "Email already exists"
}
```

**Error** (401 Unauthorized):
```json
{
  "message": "Unauthorized - Admin access required"
}
```

---

### 5. Update User
**Endpoint**: `PUT /auth/admin/users/:userId`

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**Request Body** (at least one field required):
```json
{
  "email": "updatedemail@example.com",
  "role": "creator"
}
```

**Response** (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "updatedemail@example.com",
  "role": "creator",
  "createdAt": "2025-01-02T10:30:00Z",
  "updatedAt": "2025-01-06T11:00:00Z"
}
```

**Updatable Fields**:
- `email` (must be unique if changed)
- `role` ("user", "creator", or "admin")
- `password` (if provided, must be hashed)

**Error** (404 Not Found):
```json
{
  "message": "User not found"
}
```

**Error** (400 Bad Request):
```json
{
  "message": "Email already exists"
}
```

**Error** (401 Unauthorized):
```json
{
  "message": "Unauthorized - Admin access required"
}
```

---

### 6. Delete User
**Endpoint**: `DELETE /auth/admin/users/:userId`

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**Response** (200 OK):
```json
{
  "message": "User deleted successfully",
  "deletedUser": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error** (404 Not Found):
```json
{
  "message": "User not found"
}
```

**Error** (401 Unauthorized):
```json
{
  "message": "Unauthorized - Admin access required"
}
```

---

### 7. Promote User to Creator
**Endpoint**: `PUT /auth/admin/users/:userId/promote-creator`

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**Request Body**: Empty (no body required)

**Response** (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "role": "creator",
  "updatedAt": "2025-01-06T11:15:00Z"
}
```

**Logic**:
- Update user's role to "creator"
- Update `updatedAt` timestamp

**Error** (404 Not Found):
```json
{
  "message": "User not found"
}
```

**Error** (401 Unauthorized):
```json
{
  "message": "Unauthorized - Admin access required"
}
```

---

### 8. Promote User to Admin
**Endpoint**: `PUT /auth/admin/users/:userId/promote-admin`

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**Request Body**: Empty (no body required)

**Response** (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "role": "admin",
  "updatedAt": "2025-01-06T11:20:00Z"
}
```

**Logic**:
- Update user's role to "admin"
- Update `updatedAt` timestamp

**Error** (404 Not Found):
```json
{
  "message": "User not found"
}
```

**Error** (401 Unauthorized):
```json
{
  "message": "Unauthorized - Admin access required"
}
```

---

### 9. Revoke Creator Access
**Endpoint**: `PUT /auth/admin/users/:userId/revoke-creator`

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**Request Body**: Empty (no body required)

**Response** (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "role": "user",
  "updatedAt": "2025-01-06T11:25:00Z"
}
```

**Logic**:
- If user's role is "creator", change it to "user"
- If user's role is "admin", change it to "user"
- Update `updatedAt` timestamp

**Error** (404 Not Found):
```json
{
  "message": "User not found"
}
```

**Error** (401 Unauthorized):
```json
{
  "message": "Unauthorized - Admin access required"
}
```

---

## Database Schema (MongoDB)

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed with bcrypt, required),
  role: String (enum: ["user", "creator", "admin"], default: "user"),
  status: String (enum: ["active", "banned"], default: "active"),
  name: String (optional),
  createdAt: Date (automatically set on creation),
  updatedAt: Date (automatically updated on modification)
}
```

---

## Error Handling

All endpoints should return appropriate HTTP status codes:
- `200 OK`: Successful GET, PUT operations
- `201 Created`: Successful POST operations
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server errors

All error responses should follow this format:
```json
{
  "message": "Error description",
  "error": "error_type (optional)"
}
```

---

## Security Considerations

1. **Authentication**: All admin endpoints require valid JWT token with admin role
2. **Password Hashing**: Always hash passwords using bcrypt (minimum 10 rounds)
3. **Input Validation**: Validate and sanitize all inputs
4. **Rate Limiting**: Consider implementing rate limiting on login endpoint
5. **CORS**: Configure CORS to allow requests only from trusted frontend domains
6. **Environment Variables**: Store sensitive data in environment variables:
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT signing
   - `PORT`: Server port (default 8081)
   - `NODE_ENV`: Environment (development, production)

---

## Implementation Notes

### Frontend Configuration
The frontend is configured to make requests to:
- **Primary**: `http://localhost:8081` (Port 8081 preferred)
- **Fallback**: `http://localhost:3000`

All requests include the Bearer token in the Authorization header automatically via the frontend API service.

### Pagination
- Default: 10 items per page
- Maximum recommended: 50 items per page
- Calculate total pages: `Math.ceil(total / limit)`

### Date Filtering Logic
Implement date filtering on the backend for better performance:
```
today: createdAt >= todayStart && createdAt <= todayEnd
yesterday: createdAt >= yesterdayStart && createdAt <= yesterdayEnd
7days: createdAt >= (now - 7 days)
30days: createdAt >= (now - 30 days)
90days: createdAt >= (now - 90 days)
```

Use UTC dates for consistency.

---

## Testing Recommendations

1. Test with admin authentication: Valid admin JWT token
2. Test without authentication: Missing Authorization header
3. Test with non-admin role: User or creator role token
4. Test pagination: Various page and limit values
5. Test filtering: Each date filter option
6. Test search: Partial email and ID matches
7. Test CRUD operations: Create, read, update, delete
8. Test role promotions and revocations
9. Test data validation: Invalid emails, duplicate users, etc.
10. Test error handling: 404, 400, 401 responses

---

## Example cURL Requests

### Login
```bash
curl -X POST http://localhost:8081/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### Get All Users with Filters
```bash
curl -X GET "http://localhost:8081/auth/admin/users?search=john&role=creator&dateFilter=7days&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Get Stats
```bash
curl -X GET http://localhost:8081/auth/admin/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Create User
```bash
curl -X POST http://localhost:8081/auth/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securePassword123",
    "role": "user"
  }'
```

### Update User
```bash
curl -X PUT http://localhost:8081/auth/admin/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "creator"
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:8081/auth/admin/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Promote to Creator
```bash
curl -X PUT http://localhost:8081/auth/admin/users/507f1f77bcf86cd799439011/promote-creator \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Promote to Admin
```bash
curl -X PUT http://localhost:8081/auth/admin/users/507f1f77bcf86cd799439011/promote-admin \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Revoke Creator Access
```bash
curl -X PUT http://localhost:8081/auth/admin/users/507f1f77bcf86cd799439011/revoke-creator \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Notes
- Ban/Unban functionality has been removed - `bannedUsers` always returns 0
- All timestamps use ISO 8601 format (UTC)
- All database IDs are MongoDB ObjectIds
- Ensure proper indexing on frequently queried fields (email, role, createdAt)
