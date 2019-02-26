import { ObjectType, InputType, Field, ID } from 'type-graphql';
import { Length, IsEmail, IsPhoneNumber, IsIn } from "class-validator";

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
}

@ObjectType()
export class User {
  @Field(type => ID)
  id: string;

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
}
