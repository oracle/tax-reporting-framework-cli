#!/usr/bin/env node

'use strict';
const fileService = require('./fileService');
const { v4: uuidv4 } = require('uuid');
const prettier = require('prettier');

const FILECABINET_FOLDER = 'FileCabinet/SuiteApps/com.netsuite.';
const SRC_FOLDER = 'src/';

class project {
  constructor() {
    this._uuid = uuidv4();
    this._fs = new fileService();
  }

  async create(options) {
    const projectPath = options.projectName + '/';
    const fileCabinetPath = projectPath + FILECABINET_FOLDER + projectPath;
    const srcPath = fileCabinetPath + SRC_FOLDER;

    options.uuid = this._uuid;
    options.projectPath = projectPath;
    options.srcPath = srcPath;
    options.fileCabinetPath = fileCabinetPath;

    await this._fs.createFolder(projectPath);
    await this._fs.createFolder(srcPath);
    await this._fs.createFolder(fileCabinetPath);
    this.createUUIDFile(fileCabinetPath, this._uuid);
    this.createComponents(options);
    this.createBundleRecord(options);
    this.createObjects(options);
    this.createDeploy(options);
  }

  createUUIDFile(path, uuid) {
    this._fs.createFile(path + uuid);
  }

  async createComponents(options) {
    const filename = 'SchemaInstaller.js';
    const opts = {
      srcFile: filename,
      filename: filename,
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
    const filename = 'customscript_schema_installer.xml';
    const opts = {
      srcFile: filename,
      filename: filename,
      folder: options.projectPath + 'Objects/',
      replaceContents: [
        [/UUID/g, options.uuid],
        [/COUNTRY/g, options.country],
        [/PROJECT/g, options.projectName]
      ]
    };
    await this.createFileFromTemplate(opts);
  }

  async createDeploy(options) {
    const files = ['deploy.xml', 'manifest.xml'];
    files.forEach(async (file) => {
      const opts = {
        srcFile: file,
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

    if (options.filename.match(/.*js/g)) {
      contents = prettier.format(contents, formatterOptions);
    }

    await this._fs.createFile(options.folder + options.filename, contents);
  }
}

module.exports = project;
