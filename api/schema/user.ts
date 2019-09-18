import { ObjectType, InputType, Field, ID } from 'type-graphql';
import { Length, IsEmail, IsPhoneNumber, IsIn, Matches } from "class-validator";
import { Post } from './post';



@ObjectType()
export class UserBasic {
  @Field(type => ID)
  _id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  given_name?: string;

  @Field({ nullable: true })
  family_name?: string;
}

@ObjectType()
export class Group {
  @Field(type => ID)
  _id: string;

  @Field()
  name: string;

  @Field(type => [UserBasic])
  users: UserBasic[];

  @Field()
  description: string
}


@ObjectType()
export class User {
  @Field(type => ID)
  _id: string;

  @Field()
  given_name: string;

  @Field()
  family_name: string;

  @Field()
  email: string;

  @Field()
  phone_number: string;

  @Field()
  gender: string;

  @Field()
  birthdate: string;

  @Field(type => [UserBasic], { nullable: true })
  friends?: UserBasic[];

  @Field(type => [UserBasic], { nullable: true })
  friend_requests?: UserBasic[];

  @Field(type => [Post], { nullable: true })
  posts?: Post[];
}
