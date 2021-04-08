/**
 * @NApiVersion 2.1
 * @NModuleScope TargetAccount
 */

define([], function () {
  function SearchPostProcessor(scriptContext) {
    this.name = 'SearchPostProcessor';
  }

  SearchPostProcessor.prototype.process = function (
    definition,
    dataManager,
    properties
  ) {
    var result = dataManager.output.transactions;
    var output = [];
    try {
      result.forEach(function (row) {
        output.push({
          type: row.type,
          typetext: row.typetext,
          glnumber: row.glnumber,
          glnumberdate: row.glnumberdate,
          accnumber: row.accnumber,
          accname: row.accname,
          entityId: row.entityId,
          entityName: row.entityName,
          tranid: row.tranid,
          memo: row.memo,
          debit: row.debit,
          credit: row.credit,
          trandate: row.trandate,
          fxamount: row.fxamount,
          currencytext: row.currencytext
        });
      });
    } catch (ex) {
      throw ex;
    }
    return output;
  };
  return SearchPostProcessor;
});
