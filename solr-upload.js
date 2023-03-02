const fs = require('fs');
const JSONStream = require('JSONStream');
const DbConnection = require('./db/index');

const sampleCore = DbConnection.getSampleCore();

const jsonFilePath = './solr/movies_core/movies.json';
const batchSize = 500;

const stream = fs.createReadStream(jsonFilePath, { encoding: 'utf8' });

const processBatch = (batch) => {
  sampleCore.add(batch);
};

const main = async () => {
  await sampleCore.delete('id', '*');
  await sampleCore.commit();

  const jsonStream = JSONStream.parse('*');

  let currentBatch = [];

  jsonStream.on('data', (object) => {
    currentBatch.push(object);

    if (currentBatch.length >= batchSize) {
      processBatch(currentBatch);
      currentBatch = [];
    }
  });

  jsonStream.on('end', () => {
    if (currentBatch.length > 0) {
      processBatch(currentBatch);
    }
    sampleCore.commit();
    console.log('Finished uploading documents');
  });

  stream.pipe(jsonStream);
};

main();
