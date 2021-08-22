
exports.seed = function(knex) {
  return knex('plants').truncate()
    .then(function () {
      return knex('plants').insert([
        {user_id: 1, nickname: 'red delicious apple tree', species: "Malus 'Red' Delicious", h20_frequency: 'daily'},
        {user_id: 1, nickname: 'cactus', species: 'Cacti', h20_frequency: 'infrequently'},
      ]);
    });
};
