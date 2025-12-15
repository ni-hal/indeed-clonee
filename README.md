# Indeed Clone

A full-stack job portal application built with microservices architecture.

## Features

- User authentication and authorization
- Job posting and management
- Job application system
- Company profiles
- Photo/media management
- Review system
- Real-time messaging with Kafka

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Redis
- **Message Queue**: Apache Kafka
- **File Storage**: AWS S3
- **Containerization**: Docker

## Services

- **Auth Service**: User authentication
- **User Service**: User management
- **Company Service**: Company profiles and job postings
- **Application Service**: Job applications
- **Photos Service**: Media file management
- **Review Service**: Company reviews

## Setup

1. Clone the repository
2. Configure environment variables in config files
3. Run with Docker Compose:
   ```bash
   docker-compose up
   ```

## Configuration

Update the config.json files in each service directory with your:
- Database connections
- AWS S3 credentials
- Redis configuration
- Service URLs