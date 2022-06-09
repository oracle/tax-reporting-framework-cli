#!/usr/bin/env node
/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

'use strict';
import inquirer from 'inquirer';
import {createRequire} from 'node:module';
import chalk from 'chalk';
import tafSuiteQLProject from './tafSuiteQLProject.js';
import tafSearchProject from './tafSearchProject.js';
import vatProject from './vatProject.js';

const require = createRequire(import.meta.url);

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
const questionSDFProjectType = {
  type: 'list',
  name: 'sdfProjectType',
  message: 'Select SDF project type. ',
  choices: ['SuiteApp', 'Account Customization'] 
}

export default async (options) => {
  inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));
  await inquirer
    .prompt([
      {
        type: 'list',
        name: 'projectType',
        message: 'Select project type. ',
        choices: options && options.localization ? ['VAT', 'TAF'] : ['TAF']
      }
    ])
    .then(function (answers) {
      if (answers.projectType === 'VAT') {
        questions.unshift(
          {
            type: 'fuzzypath',
            name: 'srcReportFile',
            excludeFilter: (nodePath) => {
              return nodePath.startsWith('.');
            },
            itemType: 'file',
            rootPath: './',
            message: 'Select VAT report file. ',
            suggestOnly: false
          },
          {
            type: 'fuzzypath',
            name: 'templatePath',
            excludePath: (nodePath) =>
              nodePath.startsWith('node_modules') ||
              nodePath.startsWith('.git'),
            excludeFilter: (nodePath) => nodePath == '.',
            itemType: 'directory',
            rootPath: './',
            message: 'Select VAT template directory. ',
            suggestOnly: false
          }
        );
      } else {
        questions.unshift(
          questionSDFProjectType,
          {
            type: 'list',
            name: 'searchType',
            message: 'Select search type. ',
            choices: ['search', 'suiteql']
          }
        );
      }
      promptProjectInfo(answers.projectType);
    });
};

const promptProjectInfo = async (projectType) => {
  await inquirer.prompt(questions).then((answers) => {
    console.log(chalk.grey('------------------'));
    console.log(chalk.redBright('🚀 TRF CLI 🚀'));
    console.log(chalk.grey('------------------'));
    console.log(chalk.gray('Project Name: '), chalk.blue(answers.projectName));
    console.log(chalk.gray('Project Type: '), chalk.blue(projectType));
    console.log(chalk.gray('Country: '), chalk.blue(answers.country));

    const start = new Date().getTime();
    answers.sdfProjectFolder = projectType === 'VAT' || answers.sdfProjectType === 'SuiteApp' ? 'SuiteApps' : 'SuiteScripts';
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
