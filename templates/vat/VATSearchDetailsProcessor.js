/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 *
 * @NApiVersion 2.1
 * @NModuleScope TargetAccount
 */

define([], function () {
  function VATSearchDetailsProcessor(params, context) {
    this.name = "VATSearchDetailsProcessor";
    // this.isMBACompatible =
    //   context && context.report ? context.report.isMBACompatible : false;
  }

  VATSearchDetailsProcessor.prototype.process = function (row) {
    try {
      var data = {};
      data.id = row.id;
      data.internalid = row.getValue({
        name: "internalid",
        summary: "group",
      });
      // data.txnType = row.getText({
      //     name: 'custbody_ste_transaction_type',
      //     summary: 'group'
      // });
      // data.itemType = row.getText({
      //     name: 'custitem_ste_item_taxitem_type',
      //     join: 'item',
      //     summary: 'group'
      // });
      // data.subType = row.getText({
      //     name: 'subtype',
      //     join: 'item',
      //     summary: 'group'
      // });
      data.type = row.getValue({
        name: "type",
        summary: "group",
      });
      data.typeName = row.getText({
        name: "type",
        summary: "group",
      });
      data.taxcodeName = row.getText({
        name: "taxcode",
        summary: "group",
      });
      data.taxcodeName = this.cleanUpTaxCodeName(data.taxcodeName);
      data.taxcode = row.getText({
        name: "taxcode",
        summary: "group",
      });
      // if (
      //     runtime.isFeatureInEffect({
      //         feature: 'MULTIBOOK',
      //     }) &&
      //     this.isMBACompatible
      // ) {
      //     data.netamount = row.getValue({
      //         name: 'netamount',
      //         join: 'accountingtransaction',
      //         summary: 'sum',
      //     });
      //     data.taxamount = row.getValue({
      //         name: 'formulacurrency',
      //         summary: 'sum',
      //     });
      // } else {
      data.netamount = row.getValue({
        name: "netamount",
        summary: "sum",
      });
      data.taxamount = row.getValue({
        name: "taxamount",
        join: "taxdetail",
        summary: "sum",
      });
      // }
      data.name = this.getEntityName(row, data.type);
      data.date = row.getValue({
        name: "trandate",
        summary: "group",
      });
      data.txnNo = row.getValue({
        name: "tranid",
        summary: "group",
      });
      // data.taxpointdate = row.getValue({
      //     name: 'taxpointdate',
      //     summary: 'group',
      // });
      // data.reportingCategory = row.getValue({
      //     name: 'custrecord_str_trc_code',
      //     join: 'custcol_str_tax_reporting_category',
      //     summary: 'GROUP',
      // });

      // data.accountType = row.getValue({
      //     name: 'type',
      //     join: 'account',
      //     summary: 'group',
      // });
      // if (data.accountType === 'OthCurrLiab' && data.type === 'VendBill') {
      //     data.netamount = data.netamount * -1;
      // }

      return data;
    } catch (ex) {
      error["throw"](ex, {
        context: this.name + ".process",
        level: error.level.ERROR,
      });
    }
  };

  VATSearchDetailsProcessor.prototype.getEntityName = function (row, type) {
    if (type === "ExpRept") {
      return row.getValue({
        name: "entityid",
        join: "employee",
        summary: "group",
      });
    }

    var entityName = [];
    var source =
      this.params.type === "SALE" || this.params.type === "BILLABLE_EXPENSE"
        ? "customer"
        : "vendor";
    var summary = "group";

    var isIndividual = row.getValue({
      name: "isperson",
      join: source,
      summary: summary,
    });

    if (isIndividual) {
      entityName.push(
        getValidName(
          row.getValue({
            name: "firstname",
            join: source,
            summary: summary,
          })
        )
      );
      entityName.push(
        getValidName(
          row.getValue({
            name: "middlename",
            join: source,
            summary: summary,
          })
        )
      );
      entityName.push(
        getValidName(
          row.getValue({
            name: "lastname",
            join: source,
            summary: summary,
          })
        )
      );
    } else {
      entityName.push(
        row.getValue({
          name: "companyname",
          join: source,
          summary: summary,
        })
      );
    }
    return entityName.join(" ");

    function getValidName(name) {
      if (name.toLowerCase().indexOf("none") > -1) {
        return "";
      }
      return name;
    }
  };

  VATSearchDetailsProcessor.prototype.cleanUpTaxCodeName = function (
    taxcodeName
  ) {
    var cleanTaxCodeName = taxcodeName.split(" : ");
    cleanTaxCodeName =
      cleanTaxCodeName.length > 1 ? cleanTaxCodeName[1] : cleanTaxCodeName[0];
    return cleanTaxCodeName;
  };

  return VATSearchDetailsProcessor;
});
