# search-engine

Search engine for movies. Express.js server is started on localhost:3000.

Data is in search-engine/solr/movies_core/movies.json file.

Indexing is performed by Solr. Which is run in docker container 8984:8983.

Owner of file search-engine/solr/movies_core should be set to 8983:8983.

For manual editing of config also add write permissions.

To execute ./deploy.sh also run chmod +x deploy.sh

Indexing is done for all filelds. title, year, genres, cast.

Querying is performed by title, which is analyzed 2 ways (1. Look for words; 2. Ngrams ).

All relevant documents are returned shown in the UI.

Each request needs the query term, page size and page number.

![Alt Text](./images/index.png)
