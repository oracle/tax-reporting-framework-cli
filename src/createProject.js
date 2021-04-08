#!/usr/bin/env node

'use strict';
const inquirer = require('inquirer');
const chalk = require('chalk');
const tafSuiteQLProject = require('./tafSuiteQLProject');
const tafSearchProject = require('./tafSearchProject');
const vatProject = require('./vatProject');

const questions = [
  {
    type: 'input',
    name: 'projectName',
    message:
      'Enter project name. ' +
      chalk.gray(
        '(The project ID must not be empty and can contain only lowercase alphabetic and numeric characters)\n'
      ),
    default: 'myawesomeproject'
  },
  {
    type: 'input',
    name: 'country',
    message: 'Enter report country. ',
    default: 'PH'
  }
];

module.exports = function () {
  inquirer.registerPrompt('filePath', require('inquirer-file-path'));
  inquirer.registerPrompt('directory', require('inquirer-select-directory'));
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'projectType',
        message: 'Select project type. ',
        choices: ['VAT', 'TAF']
      }
    ])
    .then(function (answers) {
      if (answers.projectType === 'VAT') {
        questions.unshift(
          {
            type: 'filePath',
            name: 'srcReportFile',
            message: 'Browse src VAT report file. ',
            basePath: './'
          },
          {
            type: 'directory',
            name: 'templatePath',
            message: 'Browse src VAT template dir. ',
            basePath: './'
          }
        );
      } else {
        questions.unshift({
          type: 'list',
          name: 'searchType',
          message: 'Select search type',
          choices: ['search', 'suiteql']
        });
      }
      promptProjectInfo(answers.projectType);
    });

  const promptProjectInfo = (projectType) => {
    inquirer.prompt(questions).then((answers) => {
      console.log(chalk.grey('------------------'));
      console.log(chalk.redBright('🚀 TRF CLI 🚀'));
      console.log(chalk.grey('------------------'));
      console.log(
        chalk.gray('Project Name: '),
        chalk.blue(answers.projectName)
      );
      console.log(chalk.gray('Project Type: '), chalk.blue(projectType));
      console.log(chalk.gray('Country: '), chalk.blue(answers.country));

      const start = new Date().getTime();
      if (projectType === 'VAT') {
        console.log(
          chalk.gray('VAT src report: '),
          chalk.blue(answers.srcReportFile)
        );
        console.log(
          chalk.gray('VAT template path: '),
          chalk.blue(answers.templatePath)
        );
        console.log(chalk.gray('Creating your project...🚀🚀🚀'));
        new vatProject().create(answers);
      } else {
        if (answers.searchType === 'search') {
          console.log(chalk.gray('Creating your project...🚀🚀🚀'));
          new tafSearchProject().create(answers);
        } else {
          new tafSuiteQLProject().create(answers);
        }
      }
      console.log(
        chalk.gray(`✨ Done in ${(new Date().getTime() - start) / 1000}s!`)
      );
    });
  };
};
