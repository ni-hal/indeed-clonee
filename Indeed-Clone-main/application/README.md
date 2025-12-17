# Application Service

Job application management service for Indeed Clone.

## API Endpoints

### Applications
- `GET /applications` - Get all applications
- `GET /applications/:id` - Get application by ID
- `POST /applications` - Create new application
- `PUT /applications/:id` - Update application
- `DELETE /applications/:id` - Delete application

## Changes Made
- Removed Kafka dependencies to fix ENOTFOUND kafka errors
- Added validation error handling for POST requests
- Direct MongoDB operations for all CRUD operations
- Fixed deprecated MongoDB methods (count -> countDocuments)

## Port
Runs on port 7003