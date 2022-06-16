/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
'use strict';

const SUMMARY_JSON_TEMPLATE =
  '"data": [\n' +
  '${schemas}' +
  '\t{\n' +
  '\t\t"id": "report_data",\n' +
  '\t\t"type": "DERIVED",\n' +
  '\t\t"field": [\n' +
  '${report_data}' +
  '\t\t]\n' +
  '\t}\n' +
  ']\n';
const DETAILS_JSON_TEMPLATE = '"data": [\n' + '${schemas}' + ']\n';
const OF_SCHEMA_TEMPLATE =
  '\t{\n' +
  '\t\t"id": "${box}",\n' +
  '\t\t"source": ["vat_${search}summary"],\n' +
  '\t\t"transformer": [\n' +
  '\t\t\t {\n' +
  '\t\t\t\t "source": ["taxcode_mapping"],\n' +
  '\t\t\t\t "type": "eqJoin",\n' +
  '\t\t\t\t "selector": { "taxcodeKey": { "$eq": "${taxcode}" } },\n' +
  '\t\t\t\t "leftJoinKey": "taxcode",\n' +
  '\t\t\t\t "rightJoinKey": "taxcodeId"\n' +
  '\t\t\t },\n' +
  '\t\t\t {\n' +
  '\t\t\t\t "type": "find",\n' +
  '\t\t\t\t "value": { "taxcodeKey": { "$eq": "${taxcode}" } }\n' +
  '\t\t\t }\n' +
  '\t\t],\n' +
  '\t\t"field": [\n' +
  '\t\t\t {\n' +
  '\t\t\t\t "id": "netamount",\n' +
  '\t\t\t\t "value": "netamount",\n' +
  '\t\t\t\t "summarytype": "sum"\n' +
  '\t\t\t },\n' +
  '\t\t\t {\n' +
  '\t\t\t\t "id": "taxamount",\n' +
  '\t\t\t\t "value": "taxamount",\n' +
  '\t\t\t\t "summarytype": "sum"\n' +
  '\t\t\t }\n' +
  '\t\t]\n' +
  '\t},\n';
const ACCRUE_SCHEMA_TEMPLATE =
  '\t{\n' +
  '\t\t"id": "${box}",\n' +
  '\t\t"source": ["vat_${search}summary"],\n' +
  '\t\t"transformer": [\n' +
  '\t\t\t {\n' +
  '\t\t\t\t "source": ["taxcode_mapping"],\n' +
  '\t\t\t\t "type": "eqJoin",\n' +
  '\t\t\t\t "selector": { "taxcodeKey": { "$in": ${taxcode} } },\n' +
  '\t\t\t\t "leftJoinKey": "taxcode",\n' +
  '\t\t\t\t "rightJoinKey": "taxcodeId"\n' +
  '\t\t\t },\n' +
  '\t\t\t {\n' +
  '\t\t\t\t "type": "find",\n' +
  '\t\t\t\t "value": { "taxcodeKey": { "$in": ${taxcode} } }\n' +
  '\t\t\t }\n' +
  '\t\t],\n' +
  '\t\t"field": [\n' +
  '\t\t\t {\n' +
  '\t\t\t\t "id": "netamount",\n' +
  '\t\t\t\t "value": "netamount",\n' +
  '\t\t\t\t "summarytype": "sum"\n' +
  '\t\t\t },\n' +
  '\t\t\t {\n' +
  '\t\t\t\t "id": "taxamount",\n' +
  '\t\t\t\t "value": "taxamount",\n' +
  '\t\t\t\t "summarytype": "sum"\n' +
  '\t\t\t }\n' +
  '\t\t]\n' +
  '\t},\n';
const REPORT_DATA_TEMPLATE =
  '\t\t{\n' +
  '\t\t\t"id": "${box}",\n' +
  '\t\t\t"value": "${expression}"\n' +
  '\t\t},\n';
