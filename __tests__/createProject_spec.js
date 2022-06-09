import {jest} from '@jest/globals';
import inquirer from 'inquirer';
import createProject from '../src/createProject.js';
import vatProject from '../src/vatProject.js';
import tafSearchProject from '../src/tafSearchProject.js';
import tafSuiteQLProject from '../src/tafSuiteQLProject.js';

jest.mock('inquirer');

describe('createProject', () => {
  beforeEach(() => {
    inquirer.registerPrompt = jest.fn();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('VAT selected > expect vatProject is called', async () => {
    jest.spyOn(vatProject.prototype, 'create').mockImplementation(() => {});
    inquirer.prompt = jest.fn().mockResolvedValue({
      projectType: 'VAT',
      projectName: 'localization=ph',
      country: 'ph',
      srcReportFile: 'vat_ph.js',
      templatePath: './'
    });
    await createProject();
    expect(vatProject.prototype.create).toBeCalled();
  });

  test('TAF selected > SuiteQL > expect tafSuiteQLProject is called', async () => {
    jest
      .spyOn(tafSuiteQLProject.prototype, 'create')
      .mockImplementation(() => {});
    inquirer.prompt = jest.fn().mockResolvedValue({
      projectType: 'TAF',
      projectName: 'localization-ph',
      country: 'ph',
      searchType: 'suiteql'
    });
    await createProject();
    expect(tafSuiteQLProject.prototype.create).toBeCalled();
  });

  test('TAF selected > Search > expect tafSearchProject is called', async () => {
    jest
      .spyOn(tafSearchProject.prototype, 'create')
      .mockImplementation(() => {});
    inquirer.prompt = jest.fn().mockResolvedValue({
      projectType: 'TAF',
      projectName: 'localization-ph',
      country: 'ph',
      searchType: 'search'
    });
    await createProject();
    expect(tafSearchProject.prototype.create).toBeCalled();
  });
});
