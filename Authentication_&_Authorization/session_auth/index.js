import express from 'express';
import router from './routes/user.routes.js';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use('/user', router);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// 1. Create Routers for Authentication and Authorization
// 2. Create Controllers for handling login, logout, and protected routes
// 3. Implement Middleware for session management and access control
// 4. Integrate with the database using Drizzle ORM for user data storage