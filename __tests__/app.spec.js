const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

describe('CRUD Operations', () => {
    it('should create a new user', async () => {
        const response = await request(app).post('/api/users').send({
            name: "Pradeep Raj",
            email: "pradeep@example.com",
            password: "12345"
        });

        expect(response.status).toBe(201);
        expect(response.body.name).toBe("Pradeep Raj");
        expect(response.body.email).toBe("pradeep@example.com");
    });

    it('should get all users', async () => {
        await request(app).post('/api/users').send({
            name: "Pradeep Raj",
            email: "pradeep@example.com",
            password: "12345"
        });

        const response = await request(app).get('/api/users');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe('Pradeep Raj');
    });

    it('should get a user by id', async() => {
        const user = await request(app).post('/api/users').send({
            name: "Pradeep Raj",
            email: "pradeep@example.com",
            password: "12345"
        });
        
        const response = await request(app).get(`/api/users/${user.body._id}`);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Pradeep Raj");
    });

    it('should update a user by id', async() => {
        const user = await request(app).post('/api/users').send({
            name: "Pradeep Raj",
            email: "pradeep@example.com",
            password: "12345"
        });

        const response = await request(app).put(`/api/users/${user.body._id}`).send({
            name: "Pradeep"
        });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Pradeep");
    });

    it('should delete a user by id', async() => {
        const user = await request(app).post('/api/users').send({
            name: "Pradeep Raj",
            email: "pradeep@example.com",
            password: "12345"
        });

        const response = await request(app).delete(`/api/users/${user.body._id}`);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Pradeep Raj");

        const getResponse = await request(app).get(`/api/users/${user.body._id}`);
        expect(getResponse.status).toBe(404);
    });
});