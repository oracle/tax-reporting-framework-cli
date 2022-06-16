import {jest} from '@jest/globals';
import project from '../src/project.js';
import tafSearchProject from '../src/tafSearchProject.js';

let aut, options;

describe('tafSearchProject', function () {
  beforeEach(() => {
    jest
      .spyOn(project.prototype, 'createFileFromTemplate')
      .mockImplementation(() => {});
    aut = new tafSearchProject();
    options = {
      srcPath: 'path/',
      uuid: 'uuid',
      country: 'PH',
      projectName: 'someproject',
      sdfProjectFolder: 'SuiteApp'
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('tafSearchProject.createReports > expect > opts are correct', () => {
    const filename = 'str_localized_reports_list.json';
    aut.createReports(options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'search/' + filename,
      filename: filename,
      folder: options.srcPath + 'records/',
      replaceContents: [
        [/UUID/g, options.uuid],
        [/COUNTRY/g, options.country],
        [/PROJECT/g, options.projectName]
      ]
    });
  });

  test('tafSearchProject.createSearches > expect > opts are correct', () => {
    const filename = 'str_localized_searches.json';
    aut.createSearches(options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'search/' + filename,
      filename: filename,
      folder: options.srcPath + 'records/',
      replaceContents: [
        [/UUID/g, options.uuid],
        [/COUNTRY/g, options.country],
        [/PROJECT/g, options.projectName]
      ]
    });
  });

  test('tafSearchProject.createSchemas > expect > opts are correct', () => {
    const files = ['TAF_SEARCH_META.json', 'TAF_SEARCH.json'];
    aut.createSchemas(options);
    files.forEach((file) => {
      expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
        srcFile: 'search/' + file,
        filename: file,
        folder: options.srcPath + 'schemas/',
        replaceContents: [
          [/UUID/g, options.uuid],
          [/COUNTRY/g, options.country],
          [/SDFPROJECTFOLDER/g, options.sdfProjectFolder],
          [/PROJECT/g, options.projectName]
        ]
      });
    });
  });

  test('tafSearchProject.createProcessors > expect > opts are correct', () => {
    const filename = 'SearchPreProcessor.js';
    aut.createProcessors(options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'search/' + filename,
      filename: filename,
      folder: options.srcPath + 'processors/pre/',
      replaceContents: []
    });
  });

  test('tafSearchProject.createTemplates > expect > opts are correct', () => {
    const filename = 'TAF_TEMPLATE.ftl';
    aut.createTemplates(options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'search/' + filename,
      filename: filename,
      folder: options.srcPath + 'templates/',
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

    aut.create(options);
    expect(tafSearchProject.prototype.createReports).toBeCalled();
    expect(tafSearchProject.prototype.createSearches).toBeCalled();
    expect(tafSearchProject.prototype.createSchemas).toBeCalled();
    expect(tafSearchProject.prototype.createProcessors).toBeCalled();
    expect(tafSearchProject.prototype.createTemplates).toBeCalled();
  });
});
