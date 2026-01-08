import express from 'express';
import db from '../db/index.js';
import { usersTable, userSessions } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { randomBytes, createHmac } from 'node:crypto';

const router = express.Router();

// Define your user-related routes here
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    const [existingUser] = await db.select({email: usersTable.email}).from(usersTable).where((table) => eq(table.email, email))
    if(existingUser){
        return res.status(400).json({error: `User with email ${email} already exists`});
    }

    const salt = randomBytes(256).toString('hex');
    // Hash the password before storing
    const hashedPassword = createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    const [user] = await db.insert(usersTable).values({
        name : name,
        email : email,
        password: hashedPassword,
        salt: salt,
    }).returning({id: usersTable.id })

    return res.status(201).json({userId: user.id, message: 'User created successfully'});
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){    
        return res.status(400).json({ error: 'Email and password are required' });
    }
    const [existingUser] = await db.select({id: usersTable.id, email: usersTable.email, salt: usersTable.salt, password: usersTable.password}).from(usersTable).where((table) => eq(table.email, email));
    if(!existingUser){
        return res.status(400).json({ error: 'User does not exists with the provided email or password' });
    }
    
    const hashedPassword = createHmac('sha256', existingUser.salt)
        .update(password)
        .digest('hex');

    if(hashedPassword !== existingUser.password){
        return res.status(400).json({ error: 'User does not exists with the provided email or password' });
    }
    const [session] = await db.insert(userSessions).values({
        userId: existingUser.id,
    }).returning({id: userSessions.id});
    return res.status(200).json({ message: 'Login successfully', sessionId: session.id });
});

export default router;