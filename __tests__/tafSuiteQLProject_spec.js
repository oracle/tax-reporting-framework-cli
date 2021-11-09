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
      projectName: 'someproject',
      sdfProjectFolder: 'SuiteApp'
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('tafSuiteQLProject.createRecords > expect > opts are correct', () => {
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

  test('tafSuiteQLProject.createSchemas > expect > opts are correct', () => {
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
          [/SDFPROJECTFOLDER/g, this.options.sdfProjectFolder],
          [/PROJECT/g, this.options.projectName]
        ]
      });
    });
  });

  test('tafSuiteQLProject.createProcessors > expect > opts are correct', () => {
    const filename = 'SuiteQLPreProcessor.js';
    this.aut.createProcessors(this.options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'suiteql/' + filename,
      filename: filename,
      folder: this.options.srcPath + 'processors/pre/',
      replaceContents: []
    });
  });

  test('tafSuiteQLProject.createTemplates > expect > opts are correct', () => {
    const filename = 'TAF_TEMPLATE.ftl';
    this.aut.createTemplates(this.options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'suiteql/' + filename,
      filename: filename,
      folder: this.options.srcPath + 'templates/',
      replaceContents: []
    });
  });

  test('tafSuiteQLProject.createBuilders > expect > opts are correct', () => {
    const filename = 'SuiteQLBuilder.js';
    this.aut.createBuilders(this.options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'suiteql/' + filename,
      filename: filename,
      folder: this.options.srcPath + 'builders/',
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

    this.aut.create(this.options);
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
    this.aut.createScriptFile(this.options, filename, folder);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'suiteql/' + filename,
      filename: filename,
      folder: this.options.srcPath + folder,
      replaceContents: []
    });
  });
});
