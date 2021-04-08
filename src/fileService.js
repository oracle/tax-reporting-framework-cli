'use strict';
const fs = require('fs').promises;
const path = require('path');

module.exports = class fileService {
  constructor() {}

  async createFolder(name) {
    await fs.mkdir(name, { recursive: true }).catch(console.error);
  }

  createFileSync(name, contents) {
    fs.writeFile(name, contents).catch((err) =>
      console.error(`Failed to write file: ${name}, Error: ${err}`)
    );
  }

  async createFile(name, contents) {
    await fs
      .writeFile(name, contents)
      .catch((err) =>
        console.error(`Failed to write file: ${name}, Error: ${err}`)
      );
  }

  async readFile(name) {
    const contents = await fs
      .readFile(path.resolve(__dirname, '../', name))
      .catch((err) =>
        console.error(`Failed to read file: ${name}, Error: ${err}`)
      );
    return contents ? contents.toString() : '';
  }
};
