
exports.up = function(knex) {
  return knex.schema.createTable('plants', tbl => {
    tbl.increments('plant_id');
    tbl.integer('user_id')
    .notNullable();
    tbl.string('nickname')
    .notNullable();
    tbl.string('species')
    .notNullable();
    tbl.string('h20_frequency')
    .notNullable();
    tbl.string('image_url')
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('plants');
};
