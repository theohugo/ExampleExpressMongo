# Express Back - Docker Compose

Ce dossier contient une configuration Docker pour lancer le backend Express et une base MongoDB (avec mongo-express pour l'UI).

Prerequis
- Docker installé
- Docker Compose (ou `docker compose` v2 intégré à Docker)

Démarrage rapide

Depuis le répertoire `express_back`, construisez et lancez les services :

```bash
docker compose up --build
```

ou (ancienne syntaxe) :

```bash
docker-compose up --build
```

Services exposés
- API backend : http://localhost:5000
- mongo-express (UI) : http://localhost:8081
- MongoDB : port 27017

Variables d'environnement
Copiez `.env.example` en `.env` si vous voulez personnaliser l'hôte/le port la connexion Mongo.

Fichier `docker-compose.yml`
- `mongo` : image officielle Mongo, variables `MONGO_INITDB_ROOT_USERNAME`/`MONGO_INITDB_ROOT_PASSWORD` définies.
- `mongo-express` : interface web pour inspecter la BDD sur le port `8081`.
- `backend` : image construite depuis ce dossier, variable `MONGO_URI` configurée pour se connecter au service `mongo`.

Debug & journalisation
- Voir les logs en temps réel :

```bash
docker compose logs -f backend
```

- Ouvrir un terminal dans le conteneur backend :

```bash
docker compose exec backend sh
```

MongoDB - connexion et import (exemples depuis `mongodb/commandes.md`)
- Ouvrir un shell vers le conteneur MongoDB :

```bash
docker compose exec mongo bash
```

- Se connecter avec `mongosh` (depuis l'extérieur ou l'intérieur du conteneur) :

```bash
mongosh "mongodb://mongo_user:example1234@localhost:27017/?authSource=admin"
```

- Importer des fichiers JSON/CSV (exemples) :

```bash
# si vous avez placé des fichiers à importer sous ./mongodb/import/datasource
docker compose exec mongo \
  mongoimport --jsonArray --db demoDatabase --collection volcans --file /import/datasource/volcano.json \
    --username mongo_user --password example1234 --authenticationDatabase admin

docker compose exec mongo \
  mongoimport --type csv --headerline --db demoDatabase --collection airbnb --file /import/datasource/airbnb.csv \
    --username mongo_user --password example1234 --authenticationDatabase admin
```

Astuce : si vous utilisez `mongo-express`, les collections et données sont visibles immédiatement sur http://localhost:8081.

Arrêt et nettoyage

```bash
docker compose down -v
```

Notes
- Si votre `server.js` utilise la syntaxe `import`, ce projet inclut `"type": "module"` dans `package.json` et le conteneur lance l'app avec `npm start`.
- Si vous voulez lancer l'app localement (sans Docker) :

```bash
cd express_back
npm install
npm start
```
