# Smart Resume API Documentation

## Base URL
http://localhost:3000

## Authentication
Currently no authentication required for development environment.

## API Endpoints

### 1. Users

#### Create User
- **Method:** POST
- **Endpoint:** `/users`
- **Description:** Register a new user with basic information
- **Required Fields:** name, email, phone
- **Responses:**
  - 201: User created successfully
  - 400: Invalid data or email/phone already registered

#### Validate Email/Phone
- **Method:** GET
- **Endpoint:** `/users/validate`
- **Description:** Check if email or phone is available
- **Query Parameters:** email or phone
- **Responses:**
  - 200: Returns availability status
  - 400: Bad request - Email or phone is required

#### Get Address by CEP
- **Method:** GET
- **Endpoint:** `/users/address/:cep`
- **Description:** Fetch address information using CEP
- **Responses:**
  - 200: Address found
  - 404: CEP not found

#### Resend Verification Code
- **Method:** POST
- **Endpoint:** `/users/resend-verification`
- **Description:** Resend email verification code
- **Required Fields:** email
- **Responses:**
  - 200: Code sent successfully
  - 400: Email already verified
  - 404: User not found

#### Get User
- **Method:** GET
- **Endpoint:** `/users/:id`
- **Description:** Get user information by ID
- **Responses:**
  - 200: User found
  - 404: User not found

#### Verify Email
- **Method:** POST
- **Endpoint:** `/users/verify-email/:id`
- **Description:** Verify user's email with verification code
- **Required Fields:** code
- **Responses:**
  - 200: Email verified successfully
  - 400: Invalid code
  - 404: User not found

#### Update User
- **Method:** PUT
- **Endpoint:** `/users/:id`
- **Description:** Update user information
- **Optional Fields:** secondaryEmail, cnpj, street, number, neighborhood, city, state, zipCode, latitude, longitude
- **Responses:**
  - 200: User updated successfully
  - 400: Invalid data
  - 404: User not found

### 2. External Services Integration

#### ViaCEP Integration
- Automatically fetches and fills address information when zipCode is provided during user update
- Returns: street, neighborhood, city, and state information

#### Email Service
- Sends verification code emails
- Sends welcome emails after successful verification
- Uses Ethereal SMTP for development environment

## Response Formats
All endpoints return JSON responses with appropriate HTTP status codes and messages.

## Error Handling
- 400: Bad Request - Invalid input data
- 404: Not Found - Resource not found
- 500: Internal Server Error - Server-side issues

## Rate Limiting
Currently no rate limiting implemented in development environment.