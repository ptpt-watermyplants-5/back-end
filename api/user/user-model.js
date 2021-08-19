const db = require('../../data/db-config');

module.exports = {
    findBy,
    findById,
    addUser,
};

function findBy(username) {
    return db('users').where({ username }).first();
}

function findById(id) {
    return db('users').where({ id }).first();
};

async function addUser(user) {
    const [id] = await db('users').insert(user);
    return findById(id);
};
