//== 个人中心-概览
var PersonalCenterOverview = function () {
    var titleWidth = 320;
    /**
     * 获取标题区域可用宽度
     * @return {number}
     */
    var getTitleWidth = function () {
        var minWidth = 260;
        var width = $('#message-body').width() - 160;
        return Math.max(minWidth, width);
    };
    /**
     * 读消息
     *
     * @param element {object} 消息链接
     */
    var readMessage = function (element) {
        var $link = $(element);
        // 移除未读class
        $link.removeClass('unread');
        // 打开页面
        KTApp.openPage($link.text(), $link.data('url'));
    };
    /**
     * 初始化收信
     */
    var initReceive = function () {
        var $status = $('#status');
        // 消息必须是已发送
        $status.val(STATUS_HAS_BEEN_SENT);
        KTTool.initDataTable({
            selector: '#message-list',
            url: basePath + '/auth/sys/message/select/receive',
            data: {
                pageSize: 10
            },
            layout: {
                header: false,
                height: 460
            },
            pagination: false,
            columns: [
                {
                    field: 'title',
                    title: '主题',
                    width: titleWidth,
                    template: function (row) {
                        return '\
                        <div class="kt-user-card-v2">\
                            <div class="kt-user-card-v2__pic">\
                                <img src="' + basePath + row.avatar + '" alt="photo">\
                            </div>\
                            <div class="kt-user-card-v2__details">\
                                <a href="javascript:;" data-url="' + basePath + '/auth/sys/message/info/' + row.messageId + '/' + row.id + '"' +
                                    'class="kt-user-card-v2__name message-link' + (row.readDate ? '' : ' unread') + '">' +
                                (row.important === 1 ? '<span class="kt-badge kt-badge--danger kt-badge--inline kt-badge--unified-danger">重要</span> ' : '') +
                                row.title + '</a>\
                                <span class="kt-user-card-v2__email">' + row.nickname + '</span>\
                            </div>\
                        </div>';
                    }
                },
                {
                    field: 'sendDate',
                    title: '类型/时间',
                    width: 80,
                    template: function (row) {
                        var typeDicts = KTTool.getSysDictsObject('messageType');
                        return '\
                        <div class="kt-user-card-v2">\
                            <div class="kt-user-card-v2__details">\
                                <a href="#" class="kt-user-card-v2__name">' + KTTool.getDictElement(row.type, typeDicts) + '</a>\
                                <span class="kt-user-card-v2__email" title="' + row.sendDate + '">' + (moment(row.sendDate, 'YYYY-MM-DD HH:mm:ss').fromNow()) + '</span>\
                            </div>\
                        </div>';
                    }
                }
            ]
        });
        // 收信
    };
    /**
     * 绑定事件
     */
    var bind = function () {
        $('#message-list').on('click', '[data-url]', function () {
            readMessage(this);
        });    
    };
    return {
        //== 初始化页面
        init: function () {
            titleWidth = getTitleWidth();
            initReceive();
            bind();
        }
    };
}();
//== 初始化
$(document).ready(function () {
    PersonalCenterOverview.init();
});