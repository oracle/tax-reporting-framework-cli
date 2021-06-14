/**
 * Copyright (c) 2021, Oracle and/or its affiliates. All rights reserved.
 */
"use strict";

const SUMMARY_JSON_TEMPLATE =
  '"data": [\n' +
  "${schemas}" +
  "\t{\n" +
  '\t\t"id": "report_data",\n' +
  '\t\t"type": "DERIVED",\n' +
  '\t\t"field": [\n' +
  "${report_data}" +
  "\t\t]\n" +
  "\t}\n" +
  "]\n";
const DETAILS_JSON_TEMPLATE = '"data": [\n' + "${schemas}" + "]\n";
const OF_SCHEMA_TEMPLATE =
  "\t{\n" +
  '\t\t"id": "${box}",\n' +
  '\t\t"source": ["vat_${search}summary"],\n' +
  '\t\t"transformer": [\n' +
  "\t\t\t {\n" +
  '\t\t\t\t "source": ["taxcode_mapping"],\n' +
  '\t\t\t\t "type": "eqJoin",\n' +
  '\t\t\t\t "selector": { "taxcodeKey": { "$eq": "${taxcode}" } },\n' +
  '\t\t\t\t "leftJoinKey": "taxcode",\n' +
  '\t\t\t\t "rightJoinKey": "taxcodeId"\n' +
  "\t\t\t },\n" +
  "\t\t\t {\n" +
  '\t\t\t\t "type": "find",\n' +
  '\t\t\t\t "value": { "taxcodeKey": { "$eq": "${taxcode}" } }\n' +
  "\t\t\t }\n" +
  "\t\t],\n" +
  '\t\t"field": [\n' +
  "\t\t\t {\n" +
  '\t\t\t\t "id": "${field}",\n' +
  '\t\t\t\t "value": "${field}",\n' +
  '\t\t\t\t "summarytype": "sum"\n' +
  "\t\t\t }\n" +
  "\t\t]\n" +
  "\t},\n";
const ACCRUE_SCHEMA_TEMPLATE =
  "\t{\n" +
  '\t\t"id": "${box}",\n' +
  '\t\t"source": ["vat_${search}summary"],\n' +
  '\t\t"transformer": [\n' +
  "\t\t\t {\n" +
  '\t\t\t\t "source": ["taxcode_mapping"],\n' +
  '\t\t\t\t "type": "eqJoin",\n' +
  '\t\t\t\t "selector": { "taxcodeKey": { "$in": ${taxcode} } },\n' +
  '\t\t\t\t "leftJoinKey": "taxcode",\n' +
  '\t\t\t\t "rightJoinKey": "taxcodeId"\n' +
  "\t\t\t },\n" +
  "\t\t\t {\n" +
  '\t\t\t\t "type": "find",\n' +
  '\t\t\t\t "value": { "taxcodeKey": { "$in": ${taxcode} } }\n' +
  "\t\t\t }\n" +
  "\t\t],\n" +
  '\t\t"field": [\n' +
  "\t\t\t {\n" +
  '\t\t\t\t "id": "${field}",\n' +
  '\t\t\t\t "value": "${field}",\n' +
  '\t\t\t\t "summarytype": "sum"\n' +
  "\t\t\t }\n" +
  "\t\t]\n" +
  "\t},\n";
const REPORT_DATA_TEMPLATE =
  "\t\t{\n" +
  '\t\t\t"id": "${box}",\n' +
  '\t\t\t"value": "${expression}"\n' +
  "\t\t},\n";
const DETAILS_SCHEMA_TEMPLATE =
  "\t\t{\n" +
  '\t\t\t"id": "${box}",\n' +
  '\t\t\t"source": ["vat_${search}"],\n' +
  '\t\t\t"transformer": [\n' +
  "\t\t\t\t {\n" +
  '\t\t\t\t\t "source": ["taxcode_mapping"],\n' +
  '\t\t\t\t\t "type": "eqJoin",\n' +
  '\t\t\t\t\t "selector": { "taxcodeKey": { "$in": ${taxcode} } },\n' +
  '\t\t\t\t\t "leftJoinKey": "taxcode",\n' +
  '\t\t\t\t\t "rightJoinKey": "taxcodeId"\n' +
  "\t\t\t\t },\n" +
  "\t\t\t\t {\n" +
  '\t\t\t\t\t "type": "find",\n' +
  '\t\t\t\t\t "value": { "taxcodeKey": { "$in": ${taxcode} } }\n' +
  "\t\t\t\t }\n" +
  "\t\t\t],\n" +
  "\t\t},\n";
