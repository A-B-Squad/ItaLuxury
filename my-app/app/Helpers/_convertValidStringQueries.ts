export const convertValidStringQueries = (
  queries: Record<string, string[]>,
) => {
  let q = "";
  for (const [key, value] of Object.entries(queries)) {
    q = q + `${q === "" ? "" : "&"}${key}=${value}`;
  }

  return q;
};
