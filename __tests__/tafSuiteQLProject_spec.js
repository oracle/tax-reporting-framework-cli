'use strict';

const project = require('../src/project');
const tafSuiteQLProject = require('../src/tafSuiteQLProject');

describe('tafSuiteQLProject', function () {
  beforeEach(() => {
    jest
      .spyOn(project.prototype, 'createFileFromTemplate')
      .mockImplementation(() => {});

    this.aut = new tafSuiteQLProject();
    this.options = {
      srcPath: 'path/',
      uuid: 'uuid',
      country: 'PH',
      projectName: 'someproject'
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('tafSuiteQLProject.createRecords > expect > opts are correct', () => {
    const filename = 'str_localized_reports_list.json';
    this.aut.createRecords(this.options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'suiteql/' + filename,
      filename: filename,
      folder: this.options.srcPath + 'records/',
      replaceContents: [
        [/UUID/g, this.options.uuid],
        [/COUNTRY/g, this.options.country],
        [/PROJECT/g, this.options.projectName]
      ]
    });
  });

  it('tafSuiteQLProject.createSchemas > expect > opts are correct', () => {
    const files = ['TAF_SUITEQL_META.json', 'TAF_SUITEQL.json'];
    this.aut.createSchemas(this.options);
    files.forEach((file) => {
      expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
        srcFile: 'suiteql/' + file,
        filename: file,
        folder: this.options.srcPath + 'schemas/',
        replaceContents: [
          [/UUID/g, this.options.uuid],
          [/COUNTRY/g, this.options.country],
          [/PROJECT/g, this.options.projectName]
        ]
      });
    });
  });

  it('tafSuiteQLProject.createProcessors > expect > opts are correct', () => {
    const filename = 'SuiteQLPreProcessor.js';
    this.aut.createProcessors(this.options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'suiteql/' + filename,
      filename: filename,
      folder: this.options.srcPath + 'processors/pre/',
      replaceContents: []
    });
  });

  it('tafSuiteQLProject.createTemplates > expect > opts are correct', () => {
    const filename = 'TAF_TEMPLATE.ftl';
    this.aut.createTemplates(this.options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'suiteql/' + filename,
      filename: filename,
      folder: this.options.srcPath + 'templates/',
      replaceContents: []
    });
  });

  it('tafSuiteQLProject.createBuilders > expect > opts are correct', () => {
    const filename = 'SuiteQLBuilder.js';
    this.aut.createBuilders(this.options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'suiteql/' + filename,
      filename: filename,
      folder: this.options.srcPath + 'builders/',
      replaceContents: []
    });
  });
});
