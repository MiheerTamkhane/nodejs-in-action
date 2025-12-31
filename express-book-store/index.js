const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

const books = [
  { id: 1, title: 'Book One', author: 'Author One' },
  { id: 2, title: 'Book Two', author: 'Author Two' },
];

// GET Route to Fetch All Books
app.get('/books', (req, res) => {
    const response = {
    status: 'success',
    data: books,
    length: books.length
  };
  res.json(response);
});

// GET Route to Fetch a Book by ID
app.get('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const book = books.find(b => b.id === bookId);

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
app.post('/books', (req, res) => {
    const body = req.body;
    const newBook = {
    id: books.length + 1,
    ...body
    }
    books.push(newBook);
    res.status(201).json({
        status: 'success',
        data: newBook
    });
});

// DELETE Route to Remove a Book by ID
app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const bookIndex = books.findIndex(b => b.id === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
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


app.listen(port, () => {
  console.log(`Book store app listening at http://localhost:${port}`);
});