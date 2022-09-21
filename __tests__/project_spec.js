import {jest} from '@jest/globals'
import prettier from 'prettier';
import fileService from "./../src/fileService";

import project from '../src/project';

let aut, options;

describe('project', function () {
  beforeEach(() => {
    aut = new project();
    options = {
      srcPath: 'path/',
      uuid: '12345',
      country: 'PH',
      projectName: 'someproject',
      projectPath: 'path/'
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('project.constructor > expect > uuid and fs is initialized', () => {
    let proj = new project();
    expect(proj._uuid).not.toBeUndefined()
    expect(proj._fs).not.toBeUndefined()
  });

  test('project.createUUIDFile > expect > uuid file is created', () => {
    jest
      .spyOn(fileService.prototype, 'createFile')
      .mockImplementation(() => {});
    const path = 'path';
    const uuid = '1234567890';
    aut.createUUIDFile(path, uuid);
    expect(fileService.prototype.createFile).toHaveBeenCalledWith(path + uuid);
  });

  test('project.createComponents > expect > opts are correct', () => {
    jest
      .spyOn(project.prototype, 'createFileFromTemplate')
      .mockImplementation(() => {});
   aut.createComponents(options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'SDFInstaller.js',
      filename: 'someproject_installer.js',
      folder: options.srcPath + 'components/',
      replaceContents: [[/UUID/g, options.uuid]]
    });
  });

  test('project.createBundleRecord > expect > opts are correct', () => {
    jest
      .spyOn(project.prototype, 'createFileFromTemplate')
      .mockImplementation(() => {});
    const filename = 'str_localized_bundle.json';
    aut.createBundleRecord(options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: filename,
      filename: filename,
      folder: options.srcPath + 'records/',
      replaceContents: [
        [/UUID/g, options.uuid],
        [/COUNTRY/g, options.country],
        [/PROJECT/g, options.projectName]
      ]
    });
  });

  test('project.createObjects > expect > opts are correct', () => {
    jest
      .spyOn(project.prototype, 'createFileFromTemplate')
      .mockImplementation(() => {});
    aut.createObjects(options);
    expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
      srcFile: 'customscript_sdfinstaller.xml',
      filename: 'customscript_someproject_installer.xml',
      folder: options.projectPath + 'Objects/',
      replaceContents: [
        [/UUID/g, options.uuid],
        [/COUNTRY/g, options.country],
        [/PROJECT/g, options.projectName]
      ]
    });
  });

  test('project.createDeploySuiteApp > expect > opts are correct', () => {
    jest
      .spyOn(project.prototype, 'createFileFromTemplate')
      .mockImplementation(() => {});
    const files = ['deploy.xml', 'manifest.xml'];
    aut.createDeploySuiteApp(options);
    files.forEach((file) => {
      expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
        srcFile: 'suiteapp/' + file,
        filename: file,
        folder: options.projectPath,
        replaceContents: [
          [/UUID/g, options.uuid],
          [/COUNTRY/g, options.country],
          [/PROJECT/g, options.projectName]
        ]
      });
    });
  });

  test('project.createDeployAccountCustomization > expect > opts are correct', () => {
    jest
      .spyOn(project.prototype, 'createFileFromTemplate')
      .mockImplementation(() => {});
    const files = ['deploy.xml', 'manifest.xml'];
    aut.createDeployAccountCustomization(options);
    files.forEach((file) => {
      expect(project.prototype.createFileFromTemplate).toHaveBeenCalledWith({
        srcFile: 'accountcustomization/' + file,
        filename: file,
        folder: options.projectPath,
        replaceContents: [
          [/UUID/g, options.uuid],
          [/COUNTRY/g, options.country],
          [/PROJECT/g, options.projectName]
        ]
      });
    });
  });

  test('project.createFileFromTemplate > expect > createFile', () => {
    jest.spyOn(fileService.prototype, 'readFile').mockImplementation(() => {
      return 'UUID';
    });
    jest
      .spyOn(fileService.prototype, 'createFolder')
      .mockImplementation(() => {});
    jest.spyOn(project.prototype, 'formatFile').mockImplementation((a, b) => {
      return b;
    });
    jest
      .spyOn(fileService.prototype, 'createFile')
      .mockImplementation(() => {});

    options.srcFile = 'file.js';
    options.folder = 'folder/';
    options.filename = 'file.js';
    options.replaceContents = [[/UUID/g, options.uuid]];
    var expected = '12345';

    aut.createFileFromTemplate(options).then(() => {
      expect(fileService.prototype.readFile).toHaveBeenCalledWith(
        './templates/' + options.srcFile
      );
      expect(fileService.prototype.createFolder).toHaveBeenCalledWith(
        options.folder
      );
      expect(project.prototype.formatFile).toBeCalledWith(
        options,
        expected
      );
      expect(fileService.prototype.createFile).toBeCalledWith(
        options.folder + options.filename,
        expected
      );
    });
  });

  test('project.formatFile > expect > format contents', () => {
    jest.spyOn(prettier, 'format').mockImplementation((a) => {
      return a.trim();
    });
    const input = '     abc      ';
    const expected = 'abc';
    options.filename = 'file.js';
    const formatterOptions = {
      tabWidth: 4,
      semi: true,
      singleQuote: true,
      printWidth: 120,
      bracketSpacing: true,
      endOfLine: 'lf',
      parser: 'babel'
    };
    expect(aut.formatFile(options, input)).toEqual(expected);
    expect(prettier.format).toBeCalledWith(input, formatterOptions);

    options.filename = 'file.json';
    formatterOptions.parser = 'json';
    aut.formatFile(options, input);
    expect(prettier.format).toBeCalledWith(input, formatterOptions);
  });

  test('project.create suiteCLoudProjectType is SuiteApp > expect > create folder and files and call createDeploySuiteApp', () => {
    jest
      .spyOn(fileService.prototype, 'createFolder')
      .mockImplementation(() => {});
    jest
      .spyOn(project.prototype, 'createUUIDFile')
      .mockImplementation(() => {});
    jest
      .spyOn(project.prototype, 'createComponents')
      .mockImplementation(() => {});
    jest
      .spyOn(project.prototype, 'createBundleRecord')
      .mockImplementation(() => {});
    jest.spyOn(project.prototype, 'createObjects').mockImplementation(() => {});
    jest.spyOn(project.prototype, 'createDeploySuiteApp').mockImplementation(() => {});
    options.suiteCLoudProjectType = 'SuiteApp'
    options.suiteCloudProjectFolder = 'SuiteApps'
    aut.create(options).then(() => {
      expect(fileService.prototype.createFolder).toHaveBeenCalledWith(
        options.projectPath
      );
      expect(fileService.prototype.createFolder).toHaveBeenCalledWith(
        options.srcPath
      );
      expect(project.prototype.createUUIDFile).toHaveBeenCalledWith(
        options.fileCabinetPath,
        aut._uuid
      );
      expect(project.prototype.createComponents).toHaveBeenCalledWith(
        options
      );
      expect(project.prototype.createBundleRecord).toHaveBeenCalledWith(
        options
      );
      expect(project.prototype.createObjects).toHaveBeenCalledWith(
        options
      );
      expect(project.prototype.createDeploySuiteApp).toHaveBeenCalledWith(options);
    });
  });

  test('project.create suiteCloudProjectType is Account Customization > expect > create folder and files and call createDeployAccountCustomization', () => {
    jest
      .spyOn(fileService.prototype, 'createFolder')
      .mockImplementation(() => {});
    jest
      .spyOn(project.prototype, 'createUUIDFile')
      .mockImplementation(() => {});
    jest
      .spyOn(project.prototype, 'createBundleRecord')
      .mockImplementation(() => {});
    jest.spyOn(project.prototype, 'createDeployAccountCustomization').mockImplementation(() => {});
    options.suiteCloudProjectType = 'Account Customization'
    options.suiteCloudProjectFolder = 'SuiteScripts'
    aut.create(options).then(() => {
      expect(fileService.prototype.createFolder).toHaveBeenCalledWith(
        options.projectPath
      );
      expect(fileService.prototype.createFolder).toHaveBeenCalledWith(
        options.srcPath
      );
      expect(fileService.prototype.createFolder).toHaveBeenCalledWith(
        options.srcPath + 'components/'
      );
      expect(fileService.prototype.createFolder).toHaveBeenCalledWith(
        options.projectPath  + 'Objects/'
      );
      expect(project.prototype.createUUIDFile).toHaveBeenCalledWith(
        options.fileCabinetPath,
        aut._uuid
      );
      expect(project.prototype.createBundleRecord).toHaveBeenCalledWith(
        options
      );
      expect(project.prototype.createDeployAccountCustomization).toHaveBeenCalledWith(options);
    });
  });
});
