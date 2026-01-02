const express = require('express');
const app = express();
const port = 3000;
const {loggerMiddleware} = require('./middlewares/logger');
const booksRoute = require('./routes/books.routes');


// Middlewares
app.use(express.json());
app.use(loggerMiddleware);


// Routes
app.use('/books', booksRoute);


app.listen(port, () => {
  console.log(`Book store app listening at http://localhost:${port}`);
});