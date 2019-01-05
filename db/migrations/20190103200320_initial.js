exports.up = function(knex, Promise) {
  return knex.schema.createTable('dreams', t => {
    t.increments('id').primary();
    t.text('dream');
    t.date('date');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('dreams');
};
