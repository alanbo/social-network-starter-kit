import { print } from 'graphql/language/printer';
import { ASTNode } from 'graphql';
import fs from 'fs';
import path from 'path';

import * as user_gql from './queries/user-queries';
import * as post_gql from './queries/post-queries';

// Function that makes an interface for each gql action type.
function makeActionInterface(action_type: string, gql_type: string) {
  return `
export interface Gql${gql_type}Action {
  type: typeof ${action_type},
  payload: ${gql_type},
  meta: {
    id: number
  }
}`;
};

// map of all grapqhql queries.
const all_queries = Object.assign({}, user_gql, post_gql);

// fixed types that need to be hardcoded.
let gql_types = `
export const gql_error = 'GQL_ERROR';
export const gql_loading = 'GQL_LOADING';
export const gql_loading_cancel = 'GQL_LOADING_CANCEL';
`;

// map of action names to action types
let actions: { [ix: string]: string } = {};


// loop through all the queries and construct data.
Object.keys(all_queries).forEach(key => {
  // parse query/mutation to a string
  const query = print((all_queries as { [ix: string]: ASTNode })[key]);

  // parse query/mutation name
  const match = query.match(/(?<=mutation |query )\w+/g);

  if (match && match.length) {
    // add exported action type
    gql_types += `export const gql_${key.toLowerCase()} = 'GQL_${match[0]}';\n`;
    // add item to actions map
    actions[key.toLowerCase()] = match[0];
  }
});


// save action types file.
const file_path = path.resolve(__dirname, '../redux/actions/gql-types.ts');
fs.writeFileSync(file_path, gql_types);

// Action Interfaces
let gql_type_imports = 'import {\n';
let action_type_imports = 'import {\n  gql_error,\n  gql_loading,\n  gql_loading_cancel,\n';
let action_interfaces = `
export interface GqlErrorAction {
  type: typeof gql_error,
  meta: {
    type: string,
    id: number
  }
}

export interface GqlLoadingAction {
  type: typeof gql_loading,
  meta: {
    type: string,
    id: number
  }
}

export interface GqlLoadingCancelAction {
  type: typeof gql_loading_cancel,
  meta: {
    type: string,
    id: number
  }
}
`;

Object.keys(actions).forEach(key => {
  // Action types to be imported.
  action_type_imports += `  gql_${key},\n`;
  // Gql interfaces to be imported.
  gql_type_imports += `  ${actions[key]},\n`;
  // Create an interface for a given action.
  action_interfaces += makeActionInterface('gql_' + key, actions[key]) + '\n';
});

// Close the imports.
action_type_imports += '} from \'./gql-types\';';
gql_type_imports += '} from \'../../graphql/operation-result-types\';';

// Construct the final string for the file.
const actions_file = `${action_type_imports}\n\n
${gql_type_imports}\n\n
${action_interfaces}
`;

// Save action interfaces file.
const interfaces_file_path = path.resolve(__dirname, '../redux/actions/gql-action-interfaces.ts');
fs.writeFileSync(interfaces_file_path, actions_file);

