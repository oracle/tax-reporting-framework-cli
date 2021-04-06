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
        ['UUID', options.uuid],
        ['COUNTRY', options.country],
        ['PROJECT', options.project]
      ]
    };
    await this.createFileFromTemplate(opts);
  }

  async createTAFSearchesRecord(options) {
    const opts = {
      filename: 'searches.json',
      folder: options.srcPath + 'records/',
      replaceContents: [
        ['UUID', options.uuid],
        ['COUNTRY', options.country],
        ['PROJECT', options.project]
      ]
    };
    await this.createFileFromTemplate(opts);
  }
}
module.exports = tafProject;
