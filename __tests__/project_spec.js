'use strict';

const project = require('../src/project');
const fileService = require('../src/fileService');

describe('project', function () {
  beforeEach(() => {
    this.aut = new project();
    this.options = {
      srcPath: 'path/',
      uuid: 'uuid',
      country: 'PH',
      projectName: 'someproject',
      projectPath: 'path/'
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('project.createUUIDFile > expect > uuid is created', () => {
    jest
      .spyOn(fileService.prototype, 'createFile')
      .mockImplementation(() => {});
    const path = 'path';
    const uuid = '1234567890';
    this.aut.createUUIDFile(path, uuid);
    expect(fileService.prototype.createFile).toHaveBeenCalledWith(path + uuid);
  });

  it('tafSearchProject.createComponents > expect > opts are correct', () => {
    jest
      .spyOn(project.prototype, 'createFileFromTemplate')
      .mockImplementation(() => {});
    const filename = 'SchemaInstaller.js';
    this.aut.createComponents(this.options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: filename,
      filename: filename,
      folder: this.options.srcPath + 'components/',
      replaceContents: [[/UUID/g, this.options.uuid]]
    });
  });

  it('tafSearchProject.createBundleRecord > expect > opts are correct', () => {
    jest
      .spyOn(project.prototype, 'createFileFromTemplate')
      .mockImplementation(() => {});
    const filename = 'str_localized_bundle.json';
    this.aut.createBundleRecord(this.options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: filename,
      filename: filename,
      folder: this.options.srcPath + 'records/',
      replaceContents: [
        [/UUID/g, this.options.uuid],
        [/COUNTRY/g, this.options.country],
        [/PROJECT/g, this.options.projectName]
      ]
    });
  });

  it('tafSearchProject.createObjects > expect > opts are correct', () => {
    jest
      .spyOn(project.prototype, 'createFileFromTemplate')
      .mockImplementation(() => {});
    const filename = 'customscript_schema_installer.xml';
    this.aut.createObjects(this.options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: filename,
      filename: filename,
      folder: this.options.projectPath + 'Objects/',
      replaceContents: [
        [/UUID/g, this.options.uuid],
        [/COUNTRY/g, this.options.country],
        [/PROJECT/g, this.options.projectName]
      ]
    });
  });

  it('tafSearchProject.createDeploy > expect > opts are correct', () => {
    jest
      .spyOn(project.prototype, 'createFileFromTemplate')
      .mockImplementation(() => {});
    const files = ['deploy.xml', 'manifest.xml'];
    this.aut.createDeploy(this.options);
    files.forEach((file) => {
      expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
        srcFile: file,
        filename: file,
        folder: this.options.projectPath,
        replaceContents: [
          [/UUID/g, this.options.uuid],
          [/COUNTRY/g, this.options.country],
          [/PROJECT/g, this.options.projectName]
        ]
      });
    });
  });

  it('tafSearchProject.createFileFromTemplate > expect > createFile', () => {
    jest.spyOn(fileService.prototype, 'readFile').mockImplementation(() => {});
    jest
      .spyOn(fileService.prototype, 'createFolder')
      .mockImplementation(() => {});
    jest.spyOn(project.prototype, 'formatFile').mockImplementation(() => {});
    this.options.srcFile = 'file.js';
    this.options.folder = 'folder/';
    this.aut.createFileFromTemplate(this.options);
    expect(fileService.prototype.readFile).toHaveBeenCalledWith(
      './templates/' + this.options.srcFile
    );
    expect(fileService.prototype.createFolder).toHaveBeenCalledWith(
      this.options.folder
    );
  });
});
