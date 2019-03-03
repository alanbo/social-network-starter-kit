import { ObjectType, InputType, Field, ID } from 'type-graphql';
import { Length, ArrayUnique, MaxLength, IsUUID } from "class-validator";
import { UserBasic, User } from './user';

@ObjectType()
export class Post {
  @Field(type => ID)
  _id: string;

  @Field(type => UserBasic)
  user: UserBasic;

  @Field()
  message: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  tags: string[];

  @Field(type => UserBasic, { nullable: true })
  visibleTo: UserBasic;
}

@InputType()
export class PostInput {
  @IsUUID("4")
  @Field(type => ID)
  user: UserBasic;

  @Length(5, 500)
  @Field()
  message: string;

  @ArrayUnique()
  @MaxLength(15, { each: true })
  @Field()
  tags: string[];

  @ArrayUnique()
  @IsUUID("4", { each: true })
  @Field(type => [ID])
  visibleTo: string[];
}