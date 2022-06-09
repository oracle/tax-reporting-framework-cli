#!/usr/bin/env node

/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
'use strict';

import fileService from './fileService.js';
import { v4 as uuidv4 } from 'uuid';
import prettier from 'prettier';
const FILECABINET_FOLDER = 'FileCabinet/sdfProjectFolder/com.netsuite.';
const SRC_FOLDER = 'src/';

export default class project {
  constructor() {
    this._uuid = uuidv4();
    this._fs = new fileService();
  }

  async create(options) {
    const projectPath = options.projectName + '/';
    const fileCabinetPath = projectPath + FILECABINET_FOLDER.replace('sdfProjectFolder', options.sdfProjectFolder) + projectPath;
    const srcPath = fileCabinetPath + SRC_FOLDER;

    options.uuid = this._uuid;
    options.projectPath = projectPath;
    options.srcPath = srcPath;
    options.fileCabinetPath = fileCabinetPath;

    await this._fs.createFolder(projectPath);
    await this._fs.createFolder(srcPath);
    this.createUUIDFile(fileCabinetPath, this._uuid);
    this.createBundleRecord(options);
    if (options.sdfProjectFolder === 'SuiteApps') {
      this.createComponents(options);
      this.createObjects(options);
      this.createDeploySuiteApp(options);
    } else if (options.sdfProjectFolder === 'SuiteScripts') {
      this._fs.createFolder(srcPath + 'components/');
      this._fs.createFolder(projectPath + 'Objects/');
      this.createDeployAccountCustomization(options);
    }
  }

  async createUUIDFile(path, uuid) {
    await this._fs.createFile(path + uuid);
  }

  async createComponents(options) {
    const opts = {
      srcFile: `SDFInstaller.js`,
      filename: `${options.projectName}_installer.js`,
      folder: options.srcPath + 'components/',
      replaceContents: [[/UUID/g, options.uuid]]
    };
    await this.createFileFromTemplate(opts);
  }

  async createBundleRecord(options) {
    const filename = 'str_localized_bundle.json';
    const opts = {
      srcFile: filename,
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

  async createObjects(options) {
    const opts = {
      srcFile: `customscript_sdfinstaller.xml`,
      filename: `customscript_${options.projectName}_installer.xml`,
      folder: options.projectPath + 'Objects/',
      replaceContents: [
        [/UUID/g, options.uuid],
        [/COUNTRY/g, options.country],
        [/PROJECT/g, options.projectName]
      ]
    };
    await this.createFileFromTemplate(opts);
  }

  async createDeploySuiteApp(options) {
    const files = ['deploy.xml', 'manifest.xml'];
    files.forEach(async (file) => {
      const opts = {
        srcFile: 'suiteapp/' + file,
        filename: file,
        folder: options.projectPath,
        replaceContents: [
          [/UUID/g, options.uuid],
          [/COUNTRY/g, options.country],
          [/PROJECT/g, options.projectName]
        ]
      };
      await this.createFileFromTemplate(opts);
    });
  }

  async createDeployAccountCustomization(options) {
    const files = ['deploy.xml', 'manifest.xml'];
    files.forEach(async (file) => {
      const opts = {
        srcFile: 'accountcustomization/' + file,
        filename: file,
        folder: options.projectPath,
        replaceContents: [
          [/UUID/g, options.uuid],
          [/COUNTRY/g, options.country],
          [/PROJECT/g, options.projectName]
        ]
      };
      await this.createFileFromTemplate(opts);
    });
  }

  async createFileFromTemplate(options) {
    let contents = await this._fs.readFile('./templates/' + options.srcFile);
    await this._fs.createFolder(options.folder);
    options.replaceContents &&
      options.replaceContents.forEach((el) => {
        contents = contents.replace(...el);
      });

    await this._fs.createFile(
      options.folder + options.filename,
      this.formatFile(options, contents)
    );
  }

  formatFile(options, contents) {
    let formatterOptions = {
      tabWidth: 4,
      semi: true,
      singleQuote: true,
      printWidth: 120,
      bracketSpacing: true,
      endOfLine: 'lf',
      parser: 'babel'
    };
    if (options.filename.match(/.*json$/g)) {
      formatterOptions.parser = 'json';
    }

    //only format js, json
    if (options.filename.match(/.*js/g)) {
      contents = prettier.format(contents, formatterOptions);
    }
    return contents;
  }
}
