

const db = require("../db");
const { usersTable } = require("../models");

// createUser, updateUser, getUserById, deleteUser

const createUser = async (req, res) => {
    try {
        const users = await db.create().from(usersTable).values(req.body).returning();
        res.status(201).json({
            status: 'success',
            data: users,
            pagination: {}
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data.' });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db.select().from(usersTable).where(equals(usersTable.id, id)).get();
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json({
            status: 'success',
            data: user,
            pagination: {}
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data.' });
    }
};
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await db.update(usersTable).set(req.body).where(equals(usersTable.id, id)).returning();
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json({
            status: 'success',
            data: updatedUser,
            pagination: {}
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data.' });
    }
}
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await db.delete(usersTable).where(equals(usersTable.id, id)).returning();
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json({
            status: 'success',
            data: deletedUser,
            pagination: {}
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data.' });
    }
}

module.exports = {
    createUser,
    getUserById,
    updateUser,
    deleteUser
};