import request from "supertest";
import bcrypt from "bcrypt";
import app from "../src/app.js";
import User from "../src/models/User.js";

describe("POST /api/vehicles", () => {
    let adminToken;
    let customerToken;

    beforeEach(async () => {
        const adminPasswordHash = await bcrypt.hash("adminPass123", 10);
        await User.create({
            name: "Admin User",
            email: "admin@example.com",
            passwordHash: adminPasswordHash,
            role: "admin"
        });

        const adminLoginRes = await request(app)
            .post("/api/auth/login")
            .send({
                email: "admin@example.com",
                password: "adminPass123"
            });
        adminToken = adminLoginRes.body.token;

        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Customer User",
                email: "customer@example.com",
                password: "customerPass123"
            });

        const customerLoginRes = await request(app)
            .post("/api/auth/login")
            .send({
                email: "customer@example.com",
                password: "customerPass123"
            });
        customerToken = customerLoginRes.body.token;
    });

    it("should allow an admin to create a vehicle successfully", async () => {
        const vehicleData = {
            make: "Toyota",
            model: "Camry",
            category: "Sedan",
            price: 25000,
            quantity: 5
        };

        const response = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(vehicleData);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("vehicle");
        expect(response.body.vehicle).toHaveProperty("id");
        expect(response.body.vehicle.make).toBe(vehicleData.make);
        expect(response.body.vehicle.model).toBe(vehicleData.model);
        expect(response.body.vehicle.category).toBe(vehicleData.category);
        expect(response.body.vehicle.price).toBe(vehicleData.price);
        expect(response.body.vehicle.quantity).toBe(vehicleData.quantity);
    });

    it("should return 401 if request is sent without JWT token", async () => {
        const vehicleData = {
            make: "Toyota",
            model: "Camry",
            category: "Sedan",
            price: 25000,
            quantity: 5
        };

        const response = await request(app)
            .post("/api/vehicles")
            .send(vehicleData);

        expect(response.statusCode).toBe(401);
    });

    it("should return 403 if a non-admin user attempts to create a vehicle", async () => {
        const vehicleData = {
            make: "Toyota",
            model: "Camry",
            category: "Sedan",
            price: 25000,
            quantity: 5
        };

        const response = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${customerToken}`)
            .send(vehicleData);

        expect(response.statusCode).toBe(403);
    });

    it("should return 400 if required fields are missing", async () => {
        const incompleteData = {
            model: "Camry",
            category: "Sedan",
            price: 25000,
            quantity: 5
        };

        const response = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(incompleteData);

        expect(response.statusCode).toBe(400);
    });

    it("should return 400 if price is 0 or negative", async () => {
        const invalidPriceData = {
            make: "Toyota",
            model: "Camry",
            category: "Sedan",
            price: 0,
            quantity: 5
        };

        const response = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(invalidPriceData);

        expect(response.statusCode).toBe(400);
    });

    it("should return 400 if quantity is negative", async () => {
        const invalidQuantityData = {
            make: "Toyota",
            model: "Camry",
            category: "Sedan",
            price: 25000,
            quantity: -1
        };

        const response = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(invalidQuantityData);

        expect(response.statusCode).toBe(400);
    });

    it("should return a response containing id, make, model, category, price, and quantity", async () => {
        const vehicleData = {
            make: "Honda",
            model: "Civic",
            category: "Sedan",
            price: 22000,
            quantity: 3
        };

        const response = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(vehicleData);

        expect(response.statusCode).toBe(201);
        const vehicle = response.body.vehicle || response.body;
        expect(vehicle).toHaveProperty("id");
        expect(vehicle).toHaveProperty("make", "Honda");
        expect(vehicle).toHaveProperty("model", "Civic");
        expect(vehicle).toHaveProperty("category", "Sedan");
        expect(vehicle).toHaveProperty("price", 22000);
        expect(vehicle).toHaveProperty("quantity", 3);
    });
});

describe("GET /api/vehicles", () => {
    let userToken;

    beforeEach(async () => {
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: "user@example.com",
                password: "password123"
            });

        const loginRes = await request(app)
            .post("/api/auth/login")
            .send({
                email: "user@example.com",
                password: "password123"
            });

        userToken = loginRes.body.token;
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
        expect(response.body).toHaveProperty("vehicles");
        expect(Array.isArray(response.body.vehicles)).toBe(true);
        expect(response.body.vehicles.length).toBe(0);
    });

    it("should allow an authenticated user to retrieve all vehicles successfully", async () => {
        const adminPasswordHash = await bcrypt.hash("adminPass123", 10);
        await User.create({
            name: "Admin User",
            email: "admin_get@example.com",
            passwordHash: adminPasswordHash,
            role: "admin"
        });

        const adminLoginRes = await request(app)
            .post("/api/auth/login")
            .send({
                email: "admin_get@example.com",
                password: "adminPass123"
            });
        const adminToken = adminLoginRes.body.token;

        await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                make: "Ford",
                model: "Mustang",
                category: "Sports",
                price: 55000,
                quantity: 2
            });

        const response = await request(app)
            .get("/api/vehicles")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("vehicles");
        expect(Array.isArray(response.body.vehicles)).toBe(true);
        expect(response.body.vehicles.length).toBe(1);
    });

    it("should return all available vehicles containing id, make, model, category, price, and quantity", async () => {
        const adminPasswordHash = await bcrypt.hash("adminPass123", 10);
        await User.create({
            name: "Admin User",
            email: "admin_get_fields@example.com",
            passwordHash: adminPasswordHash,
            role: "admin"
        });

        const adminLoginRes = await request(app)
            .post("/api/auth/login")
            .send({
                email: "admin_get_fields@example.com",
                password: "adminPass123"
            });
        const adminToken = adminLoginRes.body.token;

        await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                make: "Tesla",
                model: "Model 3",
                category: "Electric",
                price: 40000,
                quantity: 4
            });

        const response = await request(app)
            .get("/api/vehicles")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(200);
        const vehicles = response.body.vehicles || response.body;
        expect(Array.isArray(vehicles)).toBe(true);
        expect(vehicles.length).toBeGreaterThan(0);
        const vehicle = vehicles[0];
        expect(vehicle).toHaveProperty("id");
        expect(vehicle).toHaveProperty("make", "Tesla");
        expect(vehicle).toHaveProperty("model", "Model 3");
        expect(vehicle).toHaveProperty("category", "Electric");
        expect(vehicle).toHaveProperty("price", 40000);
        expect(vehicle).toHaveProperty("quantity", 4);
    });
});

