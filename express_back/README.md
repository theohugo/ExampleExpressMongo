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

## 5) Fonctionnalites metier

Le backend couvre bien les cas suivants:
- CRUD `users` (creer, lire, modifier, supprimer)
- CRUD `carts` (panier) avec gestion des lignes
- Creation de `orders` (commandes)
- Conversion d un panier en commande via le checkout

Flux principal:
1. Le client ajoute/modifie des articles dans `/api/carts/:cartId`
2. Le client valide avec `POST /api/carts/:cartId/checkout`
3. Le backend cree une commande dans `orders` et vide le panier

## 6) Endpoints principaux

- `GET /api/users`: liste des utilisateurs
- `GET /api/users/:id`: detail utilisateur
- `POST /api/users`: creation utilisateur
- `PUT /api/users/:id`: modification utilisateur
- `DELETE /api/users/:id`: suppression utilisateur
- `GET /api/users/stats`: statistiques utilisateurs

- `GET /api/beers`: catalogue de bieres (filtres: `q`, `type`, `couleur`, `marque`, `minPrice`, `maxPrice`, `page`, `limit`)
- `GET /api/beers/:id`: detail d une biere
- `GET /api/beers/stats`: statistiques catalogue
- `POST /api/orders`: creation d une commande
- `GET /api/orders`: liste des commandes (filtre: `status`)
- `GET /api/orders/:id`: detail d une commande
- `PATCH /api/orders/:id/status`: changement de statut (`pending`, `paid`, `preparing`, `shipped`, `cancelled`)
- `GET /api/orders/stats`: statistiques commandes
- `GET /api/carts/:cartId`: recuperer un panier
- `POST /api/carts/:cartId/items`: ajouter un article (`beerId`, `quantity`)
- `PUT /api/carts/:cartId/items/:beerId`: fixer la quantite (`quantity`, `0` pour retirer)
- `DELETE /api/carts/:cartId/items/:beerId`: supprimer un article
- `DELETE /api/carts/:cartId`: vider le panier
- `POST /api/carts/:cartId/checkout`: convertir le panier en commande
