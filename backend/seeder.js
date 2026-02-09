const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const sampleBooks = [
    {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        price: 12.99,
        category: 'Fiction',
        description: 'A story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
        stock: 25,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    },
    {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        price: 14.99,
        category: 'Fiction',
        description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
        stock: 30,
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    },
    {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        price: 18.99,
        category: 'Science',
        description: 'A landmark volume in science writing by one of the great minds of our time.',
        stock: 20,
        image: 'https://images.unsplash.com/photo-1462275646964-a0e3f8e6c541?w=400',
    },
    {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        price: 19.99,
        category: 'History',
        description: 'A groundbreaking narrative of humanity\'s creation and evolution.',
        stock: 15,
        image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
    },
    {
        title: 'Steve Jobs',
        author: 'Walter Isaacson',
        price: 16.99,
        category: 'Biography',
        description: 'The exclusive biography of Steve Jobs based on interviews with Jobs himself.',
        stock: 18,
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    },
    {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        price: 15.99,
        category: 'Fantasy',
        description: 'A timeless classic about the adventures of Bilbo Baggins.',
        stock: 22,
        image: 'https://images.unsplash.com/photo-1518744386442-2d48ac47a7eb?w=400',
    },
    {
        title: 'The Da Vinci Code',
        author: 'Dan Brown',
        price: 13.99,
        category: 'Mystery',
        description: 'A thrilling mystery involving symbology, art, and ancient secrets.',
        stock: 28,
        image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400',
    },
    {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        price: 11.99,
        category: 'Romance',
        description: 'A romantic novel of manners following the Bennet family.',
        stock: 35,
        image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    },
    {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        price: 13.49,
        category: 'Fiction',
        description: 'The story of Holden Caulfield and teenage angst and alienation.',
        stock: 19,
        image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400',
    },
    {
        title: 'Cosmos',
        author: 'Carl Sagan',
        price: 17.99,
        category: 'Science',
        description: 'A journey through space and time, exploring the origins of life and the universe.',
        stock: 14,
        image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400',
    },
    {
        title: '1984',
        author: 'George Orwell',
        price: 12.49,
        category: 'Fiction',
        description: 'A dystopian social science fiction novel about totalitarianism.',
        stock: 27,
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    },
    {
        title: 'The Art of War',
        author: 'Sun Tzu',
        price: 9.99,
        category: 'Non-Fiction',
        description: 'Ancient Chinese military treatise on strategy and tactics.',
        stock: 40,
        image: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=400',
    },
];

const adminUser = {
    name: 'Admin User',
    email: 'admin@bookstore.com',
    password: 'admin123',
    role: 'admin',
};

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Book.deleteMany();
        await User.deleteMany();

        // Create admin user
        await User.create(adminUser);
        console.log('Admin user created: admin@bookstore.com / admin123');

        // Create sample books
        await Book.insertMany(sampleBooks);
        console.log('Sample books created');

        console.log('Data seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
