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

  //mysql production
  // production: {
  //   client: 'mysql',
  //   connection: {
  //     host: 'us-cdbr-iron-east-01.cleardb.net',
  //     user: 'b9b3aed7dfac50',
  //     password: '35fd56f9',
  //     database: 'heroku_9160596e5d35f9d'
  //   },
  //   migrations: {
  //     directory: './db/migrations'
  //   },
  //   seeds: {
  //     directory: './db/seeds'
  //   },
  //   useNullAsDefault: true
  // }

  //mariadb production
  production: {
    client: 'mysql',
    connection: {
      host: 'bfjrxdpxrza9qllq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
      user: 'n878agjksfo91crq',
      password: 'rmpnnho953q9pjxm',
      database: 'gpn0gxfv1hboiccr',
      port: 3306
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    },
    useNullAsDefault: true
  }
};
