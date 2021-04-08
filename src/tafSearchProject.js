'use strict';

const project = require('./project');

class tafSearchProject extends project {
  constructor() {
    super();
  }

  async create(options) {
    super.create(options);
    this.createRecords(options);
    this.createSearches(options);
    this.createSchemas(options);
  }

  async createRecords(options) {
    const filename = 'reports.json';
    const opts = {
      srcFile: 'search/' + filename,
      filename: filename,
      folder: options.srcPath + 'records/',
      replaceContents: [
        [/UUID/g, options.uuid],
        [/COUNTRY/g, options.country],
        [/PROJECT/g, options.project]
      ]
    };
    await this.createFileFromTemplate(opts);
  }

  async createSearches(options) {
    const filename = 'searches.json';
    const opts = {
      srcFile: 'search/' + filename,
      filename: filename,
      folder: options.srcPath + 'records/',
      replaceContents: [
        [/UUID/g, options.uuid],
        [/COUNTRY/g, options.country],
        [/PROJECT/g, options.project]
      ]
    };
    await this.createFileFromTemplate(opts);
  }

  async createSchemas(options) {
    const files = ['TAF_SEARCH_META.json', 'TAF_SEARCH.json'];
    const folder = 'schemas/';
    files.forEach((file) => {
      this.createScriptFile(options, file, folder);
    });
  }

  async createTAFSearchProcessors(options) {
    const files = ['TAF_SEARCH_META.json', 'TAF_SEARCH.json'];
    const folder = 'schemas/';
    files.forEach((file) => {
      this.createScriptFile(options, file, folder);
    });
  }

  async createScriptFile(options, filename, folder) {
    const opts = {
      srcFile: 'search/' + filename,
      filename: filename,
      folder: options.srcPath + folder,
      replaceContents: []
    };
    await super.createFileFromTemplate(opts);
  }
}
module.exports = tafSearchProject;
