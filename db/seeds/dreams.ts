const dreams = require('../dreams/newDreams.json') as Dream[];
import Knex from 'knex';

const createDream = async (knex: Knex, dream: Dream, user: string): Promise<Dream> => {
  await knex('dreams').insert(
    dream,
    ['id', 'date', 'dream', 'user_id']
  );

  return dream;
};

const createUser = async (knex: Knex): Promise<string> => {
  const token = "103789457650925905775";
  await knex('users').insert(
    { user_name: 'Cody Taft', user_token: token },
    'id'
  );

    return token;
};

exports.seed = async function(knex: Knex) {
  try {
    await knex("dreams")
      .del();
    await knex("users").del();
    const user = await createUser(knex);
    let dreamPromises: Promise<Dream>[] = [];
    dreams.forEach(dream => {
      dreamPromises.push(createDream(knex, dream, user));
    });
    await Promise.all(dreamPromises);
    return console.log("Seeding complete");
  }
  catch (error) {
    return console.log(`Error seeding data: ${error}`);
  }
};
