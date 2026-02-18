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

## Lancer Les Tests

Depuis `express_back`:

```powershell
cd express_back
npm test
```

Ou depuis la racine:

```powershell
npm --prefix express_back test
```

## Generer Des Fixtures

Depuis la racine:

```powershell
npm --prefix express_back run fixtures
```

Version reset complet (supprime `orders`, `carts`, `beer` et les users `fixture.*` avant regeneration):

```powershell
npm --prefix express_back run fixtures:reset
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
- `POST /api/beers` (VENDEUR uniquement, via `x-user-id`)
- `PUT /api/beers/:id` (VENDEUR uniquement, via `x-user-id`)

`orders`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/seller` (VENDEUR uniquement, via `x-user-id`)
- `GET /api/orders/client` (CLIENT uniquement, via `x-user-id`)
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`
- `GET /api/orders/stats`

## Auth Role (Simple)

Pour les routes protegees, transmettre l'identifiant utilisateur:

```http
x-user-id: <mongo_user_id>
```

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
