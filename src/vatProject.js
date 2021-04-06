'use strict';

const project = require('./project');
const convert = require('./converter');

class vatProject extends project {
  constructor() {
    super();
  }

  async create(options) {
    super.create(options);
    this.createVATReportsRecord(options);
    this.createVATSearchesRecord(options);
    this.createVATSchemas(options);
  }

  async createVATReportsRecord(options) {
    const filename = 'vat_reports_list.json';
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
    await super.createFileFromTemplate(opts);
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
    await super.createFileFromTemplate(opts);
  }

  async createVATSchemas(options) {
    const filename = 'VAT_SUMMARY';
    let contents = await this._fs.readFile(options.srcReportFile);
    const convertedContents = convert(contents);
    convertedContents.forEach(async (content, idx) => {
      const opts = {
        srcFile: `vat/${filename}.json`,
        filename: `${filename}_${idx}.json`,
        folder: options.srcPath + 'schemas/',
        replaceContents: [
          ['UUID', options.uuid],
          ['COUNTRY', options.country],
          ['PROJECT', options.projectName],
          ['DATA', content.replace(/'/g, '"')]
        ]
      };
      await super.createFileFromTemplate(opts);
    });
  }
}
module.exports = vatProject;
