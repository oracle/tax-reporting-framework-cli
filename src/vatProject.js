'use strict';

const project = require('./project');
const { convert, selectTaxDefs } = require('./converter');

class vatProject extends project {
  constructor() {
    super();
  }

  async create(options) {
    this.contents = await this._fs.readFile(options.srcReportFile);
    super.create(options);
    this.createVATReportsRecord(options);
    this.createVATSearchesRecord(options);
    this.createVATSchemas(options);
    this.createProcessors(options);
  }

  async createVATReportsRecord(options) {
    const filename = 'vat_reports_list.json';
    const opts = {
      srcFile: 'vat/' + filename,
      filename: filename,
      folder: options.srcPath + 'records/',
      replaceContents: [
        [/UUID/g, options.uuid],
        [/COUNTRY/g, options.country],
        [/PROJECT/g, options.projectName]
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
        [/UUID/g, options.uuid],
        [/COUNTRY/g, options.country],
        [/PROJECT/g, options.projectName]
      ]
    };
    await super.createFileFromTemplate(opts);
  }

  async createVATSchemas(options) {
    const filename = 'VAT_SUMMARY';
    //TODO create convert SUMMARY
    const convertedContents = convert(this.contents);
    convertedContents.forEach(async (content, idx) => {
      const opts = {
        srcFile: `vat/${filename}.json`,
        filename: `${filename}_${idx}.json`,
        folder: options.srcPath + 'schemas/',
        replaceContents: [
          [/UUID/g, options.uuid],
          [/COUNTRY/g, options.country],
          [/PROJECT/g, options.projectName],
          ['DATA', content.replace(/'/g, '"')]
        ]
      };
      await super.createFileFromTemplate(opts);
    });
  }

  async createProcessors(options) {
    //COUNTRYTaxCodeMapper.js
    const taxCodeDefs = selectTaxDefs(this.contents);
    const ctrTaxCodeMapperFilename = 'COUNTRYTaxCodeMapper.js';
    const opts1 = {
      srcFile: 'vat/' + ctrTaxCodeMapperFilename,
      filename: ctrTaxCodeMapperFilename.replace('COUNTRY', options.country),
      folder: options.srcPath + 'processors/pre/',
      replaceContents: [
        [/UUID/g, options.uuid],
        [/COUNTRY/g, options.country],
        [/PROJECT/g, options.projectName],
        [/TAXDEFS/g, taxCodeDefs]
      ]
    };
    await super.createFileFromTemplate(opts1);

    const files = [
      'VATSearchProcessor.js',
      'VATSearchDetailsProcessor.js',
      'TaxCodeMapper.js'
    ];
    files.forEach((file) => {
      this.createScriptFile(options, file);
    });
  }

  async createScriptFile(options, filename) {
    const opts = {
      srcFile: 'vat/' + filename,
      filename: filename,
      folder: options.srcPath + 'processors/pre/',
      replaceContents: []
    };
    await super.createFileFromTemplate(opts);
  }
}
module.exports = vatProject;
