const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const seedData = {
  categories: [
    { name: 'Electronics' },
    { name: 'Clothing' },
    { name: 'Books' },
  ],
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
    for (const categoryData of seedData.categories) {
      await prisma.category.create({ data: categoryData });
    }

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
