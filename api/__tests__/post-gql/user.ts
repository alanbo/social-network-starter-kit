export const USER = `
query GetUser($email: String!) {
  user(email: $email) {
    email
    first_name
    last_name
    gender
    createdAt
  }
}
`;