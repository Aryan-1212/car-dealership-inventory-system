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

# Prompt 4

Review my Login implementation and suggest a refactoring.

Requirements:
- Keep all existing tests passing.
- Do not change API responses.
- Do not change routes.
- Do not change the project architecture.
- Do not introduce Repository Pattern, DTOs, or unnecessary helper classes.
- Improve readability, remove duplication, and improve maintainability only.
- Return only the files that should change.

# Prompt 5

Write Jest + Supertest integration tests for the Create Vehicle endpoint.

Requirements:
- Follow the existing project architecture.
- Reuse the existing authentication flow.
- Do not implement application code.
- Generate only the test file.

Endpoint:
POST /api/vehicles

Scenarios:
1. Admin can create a vehicle successfully.
2. Request without JWT returns 401.
3. Non-admin user returns 403.
4. Missing required fields returns 400.
5. Price must be greater than 0.
6. Quantity cannot be negative.
7. Response contains id, make, model, category, price, and quantity.

# Prompt 6

Implement only the minimum code required to make the Create Vehicle tests pass.

Requirements:
- Reuse the existing architecture.
- Do not modify authentication unless required.
- Do not refactor.
- Return only the files that need to change.

# Prompt 7

Review the Create Vehicle implementation.

Requirements:
- Keep all tests passing.
- Do not change API responses.
- Do not change the architecture.
- Improve readability and remove duplication only.
- Return only the modified files.

# Prompt 8
Write Jest + Supertest integration tests for the Get All Vehicles endpoint.

Requirements:
- Follow the existing project architecture.
- Reuse the existing authentication flow.
- Do not implement application code.
- Generate only the test file.

Endpoint:
GET /api/vehicles

Scenarios:
1. Authenticated user can retrieve all vehicles successfully.
2. Request without JWT returns 401.
3. Returns an empty array when no vehicles exist.
4. Returns all available vehicles with:
   - id
   - make
   - model
   - category
   - price
   - quantity

# Prompt 9
Implement only the minimum code required to make the Get All Vehicles tests pass.

Requirements:
- Reuse the existing project architecture.
- Reuse the existing authentication and authorization.
- Do not change existing API behavior.
- Do not refactor.
- Return only the files that need to change.

# Prompt 10
Refactor the Get All Vehicles feature without changing its behavior.

Requirements:
- Keep all existing tests passing.
- Do not change API responses or status codes.
- Do not change the project architecture.
- Do not add new features.
- Improve readability and reduce duplication only.

Focus on:
1. Remove duplicated test setup (e.g., admin creation/login).
2. Extract reusable test data (vehicle payloads).
3. Improve test names where appropriate.
4. Remove repeated literals and unnecessary code.
5. Simplify the implementation if possible without changing functionality.

Return only the files that need to change.

# Prompt 11
Write Jest + Supertest integration tests for the Search Vehicles endpoint.

Requirements:
- Follow the existing project architecture.
- Reuse the existing authentication flow.
- Do not implement application code.
- Generate only the test file.

Endpoint:
GET /api/vehicles/search

Scenarios:
1. Authenticated user can search by make.
2. Authenticated user can search by model.
3. Authenticated user can search by category.
4. Authenticated user can search using a price range (minPrice and maxPrice).
5. Authenticated user can combine multiple filters.
6. Returns an empty array when no vehicles match.
7. Request without JWT returns 401.

# Prompt 12
Implement only the minimum code required to make the Search Vehicles tests pass.

Requirements:
- Reuse the existing project architecture.
- Reuse the existing authentication and authorization.
- Do not change existing API behavior.
- Do not refactor.
- Do not add pagination, sorting, or any extra features.
- Use query parameters for filtering.
- Return only the files that need to change.

# Prompt 13
Review the Search Vehicles implementation and suggest a refactor.

Requirements:
- Keep all existing tests passing.
- Do not change the API response format or status codes.
- Do not change the route or query parameter names.
- Do not introduce new architecture (repositories, validators, etc.).
- Improve readability and reduce duplication in the query-building
  logic only.
- Return only the files that should change.

# Prompt 14
Write Jest + Supertest integration tests for the Update Vehicle endpoint.

Requirements:
- Follow the existing project architecture.
- Reuse the existing authentication flow.
- Do not implement application code.
- Generate only the test file.

Endpoint:
PUT /api/vehicles/:id

Scenarios:
1. Authenticated user can update an existing vehicle's fields
   (make, model, category, price, quantity) and receives the
   updated vehicle back.
2. Request without JWT returns 401.
3. Updating a non-existent id returns 404.
4. Invalid payload (e.g. negative price or negative quantity)
   returns 400.
5. Partial update (e.g. only price) succeeds and leaves other
   fields unchanged.

