const queryChecker = (query: string) => {
  const targets = [
    '{ "$regex": ".*", "$options": "i" }',
    '{ "$regex": "\\w+", "$options": "i" }',
    '{ "$regex": "^[a-zA-Z]+$", "$options": "i" }',
    '{ "$regex": "[a-zA-Z]+", "$options": "i" }',
    '{ "$regex": "I", "$options": "i" }',
  ];

  const exists = targets.some((target) => query.includes(target));

  let placeHolder;

  if (exists) {
    placeHolder = `{"query": { "none": "none" }, "projection": {}}`;
  } else {
    placeHolder = query;
  }

  return placeHolder;
};

export default queryChecker;
