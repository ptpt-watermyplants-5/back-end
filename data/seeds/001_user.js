
exports.seed = function(knex) {
  return knex('users').truncate()
    .then(function () {
      return knex('users').insert([
        {
          user_id: 1,
          username: 'jAppleseed',
          password: '$2b$08$ixPA7/B7IOeV63k.Hi5jvO46CT8rqQIkALlqr8CoeCUgLkdFAzUdO',
          phone_number: 7775550000
        }
      ]);
    });
};
