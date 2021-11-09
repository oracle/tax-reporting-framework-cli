const fs = require('fs').promises;
const path = require('path');
const fileService = require('../src/fileService');

jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn().mockResolvedValue(),
    readFile: jest.fn().mockResolvedValue(),
    mkdir: jest.fn().mockResolvedValue()
  }
}));
jest.mock('path');

describe('fileService', () => {
  beforeEach(() => {
    this.aut = new fileService();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('fileService.createFolder > expect > params are correct', async () => {
    const filename = 'folder';
    await this.aut.createFolder(filename);
    expect(fs.mkdir).toHaveBeenCalledWith(filename, { recursive: true });
  });

  test('fileService.createFolder > throw error > expect > catch error', async () => {
    const expected = new Error('some error');
    const filename = 'folder';
    fs.mkdir.mockRejectedValueOnce(expected);
    await expect(this.aut.createFolder(filename)).rejects.toMatchObject(
      expected
    );
  });

  test('fileService.createFile > expect > params are correct', async () => {
    const filename = 'folder';
    const contents = 'abc123';
    await this.aut.createFile(filename, contents);
    expect(fs.writeFile).toHaveBeenCalledWith(filename, contents);
  });

  test('fileService.createFile > throw error > expect > catch error', async () => {
    const expected = new Error('some error');
    const filename = 'folder';
    const contents = 'abc123';
    fs.writeFile.mockRejectedValueOnce(expected);
    await expect(this.aut.createFile(filename, contents)).rejects.toMatchObject(
      expected
    );
  });

  test('fileService.readFile > abc123 > expect >  return abc123', async () => {
    const expected = 'abc123';
    const filename = 'folder';
    fs.readFile.mockResolvedValue(expected);
    var contents = await this.aut.readFile(filename);
    expect(contents).toEqual(expected);
  });

  test('fileService.readFile > empty string > expect > return empty string', async () => {
    const expected = '';
    const filename = 'folder';
    fs.readFile.mockResolvedValue(expected);
    var contents = await this.aut.readFile(filename);
    expect(contents).toEqual(expected);
  });

  test('fileService.readFile > throw error > expect > catch error', async () => {
    const expected = new Error('some error');
    const filename = 'folder';
    fs.readFile.mockRejectedValueOnce(expected);
    await expect(this.aut.readFile(filename)).rejects.toMatchObject(expected);
  });
});
