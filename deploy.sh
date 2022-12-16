# changer owner and permissions to movies_core
sudo chown -R 8983:8983 ./solr/movies_core
sudo chmod -R 777 ./solr/movies_core

# remove previous container if exists
docker stop search_engine
docker rm search_engine

# start solr container
docker-compose up -d

# check solr status
docker exec -it search_engine solr status

# index movies_core with data from movies.json
docker exec -it search_engine /opt/solr-9.1.0/bin/post -c movies_core /var/solr/data/movies_core/movies.json

# start express server
npm install
npm run dev