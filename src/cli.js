'use strict';

const { Command } = require('commander');
const chalk = require('chalk');
const project = require('./project');

class cli {
  constructor() {}
  start() {
    try {
      const program = new Command();
      program.version('1.0.0');

      program
        .option('-d, --debug', 'debug mode')
        .option(
          '-p, --project <projectName>',
          'your project name without spaces',
          'my-awesome-report'
        )
        .option(
          '-t, --type <projectType>',
          'report type (suiteql, nquery, search)',
          'suiteql'
        );
      program.parse(process.argv);
      //   TODO: add validation of project name
      //   TODO: add validation of project type

      const start = new Date().getTime();
      const options = program.opts();
      if (options.debug) console.log(options);

      console.log(chalk.blue('🚀 TRF CLI 🚀'));
      console.log(chalk.blue('Creating your project...🚀🚀🚀'));
      console.log(`✅ Creating project: ${chalk.green(options.project)}`);
      console.log(`✅ Project type: ${chalk.green(options.type)}`);
      new project().create(options);

      const elapsed = (new Date().getTime() - start) / 1000;
      console.log(chalk.blue(`✨ Done in ${elapsed}s!`));
    } catch (ex) {
      console.log('Exception: ', ex.toString());
    }
  }
}

new cli().start();
