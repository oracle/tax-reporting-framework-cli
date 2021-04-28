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

## Issues
VAT 
- [ ] error is encountered when selecting template of vat report and creating project outside of trf-cli root

## To do
- [ ] Add PostInstall script to remove schemas 
- [x] File for OSSRs - DONE
  - commander: https://nlcorp.app.netsuite.com/app/common/custom/custrecordentry.nl?id=3009&rectype=2933&whence=
  - inquirer: https://nlcorp.app.netsuite.com/app/common/custom/custrecordentry.nl?id=3010&rectype=2933&whence=
  - chalk: https://nlcorp.app.netsuite.com/app/common/custom/custrecordentry.nl?id=3011&rectype=2933&whence=
  - jest: https://nlcorp.app.netsuite.com/app/common/custom/custrecordentry.nl?id=3014&rectype=2933&whence=
  - prettier: https://nlcorp.app.netsuite.com/app/common/custom/custrecordentry.nl?id=3018&rectype=2933&whence=
  - path: https://nlcorp.app.netsuite.com/app/common/custom/custrecordentry.nl?id=3015&rectype=2933&whence=
  - inquirer-file-path: https://nlcorp.app.netsuite.com/app/common/custom/custrecordentry.nl?id=3012&rectype=2933&whence=
  - inquirer-select-directory: https://nlcorp.app.netsuite.com/app/common/custom/custrecordentry.nl?id=3013&rectype=2933&whence=
  - node-fs-extra: https://nlcorp.app.netsuite.com/app/common/custom/custrecordentry.nl?id=3016&rectype=2933&whence=
  - uuid: https://nlcorp.app.netsuite.com/app/common/custom/custrecordentry.nl?id=3017&rectype=2933&whence=
- Send email to exporteccn_ww@oracle.com

## References
https://confluence.corp.netsuite.com/display/TEAMPDP/Open+Source+Software+Approval+Process