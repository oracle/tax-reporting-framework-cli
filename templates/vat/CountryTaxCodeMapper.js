/**
 * @NApiVersion 2.1
 * @NModuleScope TargetAccount
 */

define(['./TaxCodeMapper'], function (TaxCodeMapper) {
  function COUNTRYTaxCodeMapper(params, context) {
    TaxCodeMapper.call(this, params, context);
    this.name = 'COUNTRYTaxCodeMapper';
  }
  util.extend(CountryTaxCodeMapper.prototype, TaxCodeMapper.prototype);

  CountryTaxCodeMapper.prototype.process = function (row, columns) {
    try {
      var taxcode = TaxCodeMapper.prototype.process.call(this, row);

      //only return id and matched taxcode
      var matchedTaxCode = {
        taxcodeId: taxcode.Id,
        taxcodeKey: this.findMatchingTaxCodeDefinition(taxcode)
      };
      log.error('matchedTaxCode', matchedTaxCode);
      return matchedTaxCode;
    } catch (ex) {
      throw ex;
    }
  };

  CountryTaxCodeMapper.prototype.findMatchingTaxCodeDefinition = function (
    taxcode
  ) {
    var countryCode = 'COUNTRY';
    var taxDefinitions = TAXDEFS;
    for (var taxDef in taxDefinitions) {
      if (taxDefinitions[taxDef](taxcode)) {
        return taxDef;
      }
    }
  };

  return COUNTRYTaxCodeMapper;
});
