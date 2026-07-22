# Prompt 1 - Project Context

I am building an Incubyte Car Dealership Management System as part of a TDD assessment.

Tech Stack:
- React (Vite)
- Express.js
- MongoDB with Mongoose
- Jest
- Supertest
- bcrypt
- JWT
- ES Modules

Project Structure:
- controllers/
- services/
- models/
- routes/
- middleware/
- utils/

Current Progress:
- Project scaffolding completed.
- Jest + Supertest configured.
- MongoDB Memory Server configured for testing.
- User Registration feature completed following TDD.
- Registration tests are passing.
- Error handling has been refactored using AppError and centralized error middleware.

Architecture Rules:
- Follow TDD (Red → Green → Refactor).
- Keep the existing project structure.
- Reuse existing files whenever appropriate.
- Do not introduce unnecessary abstractions or design patterns.
- Do not rewrite existing code unless explicitly requested.
- Generate only what is requested in each prompt.

I will ask for one step at a time.
Do not implement future features unless explicitly asked.


# Prompt 2

Write Jest + Supertest integration tests for the Login feature.

Requirements:

- Follow the existing project architecture.
- Reuse authService.js, authController.js and authRoutes.js.
- Do not implement any application code.
- Only generate the test file.

Scenarios:

1. Successful login
2. Invalid password
3. User not found
4. Missing email/password

# Prompt 3

Implement only the minimum code required to make the Login tests pass.

Project context:
- Existing Express + MongoDB application.
- Registration feature is already implemented.
- Use the existing architecture:
  - authService.js
  - authController.js
  - authRoutes.js
  - User model
  - AppError
- Do not modify the registration functionality.
- Do not refactor existing code.
- Reuse existing patterns wherever possible.

Requirements:
- Implement POST /api/auth/login.
- Return HTTP 200 with:
  - JWT token
  - user object (without passwordHash)
- Return 400 for missing email or password.
- Return 401 for invalid credentials (user not found or incorrect password).
- Use bcrypt.compare() for password verification.
- Use jsonwebtoken with process.env.JWT_SECRET.
- Return only the files that need to be added or modified.