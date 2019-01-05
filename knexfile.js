// Update with your config settings.
require('dotenv').load();

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      user: 'root',
      password: process.env.MYSQL_PASSWORD,
      database: 'dreaming'
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },

  // staging: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user: 'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  //   // },

  production: {
    client: 'mysql',
    connection: {
      host: 'us-cdbr-iron-east-01.cleardb.net',
      user: 'b9b3aed7dfac50',
      password: '35fd56f9',
      database: 'heroku_9160596e5d35f9d'
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  }
};
