//== 在线用户管理
var mOnlineList = function () {
    /**
     * 初始化在线用户表格
     */
    var initTable = function () {
        var options = {
            data: {
                type: 'local',
                serverPaging: false, // 在服务器进行数据分页
                serverFiltering: false, // 在服务器进行数据过滤
                serverSorting: false // 在服务器进行数据排序
            },
            // 列配置
            columns: [
                {
                    field: 'id',
                    title: '#',
                    sortable: false, // 禁用此列排序
                    width: 40,
                    selector: {class: 'm-checkbox--solid m-checkbox--brand'}
                },
                {
                    field: 'username',
                    title: '用户名'
                },
                {
                    field: 'nickname',
                    title: '昵称'
                },
                {
                    field: 'phone',
                    title: '手机号'
                },
                {
                    field: 'startTimestamp',
                    title: '登录时间',
                    sortable: 'asc'
                },
                {
                    field: 'timeout',
                    title: '有效期',
                    template: function (row, index, datatable) {
                        return row.timeout / 1000 / 60 + '分钟';
                    }
                },
                {
                    field: 'Actions',
                    width: 30,
                    title: '操作',
                    sortable: false,
                    overflow: 'visible',
                    locked: {
                        right: 'md'
                    },
                    template: function (row, index, datatable) {
                        var _btn = '';
                        if (mTool.hasPermissions('sys:online:force')) {
                            _btn += '<a href="#" onclick="mOnlineList.forceLogin(\'' + row.sessionId + '\')" class="' + mTool.ACTIONS_DANGER + '" title="下线">\
                                <i class="la la-sign-out"></i>\
                            </a>';
                        }
                        return _btn;
                    }
                }
            ]
        };
        mUtil.ajax({
            url: mTool.getBaseUrl() + 'select',
            success: function (res) {
                options.data.source = res.data;
                mOnlineList.dataTable = mTool.initDataTable(options);
            }
        });
    };
    /**
     * 踢出指定会话
     *
     * @param sessionId {string} 会话id
     */
    var forceLogin = function (sessionId) {
        mUtil.ajax({
            url: mTool.getBaseUrl() + 'force/logout/' + sessionId,
            success: function (res) {
                mTool.successTip(mTool.commonTips.success, '会话已踢出');
            }
        });
    };
    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/sys/online/');
            initTable();
        },
        /**
         * 踢出指定会话
         *
         * @param sessionId {string} 会话id
         */
        forceLogin: function (sessionId) {
            forceLogin(sessionId);
        }
    };
}();

//== 初始化
$(document).ready(function () {
    mOnlineList.init();
});