/**
 * @NApiVersion 2.1
 * @NModuleScope TargetAccount
 */

define(['N/runtime'], function (runtime) {
  function SuiteQLPreProcessor(params, context) {
    this.name = 'SuiteQLPreProcessor';
    this.params = params;
    this.context = context;
    this.multicurrency = runtime.isFeatureInEffect({
      feature: 'MULTICURRENCY'
    });
  }

  SuiteQLPreProcessor.prototype.process = function (row) {
    try {
      var data = {};
      data.type = row.type || '';
      data.typetext = row.recordtype || '';
      data.glnumber = row.glauditnumber || '';
      data.glnumberdate = row.glauditnumberdate || '';
      data.accnumber = row.localizednumber || row.acctnumber || '';
      data.accname =
        row.localizedname || row.accountsearchdisplaynamecopy || '';
      data.accname = data.accname.replace(data.accnumber, '').trim();
      data.entityId =
        row.vendorentityid || row.customerentityid || row.entity || '';
      data.entityId = data.entityId.toString();
      data.entityName = row.altname || '';
      data.tranid = row.tranid || '';
      data.id = row.id || '';
      data.memo = row.memo || '';

      if (this.multicurrency) {
        data.currencytext = row.currency;
        data.fxamount = row.fxamount || '';
      }
      data.debit = row.debit || 0;
      data.credit = row.credit || 0;
      data.trandate = row.trandate || '';
      return data;
    } catch (ex) {
      error.throw(
        {
          name: ex.name,
          message: ex.message
        },
        {
          context: this.name + '.process',
          level: error.level.ERROR
        }
      );
    }
  };

  return SuiteQLPreProcessor;
});