const AMOUNT_RATE_REGEX = "\\.((Tax|Net|Notional)Amount|Rate)";
const SEARCH_INDEX = 1;
const TAXCODE_INDEX = 2;

const cleanupForWriting = (output) => {
  var cleanOutput = output.replace("${schemas}", "");
  cleanOutput = cleanOutput.replace("${report_data}", "");
  return cleanOutput;
};

const getFunctionBlocks = (fileContents, functionPattern) => {
  var functionRegex = new RegExp(functionPattern, "gm");
  var functionBlocks = fileContents.match(functionRegex);
  return functionBlocks;
};

const getBoxName = (objectAssignment, boxNamePattern) => {
  var nameIndex = 1;
  var boxRegex = new RegExp(boxNamePattern);
  var boxName = objectAssignment.match(boxRegex)[nameIndex];
  return boxName;
};

exports.convertToSummaries = (fileContents) => {
  var functionBlocks = getFunctionBlocks(fileContents, getFunctionPattern());
  var convertedContents = [];

  if (functionBlocks && functionBlocks.length > 0) {
    functionBlocks.forEach(function (block) {
      convertedContents.push(convertToSummarySchema(block));
    });
  } else {
    console.log("converter:  No reports to parse");
  }
  return convertedContents;

  function getObjectAssignmentPattern() {
    var objPrefix = "obj\\.(box|rate\\w+)\\w+ = ";
    var searchRegex = "\\w+\\.";
    var ofRegex = "Of\\([\"']\\w+[\"']\\)";
    var accrueRegex =
      "Accrue\\(([\"']\\w+[\"'],\\s*)?\\[[\"']\\w+[\"'](\\s*,\\s*[\"']\\w+[\"'])*\\]\\)";

    var operatorRegex = "( [+-]\\s*)?";
    var objectAssignmentRegex =
      objPrefix +
      "(" +
      searchRegex +
      "(" +
      ofRegex +
      "|" +
      accrueRegex +
      ")" +
      AMOUNT_RATE_REGEX +
      operatorRegex +
      ")+;";

    return objectAssignmentRegex;
  }

  function getFunctionPattern() {
    var functionNameRegex = "(\\w+\\.)+GetData = function\\(\\) \\{";
    var variableAssignmentRegex = "(\\s+var \\w+ = [_A-z0-9.(){}]+;)+";
    var objectAssignmentRegex = getObjectAssignmentPattern();
    var multiobjectAssignmentRegex = "(\\s+" + objectAssignmentRegex + ")+";
    var returnRegex = "\\s+return [_A-z0-9.(){}]+;";

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
        var boxNamePattern = "obj.(\\w+)";
        var boxName = getBoxName(objectAssignment, boxNamePattern);
        var ofSchemas = getOfSchemas({
          boxName: boxName,
          objectAssignment: objectAssignment,
        });
        var accrueSchemas = getAccrueSchemas({
          boxName: boxName,
          objectAssignment: objectAssignment,
        });
        var allSchemas = ofSchemas.concat(accrueSchemas);
        var boxExpression = "";
        var boxRegex = new RegExp('"id": "(\\w+)"');
        var reportData = [];

        if (allSchemas.length > 1) {
          allSchemas.forEach(function (schema, index) {
            var operator = index === allSchemas.length - 1 ? "" : " + ";
            allSchemas[index] = schema.replace(
              boxRegex,
              '"id": "$1_' + (index + 1) + '"'
            );
            var childBox = schema.match(boxRegex)[1] + "_" + (index + 1);
            boxExpression += childBox + operator;
          });

          var boxReportData = REPORT_DATA_TEMPLATE.replace("${box}", boxName);
          boxReportData = boxReportData.replace("${expression}", boxExpression);
          reportData.push(boxReportData);
        } else {
          var childBox = allSchemas[0].match(boxRegex)[1];
          boxExpression = childBox;
          var boxReportData = REPORT_DATA_TEMPLATE.replace("${box}", childBox);
          boxReportData = boxReportData.replace("${expression}", boxExpression);
          reportData.push(boxReportData);
        }

        var outputReportData = reportData.join(" ") + "${report_data}";
        var outputSchemas = allSchemas.join(" ") + "${schemas}";
        outputJSON = outputJSON.replace("${schemas}", outputSchemas);
        outputJSON = outputJSON.replace("${report_data}", outputReportData);
      });
    }
    outputJSON = cleanupForWriting(outputJSON);
    return outputJSON;
  }

  function getOfSchemas(options) {
    var schemas = [];
    var pattern = "\\w+\\.Of\\([\"'](\\w+)[\"']\\)" + AMOUNT_RATE_REGEX;
    var regex = new RegExp(pattern, "g");
    var objects = options.objectAssignment.match(regex);

    if (objects) {
      objects.forEach(function (obj, index) {
        var schema = getOfSchema({
          box: options.boxName,
          block: obj,
        });
        schemas.push(schema);
      });
    }

    return schemas;
  }

  function getOfSchema(options) {
    var FIELD_INDEX = 3;
    var schema = "";

    var pattern = "(\\w+)\\.Of\\([\"'](\\w+)[\"']\\)" + AMOUNT_RATE_REGEX;
    var regex = new RegExp(pattern);
    var components = options.block.match(regex);
    if (components) {
      schema = replaceInSchema({
        template: OF_SCHEMA_TEMPLATE,
        components: components,
        box: options.box,
        fieldIndex: FIELD_INDEX,
      });
    }

    return schema;
  }

  function getAccrueSchemas(options) {
    var schemas = [];
    var pattern =
      "\\w+\\.Accrue\\(\\[[\"']\\w+[\"'](, [\"']\\w+[\"'])*\\]\\)" +
      AMOUNT_RATE_REGEX;
    var objRegex = new RegExp(pattern, "g");
    var objects = options.objectAssignment.match(objRegex);

    if (objects) {
      objects.forEach(function (obj, index) {
        var schema = getAccrueSchema({
          box: options.boxName,
          block: obj,
        });
        schemas.push(schema);
      });
    }

    return schemas;
  }

  function getAccrueSchema(options) {
    var FIELD_INDEX = 4;
    var schema = "";

    var pattern =
      "(\\w+)\\.Accrue\\((\\[[\"']\\w+[\"'](, [\"']\\w+[\"'])*\\])\\)" +
      AMOUNT_RATE_REGEX;
    var regex = new RegExp(pattern);
    var components = options.block.match(regex);
    if (components) {
      schema = replaceInSchema({
        template: ACCRUE_SCHEMA_TEMPLATE,
        components: components,
        box: options.box,
        fieldIndex: FIELD_INDEX,
      });
    }

    return schema;
  }

  function replaceInSchema(options) {
    var template = options.template;
    var components = options.components;
    var fieldIndex = options.fieldIndex;
    var taxcodeRegex = new RegExp("\\$\\{taxcode\\}", "g");
    var fieldRegex = new RegExp("\\$\\{field\\}", "g");

    var search = components[SEARCH_INDEX].toLowerCase();
    var box = options.box.toLowerCase();
    var taxcode = components[TAXCODE_INDEX];
    var field = components[fieldIndex].toLowerCase();

    var replacedSchema = template.replace("${search}", search);
    replacedSchema = replacedSchema.replace("${box}", box);
    replacedSchema = replacedSchema.replace(taxcodeRegex, taxcode);
    replacedSchema = replacedSchema.replace(fieldRegex, field);

    return replacedSchema;
  }

  function getObjectAssignmentsFromFunction(block) {
    var objectAssignmentPattern = getObjectAssignmentPattern();
    var objectAssignmentRegex = new RegExp(objectAssignmentPattern, "gm");
    var objectAssignments = block.match(objectAssignmentRegex);
    return objectAssignments;
  }
};

