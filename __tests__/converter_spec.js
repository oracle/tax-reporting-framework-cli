import { convertToSummaries, convertToDetails, getTaxDefs} from "../src/converter";

let correctFileContents,
    incorrectFileContents,
    correctTaxDefs,
    incorrectTaxDefs;

describe("converter", function () {
  beforeEach(() => {
    correctFileContents = `
      VAT.IE.Report.Data.prototype.GetData = function() {
        var _DR = this.DataReader;

        var obj = {};
        var sales = _DR.GetSalesSummary();
        var purchases = _DR.GetPurchaseSummary();
        var salesadj = _DR.GetSalesAdjustmentSummary(this.TaxMap);
        var purchaseadj = _DR.GetPurchaseAdjustmentSummary(this.TaxMap);
        var nondeductible = _DR.GetNonDeductibleSummary();

        obj.box0T1 = sales.Accrue(['S', 'S1', 'R', 'SR']).TaxAmount +
            purchases.Accrue(['ES', 'ES1', 'ER', 'ESSP', 'ESSP1', 'ESPR', 'IS', 'IS1', 'ESR']).NotionalAmount +
            salesadj.Accrue('box0T1', ['S', 'S1', 'R', 'SR']).TaxAmount;
        obj.box0T2 = purchases.Accrue(['S', 'S1', 'R', 'I', 'I1', 'SR', 'Deduct']).TaxAmount +
            purchases.Accrue(['ES', 'ES1', 'ER', 'ESSP', 'ESSP1', 'ESPR', 'IS', 'IS1', 'ESR']).NotionalAmount +
            purchaseadj.Accrue('box0T2', ['S', 'S1', 'R', 'I', 'I1', 'SR']).TaxAmount -
            nondeductible.Of('NonDeduct').TaxAmount;
        obj.box0E1 = sales.Accrue(['ES', 'ES1', 'ER', 'ESR']).NetAmount;
        obj.box0E2 = purchases.Accrue(['ES', 'ES1', 'ER', 'ESR']).NetAmount;
        obj.box0ES1 = sales.Accrue(['ESSS', 'ESSS1']).NetAmount;
        obj.box0ES2 = purchases.Accrue(['ESSP', 'ESSP1', 'ESPR']).NetAmount;

        return this.ComputeBoxes(obj);
      };
      VAT.IE.RETURN.Data.prototype.GetDrilldownData = function(boxNumber) {
        var _DR = this.DataReader;
        var ds = {};

        var data = [];
        switch (boxNumber) {
            case 'box0E3': data = _DR.GetSalesDetails(['E']); break;
            case 'box0D4': data = _DR.GetSalesDetails(['X','ER','ESSS','ES','OS']); break;
            case 'box0D1': data = _DR.GetSalesDetails(['Z']); break;
            case 'box0C5': data = _DR.GetSalesDetails(['S']); break;
            case 'box0AC5': data = _DR.GetSalesDetails(['R']); break;
            case 'box0D2': data = _DR.GetPurchaseDetails(['EZ']); break;
            case 'box0C6': data = _DR.GetPurchaseDetails(['ES','ESSP']); break;
            case 'box0AC6': data = _DR.GetPurchaseDetails(['ER']); break;
            case 'box0BC5': data = _DR.GetSalesDetails(['SR']); break;
            case 'box0BC6': data = _DR.GetPurchaseDetails(['ESR']); break;
        }

        ds.ReportData = data;
        return ds;
      };
      VAT.IE.Report.Data.prototype.GetDrilldownData = function(boxNumber) {
          var _DR = this.DataReader;
          var ds = {};

          var data = [];
          switch (boxNumber) {
              case 'box0T1': data = _DR.GetSalesDetails(['S','S1','R','SR'], 'box0T1').concat(_DR.GetPurchaseDetails(['ES','ES1','ER','ESSP','ESSP1','ESPR','IS','IS1','ESR'], 'box0T1')); break;
          case 'box0T2':
            data = _DR.GetPurchaseDetails(['S','S1','R','ES','ES1','ER','ESSP','ESSP1','ESPR','I','I1','IS','IS1','SR','ESR','Deduct'], 'box0T2').concat(
                _DR.GetPurchaseDetailsSTCNDNeg(['NonDeduct']));
            break;
              case 'box0E1': data = _DR.GetSalesDetails(['ES','ES1','ER','ESR']); break;
              case 'box0E2': data = _DR.GetPurchaseDetails(['ES','ES1','ER','ESR']); break;
              case 'box0ES1': data = _DR.GetSalesDetails(['ESSS','ESSS1']); break;
              case 'box0ES2': data = _DR.GetPurchaseDetails(['ESSP','ESSP1','ESPR']); break;
          }

          ds.ReportData = data;
          return ds;
      };
    `;

    incorrectFileContents = `
      VAT.IE.Report.Data.prototype.GetTheData = function() {
        var _DR = this.DataReader;

        var obj = {};
        var sales = _DR.GetSalesSummary();
        var purchases = _DR.GetPurchaseSummary();
        var salesadj = _DR.GetSalesAdjustmentSummary(this.TaxMap);
        var purchaseadj = _DR.GetPurchaseAdjustmentSummary(this.TaxMap);
        var nondeductible = _DR.GetNonDeductibleSummary();

        obj.box0T1 = sales.Accrue(['S', 'S1', 'R', 'SR']).TaxAmount +
            purchases.Accrue(['ES', 'ES1', 'ER', 'ESSP', 'ESSP1', 'ESPR', 'IS', 'IS1', 'ESR']).NotionalAmount +
            salesadj.Accrue('box0T1', ['S', 'S1', 'R', 'SR']).TaxAmount;
        obj.box0T2 = purchases.Accrue(['S', 'S1', 'R', 'I', 'I1', 'SR', 'Deduct']).TaxAmount +
            purchases.Accrue(['ES', 'ES1', 'ER', 'ESSP', 'ESSP1', 'ESPR', 'IS', 'IS1', 'ESR']).NotionalAmount +
            purchaseadj.Accrue('box0T2', ['S', 'S1', 'R', 'I', 'I1', 'SR']).TaxAmount -
            nondeductible.Of('NonDeduct').TaxAmount;
        obj.box0E1 = sales.Accrue(['ES', 'ES1', 'ER', 'ESR']).NetAmount;
        obj.box0E2 = purchases.Accrue(['ES', 'ES1', 'ER', 'ESR']).NetAmount;
        obj.box0ES1 = sales.Accrue(['ESSS', 'ESSS1']).NetAmount;
        obj.box0ES2 = purchases.Accrue(['ESSP', 'ESSP1', 'ESPR']).NetAmount;

      };
      VAT.IE.Report.Data.prototype.GetTheDrilldownData = function(boxNumber) {
          var _DR = this.DataReader;
          var ds = {};

          var data = [];
          switch (boxNumber) {
              case 'box0T1': data = _DR.GetSalesDetails(['S','S1','R','SR'], 'box0T1').concat(_DR.GetPurchaseDetails(['ES','ES1','ER','ESSP','ESSP1','ESPR','IS','IS1','ESR'], 'box0T1')); break;
          case 'box0T2':
            data = _DR.GetPurchaseDetails(['S','S1','R','ES','ES1','ER','ESSP','ESSP1','ESPR','I','I1','IS','IS1','SR','ESR','Deduct'], 'box0T2').concat(
                _DR.GetPurchaseDetailsSTCNDNeg(['NonDeduct']));
            break;
              case 'box0E1': data = _DR.GetSalesDetails(['ES','ES1','ER','ESR']); break;
              case 'box0E2': data = _DR.GetPurchaseDetails(['ES','ES1','ER','ESR']); break;
              case 'box0ES1': data = _DR.GetSalesDetails(['ESSS','ESSS1']); break;
              case 'box0ES2': data = _DR.GetPurchaseDetails(['ESSP','ESSP1','ESPR']); break;
          }

          ds.ReportData = data;
      };
    
    `;
    correctTaxDefs = `
      this.TaxDefinition = {
          S1: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && taxcode.Rate > 0 && !taxcode.IsExempt && !taxcode.IsForExport &&
          !taxcode.IsImport && !taxcode.IsEC && !taxcode.IsReduced && !taxcode.IsSuperReduced && !taxcode.IsNonDeductible && !taxcode.IsNonDeductibleRef &&
          !!taxcode.EffectiveFrom && nlapiStringToDate(taxcode.EffectiveFrom).getTime() == new Date(2020, 8, 1).getTime();
          },
          S: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && taxcode.Rate > 0 && !taxcode.IsExempt && !taxcode.IsForExport &&
                  !taxcode.IsImport && !taxcode.IsEC && !taxcode.IsReduced && !taxcode.IsSuperReduced && !taxcode.IsNonDeductible && !taxcode.IsNonDeductibleRef;
          },
          Z: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && taxcode.Rate == 0 && !taxcode.IsExempt && !taxcode.IsForExport &&
                  !taxcode.IsImport && !taxcode.IsEC && !taxcode.IsReduced;
          },
          R: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && !taxcode.IsImport &&
          !taxcode.IsEC && taxcode.IsReduced && !taxcode.IsNonDeductible && !taxcode.IsNonDeductibleRef;
          },
          SR: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && !taxcode.IsImport &&
          !taxcode.IsEC && taxcode.IsSuperReduced && !taxcode.IsNonDeductible && !taxcode.IsNonDeductibleRef;
          },
          E: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && taxcode.IsExempt && !taxcode.IsForExport && !taxcode.IsImport &&
              !taxcode.IsEC && !taxcode.IsReduced;
          },
          ES1: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && taxcode.NotionalRate > 0 && !taxcode.IsExempt && !taxcode.IsForExport &&
                  !taxcode.IsImport && taxcode.IsEC && !taxcode.IsService && !taxcode.IsReduced && !taxcode.IsSuperReduced &&
                  !!taxcode.EffectiveFrom && nlapiStringToDate(taxcode.EffectiveFrom).getTime() == new Date(2020, 8, 1).getTime();
          },
          ES: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && taxcode.NotionalRate > 0 && !taxcode.IsExempt && !taxcode.IsForExport &&
                  !taxcode.IsImport && taxcode.IsEC && !taxcode.IsService && !taxcode.IsReduced && !taxcode.IsSuperReduced;
          },
          EZ: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && taxcode.NotionalRate == 0 && !taxcode.IsExempt && !taxcode.IsForExport &&
                  !taxcode.IsImport && taxcode.IsEC && !taxcode.IsService && !taxcode.IsReduced;
          },
          ER: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && !taxcode.IsImport && taxcode.IsEC &&
                  !taxcode.IsService && taxcode.IsReduced;
          },
          ESR: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && !taxcode.IsImport && taxcode.IsEC &&
                  !taxcode.IsService && taxcode.IsSuperReduced && taxcode.NotionalRate > 0 && !taxcode.IsReduced;
          },
          ESSS1: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && !taxcode.IsImport && taxcode.IsEC &&
                  !taxcode.IsReduced && taxcode.IsForSales && !taxcode.IsReverseCharge && taxcode.IsService &&
                  !!taxcode.EffectiveFrom && nlapiStringToDate(taxcode.EffectiveFrom).getTime() == new Date(2020, 8, 1).getTime();
          },
          ESSS: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && !taxcode.IsImport && taxcode.IsEC &&
                  !taxcode.IsReduced && taxcode.IsForSales && !taxcode.IsReverseCharge && taxcode.IsService;
          },
          ESSP1: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && !taxcode.IsImport && taxcode.IsEC &&
                  !taxcode.IsReduced && taxcode.IsForPurchase && taxcode.IsReverseCharge && taxcode.IsService &&
                  !!taxcode.EffectiveFrom && nlapiStringToDate(taxcode.EffectiveFrom).getTime() == new Date(2020, 8, 1).getTime();
          },
          ESSP: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && !taxcode.IsImport && taxcode.IsEC &&
                  !taxcode.IsReduced && taxcode.IsForPurchase && taxcode.IsReverseCharge && taxcode.IsService;
          },
          ESPR: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && !taxcode.IsImport && taxcode.IsEC &&
                  taxcode.IsReduced && taxcode.IsForPurchase && taxcode.IsService;
          },
          I1: function(taxcode) {
        return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && taxcode.IsImport && !taxcode.IsEC &&
          !taxcode.IsReduced && !taxcode.IsService && !taxcode.IsNonDeductible && !taxcode.IsNonDeductibleRef &&
          !!taxcode.EffectiveFrom && nlapiStringToDate(taxcode.EffectiveFrom).getTime() == new Date(2020, 8, 1).getTime();
          },
          I: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && taxcode.IsImport && !taxcode.IsEC &&
                  !taxcode.IsReduced && !taxcode.IsService && !taxcode.IsNonDeductible && !taxcode.IsNonDeductibleRef;
          },
          X: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && taxcode.IsForExport && !taxcode.IsImport && !taxcode.IsEC &&
                  !taxcode.IsReduced;
          },
          OS: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && taxcode.IsService && !taxcode.IsExempt && taxcode.IsForExport &&
                  !taxcode.IsImport && !taxcode.IsEC && !taxcode.IsReduced;
          },
          IS1: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && taxcode.IsService && !taxcode.IsExempt && !taxcode.IsForExport &&
                  taxcode.IsImport && !taxcode.IsEC && !taxcode.IsReduced &&
                  !!taxcode.EffectiveFrom && nlapiStringToDate(taxcode.EffectiveFrom).getTime() == new Date(2020, 8, 1).getTime();
          },
          IS: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && taxcode.IsService && !taxcode.IsExempt && !taxcode.IsForExport &&
                  taxcode.IsImport && !taxcode.IsEC && !taxcode.IsReduced;
      },
      Deduct: function(taxcode) {
        return taxcode.CountryCode == _CountryCode && taxcode.IsCategoryType("S0", true) && taxcode.Rate > 0 && !taxcode.IsNonDeductible && taxcode.IsNonDeductibleRef;
      },
      NonDeduct: function(taxcode) {
        return taxcode.CountryCode == _CountryCode && taxcode.IsCategoryType("S0", true) && taxcode.Rate > 0 && taxcode.IsNonDeductible && !taxcode.IsNonDeductibleRef;
          }
    };
    `;

    incorrectTaxDefs = `
      this.INCORRECTTaxDefinition = {
          S1: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && taxcode.Rate > 0 && !taxcode.IsExempt && !taxcode.IsForExport &&
          !taxcode.IsImport && !taxcode.IsEC && !taxcode.IsReduced && !taxcode.IsSuperReduced && !taxcode.IsNonDeductible && !taxcode.IsNonDeductibleRef &&
          !!taxcode.EffectiveFrom && nlapiStringToDate(taxcode.EffectiveFrom).getTime() == new Date(2020, 8, 1).getTime();
          },
          S: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && taxcode.Rate > 0 && !taxcode.IsExempt && !taxcode.IsForExport &&
                  !taxcode.IsImport && !taxcode.IsEC && !taxcode.IsReduced && !taxcode.IsSuperReduced && !taxcode.IsNonDeductible && !taxcode.IsNonDeductibleRef;
          },
          Z: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && taxcode.Rate == 0 && !taxcode.IsExempt && !taxcode.IsForExport &&
                  !taxcode.IsImport && !taxcode.IsEC && !taxcode.IsReduced;
          },
          R: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && !taxcode.IsImport &&
          !taxcode.IsEC && taxcode.IsReduced && !taxcode.IsNonDeductible && !taxcode.IsNonDeductibleRef;
          },
          SR: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && !taxcode.IsImport &&
          !taxcode.IsEC && taxcode.IsSuperReduced && !taxcode.IsNonDeductible && !taxcode.IsNonDeductibleRef;
          },
          E: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && taxcode.IsExempt && !taxcode.IsForExport && !taxcode.IsImport &&
              !taxcode.IsEC && !taxcode.IsReduced;
          },
          ES1: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && taxcode.NotionalRate > 0 && !taxcode.IsExempt && !taxcode.IsForExport &&
                  !taxcode.IsImport && taxcode.IsEC && !taxcode.IsService && !taxcode.IsReduced && !taxcode.IsSuperReduced &&
                  !!taxcode.EffectiveFrom && nlapiStringToDate(taxcode.EffectiveFrom).getTime() == new Date(2020, 8, 1).getTime();
          },
          ES: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && taxcode.NotionalRate > 0 && !taxcode.IsExempt && !taxcode.IsForExport &&
                  !taxcode.IsImport && taxcode.IsEC && !taxcode.IsService && !taxcode.IsReduced && !taxcode.IsSuperReduced;
          },
          EZ: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && taxcode.NotionalRate == 0 && !taxcode.IsExempt && !taxcode.IsForExport &&
                  !taxcode.IsImport && taxcode.IsEC && !taxcode.IsService && !taxcode.IsReduced;
          },
          ER: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && !taxcode.IsImport && taxcode.IsEC &&
                  !taxcode.IsService && taxcode.IsReduced;
          },
          ESR: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && !taxcode.IsImport && taxcode.IsEC &&
                  !taxcode.IsService && taxcode.IsSuperReduced && taxcode.NotionalRate > 0 && !taxcode.IsReduced;
          },
          ESSS1: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && !taxcode.IsImport && taxcode.IsEC &&
                  !taxcode.IsReduced && taxcode.IsForSales && !taxcode.IsReverseCharge && taxcode.IsService &&
                  !!taxcode.EffectiveFrom && nlapiStringToDate(taxcode.EffectiveFrom).getTime() == new Date(2020, 8, 1).getTime();
          },
          ESSS: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && !taxcode.IsImport && taxcode.IsEC &&
                  !taxcode.IsReduced && taxcode.IsForSales && !taxcode.IsReverseCharge && taxcode.IsService;
          },
          ESSP1: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && !taxcode.IsImport && taxcode.IsEC &&
                  !taxcode.IsReduced && taxcode.IsForPurchase && taxcode.IsReverseCharge && taxcode.IsService &&
                  !!taxcode.EffectiveFrom && nlapiStringToDate(taxcode.EffectiveFrom).getTime() == new Date(2020, 8, 1).getTime();
          },
          ESSP: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && !taxcode.IsImport && taxcode.IsEC &&
                  !taxcode.IsReduced && taxcode.IsForPurchase && taxcode.IsReverseCharge && taxcode.IsService;
          },
          ESPR: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && !taxcode.IsImport && taxcode.IsEC &&
                  taxcode.IsReduced && taxcode.IsForPurchase && taxcode.IsService;
          },
          I1: function(taxcode) {
        return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && taxcode.IsImport && !taxcode.IsEC &&
          !taxcode.IsReduced && !taxcode.IsService && !taxcode.IsNonDeductible && !taxcode.IsNonDeductibleRef &&
          !!taxcode.EffectiveFrom && nlapiStringToDate(taxcode.EffectiveFrom).getTime() == new Date(2020, 8, 1).getTime();
          },
          I: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && !taxcode.IsForExport && taxcode.IsImport && !taxcode.IsEC &&
                  !taxcode.IsReduced && !taxcode.IsService && !taxcode.IsNonDeductible && !taxcode.IsNonDeductibleRef;
          },
          X: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && !taxcode.IsExempt && taxcode.IsForExport && !taxcode.IsImport && !taxcode.IsEC &&
                  !taxcode.IsReduced;
          },
          OS: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && taxcode.IsService && !taxcode.IsExempt && taxcode.IsForExport &&
                  !taxcode.IsImport && !taxcode.IsEC && !taxcode.IsReduced;
          },
          IS1: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && taxcode.IsService && !taxcode.IsExempt && !taxcode.IsForExport &&
                  taxcode.IsImport && !taxcode.IsEC && !taxcode.IsReduced &&
                  !!taxcode.EffectiveFrom && nlapiStringToDate(taxcode.EffectiveFrom).getTime() == new Date(2020, 8, 1).getTime();
          },
          IS: function(taxcode) {
              return taxcode.CountryCode == _CountryCode && taxcode.IsService && !taxcode.IsExempt && !taxcode.IsForExport &&
                  taxcode.IsImport && !taxcode.IsEC && !taxcode.IsReduced;
      },
      Deduct: function(taxcode) {
        return taxcode.CountryCode == _CountryCode && taxcode.IsCategoryType("S0", true) && taxcode.Rate > 0 && !taxcode.IsNonDeductible && taxcode.IsNonDeductibleRef;
      },
      NonDeduct: function(taxcode) {
        return taxcode.CountryCode == _CountryCode && taxcode.IsCategoryType("S0", true) && taxcode.Rate > 0 && taxcode.IsNonDeductible && !taxcode.IsNonDeductibleRef;
          }
    };
    `;
  });

  afterEach(() => {});

  test("converter.convertToSummaries with correct input > expect > correctly generated output", () => {
    let summaries = convertToSummaries(correctFileContents);
    expect(summaries.length).toBeGreaterThan(0);
    expect(summaries[0]).not.toBeNull();
  });

  test("converter.convertToSummaries with incorrect input > expect > empty output", () => {
    let summaries = convertToSummaries(incorrectFileContents);
    expect(summaries.length).toEqual(0);
  });

  test("converter.convertToDetails with correct input > expect > correctly generated output", () => {
    let details = convertToDetails(correctFileContents);
    expect(details.length).toBeGreaterThan(0);
    expect(details[0]).not.toBeNull();
  });

  test("converter.convertToDetails with incorrect input > expect > empty output", () => {
    let details = convertToDetails(incorrectFileContents);
    expect(details.length).toEqual(0);
  });

  test("converter.getTaxDefs with regex-passing input > expect > correctly get tax definitions", () => {
    let taxDefs = getTaxDefs(correctTaxDefs);
    expect(taxDefs).not.toBeNull();
  });

  test("converter.getTaxDefs with regex-failing input > expect > null output", () => {
    let taxDefs = getTaxDefs(incorrectTaxDefs);
    expect(taxDefs).toBeNull();
  });
});
