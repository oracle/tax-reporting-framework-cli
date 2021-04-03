'use strict';
const fileService = require('./fileService');
const { v4: uuidv4 } = require('uuid');
const FILECABINET_FOLDER = 'FileCabinet/SuiteApps/com.netsuite.';
const SRC_FOLDER = '/src/';

class project {
  constructor() {
    this._uuid = uuidv4();
    this._fs = new fileService();
  }

  async create(options) {
    const projectPath = options.project + '/';
    const srcPath =
      projectPath + FILECABINET_FOLDER + options.project + SRC_FOLDER;

    options.uuid = this._uuid;
    options.srcPath = srcPath;

    await this.createProjectFolder(projectPath);
    await this.createSrcFolder(srcPath);
    this.createUUIDFile(projectPath, this._uuid);
    this.createComponents(options);
    // this.createProcessor(type);
    this.createBundleRecord(options);
    this.createReportsRecord(options);
    this.createSearchesRecord(options);
    // this.createSchema(type);
  }

  createProjectFolder(projectPath) {
    this._fs.createFolder(projectPath);
  }

  createSrcFolder(srcPath) {
    this._fs.createFolder(srcPath);
  }

  createUUIDFile(srcPath, uuid) {
    this._fs.createFile(srcPath + uuid);
  }

  async createComponents(options) {
    const opts = {
      filename: 'SchemaInstaller.js',
      folder: options.srcPath + 'components/',
      replaceContents: [['UUID', options.uuid]]
    };
    await this.createFileFromTemplate(opts);
  }

  async createBundleRecord(options) {
    const opts = {
      filename: 'bundle.json',
      folder: options.srcPath + 'records/',
      replaceContents: [
        ['UUID', options.uuid],
        ['COUNTRY', options.country],
        ['PROJECT', options.project]
      ]
    };
    await this.createFileFromTemplate(opts);
  }

  async createReportsRecord(options) {
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

  async createSearchesRecord(options) {
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

  async createFileFromTemplate(options) {
    let contents = await this._fs.readFile('./templates/' + options.filename);
    await this._fs.createFolder(options.folder);
    options.replaceContents.forEach((el) => {
      contents = contents.replace(...el);
    });
    this._fs.createFile(options.folder + options.filename, contents);
  }
}

module.exports = project;
