#!/usr/bin/env node

'use strict';
const fileService = require('./fileService');
const { v4: uuidv4 } = require('uuid');
const convert = require('./converter');

const FILECABINET_FOLDER = 'FileCabinet/SuiteApps/com.netsuite.';
const SRC_FOLDER = '/src/';

class project {
  constructor() {
    this._uuid = uuidv4();
    this._fs = new fileService();
  }

  async create(options) {
    const projectPath = options.projectName + '/';
    const srcPath =
      projectPath + FILECABINET_FOLDER + options.projectName + SRC_FOLDER;

    options.uuid = this._uuid;
    options.srcPath = srcPath;

    await this.createProjectFolder(projectPath);
    await this.createSrcFolder(srcPath);
    this.createUUIDFile(projectPath, this._uuid);
    this.createComponents(options);
    this.createBundleRecord(options);
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
    const filename = 'SchemaInstaller.js';
    const opts = {
      srcFile: filename,
      filename: filename,
      folder: options.srcPath + 'components/',
      replaceContents: [['UUID', options.uuid]]
    };
    await this.createFileFromTemplate(opts);
  }

  async createBundleRecord(options) {
    const filename = 'bundle.json';
    const opts = {
      srcFile: filename,
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

  // async createSchema(options) {
  //   const opts = {
  //     filename: 'schema.json',
  //     folder: options.srcPath + 'records/',
  //     replaceContents: [
  //       ['UUID', options.uuid],
  //       ['COUNTRY', options.country],
  //       ['PROJECT', options.projectName]
  //     ]
  //   };
  //   await this.createFileFromTemplate(opts);
  // }

  async createFileFromTemplate(options) {
    let contents = await this._fs.readFile('./templates/' + options.srcFile);
    await this._fs.createFolder(options.folder);
    options.replaceContents &&
      options.replaceContents.forEach((el) => {
        contents = contents.replace(...el);
      });
    await this._fs.createFile(options.folder + options.filename, contents);
  }
}

module.exports = project;
