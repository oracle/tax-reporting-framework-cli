#!/usr/bin/env node
/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

'use strict';

import {program, Option} from 'commander';
import chalk from 'chalk';
import createProject from './createProject.js';

class trfCLI {
  constructor() {}
  start() {
    try {
      program
        .version('1.1.0')
        .addOption(new Option('-loc, --localization').hideHelp())
        .description(chalk.redBright('🚀 TRF CLI 🚀'))
        .command('create')
        .description('create new TRF project 😎')
        .action(function () {
          createProject(program.opts());
        });
      program.parse(process.argv);

      if (process.argv.length === 2 || process.argv[2] !== 'create') {
        program.help();
      }
    } catch (ex) {
      console.log('Exception: ', ex.toString());
    }
  }
}

new trfCLI().start();
