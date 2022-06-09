/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
'use strict';

import fs from 'fs-extra';
import prettier from 'prettier';
import project from './project.js';
import { convertToSummaries, convertToDetails, getTaxDefs } from './converter.js';

export default class vatProject extends project {
  constructor() {
    super();
  }

  async create(options) {
    const prettierFormat = { tabWidth: 4, singleQuote: true, parser: 'babel' };
    this.contents = await this._fs.readFile(options.srcReportFile);
    this.contents = await prettier.format(this.contents, prettierFormat);
    super.create(options);
    this.createVATReportsRecord(options);
    this.createVATSearchesRecord(options);
    this.createVATSchemas(options);
    this.createProcessors(options);
    this.copyTemplates(options);
  }

  async createVATReportsRecord(options) {
    const filename = 'str_localized_reports_list.json';
    let schemaDetails = [];
    const convertedSummaries = convertToSummaries(this.contents);
    convertedSummaries.forEach(async (content, idx) => {
      const schemaName = `VAT_` + options.country + `_SUMMARY_${idx}.json`;
      schemaDetails.push({
        type: 'Summary',
        schema: schemaName
      });
    });
    const convertedDetails = convertToDetails(this.contents);
    convertedDetails.forEach(async (content, idx) => {
      const schemaName = `VAT_` + options.country + `_DETAILS_${idx}.json`;
      schemaDetails.push({
        type: 'Details',
        schema: schemaName
      });
    });

    const opts = {
      srcFile: 'vat/' + filename,
      filename: filename,
      folder: options.srcPath + 'records/',
      replaceContents: [
        [/UUID/g, options.uuid],
        [/COUNTRY/g, options.country],
        [/PROJECT/g, options.projectName],
        [/"DETAILS"/, JSON.stringify(schemaDetails)]
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
        [/COUNTRYLOWERCASE/g, options.country.toLowerCase()],
        [/COUNTRY/g, options.country],
        [/PROJECT/g, options.projectName]
      ]
    };
    await super.createFileFromTemplate(opts);
  }

  async createVATSchemas(options) {
    let filename = 'VAT_SUMMARY';
    const convertedSummaries = convertToSummaries(this.contents);
    convertedSummaries.forEach(async (content, idx) => {
      const opts = {
        srcFile: `vat/${filename}.json`,
        filename: `VAT_` + options.country + `_SUMMARY_${idx}.json`,
        folder: options.srcPath + 'schemas/',
        replaceContents: [
          [/UUID/g, options.uuid],
          [/COUNTRYLOWERCASE/g, options.country.toLowerCase()],
          [/COUNTRY/g, options.country],
          [/PROJECT/g, options.projectName],
          ['DATA', content.replace(/'/g, '"')]
        ]
      };
      await super.createFileFromTemplate(opts);
    });

    filename = 'VAT_DETAILS';
    const convertedDetails = convertToDetails(this.contents);
    convertedDetails.forEach(async (content, idx) => {
      const opts = {
        srcFile: `vat/${filename}.json`,
        filename: `VAT_` + options.country + `_DETAILS_${idx}.json`,
        folder: options.srcPath + 'schemas/',
        replaceContents: [
          [/UUID/g, options.uuid],
          [/COUNTRYLOWERCASE/g, options.country.toLowerCase()],
          [/COUNTRY/g, options.country],
          [/PROJECT/g, options.projectName],
          ['DATA', content.replace(/'/g, '"')]
        ]
      };
      await super.createFileFromTemplate(opts);
    });

    const folder = 'schemas/';
    this.createScriptFile(
      options,
      `VAT_META.json`,
      `VAT_${options.country}_META.json`,
      folder
    );
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
      'TaxCodeMapper.js',
      'VATSearchNonDeductibleProcessor.js',
      'VATSearchNonDeductibleDetailsProcessor.js'
    ];

    const folder = 'processors/pre/';
    files.forEach((file) => {
      this.createScriptFile(options, file, file, folder);
    });
  }

  async createScriptFile(options, sourceFile, destinationFile, folder) {
    const opts = {
      srcFile: 'vat/' + sourceFile,
      filename: destinationFile,
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
