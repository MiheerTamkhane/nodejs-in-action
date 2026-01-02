

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

const getUserById = async (req, res) => {};
const updateUser = async (req, res) => {}
const deleteUser = async (req, res) => {}

module.exports = {
    createUser,
    getUserById,
    updateUser,
    deleteUser
};