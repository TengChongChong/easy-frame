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
            mUtil.ajax({
                wait: '.m-portlet',
                url: mTool.getBaseUrl() + 'delete/' + key,
                success: function (res) {
                    resetDetails();
                    $('[data-key="' + key + '"]').remove();
                }
            });
        };
        var key = $('#key').val();
        if (mUtil.isNotBlank(key)) {
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
            if (mUtil.isNotBlank(subTitle)) {
                mUtil.alertConfirm('删除key', subTitle + '，确定要删除吗？', function () {
                    _delKey(key);
                });
            } else {
                _delKey(key);
            }
        } else {
            mTool.warnTip('删除失败', '请先选择要删除的key');
        }
    };
    /**
     * 根据key获取详细信息
     *
     * @param key {string} 键
     */
    var getDetails = function (key) {
        if (mUtil.isNotBlank(key)) {
            resetDetails();
            mUtil.ajax({
                wait: '.key-details',
                url: mTool.getBaseUrl() + 'get/' + key,
                success: function (res) {
                    $('#key').val(res.data.key);
                    $('#expire').val(res.data.expire);
                    if (typeof res.data.value !== 'object') {
                        $('#value-json').addClass('m--hide');
                        $('#value').removeClass('m--hide').val(JSON.stringify(res.data.value));
                    } else {
                        $('#value').addClass('m--hide');
                        $('#value-json').removeClass('m--hide').JSONView(res.data);
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
        $('#value-json').addClass('m--hide');
        $('#value').removeClass('m--hide');
    };
    /**
     * 查询keys
     *
     * @param prefix 前缀
     */
    var getKeys = function (prefix) {
        mUtil.ajax({
            wait: '.redis-keys',
            url: mTool.getBaseUrl() + 'select/' + prefix,
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
        if (mUtil.isArray(keys)) {
            var $redisKeys = $('.redis-keys');
            $redisKeys.empty();
            if (keys.length > 0) {
                $(keys).each(function (index, key) {
                    $redisKeys.append('<a href="javascript:;" class="m-list-search__result-item" data-key="' + key + '">\
                        <span class="m-list-search__result-item-icon">\
                            <i class="la la-database m--font-warning"></i>\
                        </span>\
                        <span class="m-list-search__result-item-text">' + key + '</span>\
                    </a>');
                });
            } else {
                $redisKeys.html('<a href="javascript:;" class="m-list-search__result-item">\
                        <span class="m-list-search__result-item-text">暂无数据</span>\
                    </a>');
            }
        }
    };
    /**
     * 加载redis前缀
     */
    var initPrefix = function () {
        // 从字典获取
        var prefixes = sysDict.redisPrefix;
        if (mUtil.isArray(prefixes)) {
            var $redisPrefixes = $('.redis-prefixes');
            $(prefixes).each(function (index, prefix) {
                $redisPrefixes.append('<li class="m-nav__item">\
                       <a href="javascript:;" class="m-nav__link" data-prefix="' + prefix.code + '">\
                           <i class="m-nav__link-icon ' + (mUtil.isNotBlank(prefix.icon) ? prefix.icon : 'la la-bars') + '"></i>\
                           <span class="m-nav__link-text">' + prefix.name + '</span>\
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

        $('.redis-keys').on('click', '.m-list-search__result-item', function () {
            getDetails($(this).data('key'));
        });
        $('.btn-delete').click(function () {
            deleteKey();
        });
    };

    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/sys/redis/');
            initPrefix();
            bind();
            var viewPort = mUtil.getViewPort();
            mUtil.scrollerInit($('.redis-keys')[0], {height: viewPort.height - 270});
            mUtil.scrollerInit($('.redis-value')[0], {height: viewPort.height - 320});

        }
    };
}();

//== 初始化
$(document).ready(function () {
    mRedisView.init();
});