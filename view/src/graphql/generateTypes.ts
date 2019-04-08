import { print } from 'graphql/language/printer';
import { ASTNode } from 'graphql';
import fs from 'fs';
import path from 'path';

import * as user_gql from './queries/user-queries';
import * as post_gql from './queries/post-queries';


const all_queries = Object.assign({}, user_gql, post_gql);

let gql_types = `
export const gql_error = 'GQL_ERROR';
export const gql_loading = 'GQL_LOADING';
export const gql_loading_cancel = 'GQL_LOADING_CANCEL';
`;


Object.keys(all_queries).forEach(key => {
  const query = print((all_queries as { [ix: string]: ASTNode })[key]);
  const match = query.match(/(?<=mutation |query )\w+/g);

  if (match && match.length) {
    gql_types += `export const gql_${key.toLowerCase()} = 'GQL_${match[0]}';\n`;
  }
});

const file_path = path.resolve(__dirname, '../redux/actions/gql-types.ts');

fs.writeFileSync(file_path, gql_types);


