# Tax Reporting Framework CLI
Tax Reporting Framework CLI is a tool for generating boilerplate codes to quickly setup and deploy your reports using Tax Reporting Framework SuiteApp in NetSuite.

## What is Tax Reporting Framework?
Tax Reporting Framework is a powerful reporting framework that uses JSON schema for report definition, freemarker templates for report output and supports Saved Searches and SuiteQL as data source. It was previously named *SuiteTax Reports* but with the recent support for Legacy environment it was renamed to **Tax Reporting Framework**. 

## Installation
```
npm install -g @oracle/tax-reporting-framework-cli
```

## Usage
```
Usage: trf [options] [command]

🚀 TRF CLI 🚀

Options:
  -V, --version  output the version number
  -h, --help     output usage information

Commands:
  create         create new TRF project 😎
```

## Sample
```
trf create
? Select project type.  TAF
? Select search type.  suiteql
? Enter project name. (The project ID must not be empty and can contain only lowercase alphabetic and numeric characters)
 localization-ireland
? Enter report country.  IE
------------------
🚀 TRF CLI 🚀
------------------
Project Name:  localization-ireland
Project Type:  TAF
Country:  IE
✨ Done in 0.005s!
```

## [Contributing](./CONTRIBUTING.MD)
Tax Reporting Framework CLI is an open source project. Pull Requests are currently not being accepted. See [CONTRIBUTING](./CONTRIBUTING.md) for details.

## [License](./LICENSE.txt)
Copyright (c) 2021 Oracle and/or its affiliates The Universal Permissive License (UPL), Version 1.0.