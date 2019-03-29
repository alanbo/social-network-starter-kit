interface IdObj {
  _id: string,
  [ix: string]: any
}

export function sortArrayOfObjByArrayOfIds(ref_array: string[], sort_array: IdObj[]) {
  const sorted = sort_array.sort((a, b) => {
    const a_ix = ref_array.findIndex(elem => elem === a._id);
    const b_ix = ref_array.findIndex(elem => elem === b._id);

    return a_ix - b_ix;
  });

  return sorted;
}