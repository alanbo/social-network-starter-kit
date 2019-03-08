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

  @Field(type => [String], { nullable: true })
  tags: string[];

  @Field(type => [UserBasic], { nullable: true })
  visible_to: UserBasic[];
}

@InputType()
export class PostInput {
  @Length(5, 500)
  @Field()
  message: string;

  @ArrayUnique()
  @MaxLength(15, { each: true })
  @Field(type => [String])
  tags: string[];

  @ArrayUnique()
  @IsUUID("4", { each: true })
  @Field(type => [ID], { nullable: true })
  visible_to: string[];
}

@InputType()
export class PostInputUpdate {
  @IsUUID("4")
  @Field()
  _id: string

  @Length(5, 500)
  @Field({ nullable: true })
  message: string;

  @ArrayUnique()
  @MaxLength(15, { each: true })
  @Field(type => [String], { nullable: true })
  tags_add: string[];

  @ArrayUnique()
  @MaxLength(15, { each: true })
  @Field(type => [String], { nullable: true })
  tags_replace: string[];

  @ArrayUnique()
  @MaxLength(15, { each: true })
  @Field(type => [String], { nullable: true })
  tags_delete: string[];

  @ArrayUnique()
  @IsUUID("4", { each: true })
  @Field(type => [ID], { nullable: true })
  visible_to_add: string[];

  @ArrayUnique()
  @IsUUID("4", { each: true })
  @Field(type => [ID], { nullable: true })
  visible_to_delete: string[];

  @ArrayUnique()
  @IsUUID("4", { each: true })
  @Field(type => [ID], { nullable: true })
  visible_to_replace: string[];
}
