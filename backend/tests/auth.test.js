import request from "supertest";
import app from "../src/app.js";
import expectCookies from "supertest/lib/cookies";

describe("POST /api/auth/register", ()=>{
    it("should register a new user successfully", async()=>{
        const response = await request(app)
        .post("/api/auth/register")
        .send({
            name:"Aryan",
            email:"aryan@example.com",
            password:"password123"
        })
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("user");
        expect(response.body.user.email).toBe("aryan@example.com")
        expect(response.body.user).not.toHaveProperty("password");
    })

    it("should return 400 if required fields are missing", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                email: "aryan@example.com"
            });

        expect(response.statusCode).toBe(400);
    });

        it("should return 409 if email already exists", async () => {

        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Aryan",
                email: "aryan@example.com",
                password: "password123"
            });

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Aryan",
                email: "aryan@example.com",
                password: "password123"
            });

        expect(response.statusCode).toBe(409);
    });

    // it("should not store password in plain text", async () => {

    //     await request(app)
    //         .post("/api/auth/register")
    //         .send({
    //             name: "Aryan",
    //             email: "aryan@example.com",
    //             password: "password123"
    //         });

    // });
})