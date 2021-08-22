const db = require('../../data/db-config');

module.exports = {
    findBy,
    findById,
    addUser,
    updateUser,
    getUserPlants,
    addPlant,
    removePlant,
};

function findBy(username) {
    return db('users').where({ username }).first();
}

function findById(id) {
    return db('users').where({ "user_id": id }).first();
};

async function addUser(user) {
    await db('users').insert(user);
    return findBy(user.username);
};

async function updateUser(id, user) {
    await db('users').where({ "user_id": id }).update(user);
    return findById(id);
};

async function getUserPlants(id) {
    const user = await db('users').where({ "user_id": id }).first();
    const plants = await db('plants').where({ "user_id": id })
        .select('plant_id','nickname','species','h20_frequency','image_url');

    return {
        'user_id': user.user_id,
        'username': user.username,
        'plants': plants,
    }
};

async function addPlant(uid, plant) {
    plant.user_id = uid;
    await db('plants').insert(plant);

    return getUserPlants(uid);
};

function removePlant(id) {
    return db('plants').where({ "plant_id": id}).del();
};
