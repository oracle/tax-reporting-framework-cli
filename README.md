# Tax Reporting Framework CLI
Tax Reporting Framework CLI is a tool for generating boilerplate codes to quickly setup and deploy your reports using Tax Reporting Framework SuiteApp in NetSuite.

## What is Tax Reporting Framework?
Tax Reporting Framework is a powerful reporting framework that uses JSON schema for report definition, freemarker templates for report output and supports Saved Searches and SuiteQL as data source. It was previously named *SuiteTax Reports* but with the recent support for Legacy environment it was renamed to **Tax Reporting Framework**. 

## Installation using NPM
```
npm install -g @oracle/tax-reporting-framework-cli
```
## No installation required using NPX
```
npx @oracle/tax-reporting-framework-cli create
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
## Account Customization Project Additional steps to replace SDF Installer
Since **run** tag in **deploy.xml** is not supported in SDF Account Customization Project

Manually run the installation scripts to install the localization Bundle, Report, SavedSearch in TRF

#### Account Customization Project Manual Bundle Record Installation
Go to **Customization** > **Scripting** > **Scripts**  

1. Go to filters type select **Scheduled** 
2. View **STR Bundle Installer SS**
3. Go to **Deployments** tab
4. Select 1 deployment and edit
5. Go to **Parameters tab**
6. Populate the parameters as follows: GUID: Project GUID, Filename: str_localized_bundle.json
7. Trigger **Save and Execute**

#### Account Customization Project Manual Report Installation
Go to **Customization** > **Scripting** > **Scripts**  

1. Go to filters type select **Map/Reduce** 
2. View **ReportSchema Installer MR**
3. Go to **Deployments** tab
4. Select 1 deployment and edit
5. Go to **Parameters tab**
6. Populate the parameters as follows: UUID: Project GUID, Filename: str_localized_report_list.json
7. Trigger **Save and Execute**

#### Account Customization Project Manual SavedSearch Installation
Go to **Customization** > **Scripting** > **Scripts**  

1. Go to filters type select **Map/Reduce** 
2. View **STR Search Installer MR**
3. Go to **Deployments** tab
4. Select 1 deployment and edit
5. Go to **Parameters tab**
6. Populate the parameters as follows: UUID: Project GUID, Filename: str_localized_searches.json
7. Trigger **Save and Execute**

## [Contributing](./CONTRIBUTING.MD)
Tax Reporting Framework CLI is an open source project. Pull Requests are currently not being accepted. See [CONTRIBUTING](./CONTRIBUTING.md) for details.

## [License](./LICENSE.txt)
Copyright (c) 2021 Oracle and/or its affiliates The Universal Permissive License (UPL), Version 1.0.