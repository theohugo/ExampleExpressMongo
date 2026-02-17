// 1 faire les imports des librairies dont on a besoin
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// 2 charger les variables d'environnement
// 1 faire les imports des librairies dont on a besoin
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import ApiResponse from './src/utils/apiResponse';

// 2 charger les variables d'environnement
dotenv.config();
const EXPRESS_HOST = process.env.EXPRESS_HOST || "localhost";
const PORT = process.env.PORT || 5000;

// 3 créer une instance d'express
const app = express();

// 3.5 (optionnel) ajouter des middlewares à notre application
app.use(cors());
app.use(express.json()); // pour pouvoir parser le body des requêtes en json
app.use(express.urlencoded({ extended: true })); // pour pouvoir parser le body des requêtes en x-www-form-urlencoded

// logger custom
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// 4 ajouter des routes à notre application
app.get('/', (req, res) => {
    // reponse directe => pas de responsabilité
    // res.send('serveur express en fonctionnement !');

    // reponse via une classe de réponse => meilleure organisation et responsabilité
    ApiResponse.success(
        res,
        'Serveur Express en fonctionnement !',
        { 
        version: '1.0.0',
        endpoints:
            {
                users: 'http://localhost:5000/api/users',
                stats: 'http://localhost:5000/api/users/stats',
                mongoExpress: 'http://localhost:8081'
            }
        }
    );
});

// import des routes
import user_router from './src/routes/user.routes.js';
app.use('/api/users', user_router);

// route 404 pour les routes non définies (à mettre à la fin de toutes les routes)
app.use((req, res) => {
    ApiResponse.notFound(res, 'Route non trouvée');
});


// custom log de demarrage du server
// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`\n🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📡 API: http://${EXPRESS_HOST}:${PORT}`);
    console.log(`🧩 Mongo Express: http://${EXPRESS_HOST}:8081`);
    console.log(`🛠️ Environnement: ${process.env.NODE_ENV || 'development'}\n`);
});


// 6 (optionnel) reaction au changemnt  d'etat en fonctionnement
process.on('SIGINT', async () => {
    console.log('\n🔌 Arrêt du serveur...');
    process.exit(0);
});