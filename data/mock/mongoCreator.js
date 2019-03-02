const bcrypt = require('bcrypt');
const fs = require('fs');
const util = require('util');

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

transformUsers();


