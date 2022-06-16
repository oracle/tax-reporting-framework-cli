import {jest} from '@jest/globals';
import fs from 'fs/promises';

jest.mock('fs/promises');

fs.mkdir = jest.fn().mockResolvedValue();
fs.readFile = jest.fn().mockResolvedValue();
fs.writeFile = jest.fn().mockResolvedValue();

import fileService from '../src/fileService';

let aut;

describe('fileService', () => {
  beforeEach(() => {
    aut = new fileService();

    fs.mkdir = jest.fn().mockResolvedValue();
    fs.readFile = jest.fn().mockResolvedValue();
    fs.writeFile = jest.fn().mockResolvedValue();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('fileService.createFolder > expect > params are correct', async () => {
    const filename = 'folder';
    await aut.createFolder(filename);
    expect(fs.mkdir).toHaveBeenCalledWith(filename, { recursive: true });
  });

  test('fileService.createFolder > throw error > expect > catch error', async () => {
    const expected = new Error('some error');
    const filename = 'folder';
    fs.mkdir.mockRejectedValueOnce(expected);
    await expect(aut.createFolder(filename)).rejects.toMatchObject(
      expected
    );
  });

  test('fileService.createFile > expect > params are correct', async () => {
    const filename = 'folder';
    const contents = 'abc123';
    await aut.createFile(filename, contents);
    expect(fs.writeFile).toHaveBeenCalledWith(filename, contents);
  });

  test('fileService.createFile > throw error > expect > catch error', async () => {
    const expected = new Error('some error');
    const filename = 'folder';
    const contents = 'abc123';
    fs.writeFile.mockRejectedValueOnce(expected);
    await expect(aut.createFile(filename, contents)).rejects.toMatchObject(
      expected
    );
  });

  test('fileService.readFile > abc123 > expect >  return abc123', async () => {
    const expected = 'abc123';
    const filename = 'folder';
    fs.readFile.mockResolvedValue(expected);
    var contents = await aut.readFile(filename);
    expect(contents).toEqual(expected);
  });

  test('fileService.readFile > empty string > expect > return empty string', async () => {
    const expected = '';
    const filename = 'folder';
    fs.readFile = jest.fn().mockResolvedValue(expected);
    var contents = await aut.readFile(filename);
    expect(contents).toEqual(expected);
  });

  test('fileService.readFile > throw error > expect > catch error', async () => {
    const expected = new Error('some error');
    const filename = 'folder';

    fs.readFile = jest.fn().mockRejectedValueOnce(expected)

    await expect(aut.readFile(filename)).rejects.toMatchObject(expected);
  });
});
