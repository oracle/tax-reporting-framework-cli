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
    const template = 'TAF_TEMPLATE.ftl';
    const opts = {
      srcFile: 'search/' + template,
      filename: template,
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
      await super.createFileFromTemplate(opts);
    });
  }

  async createProcessors(options) {
    const preprocessor = 'SearchPreProcessor.js';
    const opts1 = {
      srcFile: 'search/' + preprocessor,
      filename: preprocessor,
      folder: options.srcPath + 'processors/pre/',
      replaceContents: []
    };
    await this.createFileFromTemplate(opts1);

    const postprocessor = 'SearchPostProcessor.js';
    const opts2 = {
      srcFile: 'search/' + postprocessor,
      filename: postprocessor,
      folder: options.srcPath + 'processors/post/',
      replaceContents: []
    };
    await this.createFileFromTemplate(opts2);
  }
}
module.exports = tafSearchProject;
