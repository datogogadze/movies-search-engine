const solr = require('solr-client');

class DbConnection {
  static getSampleCore() {
    if (!this.sampleCore) {
      this.sampleCore = solr.createClient({
        host: 'localhost',
        port: '8984',
        core: 'movies_core',
      });
    }
    return this.sampleCore;
  }

  static getTestCore() {
    if (!this.testCore) {
      this.testCore = solr.createClient({
        host: 'localhost',
        port: '8984',
        core: 'test_core',
      });
    }
    return this.testCore;
  }
}

module.exports = DbConnection;