# Prompt 15
Implement only the minimum code required to make the Update Vehicle
tests pass.

Requirements:
- Reuse the existing project architecture.
- Reuse the existing authentication and authorization.
- Do not change existing API behavior.
- Do not refactor.
- Support partial updates (only update fields present in the request
  body).
- Validate price >= 0 and quantity >= 0 if those fields are present
  in the request.
- Return 404 if the id doesn't exist.
- Return only the files that need to change.

# Prompt 16
Review the Update Vehicle implementation and suggest a refactor.

Requirements:
- Keep all tests passing.
- Do not change API responses or the route.
- Improve readability and remove duplication only (e.g. shared
  validation logic with the Create Vehicle endpoint, if applicable).
- Return only the files that should change.

# Prompt 17
Write Jest + Supertest integration tests for the Delete Vehicle endpoint.

Requirements:
- Follow the existing project architecture.
- Reuse the existing authentication flow.
- Do not implement application code.
- Generate only the test file.

Endpoint:
DELETE /api/vehicles/:id

Scenarios:
1. Admin can delete an existing vehicle successfully.
2. Non-admin authenticated user returns 403.
3. Request without JWT returns 401.
4. Deleting a non-existent id returns 404.
5. After deletion, the vehicle no longer appears in GET /api/vehicles.

# Prompt 18
Implement only the minimum code required to make the Delete Vehicle
tests pass.

Requirements:
- Reuse the existing project architecture.
- Reuse the existing authentication and authorization (requireAdmin
  middleware).
- Do not change existing API behavior.
- Do not refactor.
- Return 404 if the id doesn't exist.
- Return 200 or 204 on successful deletion.
- Return only the files that need to change.

# Prompt 19
Review the Delete Vehicle implementation and suggest a refactor.

Requirements:
- Keep all tests passing.
- Do not change API responses or the route.
- Do not change the project architecture.
- Improve readability and remove duplication only (e.g. shared
  "find vehicle or 404" logic across update/delete, if applicable).
- Return only the files that should change.

# Prompt 20
Write Jest + Supertest integration tests for the Purchase Vehicle endpoint.

Requirements:
- Follow the existing project architecture.
- Reuse the existing authentication flow.
- Do not implement application code.
- Generate only the test file.

Endpoint:
POST /api/vehicles/:id/purchase

Scenarios:
1. Authenticated user can purchase a vehicle with quantity > 0,
   quantity decreases by 1, and the updated vehicle is returned.
2. Purchasing a vehicle with quantity already at 0 returns 409
   (out of stock) and quantity does NOT go negative.
3. Purchasing a non-existent id returns 404.
4. Request without JWT returns 401.

# Prompt 21
Implement only the minimum code required to make the Purchase Vehicle
tests pass.

Requirements:
- Reuse the existing project architecture.
- Reuse the existing authentication and authorization.
- Do not change existing API behavior.
- Do not refactor.
- Return 404 if the id doesn't exist.
- Return 409 if quantity is already 0.
- Decrement quantity by exactly 1 on success and return the updated
  vehicle.
- IMPORTANT: perform the check-and-decrement as a single atomic
  MongoDB operation (e.g. findOneAndUpdate with a filter condition
  like { _id: id, quantity: { $gt: 0 } }), not a separate find()
  followed by a save() — a read-then-write here is a race condition.
- Return only the files that need to change.

# Prompt 22
Review the Purchase Vehicle implementation and suggest a refactor.

Requirements:
- Keep all tests passing.
- Do not change API responses or the route.
- Do not change the atomic update logic.
- Improve readability and error handling only.
- Return only the files that should change.

# Prompt 23
Write Jest + Supertest integration tests for the Restock Vehicle endpoint.

Requirements:
- Follow the existing project architecture.
- Reuse the existing authentication flow.
- Do not implement application code.
- Generate only the test file.

Endpoint:
POST /api/vehicles/:id/restock

Body:
{ "amount": <number> }

Scenarios:
1. Admin can restock an existing vehicle — quantity increases by
   the given amount, updated vehicle is returned.
2. Non-admin authenticated user returns 403.
3. Request without JWT returns 401.
4. Restocking a non-existent id returns 404.
5. Negative or zero restock amount returns 400.
6. Missing amount in the request body returns 400.

# Prompt 24
Implement only the minimum code required to make the Restock Vehicle
tests pass.

Requirements:
- Reuse the existing project architecture.
- Reuse the existing authentication and authorization (requireAdmin
  middleware).
- Do not change existing API behavior.
- Do not refactor.
- Return 404 if the id doesn't exist.
- Return 400 if amount is missing, zero, or negative.
- Increase quantity by the given amount atomically (use $inc, not a
  find-then-save) and return the updated vehicle.
- Return only the files that need to change.

# Prompt 25