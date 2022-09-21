/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
'use strict';

import project from './project.js';

export default class tafSuiteQLProject extends project {
  constructor() {
    super();
  }

  async create(options) {
    super.create(options);
    this.createRecords(options);
    this.createSchemas(options);
    this.createProcessors(options);
    this.createBuilders(options);
    this.createTemplates(options);
  }

  async createTemplates(options) {
    const filename = 'TAF_TEMPLATE.ftl';
    const opts = {
      srcFile: 'suiteql/' + filename,
      filename: filename,
      folder: options.srcPath + 'templates/',
      replaceContents: []
    };
    await this.createFileFromTemplate(opts);
  }

  async createSchemas(options) {
    const files = ['TAF_SUITEQL_META.json', 'TAF_SUITEQL.json'];
    const folder = 'schemas/';
    files.forEach(async (file) => {
      const opts = {
        srcFile: 'suiteql/' + file,
        filename: file,
        folder: options.srcPath + folder,
        replaceContents: [
          [/UUID/g, options.uuid],
          [/COUNTRY/g, options.country],
          [/SUITECLOUDPROJECTFOLDER/g, options.suiteCloudProjectFolder],
          [/PROJECT/g, options.projectName]
        ]
      };
      await this.createFileFromTemplate(opts);
    });
  }

  async createRecords(options) {
    const filename = 'str_localized_reports_list.json';
    const opts = {
      srcFile: 'suiteql/' + filename,
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

  async createScriptFile(options, filename, folder) {
    const opts = {
      srcFile: 'suiteql/' + filename,
      filename: filename,
      folder: options.srcPath + folder,
      replaceContents: []
    };
    await this.createFileFromTemplate(opts);
  }

  async createProcessors(options) {
    const filename = 'SuiteQLPreProcessor.js';
    const opts = {
      srcFile: 'suiteql/' + filename,
      filename: filename,
      folder: options.srcPath + 'processors/pre/',
      replaceContents: []
    };
    await this.createFileFromTemplate(opts);
  }

  async createBuilders(options) {
    const filename = 'SuiteQLBuilder.js';
    const opts = {
      srcFile: 'suiteql/' + filename,
      filename: filename,
      folder: options.srcPath + 'builders/',
      replaceContents: []
    };
    await this.createFileFromTemplate(opts);
  }
}
