/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 *
 * @NApiVersion 2.1
 * @NModuleScope TargetAccount
 */

define(['N/config', 'N/runtime'], function (config, runtime) {
  function SuiteQLBuilder() {}

  SuiteQLBuilder.prototype.build = function (query, context) {
    var subsidiaryFilter = '';
    if (context.report.subsidiary) {
      subsidiaryFilter =
        ' AND tl.subsidiary IN ' + "('" + context.report.subsidiary + "')";
    }

    var accountingPeriodFilter = ' AND t.postingperiod IN ';
    var accountingPeriod = '(';
    for (var i = 0; i < context.report.postingperiod.length; i++) {
      accountingPeriod += "'" + context.report.postingperiod[i] + "'";
      if (i < context.report.postingperiod.length - 1) {
        accountingPeriod += ', ';
      }
    }
    accountingPeriod += ')';
    accountingPeriodFilter += accountingPeriod;

    // var userContextFilter = ' AND acs.accountingcontext IS NULL';
    // if (context.report.accountingcontext.usercontext != '@NONE@') {
    //     userContextFilter =
    //         ' AND acs.accountingcontext IN ' + "('" + context.report.accountingcontext.usercontext + "')";
    // }

    // var userLocaleFilter = '';
    // if (runtime.isFeatureInEffect({ feature: 'MULTILANGUAGE' })) {
    //     userLocaleFilter = ' AND acs.locale IS NULL';
    //     if (context.report.accountingcontext.userlocale != '@NONE@') {
    //         userLocaleFilter =
    //             ' AND Upper(acs.locale) IN ' +
    //             "('" +
    //             context.report.accountingcontext.userlocale.toUpperCase() +
    //             "')";
    //     }
    // }

    var isAcctNumberEnabled = config
      .load('accountingpreferences')
      .getValue('ACCOUNTNUMBERS');
    var localizednumber = isAcctNumberEnabled
      ? 'acs.acctnumber AS localizednumber, '
      : '';
    var groupbylocalizednumber = isAcctNumberEnabled ? 'acs.acctnumber, ' : '';
    var acctnumber = isAcctNumberEnabled ? 'a.acctnumber, ' : '';

    var isMultiCurrencyEnabled = runtime.isFeatureInEffect({
      feature: 'MULTICURRENCY'
    });
    var currency = isMultiCurrencyEnabled ? 't.currency, ' : '';
    var groupbycurrency = isMultiCurrencyEnabled ? 't.currency ' : '';
    var fxamount = isMultiCurrencyEnabled
      ? 'SUM (tl.foreignamount) AS fxamount, '
      : '';

    var pejFilter = " AND NOT(Upper(t.type) IN ('PEJRNL'))";

    var sql =
      'SELECT t.trandate, t.tranid, t.id, t.type, t.recordtype, tal.glauditnumber, \
            tal.glauditnumberdate, ' +
      localizednumber +
      'acs.acctname AS localizedname, ' +
      acctnumber +
      'a.accountsearchdisplayname, ' +
      'c.id AS customerid, c.isperson AS customerisperson, c.entityid AS customerentityid, c.companyname AS customercompanyname, c.firstname AS customerfirstname, c.middlename AS customermiddlename, c.lastname AS customerlastname, \
            v.id AS vendorid, v.isperson AS vendorisperson, v.entityid AS vendorentityid, v.companyname AS vendorcompanyname, v.firstname AS vendorfirstname, v.middlename AS vendormiddlename, v.lastname AS vendorlastname, \
            t.entity, e.altname, tl.memo, SUM (tal.credit) AS credit, SUM (tal.debit) AS debit, ' +
      currency +
      fxamount +
      "ROW_NUMBER() OVER (ORDER BY t.trandate, t.id) AS rn \
            FROM transaction AS t \
            LEFT JOIN transactionline AS tl ON t.id = tl.transaction \
            LEFT JOIN transactionaccountingline AS tal ON tal.transactionline = tl.id AND tal.transaction = t.id \
            LEFT JOIN account AS a ON tal.account = a.id \
            LEFT JOIN accountcontextsearch AS acs ON a.id = acs.account \
            LEFT JOIN entity AS e ON e.id = t.entity \
            LEFT JOIN customer AS c ON e.id = c.id \
            LEFT JOIN vendor AS v ON e.id  = v.id \
            WHERE t.posting = 'T' \
            AND (tal.credit IS NOT NULL OR tal.debit IS NOT NULL)" +
      subsidiaryFilter +
      accountingPeriodFilter +
      //   userContextFilter +
      //   userLocaleFilter +
      pejFilter +
      ' GROUP BY t.trandate, t.tranid, t.id, t.type, t.recordtype, tal.glauditnumber, \
            tal.glauditnumberdate, ' +
      groupbylocalizednumber +
      'acs.acctname, ' +
      acctnumber +
      'a.accountsearchdisplayname, \
            c.id, c.isperson, c.entityid, c.companyname, c.firstname, c.middlename, c.lastname, \
            v.id, v.isperson, v.entityid, v.companyname, v.firstname, v.middlename, v.lastname, \
            t.entity, e.altname, tl.memo, ' +
      groupbycurrency +
      'ORDER BY t.trandate, t.id';
    return sql;
  };

  return SuiteQLBuilder;
});
