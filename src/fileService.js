/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
'use strict';

import fs from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class fileService {
  constructor() {}

  async createFolder(name) {
    await fs.mkdir(name, { recursive: true }).catch((err) => {
      // console.log(`Failed to create folder: ${name}, Error: ${err}`);
      throw err;
    });
  }

  async createFile(name, contents) {
    await fs.writeFile(name, contents || '').catch((err) => {
      // console.log(`Failed to write file: ${name}, Error: ${err}`);
      throw err;
    });
  }

  async readFile(name) {
    const contents = await fs.readFile(path.resolve(__dirname, '../', name))
      .catch((err) => {
        // console.log(`Failed to read file: ${name}, Error: ${err}`);
        throw err;
      });
    return contents ? contents.toString() : '';
  }
};
