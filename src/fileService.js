'use strict';
const fs = require('fs').promises;
const path = require('path');

module.exports = class fileService {
  constructor() {}

  async createFolder(name) {
    await fs.mkdir(name, { recursive: true }).catch((err) => {
      // console.log(`Failed to create folder: ${name}, Error: ${err}`);
      throw err;
    });
  }

  async createFile(name, contents) {
    await fs.writeFile(name, contents).catch((err) => {
      // console.log(`Failed to write file: ${name}, Error: ${err}`);
      throw err;
    });
  }

  async readFile(name) {
    const contents = await fs
      .readFile(path.resolve(__dirname, '../', name))
      .catch((err) => {
        // console.log(`Failed to read file: ${name}, Error: ${err}`);
        throw err;
      });
    return contents ? contents.toString() : '';
  }
};
