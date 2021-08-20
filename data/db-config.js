const knex = require('knex');
const knexConfigs = require('../knexfile.js');
const environment = process.env.NODE_ENV || 'development';

module.exports = knex(knexConfigs[environment]);
