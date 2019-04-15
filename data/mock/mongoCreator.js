const bcrypt = require('bcrypt');
const fs = require('fs');
const util = require('util');
const faker = require('faker');
const uuid = require('uuid/v4');

// Convention:
// Every user has next 5 users and 5 previous users as friends.
// The exception is the begining and the end of the arrray where only remaining prev/next users are added.
// Every user has from after 5 next users to 

// const USER_NUM = 100;
const POSTS_NUM = 10;
const GENDER = ['male', 'female', 'other'];

async function createUsers() {
  // let users = [];

  // for (let i = 0; i <= USER_NUM; i++) {
  //   users.push({
  //     _id: uuid(),
  //     email: faker.internet.email().toLowerCase(),
  //     password: faker.internet.password()
  //   });

  // }

  // fs.writeFileSync(`${__dirname}/users-login-data.json`, JSON.stringify(users, null, '  '));
  let users = JSON.parse(fs.readFileSync(`${__dirname}/json/users-login-data.json`).toString());

  console.log('Creating users: ');

  users = users.map(async (user, ix) => {
    // For the first half of the users add the next 10 users as friends.
    // For the second half ot the users add the previous 10 users as friends.
    // const friends = (ix < USER_NUM / 2 ? users.slice(ix + 1, ix + 10) : users.slice(ix - 10, ix - 1)).map(user => user._id);

    let friends;
    let friend_requests;

    if (ix < 6) {
      friends = users.slice(0, ix + 6);
      // adds next 5 users as friends.
    } else if (ix < users.length - 6) {
      friends = users.slice(ix - 5, ix + 6);
      // if there is less then 5 more users adds all the remaining users.
    } else {
      const remaining_num = users.length - ix;

      friends = users.slice(ix - 5, ix + remaining_num);
    }

    // make sure only ids are in the array and remove the user from its friends.
    friends = friends.map(friend => friend._id).filter(id => !(id === user._id));

    // adds next 5 after 5 users as friend requests.
    if (ix < users.length - 11) {
      friend_requests = users.slice(ix + 6, ix + 11);
      // if there is less then 5 + 5 more users adds all the remaining users after 5 next ones.
    } else {
      const remaining_num = users.length - ix;

      friend_requests = users.slice(ix + 6, ix + remaining_num);
    }

    friend_requests = friend_requests.map(user => user._id);


    const new_user = Object.assign(user, {
      password: await bcrypt.hash(user.password, 10),
      createdAt: faker.date.past().toISOString(),
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
  ${usersJSON.replace(/"createdAt": (".+")/g, '"createdAt": new ISODate($1)')},
  { ordered: false }
);`;

  fs.writeFileSync(`${__dirname}/json/users-social.json`, usersJSON);
  fs.writeFileSync(`${__dirname}/mongo/users-social.js`, file_output);
  console.log('User file have been saved');



  function createComment(user_id) {
    const { first_name, last_name, email } = users.find(user => user._id === user_id);

    const comment = {
      _id: uuid(),
      message: faker.lorem.paragraphs(),
      // TO DO: it may be suitable to add a condition
      // to make the comment creaton date later than that of the post
      createdAt: faker.date.past().toISOString(),
      user: {
        _id: user_id,
        first_name,
        last_name,
        email
      }
    }

    return comment;
  }

  const posts = [];

  console.log('Creating posts: ');

  users.forEach(user => {
    for (let i = 0; i < POSTS_NUM; i++) {
      process.stdout.write('.');

      const post = {
        _id: uuid(),
        user: user._id,
        message: faker.lorem.paragraphs(),
        createdAt: faker.date.past().toISOString(),
        tags: faker.lorem.words().split(' '),
        comments: [],
        likes: []
      };

      if (i % 2 === 0) {
        post.visible_to = user.friends
          .slice(0, Math.round(Math.random() * user.friends.length));
      } else {
        post.visible_to = user.friends;
      }

      // add one comment from the first 3 friends of the user.
      user.friends.slice(0, 3).forEach(friend_id => {
        const comment = createComment(friend_id);

        post.comments.push(comment);

        // for the purpose of sample data the same user that commented like the post
        post.likes.push(comment.user);
      });

      posts.push(post);
    }
  });

  const postsJSON = JSON.stringify(posts, null, ' ');

  const file_output_posts = `
db.posts.insertMany(
  ${postsJSON.replace(/"createdAt": (".+")/g, '"createdAt": new ISODate($1)')},
  { ordered: false }
);`;

  fs.writeFileSync(`${__dirname}/json/posts-social.json`, postsJSON);
  fs.writeFileSync(`${__dirname}/mongo/posts-social.js`, file_output_posts);
  console.log('Posts file have been saved');

}

createUsers();
