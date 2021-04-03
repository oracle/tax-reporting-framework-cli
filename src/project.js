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

    await this.createProjectFolder(projectPath);
    await this.createSrcFolder(srcPath);
    this.createUUIDFile(projectPath, this._uuid);
    this.createComponents(srcPath, this._uuid);
    // this.createProcessor(type);
    // this.createRecords(type);
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

  async createComponents(srcPath, uuid) {
    const contents = await this._fs.readFile('./templates/SchemaInstaller.txt');
    const componentsFolder = srcPath + 'components/';
    await this._fs.createFolder(componentsFolder);
    this._fs.createFile(
      componentsFolder + 'SchemaInstaller.js',
      contents.replace('CTR_UUID', uuid)
    );
  }
}

module.exports = project;
