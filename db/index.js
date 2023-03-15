const solr = require('solr-client');

class DbConnection {
  static getSampleCore() {
    if (!this.sampleCore) {
      this.sampleCore = solr.createClient({
        host: 'localhost',
        port: '8984',
        core: 'movies_core',
        path: '/solr',
      });
    }
    return this.sampleCore;
  }
}

module.exports = DbConnection;
