const dreams = require('../dreams/newDreams.json');

const createDream = (knex, dream) => {
  return knex('dreams').insert(
    {
      date: dream.date,
      dream: dream.dream
    },
    ['id', 'date', 'dream']
  );
};

exports.seed = function(knex, Promise) {
  return knex('dreams')
    .del()
    .then(() => {
      let dreamPromises = [];

      dreams.forEach(dream => {
        dreamPromises.push(createDream(knex, dream));
      });
      return Promise.all(dreamPromises);
    })
    .then(() => console.log('Seeding complete'))
    .catch(error => console.log(`Error seeding data: ${error}`));
};
