
exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
      tbl.increments('user_id');
      tbl.string('username')
      .unique()
      .notNullable();
      tbl.string('password')
      .notNullable();
      tbl.bigint('phone_number');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
