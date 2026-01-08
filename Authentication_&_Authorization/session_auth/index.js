import express from 'express';
import router from './routes/user.routes.js';
import db from './db/index.js';
import { userSessions, usersTable } from './db/schema.js';
import { eq } from 'drizzle-orm';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use('/user', router);

app.use('/', async (req, res, next) => {
  const sessionId = req.headers['session-id'];
  if (!sessionId) {
    return res.status(401).json({ error: 'No session ID provided' });
  }

  const [session] = await db
    .select({ id: userSessions.id, userId: userSessions.userId, name: usersTable.name, email: usersTable.email })
    .from(userSessions)
    .innerJoin(usersTable, eq(userSessions.userId, usersTable.id))
    .where(eq(userSessions.id, sessionId));

  if (!session) {
    return res.status(401).json({ error: 'Invalid session ID' });
  }
  req.user = session;
  next();
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
