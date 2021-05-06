/**
 * Copyright (c) 2021, Oracle and/or its affiliates. All rights reserved.
 */
'use strict';

const fs = require('fs-extra');
const project = require('./project');
const { convert, getTaxDefs } = require('./converter');

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
    this.copyTemplates(options);
  }

  async createVATReportsRecord(options) {
    const filename = 'str_localized_reports_list.json';
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
    const filename = 'str_localized_searches.json';
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
    let filename = 'VAT_SUMMARY';
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

    const files = ['VAT_META.json', 'VAT_DETAILS.json'];
    const folder = 'schemas/';
    files.forEach((file) => {
      this.createScriptFile(options, file, folder);
    });
  }

  async createProcessors(options) {
    //COUNTRYTaxCodeMapper.js
    const taxCodeDefs = getTaxDefs(this.contents);
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

    const folder = 'processors/pre/';
    files.forEach((file) => {
      this.createScriptFile(options, file, folder);
    });
  }

  async createScriptFile(options, filename, folder) {
    const opts = {
      srcFile: 'vat/' + filename,
      filename: filename,
      folder: options.srcPath + folder,
      replaceContents: []
    };
    await super.createFileFromTemplate(opts);
  }

  async copyTemplates(options) {
    fs.copy(options.templatePath, options.srcPath + 'templates/', (err) => {
      if (err) return console.error(err);
    });
  }
}
module.exports = vatProject;
