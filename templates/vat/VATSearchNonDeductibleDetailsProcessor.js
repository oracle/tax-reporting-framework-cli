/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 *
 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */

define(['../../../../../../../src/lib/ErrorHandler', '../../../../../../../src/app/processor/IProcessor'], function (
    error,
    iprocessor
) {
    function VATSearchNonDeductibleDetailsProcessor(params, context) {
        iprocessor.call(this, params, context);
        this.name = 'VATSearchNonDeductibleDetailsProcessor';
    }
    util.extend(VATSearchNonDeductibleDetailsProcessor.prototype, iprocessor.prototype);

    VATSearchNonDeductibleDetailsProcessor.prototype.process = function (row) {
        try {
            var data = {};
            data.id = row.id;
            data.internalid = row.getValue({
                name: 'internalid',
                summary: 'group',
            });
            data.type = row.getValue({
                name: 'type',
                summary: 'group',
            });
            data.typeName = row.getText({
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
            data.name = this.getEntityName(row, data.type);
            data.date = row.getValue({
                name: 'trandate',
                summary: 'group',
            });
            data.txnNo = row.getValue({
                name: 'tranid',
                summary: 'group',
            });
            return data;
        } catch (ex) {
            error['throw'](ex, {
                context: this.name + '.process',
                level: error.level.ERROR,
            });
        }
    };

    VATSearchNonDeductibleDetailsProcessor.prototype.getEntityName = function (row, type) {
        if (type === 'ExpRept') {
            return row.getValue({
                name: 'entityid',
                join: 'employee',
                summary: 'group',
            });
        }

        var entityName = [];
        var source = this.params.type === 'SALE' || this.params.type === 'BILLABLE_EXPENSE' ? 'customer' : 'vendor';
        var summary = 'group';

        var isIndividual = row.getValue({
            name: 'isperson',
            join: source,
            summary: summary,
        });

        if (isIndividual) {
            entityName.push(
                getValidName(
                    row.getValue({
                        name: 'firstname',
                        join: source,
                        summary: summary,
                    })
                )
            );
            entityName.push(
                getValidName(
                    row.getValue({
                        name: 'middlename',
                        join: source,
                        summary: summary,
                    })
                )
            );
            entityName.push(
                getValidName(
                    row.getValue({
                        name: 'lastname',
                        join: source,
                        summary: summary,
                    })
                )
            );
        } else {
            entityName.push(
                row.getValue({
                    name: 'companyname',
                    join: source,
                    summary: summary,
                })
            );
        }
        log.error(
            '123',
            row.getValue({
                name: 'companyname',
                join: 'vendor',
                summary: 'group',
            })
        );
        return entityName.join(' ');

        function getValidName(name) {
            if (name.toLowerCase().indexOf('none') > -1) {
                return '';
            }
            return name;
        }
    };

    VATSearchNonDeductibleDetailsProcessor.prototype.getTaxCodeFromMemo = function (memo) {
        var splittedMemo = memo.split(':');
        splittedMemo = splittedMemo.length > 1 ? splittedMemo[1] : '';
        return splittedMemo;
    };

    return VATSearchNonDeductibleDetailsProcessor;
});