const DETAILS_SCHEMA_TEMPLATE =
  '\t\t{\n' +
  '\t\t\t"id": "${box}",\n' +
  '\t\t\t"source": ["vat_${search}"],\n' +
  '\t\t\t"transformer": [\n' +
  '\t\t\t\t {\n' +
  '\t\t\t\t\t "source": ["taxcode_mapping"],\n' +
  '\t\t\t\t\t "type": "eqJoin",\n' +
  '\t\t\t\t\t "selector": { "taxcodeKey": { "$in": ${taxcode} } },\n' +
  '\t\t\t\t\t "leftJoinKey": "taxcode",\n' +
  '\t\t\t\t\t "rightJoinKey": "taxcodeId"\n' +
  '\t\t\t\t },\n' +
  '\t\t\t\t {\n' +
  '\t\t\t\t\t "type": "find",\n' +
  '\t\t\t\t\t "value": { "taxcodeKey": { "$in": ${taxcode} } }\n' +
  '\t\t\t\t }\n' +
  '\t\t\t],\n' +
  '\t\t},\n';
const DETAILS_CONCAT_BOX_TEMPLATE =
  '\t\t{' +
  '\t\t\t"id": "${box}",' +
  '\t\t\t"type": "CONCAT",' +
  '\t\t\t"data": ["${boxes}"],' +
  '\t\t\t"sort": "VAT_LEGACY_DRILLDOWN_SORT"' +
  '\t\t},';
const AMOUNT_RATE_REGEX = '\\.((Tax|Net|Notional)Amount|Rate)';
const BOX_REGEX = '${box}';
const SEARCH_INDEX = 1;
const TAXCODE_INDEX = 2;

const cleanupForWriting = (output) => {
  var cleanOutput = output.replace('${schemas}', '');
  cleanOutput = cleanOutput.replace('${report_data}', '');
  return cleanOutput;
};

const getFunctionBlocks = (fileContents, functionPattern) => {
  var functionRegex = new RegExp(functionPattern, 'gm');
  var functionBlocks = fileContents.match(functionRegex);
  return functionBlocks;
};

const getBoxName = (objectAssignment, boxNamePattern) => {
  var nameIndex = 1;
  var boxRegex = new RegExp(boxNamePattern);
  var boxName = objectAssignment.match(boxRegex)[nameIndex];
  return boxName;
};

