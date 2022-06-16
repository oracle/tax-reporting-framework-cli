import {jest} from '@jest/globals';
import project from '../src/project.js';
import tafSuiteQLProject from '../src/tafSuiteQLProject.js';

let aut, options;

describe('tafSuiteQLProject', function () {
  beforeEach(() => {
    jest
      .spyOn(project.prototype, 'createFileFromTemplate')
      .mockImplementation(() => {});

    aut = new tafSuiteQLProject();
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

  test('tafSuiteQLProject.createRecords > expect > opts are correct', () => {
    const filename = 'str_localized_reports_list.json';
    aut.createRecords(options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'suiteql/' + filename,
      filename: filename,
      folder: options.srcPath + 'records/',
      replaceContents: [
        [/UUID/g, options.uuid],
        [/COUNTRY/g, options.country],
        [/PROJECT/g, options.projectName]
      ]
    });
  });

  test('tafSuiteQLProject.createSchemas > expect > opts are correct', () => {
    const files = ['TAF_SUITEQL_META.json', 'TAF_SUITEQL.json'];
    aut.createSchemas(options);
    files.forEach((file) => {
      expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
        srcFile: 'suiteql/' + file,
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

  test('tafSuiteQLProject.createProcessors > expect > opts are correct', () => {
    const filename = 'SuiteQLPreProcessor.js';
    aut.createProcessors(options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'suiteql/' + filename,
      filename: filename,
      folder: options.srcPath + 'processors/pre/',
      replaceContents: []
    });
  });

  test('tafSuiteQLProject.createTemplates > expect > opts are correct', () => {
    const filename = 'TAF_TEMPLATE.ftl';
    aut.createTemplates(options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'suiteql/' + filename,
      filename: filename,
      folder: options.srcPath + 'templates/',
      replaceContents: []
    });
  });

  test('tafSuiteQLProject.createBuilders > expect > opts are correct', () => {
    const filename = 'SuiteQLBuilder.js';
    aut.createBuilders(options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'suiteql/' + filename,
      filename: filename,
      folder: options.srcPath + 'builders/',
      replaceContents: []
    });
  });

  test('tafSuiteQLProject.create > expect > create files', () => {
    jest.spyOn(project.prototype, 'create').mockImplementation(() => {});
    jest
      .spyOn(tafSuiteQLProject.prototype, 'createRecords')
      .mockImplementation(() => {});
    jest
      .spyOn(tafSuiteQLProject.prototype, 'createSchemas')
      .mockImplementation(() => {});
    jest
      .spyOn(tafSuiteQLProject.prototype, 'createProcessors')
      .mockImplementation(() => {});
    jest
      .spyOn(tafSuiteQLProject.prototype, 'createBuilders')
      .mockImplementation(() => {});
    jest
      .spyOn(tafSuiteQLProject.prototype, 'createTemplates')
      .mockImplementation(() => {});

    aut.create(options);
    expect(tafSuiteQLProject.prototype.createRecords).toBeCalled();
    expect(tafSuiteQLProject.prototype.createSchemas).toBeCalled();
    expect(tafSuiteQLProject.prototype.createProcessors).toBeCalled();
    expect(tafSuiteQLProject.prototype.createBuilders).toBeCalled();
    expect(tafSuiteQLProject.prototype.createTemplates).toBeCalled();
  });

  test('tafSuiteQLProject.createScriptFile > expect > create file', () => {
    jest
      .spyOn(project.prototype, 'createFileFromTemplate')
      .mockImplementation(() => {});

    const filename = 'file.js';
    const folder = 'folder';
    aut.createScriptFile(options, filename, folder);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'suiteql/' + filename,
      filename: filename,
      folder: options.srcPath + folder,
      replaceContents: []
    });
  });
});