exports.convertToDetails = (fileContents) => {
  var functionBlocks = getFunctionBlocks(fileContents, getFunctionPattern());
  var convertedContents = [];

  if (functionBlocks && functionBlocks.length > 0) {
    functionBlocks.forEach(function (block) {
      convertedContents.push(convertToDetailsSchema(block));
    });
  } else {
    console.log("converter:  No reports to parse");
  }
  return convertedContents;

  function getFunctionPattern() {
    var functionNamePattern =
      "(\\w+\\.)+GetDrilldownData = function\\(\\w+(, \\w+)?\\) \\{";
    var variableAssignmentPattern = "(\\s+var \\w+ = [_A-z0-9.(){}]+;)*";
    var loopPattern = getLoopPattern();
    var switchPattern = "\\s+switch \\(boxNumber\\) \\{";
    var dataAssignmentPattern = getDataAssignmentPattern();
    var multiDataAssignmentPattern = "(" + dataAssignmentPattern + ")+";
    var returnPattern = "\\s+return [_A-z0-9.(){}]+;";
    var closingPattern =
      "\\s+\\}" +
      variableAssignmentPattern +
      "\\s+ds\\.ReportData = data;" +
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
      "(\\s+(for|if)\\s\\(" + catchAllCharacter + "+\\) \\{";
    const linePattern =
      "(\\s+" + catchAllCharacter + "+=" + catchAllCharacter + "+;)+";

    return keywordPattern + linePattern + "\\s+})*";
  }

  function convertToDetailsSchema(block) {
    var dataAssignments = getDataAssignmentsFromFunction(block);
    var outputJSON = DETAILS_JSON_TEMPLATE;

    dataAssignments.forEach(function (dataAssignment) {
      var boxNamePattern = "obj.(\\w+)";
      var boxName = getBoxName(dataAssignment, boxNamePattern);
      var schemas = getDetailSchemas({
        box: boxName,
        dataAssignment: dataAssignment,
      });
      var outputSchemas = schemas.join(" ") + "${schemas}";
      outputJSON = outputJSON.replace("${schemas}", outputSchemas);
    });

    outputJSON = cleanupForWriting(outputJSON);
    return outputJSON;
  }

  function getDataAssignmentsFromFunction(block) {
    var dataAssignmentPattern = getDataAssignmentPattern();
    var dataAssignmentRegex = new RegExp(dataAssignmentPattern, "gm");
    var dataAssignments = block.match(dataAssignmentRegex);

    return dataAssignments;
  }

  function getDataAssignmentPattern() {
    var dataAssignmentPattern = "\\s+case '(\\w+)':\\s*data =";
    var detailsPattern =
      "\\s*_DR\\.Get(Sales|Purchase)Details(\\w+)?\\(\\['\\w+'(,\\s*'\\w+')*\\](,\\s*'\\w+')?\\)";
    var fullDataAssignmentPattern =
      dataAssignmentPattern +
      detailsPattern +
      "(\\.concat\\(" +
      detailsPattern +
      "\\))*;\\s*break;";

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
      "_DR\\.Get(Sales|Purchase)Details(\\w+)?\\(\\['\\w+'(,\\s*'\\w+')*\\](,\\s*'\\w+')?\\)";
    var regex = new RegExp(pattern, "g");
    var details = options.dataAssignment.match(regex);

    if (details) {
      details.forEach(function (detail) {
        var schema = createDetailSchema({
          box: options.box,
          detail: detail,
        });
        schemas.push(schema);
      });
    }
    return schemas;
  }

  function createDetailSchema(options) {
    var schema = "";
    var pattern =
      "_DR\\.Get((Sales|Purchase)Details(\\w+)?)\\((\\[('\\w+')(,\\s*'\\w+')*\\])(,\\s*'\\w+')?\\)";
    var regex = new RegExp(pattern);
    var components = options.detail.match(regex);

    if (components) {
      schema = replaceInDetailsSchema({
        components: components,
        box: options.box,
      });
    }

    return schema;
  }

  function replaceInDetailsSchema(options) {
    var searchIndex = 1;
    var taxcodeIndex = 4;

    var template = DETAILS_SCHEMA_TEMPLATE;
    var components = options.components;
    var taxcodeRegex = new RegExp("\\$\\{taxcode\\}", "g");

    var search = components[searchIndex].toLowerCase();
    var box = options.box.toLowerCase();
    var taxcode = components[taxcodeIndex];

    var replacedSchema = template.replace("${search}", search);
    replacedSchema = replacedSchema.replace("${box}", box);
    replacedSchema = replacedSchema.replace(taxcodeRegex, taxcode);

    return replacedSchema;
  }
};

exports.getTaxDefs = (contents) => {
  const matches = contents.match(/^.*?this.TaxDefinition = (\{[\s\S]*?\});/m);
  return matches ? matches[1] : null;
};
