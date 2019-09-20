db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({
  given_name: "text",
  family_name: "text",
  email: "text"
});

db.posts.createIndex({ user: 1 });
db.posts.createIndex({ tags: 1 });
db.posts.createIndex({ message: "text", tags: "text" });