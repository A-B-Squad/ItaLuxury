export const normalizeText = (text: string): string => {
    return text
      .normalize('NFD') 
      .replace(/[\u0300-\u036f]/g, '') 
      .toLowerCase() 
      .replace(/[^a-z0-9]/g, ' '); 
  };