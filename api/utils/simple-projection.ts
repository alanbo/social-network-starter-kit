import * as R from 'ramda';
import { GraphQLResolveInfo } from 'graphql';

export default function (info: GraphQLResolveInfo): { [prop: string]: 1 } {
  // path to deeply nested property of graphql tree
  const sel_path = R.lensPath([
    'operation',
    'selectionSet',
    'selections',
    '0',
    'selectionSet',
    'selections'
  ]);

  return R.pipe(
    R.view(sel_path),
    R.map(selection => ({ [(selection as any).name.value]: 1 })),
    R.mergeAll
  )(info) as { [prop: string]: 1 };
}
