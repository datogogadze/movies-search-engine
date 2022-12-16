# search-engine

search engine for movies. data is in search-engine/solr/movies_core/movies.json file.

Indexing is performed by Solr. Which is run in docker container 8984:8983.

Owner of file search-engine/solr/movies_core should be set to 8983:8983.

For manual editing of config also add write permissions.

To execute ./deploy.sh also run chmod +x deploy.sh

Indexing is done for all filelds. title, year, genres, cast.

Querying is performed by just one word, which is searched in all of the fields.

All relevant documents are returned shown in the UI.

Each request needs the query word and page number. (page size is 10)
