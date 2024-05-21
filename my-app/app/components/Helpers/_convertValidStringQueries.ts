export const convertValidStringQueries = (
  queries: Record<string, string[]>,
): string => {
  let q = "";
  for (let [key, value] of Object.entries(queries)) {
    const joinedValues = value.join(",");
    q = `${q}${q === "" ? "" : "&"}${key}=${joinedValues}`;
  }
  return q;
};
