# Indeed Clone API Documentation

## Services & Ports
- **Company Service**: http://localhost:7001
- **Application Service**: http://localhost:4000
- **User Service**: http://localhost:3000
- **Auth Service**: http://localhost:8000

## Job Management APIs

### 1. Create Job
```
POST http://localhost:7001/companies/{companyId}/jobs
```
**Body:**
```json
{
  "title": "Software Engineer",
  "city": "San Francisco",
  "state": "CA",
  "country": "USA",
  "jobLocation": "remote",
  "type": "full_time",
  "salary": 120000,
  "description": "Job description"
}
```

### 2. Search Jobs
```
GET http://localhost:7001/jobs?page=1&limit=10&q=remote
```
**Query Parameters:**
- `page`, `limit` - Pagination
- `q` - Search keyword
- `city`, `state` - Location filters
- `type` - Job type (internship, full_time, contract)
- `companyId` - Filter by company

### 3. Get Job Details
```
GET http://localhost:7001/jobs/{jobId}
```

## Application Management APIs

### 1. Apply to Job
```
POST http://localhost:4000/jobs/{jobId}/apply
```
**Body:**
```json
{
  "userId": "507f1f77bcf86cd79943902",
  "resume": "resume-url",
  "coverLetter": "Cover letter text",
  "answers": {"experience": "5 years"}
}
```

### 2. Get Applications
```
GET http://localhost:4000/applications?userId={userId}&jobIds={jobId}
```

### 3. Update Application Status
```
PUT http://localhost:4000/applications/{applicationId}
```
**Body:**
```json
{
  "status": "UNDER_REVIEW"
}
```

## Example IDs
- Company ID: `507f1f77bcf86cd79943901`
- Job ID: `507f1f77bcf86cd79943902`
- User ID: `507f1f77bcf86cd79943903`

## Status Values
- Application: `RECEIVED`, `UNDER_REVIEW`, `ACCEPTED`, `REJECTED`
- Job Location: `remote`, `in_person`
- Job Type: `internship`, `full_time`, `contract`