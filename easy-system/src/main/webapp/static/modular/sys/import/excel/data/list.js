//== 数据导入
var mImportData = function () {
    /**
     * 当前导入模板对应的表头
     *
     * @type {array}
     */
    var columns = [];
    /**
     * 模板代码
     */
    var importCode = null;
    /**
     * 模板id
     */
    var templateId = null;
    /**
     * 文件上传
     * @type {null}
     */
    var mDropZone = null;
    /**
     * 总共导入数据量
     * @type {number}
     */
    var importTotal = 0;
    /**
     * 初始化文件上传
     */
    var initDropzone = function () {
        mDropZone = mApp.initDropzone({
            selector: '#upload-excel',
            acceptedFiles: ".xlsx, .xls",
            success: function (res) {
                $('#path').val(res.data.path);
            }
        })
    };
    /**
     * 下载模板
     *
     * @param importCode {string} 模板代码
     */
    var downloadTemplate = function (importCode) {
        mTool.downloadFile(basePath + '/auth/sys/import/excel/template/download/template/' + importCode);
    };
    /**
     * 导入数据
     */
    var importData = function () {
        var path = $('#path').val();
        if (mUtil.isNotBlank(path)) {
            mUtil.ajax({
                wait: '#import-temporary',
                url: mTool.getBaseUrl() + 'analysis/' + templateId,
                data: {
                    path: path
                },
                success: function (res) {
                    if (res.data) {
                        mTool.infoTip(mTool.commonTips.success, '数据导入成功，正在加载数据...');
                        showImportTable();
                    } else {
                        mTool.errorTip(mTool.commonTips.fail, '导入失败');
                    }
                }
            });
        } else {
            mTool.warnTip(mTool.commonTips.fail, '请先上传文件');
        }
    };
    /**
     * 显示导入表格
     */
    var showImportTable = function () {
        $('#import-temporary').addClass('m--hide');
        $('#temporary-list').removeClass('m--hide');
        mApp.animateCSS('#temporary-list', mApp.getAnimate('in'), function () {
            // 加载导入数据
            initTable();
            // 加载汇总信息
            initSummary();
        });
    };
    /**
     * 查询导入模板表头
     */
    var selectTableHead = function () {
        mUtil.ajax({
            url: basePath + '/auth/sys/import/excel/template/details/select/table/head/' + templateId,
            success: function (res) {
                if (res.data == null || res.data.length === 0) {
                    $('#import-temporary').html('<div class="alert alert-danger" role="alert"><strong>导入模板无效</strong> 模板未设置导入规则，暂时无法使用</div>');
                } else {
                    columns = res.data;
                    columns.push({
                        field: 'verificationResults',
                        width: 200,
                        title: '效验结果',
                        overflow: 'visible',
                        locked: {
                            right: 'md'
                        },
                        template: function (row, index, datatable) {
                            if ('0' === row.verificationStatus) {
                                return '<span class="m--font-danger ell" title="' + row.verificationResults.replaceAll(';', ';\r\n') + '">' + row.verificationResults + '</span>';
                            } else {
                                return '<span class="m--font-success">验证通过</span>';
                            }
                        }
                    });
                    columns.push({
                        field: 'Actions',
                        width: 40,
                        title: '操作',
                        sortable: false,
                        overflow: 'visible',
                        locked: {
                            right: 'md'
                        },
                        template: function (row, index, datatable) {
                            return '<a href="#" onclick="mApp.openPage(\'' + row.field1 + '\', \'' + basePath + '/auth/sys/import/excel/temporary/input/' + row.id + '\')" class="' + mTool.ACTIONS_INFO + '" title="编辑">\
                                <i class="la la-edit"></i>\
                            </a>';
                        }
                    });
                }
            }
        });
    };
    /**
     * 加载汇总信息
     */
    var initSummary = function () {
        mUtil.ajax({
            url: mTool.getBaseUrl() + 'select/summary/' + templateId,
            success: function (res) {
                importTotal = res.data.total;
                if (res.data.total) {
                    var $summaryInfo = $('#summary-info').removeClass().empty();
                    var html;
                    if (res.data.total === res.data.success) {
                        // 全部成功了
                        $summaryInfo.addClass('alert alert-success');
                        $('#export-fail').addClass('m--hide');
                        html = '数据全部验证通过了，共 ' + res.data.total + ' 条数据';
                    } else if (res.data.total === res.data.fail) {
                        // 全部失败了
                        $summaryInfo.addClass('alert alert-danger');
                        $('#save-formal').addClass('m--hide');
                        html = '数据全部验证失败了，共 ' + res.data.total + ' 条数据';
                    } else {
                        // 部分成功了
                        $summaryInfo.addClass('alert alert-warning');
                        html = '验证通过 ' + res.data.success + ' 条，验证失败 ' + res.data.fail + ' 条，共 ' + res.data.total + ' 条数据';
                    }
                    $summaryInfo.append('<i class="la la-bar-chart"></i> ' + html);
                } else {
                    // 如果全部导入成功了,就返回选择文件页面
                    showSelectionFileView();
                }
            }
        });
    };
    /**
     * 初始化列表
     */
    var initTable = function () {
        var options = {
            url: basePath + '/auth/sys/import/excel/temporary/select',
            // 列配置
            columns: columns
        };
        mImportData.dataTable = mTool.initDataTable(options);
    };
    /**
     * 重新选择文件
     */
    var reSelectionFile = function () {
        mUtil.alertConfirm('确定要放弃待确认数据吗？', '该操作无法撤销，请谨慎操作', function () {
            mUtil.ajax({
                wait: '#temporary-list',
                url: basePath + '/auth/sys/import/excel/temporary/clean/my/import/' + templateId,
                success: function () {
                    if (mImportData.dataTable != null) {
                        // 销毁表格
                        mImportData.dataTable.destroy();
                    }
                    showSelectionFileView();
                }
            });
        });
    };
    /**
     * 显示选择文件视图
     */
    var showSelectionFileView = function () {
        $('#last-tip').remove();
        $('#summary-info, #temporary-list').addClass('m--hide');
        $('#import-temporary, #export-fail, #save-formal').removeClass('m--hide');
        mApp.animateCSS('#import-temporary', mApp.getAnimate('in'), null);
        mDropZone.removeAllFiles();
    };
    /**
     * 保存数据到正式表
     */
    var insertData = function () {
        mUtil.ajax({
            url: mTool.getBaseUrl() + 'insert/data/' + templateId,
            success: function (res) {
                mTool.successTip(mTool.commonTips.success, '成功导入 ' + res.data + ' 条数据');
                // 如果全部导入成功了,就返回选择文件页面;如果部分成功了就刷新汇总信息以及列表
                if (importTotal === res.data) {
                    showSelectionFileView();
                } else {
                    // 刷新表格
                    mTool.selectData($('#field1').val(''));
                    // 刷新汇总信息
                    initSummary();
                }
            }
        });
    };
    /**
     * 导出错错误数据
     *
     * @param $el 按钮
     */
    var exportVerificationFailData = function ($el) {
        mTool.exportData($el, mTool.getBaseUrl() + 'export/verification/fail/data/' + templateId);
    };
    /**
     * 绑定事件
     */
    var bind = function () {
        $('#download-template').click(function () {
            downloadTemplate(importCode);
        });
        $('#import-data').click(function () {
            importData();
        });
        $('#re-selection').click(function () {
            reSelectionFile();
        });
        $('#save-formal').click(function () {
            insertData();
        });
        $('#export-fail').click(function () {
            exportVerificationFailData();
        });
    };
    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/sys/import/excel/data/');
            importCode = $('#importCode').val();
            templateId = $('#templateId').val();
            selectTableHead();
            bind();
            initDropzone();
            if ('true' === $('#hasLast').val()) {
                showImportTable();
            }
        }
    };
}();
//== 初始化
$(document).ready(function () {
    mImportData.init();
});