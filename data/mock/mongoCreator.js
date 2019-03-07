const bcrypt = require('bcrypt');
const fs = require('fs');
const util = require('util');
const faker = require('faker');
const uuid = require('uuid/v4');

const USER_NUM = 1000;
const POSTS_NUM = 10;
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

  console.log('Creating users: ');

  users = users.map(async (user, ix) => {
    // For the first half of the users add the next 10 users as friends.
    // For the second half ot the users add the previous 10 users as friends.
    const friends = (ix < USER_NUM / 2 ? users.slice(ix + 1, ix + 10) : users.slice(ix - 10, ix - 1)).map(user => user._id);

    // Same as above but for the next 5 users that are not already friends. 
    const friend_requests = (ix < USER_NUM / 2 ? users.slice(ix + 11, ix + 16) : users.slice(ix - 16, ix - 11)).map(user => user._id);

    const new_user = Object.assign(user, {
      password: await bcrypt.hash(user.password, 10),
      createdAt: +(faker.date.past()),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      friends,
      friend_requests,
      phone_number: faker.phone.phoneNumber(),
      gender: GENDER[Math.floor(Math.random() * GENDER.length)]
    });

    process.stdout.write('.');

    return new_user;
  });

  users = await Promise.all(users);

  const usersJSON = JSON.stringify(users, null, ' ');

  const file_output = `
db.users.insertMany(
  ${usersJSON},
  { ordered: false }
);`;

  fs.writeFileSync(`${__dirname}/mongo/users-social.js`, file_output);
  console.log('User file have been saved');

  const posts = [];

  console.log('Creating posts: ');

  users.forEach(user => {
    for (let i = 0; i < POSTS_NUM; i++) {
      process.stdout.write('.');

      const post = {
        _id: uuid(),
        user: user._id,
        message: faker.lorem.paragraphs(),
        createdAt: +(faker.date.past()),
        tags: faker.lorem.words().split(' ')
      };

      if (i % 2 === 0) {
        post.visible_to = user.friends
          .slice(0, Math.round(Math.random() * user.friends.length));
      } else {
        post.visible_to = user.friends;
      }

      posts.push(post);
    }
  });

  const file_output_posts = `
db.posts.insertMany(
  ${JSON.stringify(posts, null, ' ')},
  { ordered: false }
);`;

  fs.writeFileSync(`${__dirname}/mongo/posts-social.js`, file_output_posts);
  console.log('Posts file have been saved');

}

createUsers();
