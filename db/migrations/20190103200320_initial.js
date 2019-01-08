exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', table => {
      table.increments('user_id').primary();
      table.string('user_name');
      table.string('user_token');
      table.boolean('current_user');
    }),
    knex.schema.createTable('dreams', table => {
      table.increments('dream_id').primary();
      table.text('dream');
      table.date('date');
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.user_id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('dreams'),
    knex.schema.dropTableIfExists('users')
  ]);
};
