//== redis 管理
var mRedisView = function () {
    /**
     * 暂存查询结果
     */
    var keys = null;
    /**
     * 删除
     */
    var deleteKey = function () {
        var _delKey = function (key) {
            KTUtil.ajax({
                wait: '.m-portlet',
                url: KTTool.getBaseUrl() + 'delete/' + key,
                success: function (res) {
                    resetDetails();
                    $('[data-key="' + key + '"]').remove();
                }
            });
        };
        var key = $('#key').val();
        if (KTUtil.isNotBlank(key)) {
            var subTitle;
            // 登录次数累计
            if (key.indexOf('account:') > -1) {
                subTitle = null;
            } else if (key.indexOf('shiro:authorization:') > -1) {
                subTitle = null;
            } else if (key.indexOf('shiro:session:') > -1) {
                subTitle = '删除将会导致用户会话失效';
            } else {
                subTitle = '删除将会造成不可预计问题';
            }
            if (KTUtil.isNotBlank(subTitle)) {
                KTUtil.alertConfirm('删除key', subTitle + '，确定要删除吗？', function () {
                    _delKey(key);
                });
            } else {
                _delKey(key);
            }
        } else {
            KTTool.warnTip('删除失败', '请先选择要删除的key');
        }
    };
    /**
     * 根据key获取详细信息
     *
     * @param key {string} 键
     */
    var getDetails = function (key) {
        if (KTUtil.isNotBlank(key)) {
            resetDetails();
            KTUtil.ajax({
                wait: '.key-details',
                url: KTTool.getBaseUrl() + 'get/' + key,
                success: function (res) {
                    $('#key').val(res.data.key);
                    $('#expire').val(res.data.expire);
                    if (typeof res.data.value !== 'object') {
                        $('#value-json').addClass('kt-hide');
                        $('#value').removeClass('kt-hide').val(JSON.stringify(res.data.value));
                    } else {
                        $('#value').addClass('kt-hide');
                        $('#value-json').removeClass('kt-hide').JSONView(res.data);
                    }
                }
            });
        }
    };
    /**
     * 清空详情信息
     */
    var resetDetails = function () {
        $('#key, #expire, #value').val('');
        $('#value-json').addClass('kt-hide');
        $('#value').removeClass('kt-hide');
    };
    /**
     * 查询keys
     *
     * @param prefix 前缀
     */
    var getKeys = function (prefix) {
        KTUtil.ajax({
            wait: '.redis-keys',
            url: KTTool.getBaseUrl() + 'select/' + prefix,
            success: function (res) {
                keys = res.data;
                resetDetails();
                loadKeys(keys);
            }
        });
    };
    /**
     * 搜索keys
     */
    var selectKeys = function () {
        var _key = $('#query-key').val();
        var _keys = [];
        $(keys).each(function (index, key) {
            if (key.indexOf(_key) > -1) {
                _keys.push(key);
            }
        });
        loadKeys(_keys);
    };
    /**
     * 将结果解析到页面
     *
     * @param keys {array} 搜索结果
     */
    var loadKeys = function (keys) {
        if (KTUtil.isArray(keys)) {
            var $redisKeys = $('.redis-keys');
            $redisKeys.empty();
            if (keys.length > 0) {
                $(keys).each(function (index, key) {
                    $redisKeys.append('<li><a href="javascript:;" class="kt-list-search__result-item" data-key="' + key + '">\
                        <span class="kt-list-search__result-item-icon">\
                            <i class="la la-database kt--font-warning"></i>\
                        </span>\
                        <span class="kt-list-search__result-item-text">' + key + '</span>\
                    </a></li>');
                });
            } else {
                $redisKeys.html('<li><a href="javascript:;" class="kt-list-search__result-item">\
                        <span class="kt-list-search__result-item-text">暂无数据</span>\
                    </a></li>');
            }
        }
    };
    /**
     * 加载redis前缀
     */
    var initPrefix = function () {
        // 从字典获取
        var prefixes = sysDict.redisPrefix;
        if (KTUtil.isArray(prefixes)) {
            var $redisPrefixes = $('.redis-prefixes');
            $(prefixes).each(function (index, prefix) {
                $redisPrefixes.append('<li class="kt-nav__item">\
                       <a href="javascript:;" class="kt-nav__link" data-prefix="' + prefix.code + '">\
                           <i class="kt-nav__link-icon ' + (KTUtil.isNotBlank(prefix.icon) ? prefix.icon : 'la la-bars') + '"></i>\
                           <span class="kt-nav__link-text">' + prefix.name + '</span>\
                       </a>\
                   </li>');
            });
        }
    };
    /**
     * 绑定事件
     */
    var bind = function () {
        // 点击redis prefix 加载keys
        $('.redis-prefixes').on('click', 'a', function () {
            getKeys($(this).data('prefix'));
        });

        // 查询key
        $('#search-redis').click(function () {
            selectKeys();
        });

        $('.redis-keys').on('click', '.kt-list-search__result-item', function () {
            getDetails($(this).data('key'));
        });
        $('.btn-delete').click(function () {
            deleteKey();
        });
    };

    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/redis/');
            initPrefix();
            bind();
            var viewPort = KTUtil.getViewPort();
            KTUtil.scrollInit($('.redis-keys')[0], {height: viewPort.height - 270});
            KTUtil.scrollInit($('.redis-value')[0], {height: viewPort.height - 320});

        }
    };
}();

//== 初始化
$(document).ready(function () {
    mRedisView.init();
});