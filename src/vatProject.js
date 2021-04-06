'use strict';

const project = require('./project');

class vatProject extends project {
  constructor() {
    super();
  }

  async createTAFSearch(options) {
    this.create(options);
    this.createVATReportsRecord(options);
    this.createVATSearchesRecord(options);
    // this.createVATSchemas(options);
  }

  async createVATReportsRecord(options) {
    const filename = 'vat_reports_list.json';
    const opts = {
      srcFile: 'vat/' + filename,
      filename: +filename,
      folder: options.srcPath + 'records/',
      replaceContents: [
        ['UUID', options.uuid],
        ['COUNTRY', options.country],
        ['PROJECT', options.projectName]
      ]
    };
    await this.createFileFromTemplate(opts);
  }

  async createVATSearchesRecord(options) {
    const filename = 'vat_searches_list.json';
    const opts = {
      srcFile: 'vat/' + filename,
      filename: filename,
      folder: options.srcPath + 'records/',
      replaceContents: [
        ['UUID', options.uuid],
        ['COUNTRY', options.country],
        ['PROJECT', options.projectName]
      ]
    };
    await this.createFileFromTemplate(opts);
  }

  async createVATSchemas(options) {
    let contents = await this._fs.readFile(options.srcReportFile);
    const convertedContents = convert(contents);
    convertedContents.forEach((content, idx) => {
      this._fs.createFile(`converted_${idx}.json`, content);
    });
  }
}
module.exports = vatProject;
