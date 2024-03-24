
const calcDateForNewProduct = (createdAt: Date) => {
    // Get the current date
    const currentDate = new Date();

    // Calculate the date two months ago
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    // Compare createdAt date with two months ago
    const isNew = createdAt > twoMonthsAgo;
    return isNew
}

export default calcDateForNewProduct