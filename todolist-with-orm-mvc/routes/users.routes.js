const express= require('express');
const router = express.Router();
const {createUser, updateUser, getUserById, deleteUser} = require('../controllers/user.controller');

// Define routes for todos
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;