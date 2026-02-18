# MONGOAPI

Backend Express + MongoDB pour une application de commande de bieres.
Le code applicatif est dans `express_back`, mais l'execution Docker se fait depuis la racine.

## Prerequis

- Docker
- Docker Compose (`docker compose`)

## Demarrage Rapide

Depuis la racine du projet:

```powershell
docker compose up --build
```

Services exposes:
- API backend: `http://localhost:5000`
- MongoDB: `localhost:27017`
- Mongo Express: `http://localhost:8081`

## Arret Et Logs

```powershell
docker compose down
docker compose logs -f backend
docker compose logs -f mongo
docker compose logs -f mongo-express
```

## Configuration (Optionnel)

Le `docker-compose.yml` racine contient des valeurs par defaut.
Tu peux les surcharger avec un fichier `.env` a la racine:

- `BACKEND_PORT`
- `MONGO_PORT`
- `MONGO_EXPRESS_PORT`
- `MONGO_INITDB_ROOT_USERNAME`
- `MONGO_INITDB_ROOT_PASSWORD`
- `MONGO_EXPRESS_USERNAME`
- `MONGO_EXPRESS_PASSWORD`
- `MONGO_DB_NAME`
- `AUTO_SEED_BEERS`
- `MONGO_URI_DOCKER`

## Fonctionnalites

- CRUD `users`
- Catalogue `beers` avec filtres
- CRUD `carts` (panier)
- Gestion `orders` (commandes)
- Checkout panier -> commande via `POST /api/carts/:cartId/checkout`

## API Principale

`users`
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `GET /api/users/stats`

`beers`
- `GET /api/beers`
- `GET /api/beers/:id`
- `GET /api/beers/stats`

`orders`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`
- `GET /api/orders/stats`

`carts`
- `GET /api/carts/:cartId`
- `POST /api/carts/:cartId/items`
- `PUT /api/carts/:cartId/items/:beerId`
- `DELETE /api/carts/:cartId/items/:beerId`
- `DELETE /api/carts/:cartId`
- `POST /api/carts/:cartId/checkout`

## Exemple Checkout

```http
POST /api/carts/cart-demo/checkout
Content-Type: application/json

{
  "customer": {
    "name": "Alice Martin",
    "address": "10 rue de Paris, 75010 Paris"
  },
  "notes": "Livraison en fin de journee"
}
```
