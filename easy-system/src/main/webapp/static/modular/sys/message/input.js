//== 通知 -详情页
var SysMessageInput = function () {
    /**
     * 初始化收信人
     */
    var initUserSelect = function () {
        var keyword = null;
        function highlightKeywords(text){
            if(KTUtil.isNotBlank(text)){
                return text.replaceAll(keyword, '<span class="kt-font-danger">'+keyword+'</span>');
            }
        }
        $('#receiver').select2({
            language: 'zh-CN',
            placeholder: '输入用户名/昵称/部门查找用户',
            allowClear: true,
            ajax: {
                url: basePath + '/auth/sys/user/search',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    keyword = params.term;
                    return {
                        keyword: params.term,
                        current: params.page
                    };
                },
                processResults: function (res, params) {
                    params.page = params.page || 1;
                    return {
                        results: res.data.records,
                        pagination: {
                            more: (params.page * 30) < res.data.total
                        }
                    };
                },
                cache: true
            },
            escapeMarkup: function (markup) {
                return markup;
            },
            minimumInputLength: 1,
            templateSelection: function(user){
                return user.username || user.text;
            },
            templateResult: function (user) {
                if(KTUtil.isNotBlank(user.id)){
                    return '\
                        <div class="select2-result-repository clearfix">\
                            <div class="select2-result-repository__meta">\
                                <div class="select2-result-repository__title">' + highlightKeywords(user.username) + '/' + highlightKeywords(user.nickname) + '/' + highlightKeywords(user.departName) + '</div>\
                            </div>\
                        </div>';
                }
            }
        });
    };

    /**
     * 初始化编辑器
     */
    var initSummernote = function () {
        $('.summernote').summernote({
            height: 160,
            lang: 'zh-CN'
        });
    };
    /**
     * 保存并发送
     *
     * @param el
     */
    var saveAndSend = function (el) {
        $('#input-status').val(1);
        KTTool.saveData(el, null, null, null, function () {
            $('.kt-form__actions').remove();
        });
    };

    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/message/');
            KTApp.initRadio();
            initSummernote();
            initUserSelect();
        },
        saveAndSend: function (el) {
            saveAndSend(el);
        }
    };
}();
//== 初始化
$(document).ready(function () {
    SysMessageInput.init();
});