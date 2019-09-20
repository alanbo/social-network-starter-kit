import { UserBasic } from '../../schema/user';
import { UserMongo } from '../../resolvers/user';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

interface UserMongoData extends Omit<UserMongo, 'createdAt'> {
  createdAt: number
}

export function pickUserBasic({ _id, email, given_name, family_name }: UserMongoData): UserBasic {
  return { _id, email, given_name, family_name };
};