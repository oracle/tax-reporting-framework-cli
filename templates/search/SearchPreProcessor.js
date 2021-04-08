/**
 * @NApiVersion 2.1
 * @NModuleScope TargetAccount
 */

define(['N/runtime'], function (runtime) {
  function SearchPreProcessor(params, context) {
    this.name = 'SearchPreProcessor';
    this.params = params;
    this.context = context;
  }

  SearchPreProcessor.prototype.process = function (row, columns) {
    try {
      var data = {};

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
          name: 'localizednumber',
          summary: 'group'
        }) ||
        row.getValue({
          join: 'account',
          name: 'number',
          summary: 'group'
        }) ||
        '';
      data.accnumber = this.noneToBlank(data.accnumber);
      data.accname =
        row.getValue({
          join: 'account',
          name: 'localizedname',
          summary: 'group'
        }) ||
        row.getValue({
          join: 'account',
          name: 'name',
          summary: 'group'
        }) ||
        '';
      data.accname = data.accname.replace(data.accnumber, '').trim();

      var entityData = this.entityProcessor.process(row);
      data.entityId =
        entityData.entityId ||
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
          entityData.entityName ||
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

      if (
        runtime.isFeatureInEffect({
          feature: 'MULTICURRENCY'
        })
      ) {
        data.currencytext = row.getValue({
          name: 'currency',
          summary: 'group'
        });
        data.fxamount =
          row.getValue({
            name: 'fxamount',
            summary: 'sum'
          }) || '';
      }
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
      return data;
    } catch (ex) {
      throw ex;
    }
  };

  SearchPreProcessor.prototype.noneToBlank = function (string) {
    if (string && string.toLowerCase().indexOf('none') > -1) {
      return '';
    }
    return string;
  };
  return SearchPreProcessor;
});
