/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 *
 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */

define(['../../../../../../../src/app/processor/IProcessor'], function (iprocessor) {
    function VATSearchNonDeductibleProcessor(params, context) {
        iprocessor.call(this, params, context);
        this.name = 'VATSearchNonDeductibleProcessor';
    }
    util.extend(VATSearchNonDeductibleProcessor.prototype, iprocessor.prototype);

    VATSearchNonDeductibleProcessor.prototype.process = function (row) {
        try {
            var data = {};

            data.type = row.getValue({
                name: 'type',
                summary: 'group',
            });
            data.memo = row.getValue({
                name: 'memo',
                summary: 'group',
            });
            data.taxcode = this.getTaxCodeFromMemo(data.memo);
            data.netamount = 0;
            data.taxamount =
                row.getValue({
                    name: 'debitamount',
                    summary: 'sum',
                }) * -1;
            return data;
        } catch (ex) {
            throw ex;
        }
    };

    VATSearchNonDeductibleProcessor.prototype.getTaxCodeFromMemo = function (memo) {
        var splittedMemo = memo.split(':');
        splittedMemo = splittedMemo.length > 1 ? splittedMemo[1] : '';
        return splittedMemo;
    };

    return VATSearchNonDeductibleProcessor;
});
