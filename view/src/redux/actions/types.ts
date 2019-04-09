import { print } from 'graphql/language/printer';
import { ASTNode } from 'graphql';
import { $Keys, $Values } from 'utility-types';

import * as user_gql from '../../graphql/queries/user-queries';
import * as post_gql from '../../graphql/queries/post-queries';

export const gql_error = 'GQL_ERROR';
export const gql_loading = 'GQL_LOADING';
export const gql_loading_cancel = 'GQL_LOADING_CANCEL';

const all_queries = Object.assign({}, user_gql, post_gql);


type GqlTypesOpt = { [K in $Keys<Partial<typeof all_queries>>]: string };
type GqlTypes = { [K in $Keys<typeof all_queries>]: string };
const gql_types_map: Partial<GqlTypesOpt> = {};


Object.keys(all_queries).forEach(key => {
  const query = print((all_queries as { [ix: string]: ASTNode })[key]);
  const match = query.match(/(?<=mutation |query )\w+/g);

  if (match && match.length) {
    gql_types[key as keyof GqlTypesOpt] = `GQL_${match[0]}`;
  }
});

export const gql_types = gql_types_map as GqlTypes;

