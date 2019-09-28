/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface PostInput {
  message: string;
  tags: string[];
  visible_to?: string[] | null;
}

export interface PostInputUpdate {
  _id: string;
  message?: string | null;
  tags_add?: string[] | null;
  tags_replace?: string[] | null;
  tags_delete?: string[] | null;
  visible_to_add?: string[] | null;
  visible_to_delete?: string[] | null;
  visible_to_replace?: string[] | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
