import express from 'express';
import userController from '../controllers/user.controller.js';


const user_router = express.Router();

// GET http://localhost:5000/api/users
user_router.get('/', userController.getAll);

// GET http://localhost:5000/api/users/stats
user_router.get('/stats', userController.getStats);

// GET http://localhost:5000/api/users/:id
user_router.get('/:id', userController.getById);

// POST http://localhost:5000/api/users
user_router.post('/', userController.create);

// PUT http://localhost:5000/api/users/:id
user_router.put('/:id', userController.update);

// DELETE http://localhost:5000/api/users/:id
user_router.delete('/:id', userController.remove);

export default user_router;
