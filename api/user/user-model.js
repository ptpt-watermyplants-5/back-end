const db = require('../../data/db-config');

module.exports = {
    findBy,
    findById,
    addUser,
    updateUser,
    getUserPlants,
    addPlant,
    removePlant,
    removeUser,
    updatePlant,
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
    const plants = await db('plants').where({ "user_id": id }).orderBy('plant_id','asc')
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

function removePlant(id, uid) {
    return db('plants').where({ "user_id": uid,"plant_id": id}).del();
};

async function updatePlant(id, plant, uid) {
    await db('plants').where({ "plant_id": id }).update(plant);
    return getUserPlants(uid);
};

function removeUser(id) {
    return db('users').where({ "user_id": id}).del();
}
