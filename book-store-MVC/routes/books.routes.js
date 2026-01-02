
const express = require('express');
const route = express.Router();
const {getAllBooks, getBookById, addNewBook, deleteBookById} = require('../controllers/books.controller');


// GET Route to Fetch All Books
route.get('/', getAllBooks);

// GET Route to Fetch a Book by ID
route.get('/:id', getBookById);

// POST Route to Add a New Book
route.post('/', addNewBook);
// DELETE Route to Remove a Book by ID
route.delete('/:id', deleteBookById);

module.exports = route;
