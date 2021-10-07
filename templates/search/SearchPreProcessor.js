/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 *
 * @NApiVersion 2.1
 * @NModuleScope TargetAccount
 */

define([], function () {
  function SearchPreProcessor(params, context) {
    this.name = 'SearchPreProcessor';
    this.params = params;
    this.context = context;
  }

  SearchPreProcessor.prototype.process = function (row, columns) {
    var data = {};
    try {
      data.type = row.getValue({
        name: 'type',
        summary: 'group'
      });
      data.typetext = row.getText({
        name: 'type',
        summary: 'group'
      });
      data.glnumber = row.getValue({
        name: 'glnumber',
        summary: 'group'
      });
      data.glnumberdate =
        row.getValue({
          name: 'glnumberdate',
          summary: 'group'
        }) || '';
      data.accnumber =
        row.getValue({
          join: 'account',
          name: 'number',
          summary: 'group'
        }) || '';
      data.accnumber = this.noneToBlank(data.accnumber);
      data.accname =
        row.getValue({
          join: 'account',
          name: 'name',
          summary: 'group'
        }) || '';
      data.accname = data.accname.replace(data.accnumber, '').trim();
      data.entityId =
        row.getValue({
          name: 'entity',
          summary: 'group'
        }) ||
        row.getValue({
          name: 'internalid',
          join: 'vendorline',
          summary: 'group'
        }) ||
        '';
      data.entityName =
        this.noneToBlank(
          row.getText({
            name: 'entity',
            summary: 'group'
          })
        ) || '';
      data.tranid =
        row.getValue({
          name: 'tranid',
          summary: 'group'
        }) || '';
      data.id =
        row.getValue({
          name: 'internalid',
          summary: 'group'
        }) || '';
      data.memo =
        row.getValue({
          name: 'memo',
          summary: 'group'
        }) || '';
      data.memo = this.noneToBlank(data.memo);
      data.debit =
        row.getValue({
          name: 'debitamount',
          summary: 'sum'
        }) || 0;
      data.credit =
        row.getValue({
          name: 'creditamount',
          summary: 'sum'
        }) || 0;
      data.trandate =
        row.getValue({
          name: 'trandate',
          summary: 'group'
        }) || '';
    } catch (ex) {
      throw ex;
    }
    return data;
  };

  SearchPreProcessor.prototype.noneToBlank = function (string) {
    if (string && string.toLowerCase().indexOf('none') > -1) {
      return '';
    }
    return string;
  };
  return SearchPreProcessor;
});
