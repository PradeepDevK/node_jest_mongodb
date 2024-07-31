const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../src/models/user');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await User.syncIndexes(); // Ensure indexes are created
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await User.deleteMany({});
});

describe('User Model Unit Tests', () => {
    it('should create a new user', async() => {
        const user = new User({
            name: "Pradeep Raj",
            email: "pradeep@example.com",
            password: "12345"
        });

        await user.save();
        const foundUser = await User.findOne({email: 'pradeep@example.com'});
        expect(foundUser).not.toBeNull();
        expect(foundUser.name).toBe('Pradeep Raj');
    });

    it('should find a user by email', async() => {
        const user = new User({
            name: "Pradeep Raj",
            email: "pradeep@example.com",
            password: "12345"
        });

        await user.save();
        const foundUser = await User.findOne({email: 'pradeep@example.com'});
        expect(foundUser).not.toBeNull();
        expect(foundUser.email).toBe('pradeep@example.com');
    });

    it('should update a user', async () => {
        const user = new User({
            name: "Pradeep Raj",
            email: "pradeep@example.com",
            password: "12345"
        });

        await user.save();
        user.name = "Pradeep";
        await user.save();

        const updatedUser = await User.findOne({email: "pradeep@example.com"});
        expect(updatedUser.name).toBe("Pradeep");
    });

    it('should delete a user', async() => {
        const user = new User({
            name: "Pradeep Raj",
            email: "pradeep@example.com",
            password: "12345"
        });

        await user.save();
        await User.deleteOne({email: "pradeep@example.com"});

        const deletedUser = await User.findOne({email: "pradeep@example.com"});
        expect(deletedUser).toBeNull();
    });

    it('should not create a user with a duplicate email', async () => {
        const user1 = new User({
            name: "Pradeep Raj",
            email: "pradeep@example.com",
            password: "12345"
        });

        const user2 = new User({
            name: "Pradeep Raj",
            email: "pradeep@example.com",
            password: "12345"
        });

        let error;
        await user1.save();
        try {
            await user2.save();
        } catch(e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.name).toBe("MongoServerError");
        expect(error.code).toBe(11000);
    });

    it('should require a name, email, password', async () => {
        const user = new User();

        let error;
        try {
            await user.save();
        } catch(e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.errors.name).toBeDefined();
        expect(error.errors.email).toBeDefined();
        expect(error.errors.password).toBeDefined();
    });
});