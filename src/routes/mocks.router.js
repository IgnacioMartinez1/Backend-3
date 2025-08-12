import { Router } from 'express';
import { faker } from '@faker-js/faker';
import { createHash } from '../utils/index.js';
import petsController from '../controllers/pets.controller.js';
import userModel from '../dao/models/User.js';
import petModel from '../dao/models/Pet.js';

const router = Router();

router.get('/mockingpets', petsController.getAllPets);

const generateMockUsers = async (count) => {
    const users = [];
    for (let i = 0; i < count; i++) {
        const hashedPassword = await createHash('coder123');
        users.push({
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            email: faker.internet.email(),
            password: hashedPassword,
            role: faker.helpers.arrayElement(['user', 'admin']),
            pets: [],
        });
    }
    return users;
};

router.get('/mockingusers', async (req, res) => {
    const users = await generateMockUsers(50);
    res.send({ status: 'success', payload: users });
});


router.post('/generateData', async (req, res) => {
    const { users: userCount, pets: petCount } = req.body;

    if (!userCount || !petCount) {
        return res.status(400).send({ status: 'error', error: 'Missing parameters' });
    }

    const users = await generateMockUsers(userCount);
    await userModel.insertMany(users);

 
    const pets = [];
    for (let i = 0; i < petCount; i++) {
        pets.push({
            name: faker.animal.type(),
            specie: faker.helpers.arrayElement(['dog', 'cat', 'bird']),
            birthDate: faker.date.past(),
            adopted: false,
            owner: null,
            image: faker.image.animals(),
        });
    }
    await petModel.insertMany(pets);

    res.send({ status: 'success', message: 'Data generated and inserted successfully' });
});

export default router;