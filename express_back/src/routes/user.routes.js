import express from 'express';


const user_router = express.Router();

// GET http://localhost:5000/api/users/
user_router.get('/', (req, res) => {
    res.send('Route de gestion des utilisateurs');
});

export default user_router;