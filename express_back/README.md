# Express Back - Docker + MongoDB

Ce dossier lance:
- `backend` (Express)
- `mongo` (MongoDB)
- `mongo-express` (UI MongoDB)

## 1) Variables d'environnement

Copie le template:

```powershell
Copy-Item .env.example .env
```

Variables principales dans `.env`:
- `NODE_ENV`: environnement Node (`development`, `production`)
- `EXPRESS_HOST`: host du serveur Express dans le conteneur (`0.0.0.0`)
- `PORT`: port interne Express (laisse `5000`)
- `MONGO_URI`: URI Mongo pour execution locale (`npm start`)
- `MONGO_URI_DOCKER`: URI Mongo pour le conteneur backend
- `BACKEND_PORT`: port expose sur ta machine (ex: `5001`)
- `MONGO_PORT`: port expose Mongo sur ta machine
- `MONGO_EXPRESS_PORT`: port expose Mongo Express sur ta machine
- `MONGO_INITDB_ROOT_USERNAME`: user admin Mongo
- `MONGO_INITDB_ROOT_PASSWORD`: password admin Mongo
- `MONGO_EXPRESS_USERNAME`: login UI mongo-express
- `MONGO_EXPRESS_PASSWORD`: password UI mongo-express

## 2) Démarrage Docker

Depuis `express_back/`:

```powershell
docker compose up --build
```

Accès:
- API: `http://localhost:${BACKEND_PORT}`
- Mongo Express: `http://localhost:${MONGO_EXPRESS_PORT}`

## 3) Logs

```powershell
docker compose logs -f backend
docker compose logs -f mongo-express
docker compose logs -f mongo
```

## 4) Lancement local (sans Docker)

Assure-toi que MongoDB tourne sur ta machine puis:

```powershell
npm install
npm start
```

Le backend lit `MONGO_URI` depuis `.env`.
