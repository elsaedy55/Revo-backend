# Revo Backend

## Project Structure

```
├── src/                            # Source code directory
│   ├── index.js                   # Application entry point
│   ├── test-db.js                 # Database testing utilities
│   ├── config/                    # Configuration files
│   │   ├── auth.config.js         # Authentication configuration
│   │   ├── database.config.js     # Database configuration
│   │   ├── database.js           # Database connection setup
│   │   ├── firebase.config.js     # Firebase configuration
│   │   └── firebase.js           # Firebase setup
│   │
│   ├── controllers/               # Request handlers
│   │   ├── auth.controller.js     # Authentication controller
│   │   ├── authController.js      # Auth operations handler
│   │   └── medicalHistory.controller.js  # Medical history controller
│   │
│   ├── db/                        # Database related files
│   │   ├── migrate.js             # Migration script
│   │   └── migrations/            # Database migrations
│   │       ├── 001_create_users_table.sql
│   │       ├── 002_create_medical_history_table.sql
│   │       └── 003_modify_user_id_type.sql
│   │
│   ├── middleware/                # Express middleware
│   │   ├── authJwt.js            # JWT authentication middleware
│   │   ├── medicalHistory.validator.js  # Medical history validation
│   │   ├── validation.middleware.js     # General validation middleware
│   │   └── validators.js          # Input validators
│   │
│   ├── models/                    # Data models
│   │   └── medicalHistory.model.js # Medical history model
│   │
│   ├── routes/                    # API routes
│   │   ├── auth.routes.js         # Authentication routes
│   │   ├── authRoutes.js         # Auth endpoints
│   │   └── medicalHistory.routes.js # Medical history routes
│   │
│   └── services/                  # Business logic
│       ├── auth.service.js        # Authentication service
│       └── authService.js        # Auth business logic
│
├── .env                           # Environment variables
├── API_TEST_GUIDE.md              # API testing documentation
└── package.json                   # Project dependencies and scripts
```

### Components Description

1. **Config (/src/config)**
   - Handles all configuration settings
   - Database connection setup
   - Firebase integration
   - Authentication settings

2. **Controllers (/src/controllers)**
   - Handle HTTP requests
   - Process incoming data
   - Call appropriate services
   - Send responses

3. **Database (/src/db)**
   - Migration scripts
   - Database schema evolution
   - SQL migration files

4. **Middleware (/src/middleware)**
   - JWT authentication
   - Request validation
   - Input sanitization
   - Custom middleware functions

5. **Models (/src/models)**
   - Data models
   - Schema definitions
   - Data validation rules

6. **Routes (/src/routes)**
   - API endpoint definitions
   - Route grouping
   - Route protection

7. **Services (/src/services)**
   - Business logic implementation
   - External service integration
   - Data processing

## Tech Stack

- **Node.js & Express.js** - Backend framework
- **PostgreSQL** - Database
- **Passport.js** - Authentication middleware
- **Firebase** - Cloud services integration
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **Express Validator** - Request validation

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file with the following variables:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=revo_db
DB_USER=your_username
DB_PASSWORD=your_password

# Authentication
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Firebase
FIREBASE_API_KEY=your_firebase_api_key
```

3. Start development server:
```bash
npm run dev
```

## API Documentation

Detailed API documentation can be found in `API_TEST_GUIDE.md`

## Authentication

The application supports multiple authentication methods:
- JWT-based authentication
- Google OAuth 2.0
- Firebase authentication

## Database

PostgreSQL is used as the primary database with migrations handled through pg-migrate.

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run migrate` - Run database migrations

## Project Dependencies

### Main Dependencies
- express
- pg (PostgreSQL)
- passport
- jsonwebtoken
- bcrypt
- firebase
- express-validator

### Development Dependencies
- nodemon

## Security

- Password hashing using bcrypt
- JWT token authentication
- OAuth 2.0 integration
- Input validation using express-validator
- Secure session handling

## Contributing

1. Clone the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

[Add License Information Here]