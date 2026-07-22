import request from "supertest";
import bcrypt from "bcrypt";
import app from "../src/app.js";
import User from "../src/models/User.js";

const sampleVehicle = {
    make: "Toyota",
    model: "Camry",
    category: "Sedan",
    price: 25000,
    quantity: 5
};

const createAuthenticatedToken = async (role = "customer") => {
    const email = `${role}_${Math.random()}@example.com`;
    const password = "password123";
    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
        name: `${role} User`,
        email,
        passwordHash,
        role
    });

    const loginRes = await request(app)
        .post("/api/auth/login")
        .send({ email, password });

    return loginRes.body.token;
};

describe("POST /api/vehicles", () => {
    let adminToken;
    let customerToken;

    beforeEach(async () => {
        adminToken = await createAuthenticatedToken("admin");
        customerToken = await createAuthenticatedToken("customer");
    });

    it("should allow an admin to create a vehicle successfully", async () => {
        const response = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(sampleVehicle);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("vehicle");
        expect(response.body.vehicle).toMatchObject({
            make: sampleVehicle.make,
            model: sampleVehicle.model,
            category: sampleVehicle.category,
            price: sampleVehicle.price,
            quantity: sampleVehicle.quantity
        });
        expect(response.body.vehicle).toHaveProperty("id");
    });

    it("should return 401 if request is sent without JWT token", async () => {
        const response = await request(app)
            .post("/api/vehicles")
            .send(sampleVehicle);

        expect(response.statusCode).toBe(401);
    });

    it("should return 403 if a non-admin user attempts to create a vehicle", async () => {
        const response = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${customerToken}`)
            .send(sampleVehicle);

        expect(response.statusCode).toBe(403);
    });

    it("should return 400 if required fields are missing", async () => {
        const incompleteData = { model: "Camry", category: "Sedan", price: 25000, quantity: 5 };

        const response = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(incompleteData);

        expect(response.statusCode).toBe(400);
    });

    it("should return 400 if price is 0 or negative", async () => {
        const invalidPriceData = { ...sampleVehicle, price: 0 };

        const response = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(invalidPriceData);

        expect(response.statusCode).toBe(400);
    });

    it("should return 400 if quantity is negative", async () => {
        const invalidQuantityData = { ...sampleVehicle, quantity: -1 };

        const response = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(invalidQuantityData);

        expect(response.statusCode).toBe(400);
    });

    it("should return a response containing id, make, model, category, price, and quantity", async () => {
        const response = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(sampleVehicle);

        expect(response.statusCode).toBe(201);
        expect(response.body.vehicle).toEqual(
            expect.objectContaining({
                id: expect.anything(),
                make: sampleVehicle.make,
                model: sampleVehicle.model,
                category: sampleVehicle.category,
                price: sampleVehicle.price,
                quantity: sampleVehicle.quantity
            })
        );
    });
});

describe("GET /api/vehicles", () => {
    let userToken;
    let adminToken;

    beforeEach(async () => {
        userToken = await createAuthenticatedToken("customer");
        adminToken = await createAuthenticatedToken("admin");
    });

    it("should return 401 if request is sent without JWT token", async () => {
        const response = await request(app)
            .get("/api/vehicles");

        expect(response.statusCode).toBe(401);
    });

    it("should return an empty array when no vehicles exist", async () => {
        const response = await request(app)
            .get("/api/vehicles")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.vehicles).toEqual([]);
    });

    it("should allow an authenticated user to retrieve all vehicles successfully", async () => {
        await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(sampleVehicle);

        const response = await request(app)
            .get("/api/vehicles")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.vehicles).toHaveLength(1);
    });

    it("should return all available vehicles containing id, make, model, category, price, and quantity", async () => {
        await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(sampleVehicle);

        const response = await request(app)
            .get("/api/vehicles")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.vehicles[0]).toEqual(
            expect.objectContaining({
                id: expect.anything(),
                make: sampleVehicle.make,
                model: sampleVehicle.model,
                category: sampleVehicle.category,
                price: sampleVehicle.price,
                quantity: sampleVehicle.quantity
            })
        );
    });
});

describe("GET /api/vehicles/search", () => {
    let userToken;
    let adminToken;

    beforeEach(async () => {
        userToken = await createAuthenticatedToken("customer");
        adminToken = await createAuthenticatedToken("admin");

        await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ make: "Toyota", model: "Camry", category: "Sedan", price: 25000, quantity: 5 });

        await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ make: "Honda", model: "Civic", category: "Sedan", price: 22000, quantity: 3 });

        await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ make: "Ford", model: "F-150", category: "Truck", price: 45000, quantity: 2 });
    });

    it("should return 401 if request is sent without JWT token", async () => {
        const response = await request(app)
            .get("/api/vehicles/search?make=Toyota");

        expect(response.statusCode).toBe(401);
    });

    it("should allow an authenticated user to search by make", async () => {
        const response = await request(app)
            .get("/api/vehicles/search?make=Toyota")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("vehicles");
        expect(response.body.vehicles).toHaveLength(1);
        expect(response.body.vehicles[0].make).toBe("Toyota");
    });

    it("should allow an authenticated user to search by model", async () => {
        const response = await request(app)
            .get("/api/vehicles/search?model=Civic")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("vehicles");
        expect(response.body.vehicles).toHaveLength(1);
        expect(response.body.vehicles[0].model).toBe("Civic");
    });

    it("should allow an authenticated user to search by category", async () => {
        const response = await request(app)
            .get("/api/vehicles/search?category=Sedan")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("vehicles");
        expect(response.body.vehicles).toHaveLength(2);
    });

    it("should allow an authenticated user to search using a price range (minPrice and maxPrice)", async () => {
        const response = await request(app)
            .get("/api/vehicles/search?minPrice=20000&maxPrice=30000")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("vehicles");
        expect(response.body.vehicles).toHaveLength(2);
        expect(response.body.vehicles.every(v => v.price >= 20000 && v.price <= 30000)).toBe(true);
    });

    it("should allow an authenticated user to combine multiple filters", async () => {
        const response = await request(app)
            .get("/api/vehicles/search?make=Toyota&category=Sedan&minPrice=20000&maxPrice=30000")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("vehicles");
        expect(response.body.vehicles).toHaveLength(1);
        expect(response.body.vehicles[0].make).toBe("Toyota");
        expect(response.body.vehicles[0].category).toBe("Sedan");
    });

    it("should return an empty array when no vehicles match the search criteria", async () => {
        const response = await request(app)
            .get("/api/vehicles/search?make=BMW")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("vehicles");
        expect(response.body.vehicles).toEqual([]);
    });
});

describe("PUT /api/vehicles/:id", () => {
    let userToken;
    let adminToken;
    let createdVehicleId;

    beforeEach(async () => {
        userToken = await createAuthenticatedToken("customer");
        adminToken = await createAuthenticatedToken("admin");

        const createRes = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(sampleVehicle);

        createdVehicleId = createRes.body.vehicle.id;
    });

    it("should allow an authenticated user to update an existing vehicle's fields and receive the updated vehicle back", async () => {
        const updateData = {
            make: "Toyota",
            model: "Camry Hybrid",
            category: "Sedan",
            price: 28000,
            quantity: 10
        };

        const response = await request(app)
            .put(`/api/vehicles/${createdVehicleId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send(updateData);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("vehicle");
        expect(response.body.vehicle).toMatchObject(updateData);
        expect(response.body.vehicle.id).toBe(createdVehicleId);
    });

    it("should return 401 if request is sent without JWT token", async () => {
        const updateData = { price: 30000 };

        const response = await request(app)
            .put(`/api/vehicles/${createdVehicleId}`)
            .send(updateData);

        expect(response.statusCode).toBe(401);
    });

    it("should return 404 when updating a non-existent vehicle id", async () => {
        const nonExistentId = "60d5ec49f1b2c8118456789a";
        const updateData = { price: 30000 };

        const response = await request(app)
            .put(`/api/vehicles/${nonExistentId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send(updateData);

        expect(response.statusCode).toBe(404);
    });

    it("should return 400 if payload is invalid (e.g., negative price or negative quantity)", async () => {
        const invalidPriceRes = await request(app)
            .put(`/api/vehicles/${createdVehicleId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ price: -500 });

        expect(invalidPriceRes.statusCode).toBe(400);

        const invalidQuantityRes = await request(app)
            .put(`/api/vehicles/${createdVehicleId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ quantity: -2 });

        expect(invalidQuantityRes.statusCode).toBe(400);
    });

    it("should allow a partial update (e.g. only price) and leave other fields unchanged", async () => {
        const partialUpdateData = { price: 29000 };

        const response = await request(app)
            .put(`/api/vehicles/${createdVehicleId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send(partialUpdateData);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("vehicle");
        expect(response.body.vehicle).toMatchObject({
            id: createdVehicleId,
            make: sampleVehicle.make,
            model: sampleVehicle.model,
            category: sampleVehicle.category,
            price: 29000,
            quantity: sampleVehicle.quantity
        });
    });
});

describe("DELETE /api/vehicles/:id", () => {
    let customerToken;
    let adminToken;
    let createdVehicleId;

    beforeEach(async () => {
        customerToken = await createAuthenticatedToken("customer");
        adminToken = await createAuthenticatedToken("admin");

        const createRes = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(sampleVehicle);

        createdVehicleId = createRes.body.vehicle.id;
    });

    it("should allow an admin to delete an existing vehicle successfully", async () => {
        const response = await request(app)
            .delete(`/api/vehicles/${createdVehicleId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
    });

    it("should return 403 if a non-admin authenticated user attempts to delete a vehicle", async () => {
        const response = await request(app)
            .delete(`/api/vehicles/${createdVehicleId}`)
            .set("Authorization", `Bearer ${customerToken}`);

        expect(response.statusCode).toBe(403);
    });

    it("should return 401 if request is sent without JWT token", async () => {
        const response = await request(app)
            .delete(`/api/vehicles/${createdVehicleId}`);

        expect(response.statusCode).toBe(401);
    });

    it("should return 404 when deleting a non-existent vehicle id", async () => {
        const nonExistentId = "60d5ec49f1b2c8118456789a";

        const response = await request(app)
            .delete(`/api/vehicles/${nonExistentId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(404);
    });

    it("should ensure the vehicle no longer appears in GET /api/vehicles after deletion", async () => {
        await request(app)
            .delete(`/api/vehicles/${createdVehicleId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        const getRes = await request(app)
            .get("/api/vehicles")
            .set("Authorization", `Bearer ${customerToken}`);

        expect(getRes.statusCode).toBe(200);
        expect(getRes.body.vehicles).toHaveLength(0);
    });
});

describe("POST /api/vehicles/:id/purchase", () => {
    let customerToken;
    let adminToken;
    let createdVehicleId;

    beforeEach(async () => {
        customerToken = await createAuthenticatedToken("customer");
        adminToken = await createAuthenticatedToken("admin");

        const createRes = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ ...sampleVehicle, quantity: 2 });

        createdVehicleId = createRes.body.vehicle.id;
    });

    it("should allow an authenticated user to purchase a vehicle with quantity > 0, decrease quantity by 1, and return the updated vehicle", async () => {
        const response = await request(app)
            .post(`/api/vehicles/${createdVehicleId}/purchase`)
            .set("Authorization", `Bearer ${customerToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("vehicle");
        expect(response.body.vehicle.id).toBe(createdVehicleId);
        expect(response.body.vehicle.quantity).toBe(1);
    });

    it("should return 409 out of stock if quantity is already 0 and not allow quantity to become negative", async () => {
        const zeroStockRes = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ ...sampleVehicle, quantity: 0 });

        const zeroStockVehicleId = zeroStockRes.body.vehicle.id;

        const response = await request(app)
            .post(`/api/vehicles/${zeroStockVehicleId}/purchase`)
            .set("Authorization", `Bearer ${customerToken}`);

        expect(response.statusCode).toBe(409);

        const getRes = await request(app)
            .get("/api/vehicles")
            .set("Authorization", `Bearer ${customerToken}`);

        const foundVehicle = getRes.body.vehicles.find(v => v.id === zeroStockVehicleId);
        expect(foundVehicle.quantity).toBe(0);
    });

    it("should return 404 when purchasing a non-existent vehicle id", async () => {
        const nonExistentId = "60d5ec49f1b2c8118456789a";

        const response = await request(app)
            .post(`/api/vehicles/${nonExistentId}/purchase`)
            .set("Authorization", `Bearer ${customerToken}`);

        expect(response.statusCode).toBe(404);
    });

    it("should return 401 if request is sent without JWT token", async () => {
        const response = await request(app)
            .post(`/api/vehicles/${createdVehicleId}/purchase`);

        expect(response.statusCode).toBe(401);
    });
});




