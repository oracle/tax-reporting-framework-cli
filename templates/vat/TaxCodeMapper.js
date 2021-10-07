/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 *
 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */

define([], function () {
  function TaxCodeMapper(params, context) {
    this.name = "TaxCodeMapper";
    this.taxCodeRates = {};
  }

  TaxCodeMapper.prototype.process = function (row, columns) {
    try {
      var sRate = row.getValue({ name: "rate", summary: "group" });
      var available = row.getValue({ name: "availableon", summary: "group" });

      var taxcode = {};
      taxcode.Id = row.getValue({ name: "internalid", summary: "group" });
      this.taxCodeRates[taxcode.Id] = sRate;
      taxcode.Name = row.getValue({ name: "itemid", summary: "group" });
      taxcode.CountryCode = row.getValue({ name: "country", summary: "group" });
      taxcode.Rate =
        sRate === null || sRate === "" || isNaN(parseFloat(sRate))
          ? 0.0
          : parseFloat(sRate);
      taxcode.EffectiveFrom = row.getValue({
        name: "effectivefrom",
        summary: "group",
      });
      taxcode.ValidUntil = row.getValue({
        name: "validuntil",
        summary: "group",
      });
      taxcode.IsForSales = available === "BOTH" || available === "SALE";
      taxcode.IsForPurchase = available === "BOTH" || available === "PURCHASE";
      taxcode.IsExempt = row.getValue({ name: "exempt", summary: "group" });
      taxcode.IsService = row.getValue({
        name: "appliestoservice",
        summary: "group",
      });
      taxcode.IsEC = row.getValue({ name: "iseccode", summary: "group" });
      taxcode.IsForExport = row.getValue({
        name: "isexport",
        summary: "group",
      });
      taxcode.IsExcluded = row.getValue({
        name: "isexcludetaxreports  ",
        summary: "group",
      });
      taxcode.IsReverseCharge = row.getValue({
        name: "isreversecharge",
        summary: "group",
      });
      taxcode.NotionalRate = this.taxCodeRates[
        row.getValue({ name: "parent", summary: "group" })
      ];

      taxcode.IsImport = row.getValue({
        name: "custrecord_4110_import",
        summary: "group",
      });
      taxcode.IsGovernment = row.getValue({
        name: "custrecord_4110_government",
        summary: "group",
      });
      taxcode.IsCapitalGoods = row.getValue({
        name: "custrecord_4110_capital_goods",
        summary: "group",
      });
      taxcode.IsNoTaxInvoice = row.getValue({
        name: "custrecord_4110_no_tax_invoice",
        summary: "group",
      });
      taxcode.IsPurchaserIssued = row.getValue({
        name: "custrecord_4110_purchaser_issued",
        summary: "group",
      });
      taxcode.IsDuplicateInvoice = row.getValue({
        name: "custrecord_4110_duplicate",
        summary: "group",
      });
      taxcode.IsTriplicateInvoice = row.getValue({
        name: "custrecord_4110_triplicate",
        summary: "group",
      });
      taxcode.IsOTherTaxEvidence = row.getValue({
        name: "custrecord_4110_other_tax_evidence",
        summary: "group",
      });
      taxcode.IsCashRegister = row.getValue({
        name: "custrecord_4110_cash_register",
        summary: "group",
      });
      taxcode.IsReduced = row.getValue({
        name: "custrecord_4110_reduced_rate",
        summary: "group",
      });
      taxcode.IsSuperReduced = row.getValue({
        name: "custrecord_4110_super_reduced",
        summary: "group",
      });
      taxcode.IsSurcharge = row.getValue({
        name: "custrecord_4110_surcharge",
        summary: "group",
      });

      taxcode.IsNonOperation = row.getValue({
        name: "custrecord_4110_non_operation",
        summary: "group",
      });
      taxcode.IsNoTaxCredit = row.getValue({
        name: "custrecord_4110_no_tax_credit",
        summary: "group",
      });
      taxcode.IsElectronic = row.getValue({
        name: "custrecord_4110_electronic",
        summary: "group",
      });
      taxcode.IsSpecialTerritory = row.getValue({
        name: "custrecord_4110_special_territory",
        summary: "group",
      });
      taxcode.IsUnknownTaxCredit = row.getValue({
        name: "custrecord_4110_unknown_tax_credit",
        summary: "group",
      });
      taxcode.IsSuspended = row.getValue({
        name: "custrecord_4110_suspended",
        summary: "group",
      });
      taxcode.IsNonTaxable = row.getValue({
        name: "custrecord_4110_non_taxable",
        summary: "group",
      });
      taxcode.IsPartialCredit = row.getValue({
        name: "custrecord_4110_partial_credit",
        summary: "group",
      });
      //TODO
      // taxcode.IsCustomsDuty = row.getValue({
      //     name: 'custrecord_4110_duty',
      //     summary: 'group'
      // });
      taxcode.IsPaid = row.getValue({
        name: "custrecord_4110_paid",
        summary: "group",
      });
      taxcode.IsOutsideCustoms = row.getValue({
        name: "custrecord_4110_outside_customs",
        summary: "group",
      });
      taxcode.IsNonResident = row.getValue({
        name: "custrecord_4110_non_resident",
        summary: "group",
      });
      taxcode.IsNonrowoverable = row.getValue({
        name: "custrecord_4110_non_recoverable",
        summary: "group",
      });
      //TODO
      // taxcode.IsReverseChargeAlt = row.getValue({
      //     name: 'custrecord_4110_reverse_charge_alt',
      //     summary: 'group'
      // });
      taxcode.IsNonDeductibleRef = row.getValue({
        name: "custrecord_4110_nondeductible_parent",
        summary: "group",
      })
        ? true
        : false;
      taxcode.IsNonDeductible = row.getValue({
        name: "custrecord_4110_non_deductible",
        summary: "group",
      });
      taxcode.DeferredOn = row.getValue({
        name: "custrecord_deferred_on",
        summary: "group",
      });
      taxcode.IsForDigitalServices = row.getValue({
        name: "custrecord_for_digital_services",
        summary: "group",
      });
      // TODO
      // taxcode.IsDirectCostServiceItem =
      //     row.getValue({
      //         name: 'custrecord_is_direct_cost_service',
      //         summary: 'group'
      //     });

      taxcode.IsCategoryType = function getSelectedCategory(val, isNull) {
        var selcategory = row.getValue({
          name: "custrecord_4110_category",
          summary: "group",
        });

        if (selcategory && selcategory.toLowerCase().indexOf('none') > -1) {
          selcategory = '';
        }

        if (!selcategory && isNull) {
          return true;
        } else {
          return selcategory === val;
        }
      };

      if (taxcode.IsReverseChargeAlt && !taxcode.NotionalRate) {
        var tempNotionalRate = this.taxCodeRates[
          row.getValue("custrecord_4110_parent_alt")
        ];
        taxcode.NotionalRate = tempNotionalRate ? tempNotionalRate : 0;
      }
      log.error("taxcode", taxcode);
      return taxcode;
    } catch (ex) {
      throw ex;
    }
  };

  return TaxCodeMapper;
});
