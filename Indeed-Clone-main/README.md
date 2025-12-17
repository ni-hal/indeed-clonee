# Indeed Clone - Microservices Architecture

A job portal application built with microservices architecture using Node.js, Express, and MongoDB.

## Services

### Application Service (Port 7003)
- Job application management
- CRUD operations for applications
- Validation and error handling

### Company Service (Port 3008)
- Company and job management
- Job posting and updates
- Company profiles

### User Service (Port 3004)
- User registration and management
- User profiles and authentication
- User data operations

### Review Service (Port 3006)
- Company reviews and ratings
- Review management
- Featured reviews

### Photos Service (Port 3001)
- Image upload and management
- Photo storage and retrieval

### Auth Service (Port 3002)
- Authentication and authorization
- JWT token management
- User session handling

### Chat Service (Port 3007)
- Real-time messaging
- Chat between users and employers

## Recent Changes

### Kafka Dependencies Removed
- Fixed ENOTFOUND kafka errors across all services
- Replaced Kafka messaging with direct MongoDB operations
- Improved local development experience

### Port Conflicts Resolved
- Updated default ports to avoid conflicts
- Next.js frontend moved to port 3005

### Database Improvements
- Fixed deprecated MongoDB methods (count -> countDocuments)
- Added proper validation error handling
- Improved error responses

## Setup Instructions

1. Install dependencies for each service:
   ```bash
   cd [service-directory]
   npm install
   ```

2. Start MongoDB locally

3. Start each service:
   ```bash
   npm start
   ```

4. Services will be available on their respective ports

## API Documentation

Each service includes Swagger documentation available at:
- `http://localhost:[port]/api-docs`

## Environment Variables

Configure the following in each service's `.env` file:
- MongoDB connection string
- Service URLs for inter-service communication
- JWT secrets for authentication