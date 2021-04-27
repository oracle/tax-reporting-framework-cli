'use strict';

const project = require('./project');

class tafSearchProject extends project {
  constructor() {
    super();
  }

  async create(options) {
    super.create(options);
    this.createReports(options);
    this.createSearches(options);
    this.createSchemas(options);
    this.createProcessors(options);
    this.createTemplates(options);
  }

  async createTemplates(options) {
    const filename = 'TAF_TEMPLATE.ftl';
    const opts = {
      srcFile: 'search/' + filename,
      filename: filename,
      folder: options.srcPath + 'templates/',
      replaceContents: []
    };
    await this.createFileFromTemplate(opts);
  }

  async createReports(options) {
    const filename = 'str_localized_reports_list.json';
    const opts = {
      srcFile: 'search/' + filename,
      filename: filename,
      folder: options.srcPath + 'records/',
      replaceContents: [
        [/UUID/g, options.uuid],
        [/COUNTRY/g, options.country],
        [/PROJECT/g, options.projectName]
      ]
    };
    await this.createFileFromTemplate(opts);
  }

  async createSearches(options) {
    const filename = 'str_localized_searches.json';
    const opts = {
      srcFile: 'search/' + filename,
      filename: filename,
      folder: options.srcPath + 'records/',
      replaceContents: [
        [/UUID/g, options.uuid],
        [/COUNTRY/g, options.country],
        [/PROJECT/g, options.projectName]
      ]
    };
    await this.createFileFromTemplate(opts);
  }

  async createSchemas(options) {
    const files = ['TAF_SEARCH_META.json', 'TAF_SEARCH.json'];
    const folder = 'schemas/';
    files.forEach(async (file) => {
      const opts = {
        srcFile: 'search/' + file,
        filename: file,
        folder: options.srcPath + folder,
        replaceContents: [
          [/UUID/g, options.uuid],
          [/COUNTRY/g, options.country],
          [/PROJECT/g, options.projectName]
        ]
      };
      await this.createFileFromTemplate(opts);
    });
  }

  async createProcessors(options) {
    const filename = 'SearchPreProcessor.js';
    const opts = {
      srcFile: 'search/' + filename,
      filename: filename,
      folder: options.srcPath + 'processors/pre/',
      replaceContents: []
    };
    await this.createFileFromTemplate(opts);
  }
}
module.exports = tafSearchProject;
