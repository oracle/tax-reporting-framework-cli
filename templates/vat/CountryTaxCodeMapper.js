/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 *
 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */

define(["./TaxCodeMapper"], function (TaxCodeMapper) {
  function COUNTRYTaxCodeMapper(params, context) {
    TaxCodeMapper.call(this, params, context);
    this.name = "COUNTRYTaxCodeMapper";
  }
  util.extend(COUNTRYTaxCodeMapper.prototype, TaxCodeMapper.prototype);

  COUNTRYTaxCodeMapper.prototype.process = function (row, columns) {
    try {
      var taxcode = TaxCodeMapper.prototype.process.call(this, row);

      //only return id and matched taxcode
      var matchedTaxCode = {
        taxcodeId: taxcode.Id,
        taxcodeKey: this.findMatchingTaxCodeDefinition(taxcode),
        taxcodeName: taxcode.Name,
      };
      return matchedTaxCode;
    } catch (ex) {
      throw ex;
    }
  };

  COUNTRYTaxCodeMapper.prototype.findMatchingTaxCodeDefinition = function (
    taxcode
  ) {
    var _CountryCode = "COUNTRY";
    var taxDefinitions = TAXDEFS;
    for (var taxDef in taxDefinitions) {
      if (taxDefinitions[taxDef](taxcode)) {
        return taxDef;
      }
    }
  };

  return COUNTRYTaxCodeMapper;
});
