#!/usr/bin/env node
'use strict';

// const { Command } = require('commander');
const program = require('commander');
const chalk = require('chalk');
const project = require('./project');
const createProject = require('./createProject');

class trfCLI {
  constructor() {}
  start() {
    try {
      // const program = new Command();
      // program.version('1.0.0');

      // program
      //   .description(chalk.blue('🚀 TRF CLI 🚀'))
      //   .option('-d, --debug', 'debug mode')
      //   .option(
      //     '-p, --project <projectName>',
      //     'your project name without spaces',
      //     'my-awesome-report'
      //   )
      //   .option(
      //     '-t, --type <projectType>',
      //     'report type (suiteql, nquery, search)',
      //     'suiteql'
      //   )
      //   .option('-c, --country <countrycode>', 'countrycode (PH, GB, CZ)', 'PH')
      //   .parse(process.argv);
      //   TODO: add validation of project name
      //   TODO: add validation of project type

      // const start = new Date().getTime();
      // const options = program.opts();
      // if (options.debug) console.log(options);

      // console.log(chalk.blue('🚀 TRF CLI 🚀'));
      // console.log(chalk.blue('Creating your project...🚀🚀🚀'));
      // console.log(`✅ Creating project: ${chalk.green(options.project)}`);
      // console.log(`✅ Project type: ${chalk.green(options.type)}`);
      // console.log(`✅ Country: ${chalk.green(options.country)}`);
      // new project().create(options);
      // const elapsed = (new Date().getTime() - start) / 1000;
      // console.log(chalk.blue(`✨ Done in ${elapsed}s!`));

      program
        .version('1.0.0')
        .command('create')
        .description('create new TRF project 😎')
        .action(function () {
          createProject();
        });
      program.parse(process.argv);

      if (process.argv.length === 2) {
        program.help();
      }
    } catch (ex) {
      console.log('Exception: ', ex.toString());
    }
  }
}

new trfCLI().start();
