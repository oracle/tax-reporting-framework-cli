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
    jest.clearAllMocks();
  });

  it('tafSearchProject.createReports > expect > opts are correct', () => {
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

  it('tafSearchProject.createSearches > expect > opts are correct', () => {
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

  it('tafSearchProject.createSchemas > expect > opts are correct', () => {
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

  it('tafSearchProject.createProcessors > expect > opts are correct', () => {
    const filename = 'SearchPreProcessor.js';
    this.aut.createProcessors(this.options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'search/' + filename,
      filename: filename,
      folder: this.options.srcPath + 'processors/pre/',
      replaceContents: []
    });
  });

  it('tafSearchProject.createTemplates > expect > opts are correct', () => {
    const filename = 'TAF_TEMPLATE.ftl';
    this.aut.createTemplates(this.options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'search/' + filename,
      filename: filename,
      folder: this.options.srcPath + 'templates/',
      replaceContents: []
    });
  });
});
