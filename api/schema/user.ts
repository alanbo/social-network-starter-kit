import { ObjectType, InputType, Field, ID } from 'type-graphql';
import { Length, IsEmail, IsPhoneNumber, IsIn, Matches } from "class-validator";

@InputType()
export class UserInput {
  @Field()
  @Length(2, 10)
  first_name: string;

  @Field()
  @Length(2, 15)
  last_name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsPhoneNumber(null)
  phone_number: string

  @Field()
  @IsIn(['male', 'female', 'other'])
  gender: string;

  @Field()
  @Matches(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/)
  password: string;
}

@ObjectType()
export class UserBasic {
  @Field(type => ID)
  _id: string;

  @Field()
  email: string;

  @Field()
  first_name: string;

  @Field()
  last_name: string;
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
  first_name: string;

  @Field()
  last_name: string;

  @Field()
  email: string;

  @Field()
  phone_number: string;

  @Field()
  gender: string;

  @Field()
  createdAt: Date;

  @Field(type => [UserBasic], { nullable: true })
  friends?: UserBasic[];

  @Field(type => [Group], { nullable: true })
  groups?: Group[];
}
