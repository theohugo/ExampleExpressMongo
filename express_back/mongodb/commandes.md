```javascript
docker exec -it mongodb bash
 
mongosh --port 27017
use admin
db.auth("mongo_user", passwordPrompt())
// ou
mongosh "mongodb://mongo_user:example1234@mongodb:27017/database_name"

show dbs
use presentation
db.createCollection("demmo_col")
show collections

mongoimport --db demoDatabase --collection beer --file /import/datasource/beer.json --username mongo_user --password example1234 --authenticationDatabase admin

mongoimport --type csv --headerline --db demoDatabase --collection airbnb --file /import/datasource/airbnb.csv --username mongo_user --password example1234 --authenticationDatabase admin


mongoimport --db demoDatabase \
    --collection beer \
    --file /import/datasource/beer.json \
    --username mongo_user \
    --password example1234 \
    --authenticationDatabase admin

mongoimport --db demoDatabase --collection movies --file /import/datasource/movies.json --username mongo_user --password example1234 --authenticationDatabase admin

mongoimport --jsonArray --db demoDatabase --collection volcans --file /import/datasource/volcano.json --username mongo_user --password example1234 --authenticationDatabase admin

mongoimport --type csv --headerline --db demoDatabase --collection airbnb --file /import/datasource/airbnb.csv --username mongo_user --password example1234 --authenticationDatabase admin


mongosh "mongodb://mongo_user:example1234@mongodb:27017"
 
```
