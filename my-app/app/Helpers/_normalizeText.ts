export const normalizeText = (text: string): string => {
    return text
      .normalize('NFD') // Decompose accented characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .toLowerCase() // Convert to lowercase
      .replace(/[^a-z0-9]/g, ' '); // Remove special characters
  };