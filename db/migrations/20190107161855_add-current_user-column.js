exports.up = function(knex, Promise) {
  return knex.schema.table('users', table => {
    table.boolean('current_user');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', table => {
    table.dropColumn('current_user');
  });
};
