const express = require('express');
const app = express();
const port = 3000;
const {loggerMiddleware} = require('./middleware/logger');
const todosRoutes = require('./routes/todos.routes');
const usersRoutes = require('./routes/users.routes');

// Middlewares
app.use(express.json());
app.use(loggerMiddleware);


// Routes
app.use('/todos', todosRoutes);
app.use('/users', usersRoutes);

app.listen(port, () => {
  console.log(`Book store app listening at http://localhost:${port}`);
});