'use strict';

const project = require('../src/project');
const tafSearchProject = require('../src/tafSearchProject');

describe('tafSearchProject', function () {
  beforeEach(() => {
    jest
      .spyOn(project.prototype, 'createFileFromTemplate')
      .mockImplementation(() => {});
    this.aut = new tafSearchProject();
    this.options = {
      srcPath: 'path/',
      uuid: 'uuid',
      country: 'PH',
      projectName: 'someproject'
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('tafSearchProject.createReports > expect > opts are correct', () => {
    const filename = 'str_localized_reports_list.json';
    this.aut.createReports(this.options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'search/' + filename,
      filename: filename,
      folder: this.options.srcPath + 'records/',
      replaceContents: [
        [/UUID/g, this.options.uuid],
        [/COUNTRY/g, this.options.country],
        [/PROJECT/g, this.options.projectName]
      ]
    });
  });

  test('tafSearchProject.createSearches > expect > opts are correct', () => {
    const filename = 'str_localized_searches.json';
    this.aut.createSearches(this.options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'search/' + filename,
      filename: filename,
      folder: this.options.srcPath + 'records/',
      replaceContents: [
        [/UUID/g, this.options.uuid],
        [/COUNTRY/g, this.options.country],
        [/PROJECT/g, this.options.projectName]
      ]
    });
  });

  test('tafSearchProject.createSchemas > expect > opts are correct', () => {
    const files = ['TAF_SEARCH_META.json', 'TAF_SEARCH.json'];
    this.aut.createSchemas(this.options);
    files.forEach((file) => {
      expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
        srcFile: 'search/' + file,
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

  test('tafSearchProject.createProcessors > expect > opts are correct', () => {
    const filename = 'SearchPreProcessor.js';
    this.aut.createProcessors(this.options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'search/' + filename,
      filename: filename,
      folder: this.options.srcPath + 'processors/pre/',
      replaceContents: []
    });
  });

  test('tafSearchProject.createTemplates > expect > opts are correct', () => {
    const filename = 'TAF_TEMPLATE.ftl';
    this.aut.createTemplates(this.options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'search/' + filename,
      filename: filename,
      folder: this.options.srcPath + 'templates/',
      replaceContents: []
    });
  });

  test('tafSearchProject.create > expect > create files', () => {
    jest.spyOn(project.prototype, 'create').mockImplementation(() => {});
    jest
      .spyOn(tafSearchProject.prototype, 'createReports')
      .mockImplementation(() => {});
    jest
      .spyOn(tafSearchProject.prototype, 'createSearches')
      .mockImplementation(() => {});
    jest
      .spyOn(tafSearchProject.prototype, 'createSchemas')
      .mockImplementation(() => {});
    jest
      .spyOn(tafSearchProject.prototype, 'createProcessors')
      .mockImplementation(() => {});
    jest
      .spyOn(tafSearchProject.prototype, 'createTemplates')
      .mockImplementation(() => {});

    this.aut.create(this.options);
    expect(tafSearchProject.prototype.createReports).toBeCalled();
    expect(tafSearchProject.prototype.createSearches).toBeCalled();
    expect(tafSearchProject.prototype.createSchemas).toBeCalled();
    expect(tafSearchProject.prototype.createProcessors).toBeCalled();
    expect(tafSearchProject.prototype.createTemplates).toBeCalled();
  });
});
