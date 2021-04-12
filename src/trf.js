#!/usr/bin/env node
'use strict';

const program = require('commander');
const chalk = require('chalk');
const createProject = require('./createProject');

class trfCLI {
  constructor() {}
  start() {
    try {
      program
        .version('1.0.0')
        .description(chalk.redBright('🚀 TRF CLI 🚀'))
        .command('create')
        .description('create new TRF project 😎')
        .action(function () {
          createProject();
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
