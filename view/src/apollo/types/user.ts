export interface User {
  _id: string
  email: string
  given_name: string | null
  family_name: string | null
  nickname: string | null
  phone_number: string | null
  gender: string | null
  birthdate: string | null
  email_verified: boolean | null
}