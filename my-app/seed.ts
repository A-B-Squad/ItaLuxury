const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const seedData = {
  // categories: [
  //   { id: 1, name: 'Electronics', parentId: null },
  //   { id: 2, name: 'Clothing', parentId: null },
  //   { id: 3, name: 'Books', parentId: null },
  //   { id: 8, name: 'Smartphones', parentId: 1 },
  //   { id: 9, name: 'Laptops', parentId: 1 },
  //   { id: 10, name: 'Televisions', parentId: 1 },
  //   { id: 11, name: 'T-shirts', parentId: 2 },
  //   { id: 12, name: 'Jeans', parentId: 2 },
  //   { id: 13, name: 'Dresses', parentId: 2 },
  //   { id: 14, name: 'Fiction', parentId: 3 },
  //   { id: 15, name: 'Non-fiction', parentId: 3 },
  //   { id: 16, name: 'Science Fiction', parentId: 3 },
  // ],
  products: [
    {
      name: 'Smartphone',
      price: 999.99,
      isVisible: true,
      reference: 'PHN001',
      description: 'A high-end smartphone with advanced features.',
      inventory: 100,
      solde: 0,
      images: ['smartphone_image1.jpg', 'smartphone_image2.jpg'],
      categories: { connect: { name: 'Electronics' } },
    },
    {
      name: 'T-Shirt',
      price: 29.99,
      isVisible: true,
      reference: 'TS001',
      description: 'A comfortable and stylish T-shirt.',
      inventory: 200,
      solde: 0,
      images: ['tshirt_image1.jpg', 'tshirt_image2.jpg'],
      categories: { connect: { name: 'Clothing' } },
    },
  ],
  users: [
    {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'USER',
      number: '1234567890',
    },
    {
      fullName: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'ADMIN',
      number: '0987654321',
    },
  ],


};

async function seed() {
  try {
    // for (const categoryData of seedData.categories) {
    //   await prisma.category.create({ data: categoryData });
    // }

    for (const userData of seedData.users) {
      await prisma.user.create({ data: userData });
    }
    for (const productData of seedData.products) {
      await prisma.product.create({ data: productData });
    }


    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Call the seed function
seed();