export const convertToSummaries = (fileContents) => {
  var functionBlocks = getFunctionBlocks(fileContents, getFunctionPattern());
  var convertedContents = [];

  if (functionBlocks && functionBlocks.length > 0) {
    functionBlocks.forEach(function (block) {
      convertedContents.push(convertToSummarySchema(block));
    });
  } else {
    console.log('converter:  No reports to parse');
  }
  return convertedContents;

  function getObjectAssignmentPattern() {
    var objPrefix = 'obj\\.(box|rate\\w+)\\w+ =\\s*';
    var searchRegex = '\\w+\\.';
    var ofRegex = 'Of\\(["\']\\w+["\']\\)';
    var accrueRegex =
      'Accrue\\((["\']\\w+["\'],\\s*)?\\[\\s*["\']\\w+["\'](\\s*,\\s*["\']\\w+["\'])*(,|)\\s*\\]\\)';

    var operatorRegex = '( [+-]\\s*)?';
    var objectAssignmentRegex =
      objPrefix +
      '(' +
      searchRegex +
      '(' +
      ofRegex +
      '|' +
      accrueRegex +
      ')' +
      AMOUNT_RATE_REGEX +
      operatorRegex +
      ')+;';

    return objectAssignmentRegex;
  }

  function getFunctionPattern() {
    var functionNameRegex = '(\\w+\\.)+GetData = function\\s*\\(\\) \\{';
    var variableAssignmentRegex = '(\\s+var \\w+ = [_A-z0-9.(){}]+;)+';
    var objectAssignmentRegex = getObjectAssignmentPattern();
    var multiobjectAssignmentRegex = '(\\s+' + objectAssignmentRegex + ')+';
    var returnRegex = '\\s+return [_A-z0-9.(){}]+;';

    var functionRegex =
      functionNameRegex +
      variableAssignmentRegex +
      multiobjectAssignmentRegex +
      returnRegex;
    return functionRegex;
  }

  function convertToSummarySchema(block) {
    var objectAssignments = getObjectAssignmentsFromFunction(block);
    var outputJSON = SUMMARY_JSON_TEMPLATE;
    if (objectAssignments.length > 0) {
      objectAssignments.forEach(function (objectAssignment, index) {
        var boxNamePattern = 'obj.(\\w+)';
        var boxName = getBoxName(objectAssignment, boxNamePattern);
        var ofSchemas = getOfSchemas({
          boxName: boxName,
          objectAssignment: objectAssignment
        });
        var accrueSchemas = getAccrueSchemas({
          boxName: boxName,
          objectAssignment: objectAssignment
        });
        var allSchemas = ofSchemas.concat(accrueSchemas);
        var boxExpression = '';
        var boxRegex = new RegExp('"id": "(\\w+)"');
        var reportData = [];

        if (allSchemas.length > 1) {
          allSchemas.forEach(function (schema, index) {
            var operator = index === allSchemas.length - 1 ? '' : ' + ';
            allSchemas[index] = schema.replace(
              boxRegex,
              '"id": "$1_' + (index + 1) + '"'
            );
            var childBox = schema.match(boxRegex)[1] + '_' + (index + 1);
            boxExpression += childBox + operator;
          });
        } else {
          boxName = allSchemas[0].match(boxRegex)[1];
          boxExpression = boxName;
        }

        var boxReportData = createBoxReportData({
          box: boxName,
          expression: boxExpression
        });
        reportData = reportData.concat(boxReportData);

        var outputReportData = reportData.join(' ') + '${report_data}';
        var outputSchemas = allSchemas.join(' ') + '${schemas}';
        outputJSON = outputJSON.replace('${schemas}', outputSchemas);
        outputJSON = outputJSON.replace('${report_data}', outputReportData);
      });
    }
    outputJSON = cleanupForWriting(outputJSON);
    return outputJSON;
  }

  function getOfSchemas(options) {
    var schemas = [];
    var pattern = '\\w+\\.Of\\(["\'](\\w+)["\']\\)' + AMOUNT_RATE_REGEX;
    var regex = new RegExp(pattern, 'g');
    var objects = options.objectAssignment.match(regex);

    if (objects) {
      objects.forEach(function (obj, index) {
        var schema = getOfSchema({
          box: options.boxName,
          block: obj
        });
        schemas.push(schema);
      });
    }

    return schemas;
  }

  function getOfSchema(options) {
    var FIELD_INDEX = 3;
    var schema = '';

    var pattern = '(\\w+)\\.Of\\(["\'](\\w+)["\']\\)' + AMOUNT_RATE_REGEX;
    var regex = new RegExp(pattern);
    var components = options.block.match(regex);
    if (components) {
      schema = replaceInSchema({
        template: OF_SCHEMA_TEMPLATE,
        components: components,
        box: options.box,
        fieldIndex: FIELD_INDEX
      });
    }

    return schema;
  }

  function getAccrueSchemas(options) {
    var schemas = [];
    var pattern =
      '\\w+\\.Accrue\\(\\[\\s*["\']\\w+["\'](\\s*,\\s*["\']\\w+["\'])*(,|)\\s*\\]\\)' +
      AMOUNT_RATE_REGEX;
    var objRegex = new RegExp(pattern, 'g');
    var objects = options.objectAssignment.match(objRegex);
    if (objects) {
      objects.forEach(function (obj, index) {
        var schema = getAccrueSchema({
          box: options.boxName,
          block: obj
        });
        schemas.push(schema);
      });
    }

    return schemas;
  }

  function getAccrueSchema(options) {
    var FIELD_INDEX = 4;
    var schema = '';

    var pattern =
      '(\\w+)\\.Accrue\\((\\[\\s*["\']\\w+["\'](\\s*,\\s*["\']\\w+["\'])*(,|)\\s*\\])\\)' +
      AMOUNT_RATE_REGEX;
    var regex = new RegExp(pattern);
    var components = options.block.match(regex);
    if (components) {
      schema = replaceInSchema({
        template: ACCRUE_SCHEMA_TEMPLATE,
        components: components,
        box: options.box,
        fieldIndex: FIELD_INDEX
      });
    }

    return schema;
  }

  function replaceInSchema(options) {
    var template = options.template;
    var components = options.components;
    var fieldIndex = options.fieldIndex;
    var taxcodeRegex = new RegExp('\\$\\{taxcode\\}', 'g');
    var fieldRegex = new RegExp('\\$\\{field\\}', 'g');

    var search = components[SEARCH_INDEX].toLowerCase();
    var box = options.box;
    var taxcode = components[TAXCODE_INDEX];
    var field = components[fieldIndex].toLowerCase();

    var replacedSchema = template.replace('${search}', search);
    replacedSchema = replacedSchema.replace(BOX_REGEX, box);
    replacedSchema = replacedSchema.replace(taxcodeRegex, taxcode);
    replacedSchema =
      field !== 'netamount' && field !== 'taxamount'
        ? replacedSchema.replace(fieldRegex, field)
        : replacedSchema;

    return replacedSchema;
  }

  function getObjectAssignmentsFromFunction(block) {
    var objectAssignmentPattern = getObjectAssignmentPattern();
    var objectAssignmentRegex = new RegExp(objectAssignmentPattern, 'gm');
    var objectAssignments = block.match(objectAssignmentRegex);
    return objectAssignments;
  }

  function createBoxReportData(options) {
    let boxReportData = [];
    let boxPattern = new RegExp(options.box + '(_\\d+)?', 'g');

    let totalBox = REPORT_DATA_TEMPLATE.replace(BOX_REGEX, options.box);
    totalBox = totalBox.replace('${expression}', options.expression);
    boxReportData.push(totalBox);

    let taxamountBox = REPORT_DATA_TEMPLATE.replace(
      BOX_REGEX,
      options.box + '_taxamount'
    );
    let taxamountExpression = options.expression.replace(
      boxPattern,
      options.box + '.taxamount'
    );
    taxamountBox = taxamountBox.replace('${expression}', taxamountExpression);
    boxReportData.push(taxamountBox);

    let netamountBox = REPORT_DATA_TEMPLATE.replace(
      BOX_REGEX,
      options.box + '_netamount'
    );
    let netamountExpression = options.expression.replace(
      boxPattern,
      options.box + '.netamount'
    );
    netamountBox = netamountBox.replace('${expression}', netamountExpression);
    boxReportData.push(netamountBox);

    return boxReportData;
  }
};

