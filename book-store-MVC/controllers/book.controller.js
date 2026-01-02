
const { BOOKS } = require('../models/book');

exports.getAllbooks =  (req, res) => {
    const response = {
    status: 'success',
    data: BOOKS,
    length: BOOKS.length
  };
  res.json(response);
};

exports.getBookById = (req, res) => {
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
};

exports.addNewBook = (req, res) => {
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
};

exports.deleteBookById = (req, res) => {
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
};