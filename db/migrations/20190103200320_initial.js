exports.up = function(knex, Promise) {
  return knex.schema.createTable('dreams', t => {
    t.increments('id').primary();
    t.text('dream');
    t.date('date');
    t.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('dreams');
};
