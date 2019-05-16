import { print } from 'graphql/language/printer';
import { ASTNode } from 'graphql';
import fs from 'fs';
import path from 'path';
import all_queries from './queries';
// _________ ../redux/actions/gql-types.ts _________

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



// _________ ../redux/actions/gql-action-interfaces.ts _________

// read all the types constructed by apollo codegen
const gqlTypes = fs.readFileSync(path.resolve(__dirname, 'operation-result-types.ts')).toString();
// match a list of Variables types
const varTypesArr = gqlTypes.match(/(?<=export interface )\w+Variables/g) || [];

// Function that makes an interface for each gql action type.
function makeActionInterface(action_type: string, gql_type: string) {
  const varType = `${gql_type}Variables`;
  const has_variables = varTypesArr.includes(varType);
  const has_variables_str = has_variables ? `\n    variables: ${varType}` : '';
  return `
export interface Gql${gql_type}Action {
  type: typeof ${action_type},
  payload: ${gql_type},
  meta: {
    id: number${has_variables_str},
    state: AppState
  }
}`;
};

let gql_type_imports = 'import {\n';
let action_type_imports = 'import {\n  gql_error,\n  gql_loading,\n  gql_loading_cancel,\n';
let action_interfaces = `

import { AppState } from '../reducers';

export interface GqlErrorAction {
  type: typeof gql_error,
  payload: Error,
  meta: {
    type: string,
    id: number,
    state: AppState
  }
}

export interface GqlLoadingAction {
  type: typeof gql_loading,
  meta: {
    type: string,
    id: number,
    state: AppState
  }
}

export interface GqlLoadingCancelAction {
  type: typeof gql_loading_cancel,
  meta: {
    type: string,
    id: number,
    state: AppState
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

varTypesArr.forEach(varType => {
  gql_type_imports += `  ${varType},\n`;
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

// _________ ../redux/actions/gql-thunks.ts _________

let thunks = '';

Object.keys(all_queries).forEach(key => {
  const query = print((all_queries as { [ix: string]: ASTNode })[key]);
  // might need better matching pattern
  const is_mutation = query.match('mutation ');
  const is_query = query.match('query ');

  // only process queries and mutations
  if (!is_mutation && !is_query) {
    return;
  }

  // make it camel case.
  const thunk_name = key.toLowerCase().split('_').reduce((prev, curr) => {
    return prev + curr[0].toUpperCase() + curr.substring(1).toLowerCase();
  }, 'gql');


  thunks += `
export const ${thunk_name} = gqlThunkCreator({
  ${is_query ? 'query' : 'mutation'}: gql_queries.${key},
  type: gql_${key.toLowerCase()}
});
`;
});

const thunks_file = `${action_type_imports}

import gql_queries from '../../graphql/queries';
import gqlThunkCreator from './gqlThunkCreator';

${thunks}
`;

const thunks_file_path = path.resolve(__dirname, '../redux/actions/gql-thunks.ts');
fs.writeFileSync(thunks_file_path, thunks_file);



