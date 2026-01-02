
const express = require('express');
const route = express.Router();
const {BOOKS} = require('../db/books');


// GET Route to Fetch All Books
route.get('/', (req, res) => {
    const response = {
    status: 'success',
    data: BOOKS,
    length: BOOKS.length
  };
  res.json(response);
});

// GET Route to Fetch a Book by ID
route.get('/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const book = BOOKS.find(b => b.id === bookId);

  if (book) {
    res.json({
      status: 'success',
      data: book
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'Book not found'
    });
  }
});

// POST Route to Add a New Book
route.post('/', (req, res) => {
    const body = req.body;
    const newBook = {
    id: BOOKS.length + 1,
    ...body
    }
    BOOKS.push(newBook);
    res.status(201).json({
        status: 'success',
        data: newBook
    });
});

// DELETE Route to Remove a Book by ID
route.delete('/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const bookIndex = BOOKS.findIndex(b => b.id === bookId);

  if (bookIndex !== -1) {
    BOOKS.splice(bookIndex, 1);
    res.json({
      status: 'success',
      message: 'Book deleted successfully'
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'Book not found'
    });
  }
});

module.exports = route;
