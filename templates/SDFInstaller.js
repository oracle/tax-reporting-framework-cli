/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 *
 * @NApiVersion 2.1
 * @NScriptType SDFInstallationScript
 */
define(['N/task'], function (task) {
  var APP_GUID = 'UUID';

  function run() {
    installBundle();
    installReportSchemas();
    installSavedSearches();
  }

  function installBundle() {
    var bundleInstaller = task.create({
      taskType: task.TaskType.SCHEDULED_SCRIPT
    });
    bundleInstaller.scriptId = 'customscript_str_bundle_installer_ss';
    bundleInstaller.params = {
      custscript_str_bundle_installer_ss_guid: APP_GUID
    };
    bundleInstaller.submit();
  }

  function installReportSchemas() {
    var reportSchemaInstaller = task.create({
      taskType: task.TaskType.MAP_REDUCE
    });
    reportSchemaInstaller.scriptId = 'customscript_reportschema_installer_mr';
    reportSchemaInstaller.params = {
      custscript_str_reportschema_ins_mr_uuid: APP_GUID
    };
    reportSchemaInstaller.submit();
  }

  function installSavedSearches() {
    var searchInstaller = task.create({
      taskType: task.TaskType.MAP_REDUCE
    });
    searchInstaller.scriptId = 'customscript_str_searchinstaller_mr';
    searchInstaller.params = {
      custscript_str_searchinstall_mr_uuid: APP_GUID,
      custscript_str_searchinstall_mr_file: 'str_localized_searches.json'
    };
    searchInstaller.submit();
  }

  return {
    run: run
  };
});
