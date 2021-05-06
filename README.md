# Tax Reporting Framework CLI

## Command line interface for creating reports in TRF with ease!
```
? Select project type.  VAT
? Find src VAT report file vat.IE.Report.js
? Enter project name.  Localization-Ireland
? Enter report country.  IE
------------------
🚀 TRF CLI 🚀
------------------
Project Name:  Localization-Ireland
Project Type:  VAT
Country:  IE
VAT Source Report:  vat.IE.Report.js
Creating your project...🚀🚀🚀
✨ Done in 0.002s!
```

## Installation
```
git clone https://gitlab.eng.netsuite.com/localization-prod/shared-components/tax-reporting-framework-cli
cd tax-reporting-framework-cli
npm install -g ./
trf create
```
## Commands
```
Usage: trf [options] [command]

🚀 TRF CLI 🚀

Options:
  -V, --version  output the version number
  -h, --help     output usage information

Commands:
  create         create new TRF project 😎
```
## Approved OSSRs
- [x] commander: https://nlcorp.app.netsuite.com/app/common/custom/custrecordentry.nl?id=3009&rectype=2933&whence=
- [x] inquirer: https://nlcorp.app.netsuite.com/app/common/custom/custrecordentry.nl?id=3010&rectype=2933&whence=
- [x] chalk: https://nlcorp.app.netsuite.com/app/common/custom/custrecordentry.nl?id=3011&rectype=2933&whence=
- [x] jest: https://nlcorp.app.netsuite.com/app/common/custom/custrecordentry.nl?id=3014&rectype=2933&whence=
- [x] prettier: https://nlcorp.app.netsuite.com/app/common/custom/custrecordentry.nl?id=3018&rectype=2933&whence=
- [x] path: https://nlcorp.app.netsuite.com/app/common/custom/custrecordentry.nl?id=3015&rectype=2933&whence=
- [ ] inquirer-file-path: https://nlcorp.app.netsuite.com/app/common/custom/custrecordentry.nl?id=3012&rectype=2933&whence=
- [ ] inquirer-select-directory: https://nlcorp.app.netsuite.com/app/common/custom/custrecordentry.nl?id=3013&rectype=2933&whence=
- [x] node-fs-extra: https://nlcorp.app.netsuite.com/app/common/custom/custrecordentry.nl?id=3016&rectype=2933&whence=
- [x] uuid: https://nlcorp.app.netsuite.com/app/common/custom/custrecordentry.nl?id=3017&rectype=2933&whence=

## To do
- [x] Get approval from exporteccn_ww@oracle.com
- [ ] Contact Oracle Legal to discuss the type of project you would like to open source and to get advice about the type of the license to use.
- [ ] Get approval from Oracle Corporate Architecture. The request is made via the form, prerequisites should be met: LICENSE.txt and THIRD-PARTY-LICENSES.txt files should be placed in the root and copyright/license headers added to project files. Contact: Corporate Architecture Approvals <corparch_appr@oracle.com>
- [ ] Get approval from HQInfo. Contact: hqinfo_us_appr@oracle.com
- [ ] Oracle headers
- [x] THIRD_PARTY_LICENSES.txt

## References
https://confluence.corp.netsuite.com/display/TEAMPDP/Open+Source+Software+Approval+Process