import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ApiResponse from './src/utils/apiResponse.js';
import user_router from './src/routes/user.routes.js';
import connectDB from './src/config/database.js';

dotenv.config();

const EXPRESS_HOST = process.env.EXPRESS_HOST || 'localhost';
const PORT = Number(process.env.PORT) || 5000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

app.get('/', (req, res) => {
    const apiBaseUrl = `http://${EXPRESS_HOST}:${PORT}`;

    ApiResponse.success(
        res,
        'Serveur Express en fonctionnement !',
        {
            version: '1.0.0',
            endpoints: {
                users: `${apiBaseUrl}/api/users`,
                stats: `${apiBaseUrl}/api/users/stats`,
                mongoExpress: `http://${EXPRESS_HOST}:8081`,
            },
        }
    );
});

app.use('/api/users', user_router);

app.use((req, res) => {
    ApiResponse.notFound(res, 'Route non trouvee');
});

async function bootstrap() {
    try {
        console.log('[BOOT] Demarrage de Express Back...');
        console.log(`[BOOT] ENV=${process.env.NODE_ENV || 'development'} PORT=${PORT}`);

        if (!MONGO_URI) {
            throw new Error('MONGO_URI est manquante');
        }

        console.log('[BOOT] Connexion a MongoDB en cours...');
        await connectDB(MONGO_URI);
        console.log('[BOOT] Connexion MongoDB OK');

        app.listen(PORT, () => {
            console.log(`[BOOT] Serveur Express demarre sur http://${EXPRESS_HOST}:${PORT}`);
            console.log(`[BOOT] Mongo Express: http://${EXPRESS_HOST}:8081`);
        });
    } catch (error) {
        console.error(`[BOOT] Echec au demarrage: ${error.message}`);
        process.exit(1);
    }
}

bootstrap();

process.on('SIGINT', () => {
    console.log('[BOOT] Arret du serveur (SIGINT)...');
    process.exit(0);
});
