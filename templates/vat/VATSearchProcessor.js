/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 *
 * @NApiVersion 2.1
 * @NModuleScope TargetAccount
 */

define([], function () {
  function VATSearchProcessor(params, context) {
    this.name = 'VATSearchProcessor';
  }

  VATSearchProcessor.prototype.process = function (row) {
    try {
      var data = {};

      data.type = row.getValue({
        name: 'type',
        summary: 'group'
      });
      data.taxcode = row.getValue({
        name: 'taxcode',
        summary: 'group'
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
        name: 'netamount',
        summary: 'sum'
      });
      data.taxamount = row.getValue({
        name: 'taxamount',
        summary: 'sum'
      });
      // }

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
      throw ex;
    }
  };

  return VATSearchProcessor;
});
