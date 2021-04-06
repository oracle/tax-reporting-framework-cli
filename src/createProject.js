#!/usr/bin/env node

'use strict';
const inquirer = require('inquirer');
const chalk = require('chalk');
const tafProject = require('./tafProject');
const vatProject = require('./vatProject');

const questions = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Enter project name. ',
    default: 'my-awesome-project'
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
        questions.unshift({
          type: 'filePath',
          name: 'srcReportFile',
          message: 'Find src VAT report file',
          basePath: './'
        });
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
      console.log(chalk.blue('Project Name: '), answers.projectName);
      console.log(chalk.blue('Project Type: '), projectType);
      console.log(chalk.blue('Country: '), answers.country);

      const start = new Date().getTime();
      if (projectType === 'VAT') {
        console.log(chalk.blue('VAT Source Report: '), answers.srcReportFile);
        console.log(chalk.gray('Creating your project...🚀🚀🚀'));
        new vatProject().create(answers);
      } else {
        if (answers.searchType === 'search') {
          console.log(chalk.blue('VAT Source Report: '), answers.srcReportFile);
          console.log(chalk.gray('Creating your project...🚀🚀🚀'));
          new tafProject().createTAFSearch(answers);
        } else {
          new tafProject().createTAFSuiteQL(answers);
        }
      }
      console.log(
        chalk.gray(`✨ Done in ${(new Date().getTime() - start) / 1000}s!`)
      );
    });
  };
};
