import request from "supertest";
import app from '../src/app.js';

describe("Health API",()=>{
    it("Should return API running", async()=>{
        const res = await request(app).get("/api/health");

        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe("API Running")
    })
})