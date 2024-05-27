const calcDateForNewProduct = (createdAt: Date) => {
  // Get the current date
  const currentDate = new Date();

  // Calculate the date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Compare createdAt date with 30 days ago
  const isNew = createdAt > thirtyDaysAgo;
  return isNew;
};

export default calcDateForNewProduct;
