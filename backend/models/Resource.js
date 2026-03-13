const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title can not be more than 100 characters']
  },
  author: {
    type: String,
    required: [true, 'Please add an author']
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject']
  },
  topic: {
    type: String,
    required: [true, 'Please add a topic']
  },
  resourceType: {
    type: String,
    required: [true, 'Please specify resource type'],
    enum: [
      'Research Paper',
      'Book',
      'Lecture Video',
      'Open Course Material',
      'Other'
    ]
  },
  url: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  description: {
    type: String,
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  difficultyLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  publicationYear: {
    type: Number,
    max: new Date().getFullYear()
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Adding indexes to improve search performace
ResourceSchema.index({ title: 'text', topic: 'text', subject: 'text', description: 'text' });
ResourceSchema.index({ difficultyLevel: 1, resourceType: 1, publicationYear: -1 });

module.exports = mongoose.model('Resource', ResourceSchema);
