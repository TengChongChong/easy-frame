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

    var mDropZone = null;
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
                url: mTool.getBaseUrl() + 'analysis/' + $('#importCode').val(),
                data: {
                    path: path
                },
                success: function (res) {
                    if (res.data) {
                        mTool.successTip(mTool.commonTips.success, '数据导入成功，正在加载数据...');
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
            initTable();
        });
    };
    /**
     * 查询导入模板表头
     */
    var selectTableHead = function () {
        mUtil.ajax({
            url: basePath + '/auth/sys/import/excel/template/details/select/table/head/' + importCode,
            success: function (res) {
                if (res.data == null || res.data.length === 0) {
                    $('#import-temporary').html('<div class="alert alert-danger" role="alert"><strong>导入模板无效</strong> 模板未设置导入规则，暂时无法使用</div>');
                } else {
                    columns = res.data;
                }
            }
        });
    };
    /**
     * 初始化列表
     */
    var initTable = function () {
        var _columns = columns;
        // 验证结果&操作列
        _columns.push({
            field: 'verificationResults',
            width: 200,
            title: '效验结果',
            overflow: 'visible',
            locked: {
                right: 'md'
            },
            template: function (row, index, datatable) {
                if (mUtil.isNotBlank(row.verificationResults)) {
                    return '<span class="m--font-danger ell" title="' + row.verificationResults + '">' + row.verificationResults + '</span>';
                } else {
                    return '<span class="m--font-success">验证通过</span>';
                }
            }
        });
        _columns.push({
            field: 'Actions',
            width: 40,
            title: '操作',
            sortable: false,
            overflow: 'visible',
            locked: {
                right: 'md'
            },
            template: function (row, index, datatable) {
                return '<a href="#" onclick="mApp.openPage(\'' + row.field1 + '\', \''+basePath+'/auth/sys/import/excel/temporary/input/' + row.id + '\')" class="' + mTool.ACTIONS_INFO + '" title="编辑">\
                                <i class="la la-edit"></i>\
                            </a>';
            }
        });

        var options = {
            url: basePath + '/auth/sys/import/excel/temporary/select',
            // 列配置
            columns: _columns
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
                url: basePath + '/auth/sys/import/excel/temporary/clean/my/import/' + importCode,
                success: function () {
                    $('#temporary-list').addClass('m--hide');
                    $('#import-temporary').removeClass('m--hide');
                    mApp.animateCSS('#import-temporary', mApp.getAnimate('in'), null);
                }
            });
        });
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
    };
    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/sys/import/excel/data/');
            importCode = $('#importCode').val();
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