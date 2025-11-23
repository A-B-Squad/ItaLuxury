
export const normalizeText = (term: string): string => {
  return term
    .trim()
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replaceAll(/\s+/g, " ");
};