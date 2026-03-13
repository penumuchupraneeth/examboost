const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Resource = require('./models/Resource');

// Load env vars
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const resources = [
  {
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    subject: 'Computer Science',
    topic: 'Algorithms',
    resourceType: 'Book',
    url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-046j-introduction-to-algorithms-sma-5503-fall-2005/',
    description: 'A comprehensive textbook on algorithms covering sorting, data structures, and graph algorithms.',
    difficultyLevel: 'Intermediate',
    publicationYear: 2009
  },
  {
    title: 'Deep Learning',
    author: 'Ian Goodfellow',
    subject: 'Artificial Intelligence',
    topic: 'Machine Learning',
    resourceType: 'Book',
    url: 'https://www.deeplearningbook.org/',
    description: 'The definitive textbook on deep learning mathematics and concepts.',
    difficultyLevel: 'Advanced',
    publicationYear: 2016
  },
  {
    title: 'CS50: Introduction to Computer Science',
    author: 'David J. Malan',
    subject: 'Computer Science',
    topic: 'Programming Basics',
    resourceType: 'Lecture Video',
    url: 'https://pll.harvard.edu/course/cs50-introduction-computer-science',
    description: 'An introduction to the intellectual enterprises of computer science and the art of programming.',
    difficultyLevel: 'Beginner',
    publicationYear: 2023
  },
  {
    title: 'Attention Is All You Need',
    author: 'Ashish Vaswani et al.',
    subject: 'Artificial Intelligence',
    topic: 'Natural Language Processing',
    resourceType: 'Research Paper',
    url: 'https://arxiv.org/abs/1706.03762',
    description: 'The original paper introducing the Transformer architecture which revolutionized NLP.',
    difficultyLevel: 'Advanced',
    publicationYear: 2017
  },
  {
    title: 'Calculus Early Transcendentals',
    author: 'James Stewart',
    subject: 'Mathematics',
    topic: 'Calculus',
    resourceType: 'Book',
    url: 'https://openstax.org/details/books/calculus-volume-1',
    description: 'A clear and accurate guide covering limits, derivatives, integrals, and the fundamental theorem of calculus.',
    difficultyLevel: 'Intermediate',
    publicationYear: 2020
  }
];

const importData = async () => {
  try {
    await Resource.deleteMany({});
    console.log('Existing resources deleted.');
    
    await Resource.insertMany(resources);
    console.log('Sample data imported successfully.');
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Resource.deleteMany({});
    console.log('Data destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Use node seed.js -i to import, or -d to delete');
  process.exit();
}
