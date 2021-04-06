'use strict';

const project = require('./project');

class tafProject extends project {
  constructor() {
    super();
  }

  async createTAFReportsRecord(options) {
    const opts = {
      filename: 'reports.json',
      folder: options.srcPath + 'records/',
      replaceContents: [
        [/UUID/g, options.uuid],
        [/COUNTRY/g, options.country],
        [/PROJECT/g, options.project]
      ]
    };
    await this.createFileFromTemplate(opts);
  }

  async createTAFSearchesRecord(options) {
    const opts = {
      filename: 'searches.json',
      folder: options.srcPath + 'records/',
      replaceContents: [
        [/UUID/g, options.uuid],
        [/COUNTRY/g, options.country],
        [/PROJECT/g, options.project]
      ]
    };
    await this.createFileFromTemplate(opts);
  }
}
module.exports = tafProject;
