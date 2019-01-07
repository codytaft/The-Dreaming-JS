const dreams = require('../dreams/newDreams.json');

const createDream = (knex, dream, user) => {
  return knex('dreams').insert(
    {
      date: dream.date,
      dream: dream.dream,
      user_id: user
    },
    ['id', 'date', 'dream', 'user_id']
  );
};

const createUser = knex => {
  return knex('users').insert(
    { user_name: 'Cody Taft', user_token: '103789457650925905775' },
    'id'
  );
};

exports.seed = function(knex, Promise) {
  return knex('dreams')
    .del()
    .then(() => knex('users').del())
    .then(() => {
      return createUser(knex);
    })
    .then(user => {
      let dreamPromises = [];
      dreams.forEach(dream => {
        dreamPromises.push(createDream(knex, dream, user[0]));
      });
      return Promise.all(dreamPromises);
    })
    .then(() => console.log('Seeding complete'))
    .catch(error => console.log(`Error seeding data: ${error}`));
};
