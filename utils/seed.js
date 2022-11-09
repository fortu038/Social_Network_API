const connection = require('../config/connection');
const { Thought, User } = require('../models');
const { getRandomName, getRandomThoughts } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  await Thought.deleteMany({});

  await User.deleteMany({});

  const users = [];

  for (let i = 0; i < 10; i++) {
    // const thoughts = getRandomThoughts(5);
    const thoughts = [];

    const username = getRandomName();

    const compactName = username.replace(/\s/g, "").toLowerCase()

    const email = `${compactName}@example.com`;

    const friends = [];

    users.push({
      username,
      email,
      thoughts,
      friends,
    });
  }

  // Add users to the collection and await the results
  await User.collection.insertMany(users);

  // Log out the seed data to indicate what should appear in the database
  console.table(users);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
