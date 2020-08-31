export const pick = (keys, obj) => {
  const result = {};
  keys.forEach(k => {
    result[k] = obj[k];
  });
  return result;
};
