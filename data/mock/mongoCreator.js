const bcrypt = require('bcrypt');
const fs = require('fs');
const util = require('util');
const faker = require('faker');
const uuid = require('uuid/v4');

const USER_NUM = 1000;
const GENDER = ['male', 'female', 'other'];

async function createUsers() {
  let users = [];

  for (let i = 0; i <= USER_NUM; i++) {
    users.push({
      _id: uuid(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password()
    });

  }

  fs.writeFileSync(`${__dirname}/users-login-data.json`, JSON.stringify(users, null, '  '));

  users = users.map(async (user, ix) => {
    const friends = (ix < USER_NUM / 2 ? users.slice(ix + 1, ix + 10) : users.slice(ix + 1, ix + 10)).map(user => user._id);

    const new_user = Object.assign(user, {
      password: await bcrypt.hash(user.password, 10),
      createdAt: +(faker.date.past()),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      friends,
      phone_number: faker.phone.phoneNumber(),
      gender: GENDER[Math.round(Math.random() * GENDER.length)]
    });

    process.stdout.write('.');

    return new_user;
  });
  users = JSON.stringify(await Promise.all(users), null, ' ');

  const file_output = `
db.users.insertMany(
  ${users},
  { ordered: false }
);`;

  fs.writeFileSync(`${__dirname}/mongo/users-social.js`, file_output);
}



// const readFileSync = util.promisify(fs.readFileSync);

async function transformUsers() {
  const usersJSON = fs.readFileSync(`${__dirname}/json-data/users-data.json`).toString();
  const keys = {};

  const users = JSON.parse(usersJSON)
    // remove duplicate ids
    .map(user => {
      if (typeof keys[user._id] === 'number') {
        keys[user._id]++;
      } else {
        keys[user._id] = 1;
      }

      return user;
    })
    .filter(({ _id }) => keys[_id] === 1)
    .map(async (user) => {
      user.password = await bcrypt.hash(user.password, 10);

      return user;
    });

  const new_users = await Promise.all(users);
  const file_output = `
db.users.insertMany(
  ${JSON.stringify(new_users)},
  { ordered: false }
);`;

  fs.writeFileSync(`${__dirname}/mongo/users-social.js`, file_output);

  console.log(new_users);
}

// transformUsers();
createUsers();