export const convertToDetails = (fileContents) => {
  var functionBlocks = getFunctionBlocks(fileContents, getFunctionPattern());
  var convertedContents = [];

  if (functionBlocks && functionBlocks.length > 0) {
    functionBlocks.forEach(function (block) {
      convertedContents.push(convertToDetailsSchema(block));
    });
  } else {
    console.log('converter:  No reports to parse');
  }
  return convertedContents;

  function getFunctionPattern() {
    var functionNamePattern =
      '(\\w+\\.)+GetDrilldownData = function\\s*\\(\\w+(, \\w+)?\\) \\{';
    var variableAssignmentPattern = '(\\s+var \\w+ = [_A-z0-9.(){}]+;)*';
    var loopPattern = getLoopPattern();
    var switchPattern = '\\s+switch \\(boxNumber\\) \\{';
    var dataAssignmentPattern = getDataAssignmentPattern();
    var multiDataAssignmentPattern = '(' + dataAssignmentPattern + ')+';
    var returnPattern = '\\s+return [_A-z0-9.(){}]+;';
    var closingPattern =
      '\\s+\\}' +
      variableAssignmentPattern +
      '\\s+ds\\.ReportData = data;' +
      returnPattern;

    var functionPattern =
      functionNamePattern +
      variableAssignmentPattern +
      loopPattern +
      switchPattern +
      multiDataAssignmentPattern +
      closingPattern;
    return functionPattern;
  }

  function getLoopPattern() {
    const catchAllCharacter = "[_A-z0-9.(){} +,']";
    const keywordPattern =
      '(\\s+(for|if)\\s\\(' + catchAllCharacter + '+\\) \\{';
    const linePattern =
      '(\\s+' + catchAllCharacter + '+=' + catchAllCharacter + '+;)+';

    return keywordPattern + linePattern + '\\s+})*';
  }

  function convertToDetailsSchema(block) {
    var dataAssignments = getDataAssignmentsFromFunction(block);
    var outputJSON = DETAILS_JSON_TEMPLATE;

    dataAssignments.forEach(function (dataAssignment) {
      var boxNamePattern = 'obj.(\\w+)';
      var boxName = getBoxName(dataAssignment, boxNamePattern);
      var schemas = getDetailSchemas({
        box: boxName,
        dataAssignment: dataAssignment
      });
      var outputSchemas = schemas.join(' ') + '${schemas}';
      outputJSON = outputJSON.replace('${schemas}', outputSchemas);
    });

    outputJSON = cleanupForWriting(outputJSON);
    return outputJSON;
  }

  function getDataAssignmentsFromFunction(block) {
    var dataAssignmentPattern = getDataAssignmentPattern();
    var dataAssignmentRegex = new RegExp(dataAssignmentPattern, 'gm');
    var dataAssignments = block.match(dataAssignmentRegex);
    return dataAssignments;
  }

  function getDataAssignmentPattern() {
    var dataAssignmentPattern = "\\s+case '(\\w+)':\\s*data =";
    var detailsPattern =
      "\\s*_DR\\s*\\.Get(Sales|Purchase)Details(\\w+)?\\(\\s*\\[\\s*'\\w+'(,\\s*'\\w+'(,|)\\s*)*\\](,\\s*'\\w+')?\\s*\\)";
    var fullDataAssignmentPattern =
      dataAssignmentPattern +
      detailsPattern +
      '(\\s*\\.concat\\(' +
      detailsPattern +
      '\\s*\\))*;\\s*break;';

    return fullDataAssignmentPattern;
  }

  function getBoxName(dataAssignment) {
    var nameIndex = 1;
    var boxNamePattern = "case '(\\w+)'";
    var boxRegex = new RegExp(boxNamePattern);
    var boxName = dataAssignment.match(boxRegex)[nameIndex];
    return boxName;
  }

  function getDetailSchemas(options) {
    var schemas = [];
    var pattern =
      "_DR\\s*\\.Get(Sales|Purchase)Details(\\w+)?\\(\\s*\\[\\s*'\\w+'(,\\s*'\\w+'(,|)\\s*)*\\](,\\s*'\\w+')?\\s*\\)";
    var regex = new RegExp(pattern, 'g');
    var details = options.dataAssignment.match(regex);
    if (details) {
      details.forEach(function (detail, index) {
        var schema = createDetailSchema({
          box: options.box + '_' + index,
          detail: detail
        });
        schemas.push(schema);
      });
      var concatDetailsBox = createConcatDetailsBox({
        box: options.box,
        details: details
      });
      schemas.push(concatDetailsBox);
    }
    return schemas;
  }

  function createDetailSchema(options) {
    var schema = '';
    var pattern =
      "_DR\\s*.Get((Sales|Purchase)Details(\\w+)?)\\(\\s*(\\[\\s*('\\w+')(,\\s*'\\w+'(,|)\\s*)*\\])(,\\s*'\\w+')?\\s*\\)";
    var regex = new RegExp(pattern);
    var components = options.detail.match(regex);

    if (components) {
      schema = replaceInDetailsSchema({
        components: components,
        box: options.box
      });
    }

    return schema;
  }

  function replaceInDetailsSchema(options) {
    var searchIndex = 1;
    var taxcodeIndex = 4;

    var template = DETAILS_SCHEMA_TEMPLATE;
    var components = options.components;
    var taxcodeRegex = new RegExp('\\$\\{taxcode\\}', 'g');

    var search = components[searchIndex].toLowerCase();
    var box = options.box;
    var taxcode = components[taxcodeIndex];

    var replacedSchema = template.replace('${search}', search);
    replacedSchema = replacedSchema.replace(BOX_REGEX, box);
    replacedSchema = replacedSchema.replace(taxcodeRegex, taxcode);

    return replacedSchema;
  }

  function createConcatDetailsBox(options) {
    let concatDetailsBox = DETAILS_CONCAT_BOX_TEMPLATE.replace(
      BOX_REGEX,
      options.box
    );
    let boxes = options.details.map(
      (detail, index) => options.box + '_' + index
    );
    concatDetailsBox = concatDetailsBox.replace('${boxes}', boxes.join('","'));
    return concatDetailsBox;
  }
};

export const getTaxDefs = (contents) => {
  const matches = contents.match(/^.*?this.TaxDefinition = (\{[\s\S]*?\});/m);
  var taxDefs = null;
  if (matches) {
    taxDefs = matches[1].replace(/nlapiStringToDate/g, 'new Date');
  }
  return taxDefs;
};
