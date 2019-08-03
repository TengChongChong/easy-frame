"use strict";

/**
 * UI 工具类
 */

var KTApp = function () {
    // 状态色
    var colors = {};
    /**
     * 全局动画设置
     * @type {{in: string, out: string}}
     */
    var animate = {
        // 出现动画
        in: 'fadeIn',
        // 消失动画
        out: 'fadeOut'
    };
    /**
     * 初始化 tooltips
     * @param el {object} 元素
     */
    var initTooltip = function (el) {
        var skin = el.data('skin') ? 'tooltip-' + el.data('skin') : '';
        var width = el.data('width') === 'auto' ? 'tooltop-auto-width' : '';
        var triggerValue = el.data('trigger') ? el.data('trigger') : 'hover';

        el.tooltip({
            trigger: triggerValue,
            template: '<div class="tooltip ' + skin + ' ' + width + '" role="tooltip">\
                <div class="arrow"></div>\
                <div class="tooltip-inner"></div>\
            </div>'
        });
    };
    /**
     * 初始化 tooltips
     */
    var initTooltips = function () {
        $('[data-toggle="kt-tooltip"], .kt-tooltip-auto').each(function () {
            initTooltip($(this));
        });
    };
    /**
     * 初始化 popover
     *
     * @param el {object} 元素
     */
    var initPopover = function (el) {
        var skin = el.data('skin') ? 'popover-' + el.data('skin') : '';
        var triggerValue = el.data('trigger') ? el.data('trigger') : 'hover';

        el.popover({
            trigger: triggerValue,
            template: '\
            <div class="popover ' + skin + '" role="tooltip">\
                <div class="arrow"></div>\
                <h3 class="popover-header"></h3>\
                <div class="popover-body"></div>\
            </div>'
        });
    };
    /**
     * 初始化 popover
     */
    var initPopovers = function () {
        $('[data-toggle="kt-popover"]').each(function () {
            initPopover($(this));
        });
    };
    /**
     * 初始化 portlet
     * @param el {object} 元素
     * @param options {object} 选项
     */
    var initPortlet = function (el, options) {
        new KTPortlet(el, options);
    };
    /**
     * 初始化 portlet
     */
    var initPortlets = function () {
        $('[data-ktportlet="true"]').each(function () {
            var $el = $(this);
            if ($el.data('data-kt-portlet-initialized') !== true) {
                initPortlet(this, {});
                $el.data('data-kt-portlet-initialized', true);
            }
        });
    };
    /**
     * 初始化滚动条
     */
    var initScroll = function () {
        $('[data-scroll="true"], .kt-scrollable').each(function () {
            var el = $(this);
            KTUtil.scrollInit(this, {
                mobileNativeScroll: true,
                handleWindowResize: true,
                rememberPosition: el.data('remember-position'),
                height: function () {
                    if (KTUtil.isInResponsiveRange('tablet-and-mobile') && el.data('mobile-height')) {
                        return el.data('mobile-height');
                    } else {
                        return el.data('height');
                    }
                }
            });
        });
    };
    /**
     * 初始化 alert
     */
    var initAlerts = function () {
        $('body').on('click', '[data-close=alert]', function () {
            $(this).closest('.alert').hide();
        });
    };
    /**
     * 初始化 sticky
     */
    var initSticky = function () {
        new Sticky('[data-sticky="true"]');
    };
    /**
     * 初始化 dropdown
     *
     * @param dropdown {object} 元素
     */
    var initAbsoluteDropdown = function (dropdown) {
        var dropdownMenu;

        if (!dropdown) {
            return;
        }

        dropdown.on('show.bs.dropdown', function (e) {
            dropdownMenu = $(e.target).find('.dropdown-menu');
            $('body').append(dropdownMenu.detach());
            dropdownMenu.css('display', 'block');
            dropdownMenu.position({
                'my': 'right top',
                'at': 'right bottom',
                'of': $(e.relatedTarget)
            });
        });

        dropdown.on('hide.bs.dropdown', function (e) {
            $(e.target).append(dropdownMenu.detach());
            dropdownMenu.hide();
        });
    };
    /**
     * 初始化 dropdown
     */
    var initAbsoluteDropdowns = function () {
        var $body = $('body');
        $body.on('show.bs.dropdown', function (e) {
            if ($(e.target).find("[data-attach='body']").length === 0) {
                return;
            }

            var dropdownMenu = $(e.target).find('.dropdown-menu');

            $('body').append(dropdownMenu.detach());
            dropdownMenu.css('display', 'block');
            dropdownMenu.position({
                'my': 'right top',
                'at': 'right bottom',
                'of': $(e.relatedTarget)
            });
        });

        $body.on('hide.bs.dropdown', function (e) {
            if ($(e.target).find("[data-attach='body']").length === 0) {
                return;
            }

            var dropdownMenu = $(e.target).find('.dropdown-menu');

            $(e.target).append(dropdownMenu.detach());
            dropdownMenu.hide();
        });
    };
    /**
     * 初始化标签页
     */
    var initTabs = function () {
        window.tabPage = new KTTabPage();
    };
    /**
     * 打开页面
     * @param name 页面名称
     * @param url 访问地址
     * @param canClose 是否可以关闭
     */
    var openPage = function (name, url, canClose) {
        if (top.location !== self.location && typeof tabPage === 'undefined') { // 有父页面,并且 tabPage is null
            parent.KTApp.openPage(name, url, canClose);
        } else {
            if (typeof tabPage !== 'undefined') {
                tabPage.addTab(name, url, canClose);
            } else {
                window.open(url);
            }
        }
    };
    /**
     * 关闭当前页面
     */
    var closeCurrentPage = function () {
        KTApp.closeTabByUrl(window.location.href);
    };
    /**
     * 关闭指定url页面
     * @param url 页面url
     */
    var closeTabByUrl = function (url) {
        if (top.location !== self.location && typeof tabPage === 'undefined') {
            // 有父页面,并且 tabPage is null
            parent.KTApp.closeTabByUrl(url);
        } else {
            if (typeof tabPage !== 'undefined') {
                tabPage.closeTabByUrl(url);
            } else {
                window.close();
            }
        }
    };
    /**
     * 初始化bootstrap select
     * @param selector {string} 选择器
     */
    var initSelectPicker = function (selector) {
        $(selector).each(function () {
            var $element = $(this);
            if (!$element.data('select-initialized')) {
                $element.attr('data-select-initialized', 'true');

                // 指定了字典类型
                if (typeof $element.data('dict-type') !== 'undefined') {
                    if($element.data('no-empty') !== true){
                        $element.append('<option value=""></option>');
                    }
                    initDictSelect($element);
                }
                // 指定了 data-url 属性,ajax请求接口获取下拉菜单
                if (typeof $element.data('url') !== 'undefined') {
                    if($element.data('no-empty') !== true){
                        $element.append('<option value=""></option>');
                    }
                    initSelectByUrl($element);
                }
                if (KTUtil.isNotBlank($element.data('value'))) {
                    $element.val($element.data('value'));
                }
                $element.selectpicker({
                    noneSelectedText: ''
                });
            }
        });
    };
    /**
     * 初始化checkbox字典
     *
     * @param selector {string} jquery选择器
     */
    var initCheckbox = function (selector) {
        initCheckBoxOrRadio($(selector), 'checkbox');
    };
    /**
     * 初始化radio字典
     *
     * @param selector {string} jquery选择器
     */
    var initRadio = function (selector) {
        initCheckBoxOrRadio($(selector), 'radio');
    };
    /**
     * 初始化checkbox/radio字典
     *
     * @param $elements {object} jquery元素
     * @param type {string} 类型
     */
    var initCheckBoxOrRadio = function ($elements, type) {
        var defaultChecked = function (value, code) {
            if (KTUtil.isNumber(value)) {
                try {
                    code = Number(code);
                } catch (e) {
                }
                if (value === code) {
                    return 'checked';
                }
            } else {
                if (KTUtil.isNotBlank(value)) {
                    var values = value.split(',');
                    if (values.indexOf(code) > -1) {
                        return 'checked';
                    }
                }
            }
            return '';
        };
        if ($elements != null && $elements.length > 0) {
            $($elements).each(function (index, element) {
                var $element = $(element);
                // 检查是否初始化过
                if (!$element.data(type + '-initialized')) {
                    $element.attr('data-' + type + '-initialized', 'true');
                    // 字典类型
                    var dictType = $element.data('dict-type');
                    if (KTUtil.isNotBlank(dictType)) {
                        // 方向
                        var direction = $element.data('direction');
                        var containerClass = 'kt-' + type + '-inline';
                        if ('vertical' === direction) {
                            containerClass = 'kt-' + type + '-list';
                        }
                        var dicts = KTTool.getSysDictArray(dictType);
                        if (dicts != null && dicts.length > 0) {
                            var value = $element.data('value');
                            var name = $element.data('name');
                            var required = $element.data('required');
                            var html = '<div class="' + containerClass + '">';
                            $(dicts).each(function (index, dict) {
                                html += '<label class="kt-' + type + '">\
                                        <input name="' + name + '" value="' + dict.code + '" type="' + type + '" ' +
                                    defaultChecked(value, dict.code) + ' ' + (required ? 'required' : '') + '> ' + dict.name + '\
                                        <span></span>\
                                    </label>';
                            });
                            html += '</div>';
                            $element.html(html);
                        }
                    }
                }
            });
        }
    };
    /**
     * 初始化日期插件
     *
     * @param selector {string} 选择器
     */
    var initDatePicker = function (selector) {
        /**
         * 获取默认视图
         * 0-分 1-时 2-日 3-月 4-年
         * @param format {string} 日期格式
         * @return {number}
         */
        function getStartView(format) {
            if (format === 'yyyy') {
                return 4;
            } else if (format.length === 'yyyy-mm'.length) {
                return 3;
            } else if (format.length === 'hh:ii'.length) {
                return 1;
            } else {
                return 2;
            }
        }

        /**
         * 获取最小视图
         * 0-分 1-时 2-日 3-月 4-年
         * @param format {string} 日期格式
         * @return {number}
         */
        function getMinView(format) {
            if (format === 'yyyy') {
                return 4;
            } else if (format.length === 'yyyy-mm'.length) {
                return 3;
            } else if (format.length === 'yyyy-mm-dd'.length) {
                return 2;
            } else {
                return 0;
            }
        }

        $(selector).each(function () {
            var $element = $(this);
            var config = {
                language: 'zh-CN',
                todayHighlight: true,
                autoclose: true,
                pickerPosition: $element.data('position'),
                format: $element.data('format'),
                todayBtn: $element.data('today-btn'),
                startView: $element.data('start-view'),
                minView: $element.data('min-view')
            };
            if (KTUtil.isBlank(config.pickerPosition)) {
                config.pickerPosition = 'bottom-right';
            }
            if (KTUtil.isBlank(config.format)) {
                config.format = 'yyyy-mm-dd';
            }
            if (typeof config.todayBtn === 'undefined') {
                config.todayBtn = false;
            }
            if (typeof config.startView === 'undefined') {
                config.startView = getStartView(config.format);
            }
            if (typeof config.minView === 'undefined') {
                config.minView = getMinView(config.format);
            }
            $element.datetimepicker(config);
        });
    };
    /**
     * 根据字典类型加载select > option
     *
     * @param $element {object} select对象
     */
    var initDictSelect = function ($element) {
        var dictType = $element.data('dict-type');
        var dicts = KTTool.getSysDictArray(dictType);
        if (dicts != null && dicts.length > 0) {
            $(dicts).each(function (index, dict) {
                $element.append('<option value="' + dict.code + '">' + dict.name + '</option>');
            });
        }
    };
    /**
     * 根据 data-url 加载select > option
     *
     * @param $element {object}
     */
    var initSelectByUrl = function ($element) {
        KTUtil.ajax({
            url: $element.data('url'),
            fail: function (res) {
                console.error(res.message);
                $element.selectpicker();
            },
            success: function (res) {
                if (typeof res.data !== 'undefined' && res.data.length > 0) {
                    $(res.data).each(function (index, obj) {
                        $element.append('<option value="' + obj.value + '">' + obj.text + '</option>');
                    });
                }
                if (KTUtil.isNotBlank($element.data('value'))) {
                    $element.val($element.data('value'));
                }
                $element.selectpicker();
            }
        });
    };
    /**
     * animate.css 工具
     *
     * @param selector {string} 展示动画的元素选择器
     * @param animationName {string} 动画名称
     * @param callback {function} 回调函数
     */
    var animateCSS = function (selector, animationName, callback) {
        var node = document.querySelector(selector);
        node.classList.add('animated', animationName);

        function handleAnimationEnd() {
            node.classList.remove('animated', animationName);
            node.removeEventListener('animationend', handleAnimationEnd);

            if (KTUtil.isFunction(callback)) {
                callback();
            }
        }

        node.addEventListener('animationend', handleAnimationEnd);
    };
    /**
     * 初始化文件上传
     *
     * @param options 参数
     */
    var initDropzone = function (options) {
        var _defaultOptions = {
            url: basePath + '/auth/upload',
            paramName: "file",
            maxFiles: 1,
            maxFilesize: 10, // MB
            addRemoveLinks: true,
            dictDefaultMessage: Dropzone.dictDefaultMessage,
            dictFallbackMessage: Dropzone.dictFallbackMessage,
            dictFallbackText: Dropzone.dictFallbackText,
            dictFileTooBig: Dropzone.dictFileTooBig,
            dictInvalidFileType: Dropzone.dictInvalidFileType,
            dictResponseError: Dropzone.dictResponseError,
            dictCancelUpload: Dropzone.dictCancelUpload,
            dictUploadCanceled: Dropzone.dictUploadCanceled,
            dictCancelUploadConfirmation: Dropzone.dictCancelUploadConfirmation,
            dictRemoveFile: Dropzone.dictRemoveFile,
            dictMaxFilesExceeded: Dropzone.dictMaxFilesExceeded
        };
        var option = $.extend(true, {}, _defaultOptions, options);
        if (KTUtil.isFunction(options.success)) {
            option.success = function (file) {
                options.success($.parseJSON(file.xhr.response), file);
                if (file.previewElement) {
                    return file.previewElement.classList.add("dz-success");
                }
            }
        }
        if (KTUtil.isFunction(options.complete)) {
            option.complete = function (file) {
                options.complete($.parseJSON(file.xhr.response), file);
                if (file._removeLink) {
                    file._removeLink.innerHTML = this.options.dictRemoveFile;
                }
                if (file.previewElement) {
                    return file.previewElement.classList.add("dz-complete");
                }
            }
        }
        return new Dropzone(option.selector, option);
    };

    return {
        /**
         * 初始化
         *
         * @param options {object} 配置
         */
        init: function (options) {
            if (options && options.colors) {
                colors = options.colors;
            }

            KTApp.initComponents();
        },
        /**
         * 初始化插件
         */
        initComponents: function () {
            initScroll();
            initTooltips();
            initPopovers();
            initAlerts();
            initPortlets();
            initSticky();
            initAbsoluteDropdowns();
            initSelectPicker('.select-picker');
            initCheckbox('.checkbox-dict');
            initRadio('.radio-dict');
            initDatePicker('.date-picker');
        },
        /**
         * 初始化radio
         */
        initRadio: function () {
            initRadio('.radio-dict');
        },
        /**
         * 初始化checkbox
         */
        initCheckbox: function () {
            initCheckbox('.checkbox-dict');
        },
        /**
         * 初始化tooltips
         */
        initTooltips: function () {
            initTooltips();
        },
        /**
         * 初始化tooltip
         *
         * @param el {object} 要初始化的元素
         */
        initTooltip: function (el) {
            initTooltip(el);
        },
        /**
         * 初始化popovers
         */
        initPopovers: function () {
            initPopovers();
        },
        /**
         * 初始化popover
         *
         * @param el {object} 要初始化的元素
         */
        initPopover: function (el) {
            initPopover(el);
        },
        /**
         * 初始化portlets
         */
        initPortlets: function () {
            initPortlets();
        },
        /**
         * 初始化portlet
         *
         * @param el {object} 要初始化的元素
         * @param options {object} 设置
         */
        initPortlet: function (el, options) {
            initPortlet(el, options);
        },
        /**
         * 初始化sticky
         */
        initSticky: function () {
            initSticky();
        },
        /**
         * 初始化AbsoluteDropdown
         *
         * @param dropdown {object} 要初始化的元素
         */
        initAbsoluteDropdown: function (dropdown) {
            initAbsoluteDropdown(dropdown);
        },

        /**
         * 显示加载提示
         *
         * @param target {string} 选择器
         * @param options {object} 选项
         */
        block: function (target, options) {
            var el = $(target);

            options = $.extend(true, {
                opacity: 0.2,
                overlayColor: '#fff',
                type: 'loader',
                state: 'success',
                size: '',
                centerX: true,
                centerY: true,
                message: '',
                shadow: true,
                width: 'auto'
            }, options);

            var html;
            var version = options.type ? 'kt-spinner--' + options.type : '';
            var state = options.state ? 'kt-spinner--' + options.state : '';
            var size = options.size ? 'kt-spinner--' + options.size : '';
            var spinner = '<div class="kt-spinner ' + version + ' ' + state + ' ' + size + '"></div';

            if (options.message && options.message.length > 0) {
                var classes = 'blockui ' + (options.shadow === false ? 'blockui' : '');

                html = '<div class="' + classes + '"><span>' + options.message + '</span><span>' + spinner + '</span></div>';

                var el = document.createElement('div');
                KTUtil.get('body').prepend(el);
                KTUtil.addClass(el, classes);
                el.innerHTML = '<span>' + options.message + '</span><span>' + spinner + '</span>';
                options.width = KTUtil.actualWidth(el) + 10;
                KTUtil.remove(el);

                if (target === 'body') {
                    html = '<div class="' + classes + '" style="margin-left:-' + (options.width / 2) + 'px;"><span>' + options.message + '</span><span>' + spinner + '</span></div>';
                }
            } else {
                html = spinner;
            }

            var params = {
                message: html,
                centerY: options.centerY,
                centerX: options.centerX,
                css: {
                    top: '30%',
                    left: '50%',
                    border: '0',
                    padding: '0',
                    backgroundColor: 'none',
                    width: options.width
                },
                overlayCSS: {
                    backgroundColor: options.overlayColor,
                    opacity: options.opacity,
                    cursor: 'wait',
                    zIndex: '10'
                },
                onUnblock: function () {
                    if (el && el[0]) {
                        KTUtil.css(el[0], 'position', '');
                        KTUtil.css(el[0], 'zoom', '');
                    }
                }
            };

            if (target === 'body') {
                params.css.top = '50%';
                $.blockUI(params);
            } else {
                var el = $(target);
                el.block(params);
            }
        },
        /**
         * 隐藏加载提示
         *
         * @param target {string} 选择器
         */
        unblock: function (target) {
            if (target && target !== 'body') {
                $(target).unblock();
            } else {
                $.unblockUI();
            }
        },
        /**
         * 显示页面级别加载提示
         *
         * @param options {object}
         */
        blockPage: function (options) {
            if (options == null) {
                options = {
                    message: '页面加载中，请稍候...'
                }
            }
            KTApp.block('body', options);
        },
        /**
         * 隐藏页面级别加载提示
         */
        too: function () {
            return KTApp.unblock('body');
        },
        /**
         * 在按钮上面显示加载中图标
         *
         * @param target {string|object} 选择器
         * @param options {object} 选项
         */
        progress: function (target, options) {
            var skin = (options && options.skin) ? options.skin : 'light';
            var alignment = (options && options.alignment) ? options.alignment : 'right';
            var size = (options && options.size) ? 'kt-spinner--' + options.size : '';
            var classes = 'kt-spinner ' + 'kt-spinner--' + skin + ' kt-spinner--' + alignment + ' kt-spinner--' + size;

            KTApp.unprogress(target);
            var $btns = $(target);
            $btns.attr('disabled', 'disabled').addClass(classes).data('progress-classes', classes);
        },
        /**
         * 隐藏按钮上面显示加载中图标
         * @param target {string} 选择器
         */
        unprogress: function (target) {
            $(target).removeAttr('disabled').removeClass($(target).data('progress-classes'));
        },
        /**
         * 根据状态名称获取颜色
         *
         * @param name {string} 状态名称
         * @return {string} 颜色
         */
        getStateColor: function (name) {
            return colors["state"][name];
        },
        /**
         * 获取base color
         *
         * @param type {string} 类型
         * @param level {number} 级别
         * @return {string} 颜色
         */
        getBaseColor: function (type, level) {
            return colors["base"][type][level - 1];
        },
        /**
         * 初始化标签页
         */
        initTabs: function () {
            initTabs();
        },
        /**
         * 打开页面
         * @param name 页面名称
         * @param url 访问地址
         * @param canClose 是否可以关闭
         */
        openPage: function (name, url, canClose) {
            openPage(name, url, canClose);
        },
        /**
         * 关闭当前页面
         */
        closeCurrentPage: function () {
            closeCurrentPage();
        },
        /**
         * 关闭指定url页面
         * @param url {string} 页面url
         */
        closeTabByUrl: function (url) {
            closeTabByUrl(url);
        },
        /**
         * 根据操作获取动画class
         * @param {string} name in/out
         * @returns {string} class
         */
        getAnimate: function (name) {
            return animate[name];
        },
        /**
         * 初始化bootstrap select
         * @param selector {string} 选择器
         */
        initSelectPicker: function (selector) {
            return initSelectPicker(selector);
        },
        /**
         * 初始化日期插件
         *
         * @param selector {string} 选择器
         */
        initDatePicker: function (selector) {
            initDatePicker(selector);
        },
        /**
         * 初始化文件上传
         *
         * @param options 参数
         */
        initDropzone: function (options) {
            return initDropzone(options);
        },
        /**
         * animate.css 工具
         *
         * @param selector {string} 展示动画的元素选择器
         * @param animationName {string} 动画名称
         * @param callback {function} 回调函数
         */
        animateCSS: function (selector, animationName, callback) {
            animateCSS(selector, animationName, callback);
        }
    };
}();

//== 页面加载完毕初始化App
$(document).ready(function () {
    KTApp.init(appOptions);
});
"use strict";
/**
 * @class KTUtil  工具类
 */
this.Element && function(ElementPrototype) {
    ElementPrototype.matches = ElementPrototype.matches ||
        ElementPrototype.matchesSelector ||
        ElementPrototype.webkitMatchesSelector ||
        ElementPrototype.msMatchesSelector ||
        function(selector) {
            var node = this,
                nodes = (node.parentNode || node.document).querySelectorAll(selector),
                i = -1;
            while (nodes[++i] && nodes[i] != node);
            return !!nodes[i];
        }
}(Element.prototype);

// closest polyfill
this.Element && function(ElementPrototype) {
    ElementPrototype.closest = ElementPrototype.closest ||
        function(selector) {
            var el = this;
            while (el.matches && !el.matches(selector)) el = el.parentNode;
            return el.matches ? el : null;
        }
}(Element.prototype);

// remove polyfill
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

// matches polyfill
this.Element && function(ElementPrototype) {
    ElementPrototype.matches = ElementPrototype.matches ||
        ElementPrototype.matchesSelector ||
        ElementPrototype.webkitMatchesSelector ||
        ElementPrototype.msMatchesSelector ||
        function(selector) {
            var node = this,
                nodes = (node.parentNode || node.document).querySelectorAll(selector),
                i = -1;
            while (nodes[++i] && nodes[i] != node);
            return !!nodes[i];
        }
}(Element.prototype);

(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

(function(arr) {
    arr.forEach(function(item) {
        if (item.hasOwnProperty('prepend')) {
            return;
        }
        Object.defineProperty(item, 'prepend', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function prepend() {
                var argArr = Array.prototype.slice.call(arguments),
                    docFrag = document.createDocumentFragment();

                argArr.forEach(function(argItem) {
                    var isNode = argItem instanceof Node;
                    docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                });

                this.insertBefore(docFrag, this.firstChild);
            }
        });
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

// 全局变量
window.KTUtilElementDataStore = {};
window.KTUtilElementDataStoreID = 0;
window.KTUtilDelegatedEventHandlers = {};

var KTUtil = function() {

    var resizeHandlers = [];

    /**
     * 响应式配置
     */
    var breakpoints = {
        sm: 544, // Small screen / phone           
        md: 768, // Medium screen / tablet            
        lg: 1024, // Large screen / desktop        
        xl: 1200, // Extra large screen / wide desktop
        xxl: 1400, // Extra large screen / wide desktop
        xxxl: 1600 // Extra large screen / wide desktop
    };

    /**
     * 处理窗口大小调整事件
     * 完成调整大小后延迟附加事件处理程序
     */
    var _windowResizeHandler = function() {
        var _runResizeHandlers = function() {
            // reinitialize other subscribed elements
            for (var i = 0; i < resizeHandlers.length; i++) {
                var each = resizeHandlers[i];
                each.call();
            }
        };

        var timeout = false; // timeout
        var delay = 250; // 延迟时间

        window.addEventListener('resize', function() {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                _runResizeHandlers();
            }, delay);
        });
    };

    return {
        /**
         * 初始化
         */
        init: function(options) {
            if (options && options.breakpoints) {
                // 指定了响应式配置
                breakpoints = options.breakpoints;
            }

            _windowResizeHandler();
        },

        /**
         * 添加窗口大小调整事件处理
         * @param callback {function} 回调函数
         */
        addResizeHandler: function(callback) {
            resizeHandlers.push(callback);
        },

        /**
         * 移除窗口大小调整事件处理
         * @param callback {function} 回调函数
         */
        removeResizeHandler: function(callback) {
            for (var i = 0; i < resizeHandlers.length; i++) {
                if (callback === resizeHandlers[i]) {
                    delete resizeHandlers[i];
                }
            }
        },

        /**
         * 触发窗口大小调整事件
         */
        runResizeHandlers: function() {
            _runResizeHandlers();
        },

        resize: function() {
            if (typeof(Event) === 'function') {
                window.dispatchEvent(new Event('resize'));
            } else {
                // IE 或其他老版本浏览器
                var evt = window.document.createEvent('UIEvents');
                evt.initUIEvent('resize', true, false, window, 0); 
                window.dispatchEvent(evt);
            }
        },

        /**
         * 从url中获取参数
         *
         * @param {string} paramName 参数名
         * @returns {string|null}
         */
        getURLParam: function(paramName) {
            var searchString = window.location.search.substring(1),
                i, val, params = searchString.split("&");

            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] === paramName) {
                    return unescape(val[1]);
                }
            }

            return null;
        },

        /**
         * 根据窗口判断是否属于触摸设备(宽度小于lg)
         *
         * @returns {boolean}
         */
        isMobileDevice: function() {
            return this.getViewPort().width < this.getBreakpoint('lg');
        },

        /**
         * 根据窗口判断是否属于电脑(宽度大于lg)
         *
         * @returns {boolean}
         */
        isDesktopDevice: function() {
            return !KTUtil.isMobileDevice();
        },

        /**
         * 获取浏览器窗口大小
         *
         * @returns {object}
         */
        getViewPort: function() {
            var e = window,
                a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }

            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        },

        /**
         * 检查当前窗口是否为指定模式
         *
         * @param {string} mode 窗口模式(e.g: desktop, desktop-and-tablet, tablet, tablet-and-mobile, mobile)
         * @returns {boolean}  
         */
        isInResponsiveRange: function(mode) {
            var breakpoint = this.getViewPort().width;

            if (mode === 'general') {
                return true;
            } else if (mode === 'desktop' && breakpoint >= (this.getBreakpoint('lg') + 1)) {
                return true;
            } else if (mode === 'tablet' && (breakpoint >= (this.getBreakpoint('md') + 1) && breakpoint < this.getBreakpoint('lg'))) {
                return true;
            } else if (mode === 'mobile' && breakpoint <= this.getBreakpoint('md')) {
                return true;
            } else if (mode === 'desktop-and-tablet' && breakpoint >= (this.getBreakpoint('md') + 1)) {
                return true;
            } else if (mode === 'tablet-and-mobile' && breakpoint <= this.getBreakpoint('lg')) {
                return true;
            } else if (mode === 'minimal-desktop-and-below' && breakpoint <= this.getBreakpoint('xl')) {
                return true;
            } else if (mode === 'big-screen' && breakpoint <= this.getBreakpoint('xxl')) {
                return true;
            } else if (mode === 'super-screen' && breakpoint <= this.getBreakpoint('xxxl')) {
                return true;
            }

            return false;
        },

        /**
         * 生成一个指定前缀的 unique ID
         *
         * @param {string} prefix {string} 前缀
         * @returns {string}
         */
        getUniqueID: function(prefix) {
            return prefix + Math.floor(Math.random() * (new Date()).getTime());
        },

        /**
         * 根据模式获取尺寸
         *
         * @param {string} 响应式模式前缀 (e.g: xl, lg, md, sm)
         * @returns {number}  
         */
        getBreakpoint: function(mode) {
            return breakpoints[mode];
        },

        /**
         * 检查对象是否具有与给定键路径匹配的属性
         *
         * @param {object} obj 要检查的变量
         * @param {string} keys 路径
         * @returns {object}  
         */
        isset: function(obj, keys) {
            var stone;

            keys = keys || '';

            if (keys.indexOf('[') !== -1) {
                throw new Error('Unsupported object path notation.');
            }

            keys = keys.split('.');

            do {
                if (obj === undefined) {
                    return false;
                }

                stone = keys.shift();

                if (!obj.hasOwnProperty(stone)) {
                    return false;
                }

                obj = obj[stone];

            } while (keys.length);

            return true;
        },

        /**
         * 获取父级最高z-index
         * @param {object} el 元素
         * @returns {number|null}
         */
        getHighestZindex: function(el) {
            var elem = KTUtil.get(el),
                position, value;

            while (elem && elem !== document) {
                position = KTUtil.css(elem, 'position');

                if (position === "absolute" || position === "relative" || position === "fixed") {
                    value = parseInt(KTUtil.css(elem, 'z-index'));

                    if (!isNaN(value) && value !== 0) {
                        return value;
                    }
                }

                elem = elem.parentNode;
            }

            return null;
        },

        /**
         * 检查父级是否有fixed定位
         *
         * @param {object} el 元素
         * @returns {boolean}  
         */
        hasFixedPositionedParent: function(el) {
            while (el && el !== document) {
                var position = KTUtil.css(el, 'position');

                if (position === 'fixed') {
                    return true;
                }

                el = el.parentNode;
            }

            return false;
        },

        /**
         * 获取指定的最小和最大范围内随机生成的整数值
         *
         * @param {number} min 最小
         * @param {number} max 最大
         * @returns {number}
         */
        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        // jQuery Workarounds

        // Deep extend:  $.extend(true, {}, objA, objB);
        deepExtend: function(out) {
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                var obj = arguments[i];

                if (!obj)
                    continue;

                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object')
                            out[key] = KTUtil.deepExtend(out[key], obj[key]);
                        else
                            out[key] = obj[key];
                    }
                }
            }

            return out;
        },

        // extend:  $.extend({}, objA, objB); 
        extend: function(out) {
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                if (!arguments[i])
                    continue;

                for (var key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key))
                        out[key] = arguments[i][key];
                }
            }

            return out;
        },

        get: function(query) {
            var el;

            if (query === document) {
                return document;
            }

            if (!!(query && query.nodeType === 1)) {
                return query;
            }

            if (el = document.getElementById(query)) {
                return el;
            } else if (el = document.getElementsByTagName(query)) {
                return el[0];
            } else if (el = document.getElementsByClassName(query)) {
                return el[0];
            } else {
                return null;
            }
        },

        getByID: function(query) {
            if (!!(query && query.nodeType === 1)) {
                return query;
            }

            return document.getElementById(query);
        },

        getByTag: function(query) {
            var el;
            
            if (el = document.getElementsByTagName(query)) {
                return el[0];
            } else {
                return null;
            }
        },

        getByClass: function(query) {
            var el;
            
            if (el = document.getElementsByClassName(query)) {
                return el[0];
            } else {
                return null;
            }
        },

        /**
         * Checks whether the element has given classes
         * @param {object} el jQuery element object
         * @param {string} Classes string
         * @returns {boolean}  
         */
        hasClasses: function(el, classes) {
            if (!el) {
                return;
            }

            var classesArr = classes.split(" ");

            for (var i = 0; i < classesArr.length; i++) {
                if (KTUtil.hasClass(el, KTUtil.trim(classesArr[i])) == false) {
                    return false;
                }
            }

            return true;
        },

        hasClass: function(el, className) {
            if (!el) {
                return;
            }

            return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
        },

        addClass: function(el, className) {
            if (!el || typeof className === 'undefined') {
                return;
            }

            var classNames = className.split(' ');

            if (el.classList) {
                for (var i = 0; i < classNames.length; i++) {
                    if (classNames[i] && classNames[i].length > 0) {
                        el.classList.add(KTUtil.trim(classNames[i]));
                    }
                }
            } else if (!KTUtil.hasClass(el, className)) {
                for (var i = 0; i < classNames.length; i++) {
                    el.className += ' ' + KTUtil.trim(classNames[i]);
                }
            }
        },

        removeClass: function(el, className) {
          if (!el || typeof className === 'undefined') {
                return;
            }

            var classNames = className.split(' ');

            if (el.classList) {
                for (var i = 0; i < classNames.length; i++) {
                    el.classList.remove(KTUtil.trim(classNames[i]));
                }
            } else if (KTUtil.hasClass(el, className)) {
                for (var i = 0; i < classNames.length; i++) {
                    el.className = el.className.replace(new RegExp('\\b' + KTUtil.trim(classNames[i]) + '\\b', 'g'), '');
                }
            }
        },

        triggerCustomEvent: function(el, eventName, data) {
            if (window.CustomEvent) {
                var event = new CustomEvent(eventName, {
                    detail: data
                });
            } else {
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent(eventName, true, true, data);
            }

            el.dispatchEvent(event);
        },

        triggerEvent: function(node, eventName) {
            // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
            var doc;
            if (node.ownerDocument) {
                doc = node.ownerDocument;
            } else if (node.nodeType == 9) {
                // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
                doc = node;
            } else {
                throw new Error("Invalid node passed to fireEvent: " + node.id);
            }

            if (node.dispatchEvent) {
                // Gecko-style approach (now the standard) takes more work
                var eventClass = "";

                // Different events have different event classes.
                // If this switch statement can't map an eventName to an eventClass,
                // the event firing is going to fail.
                switch (eventName) {
                case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
                case "mouseenter":
                case "mouseleave":
                case "mousedown":
                case "mouseup":
                    eventClass = "MouseEvents";
                    break;

                case "focus":
                case "change":
                case "blur":
                case "select":
                    eventClass = "HTMLEvents";
                    break;

                default:
                    throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                    break;
                }
                var event = doc.createEvent(eventClass);

                var bubbles = eventName == "change" ? false : true;
                event.initEvent(eventName, bubbles, true); // All events created as bubbling and cancelable.

                event.synthetic = true; // allow detection of synthetic events
                // The second parameter says go ahead with the default action
                node.dispatchEvent(event, true);
            } else if (node.fireEvent) {
                // IE-old school style
                var event = doc.createEventObject();
                event.synthetic = true; // allow detection of synthetic events
                node.fireEvent("on" + eventName, event);
            }
        },

        index: function( elm ){ 
            elm = KTUtil.get(elm);
            var c = elm.parentNode.children, i = 0;
            for(; i < c.length; i++ )
                if( c[i] == elm ) return i;
        },

        trim: function(string) {
            return string.trim();
        },

        eventTriggered: function(e) {
            if (e.currentTarget.dataset.triggered) {
                return true;
            } else {
                e.currentTarget.dataset.triggered = true;

                return false;
            }
        },

        remove: function(el) {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        },

        find: function(parent, query) {
            parent = KTUtil.get(parent);
            if (parent) {
                return parent.querySelector(query);
            }            
        },

        findAll: function(parent, query) {
            parent = KTUtil.get(parent);
            if (parent) {
                return parent.querySelectorAll(query);
            } 
        },

        insertAfter: function(el, referenceNode) {
            return referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
        },

        parents: function(elem, selector) {
            // Element.matches() polyfill
            if (!Element.prototype.matches) {
                Element.prototype.matches =
                    Element.prototype.matchesSelector ||
                    Element.prototype.mozMatchesSelector ||
                    Element.prototype.msMatchesSelector ||
                    Element.prototype.oMatchesSelector ||
                    Element.prototype.webkitMatchesSelector ||
                    function(s) {
                        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                            i = matches.length;
                        while (--i >= 0 && matches.item(i) !== this) {}
                        return i > -1;
                    };
            }

            // Set up a parent array
            var parents = [];

            // Push each parent element to the array
            for ( ; elem && elem !== document; elem = elem.parentNode ) {
                if (selector) {
                    if (elem.matches(selector)) {
                        parents.push(elem);
                    }
                    continue;
                }
                parents.push(elem);
            }

            // Return our parent array
            return parents;
        },

        children: function(el, selector, log) {
            if (!el || !el.childNodes) {
                return;
            }

            var result = [],
                i = 0,
                l = el.childNodes.length;

            for (var i; i < l; ++i) {
                if (el.childNodes[i].nodeType == 1 && KTUtil.matches(el.childNodes[i], selector, log)) {
                    result.push(el.childNodes[i]);
                }
            }

            return result;
        },

        child: function(el, selector, log) {
            var children = KTUtil.children(el, selector, log);

            return children ? children[0] : null;
        },

        matches: function(el, selector, log) {
            var p = Element.prototype;
            var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
                return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
            };

            if (el && el.tagName) {
                return f.call(el, selector);
            } else {
                return false;
            }
        },

        data: function(element) {
            element = KTUtil.get(element);

            return {
                set: function(name, data) {
                    if (element === undefined) {
                        return;
                    }

                    if (element.customDataTag === undefined) {
                        KTUtilElementDataStoreID++;
                        element.customDataTag = KTUtilElementDataStoreID;
                    }

                    if (KTUtilElementDataStore[element.customDataTag] === undefined) {
                        KTUtilElementDataStore[element.customDataTag] = {};
                    }

                    KTUtilElementDataStore[element.customDataTag][name] = data;
                },

                get: function(name) {
                    if (element === undefined) {
                        return;
                    }

                    if (element.customDataTag === undefined) { 
                        return null;
                    }

                    return this.has(name) ? KTUtilElementDataStore[element.customDataTag][name] : null;
                },

                has: function(name) {
                    if (element === undefined) {
                        return false;
                    }
                    
                    if (element.customDataTag === undefined) { 
                        return false;
                    }

                    return (KTUtilElementDataStore[element.customDataTag] && KTUtilElementDataStore[element.customDataTag][name]) ? true : false;
                },

                remove: function(name) {
                    if (element && this.has(name)) {
                        delete KTUtilElementDataStore[element.customDataTag][name];
                    }
                }
            };
        },

        outerWidth: function(el, margin) {
            var width;

            if (margin === true) {
                var width = parseFloat(el.offsetWidth);
                width += parseFloat(KTUtil.css(el, 'margin-left')) + parseFloat(KTUtil.css(el, 'margin-right'));

                return parseFloat(width);
            } else {
                var width = parseFloat(el.offsetWidth);

                return width;
            }
        },

        offset: function(elem) {
            var rect, win;
            elem = KTUtil.get(elem);

            if ( !elem ) {
                return;
            }

            // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
            // Support: IE <=11 only
            // Running getBoundingClientRect on a
            // disconnected node in IE throws an error

            if ( !elem.getClientRects().length ) {
                return { top: 0, left: 0 };
            }

            // Get document-relative position by adding viewport scroll to viewport-relative gBCR
            rect = elem.getBoundingClientRect();
            win = elem.ownerDocument.defaultView;

            return {
                top: rect.top + win.pageYOffset,
                left: rect.left + win.pageXOffset
            };
        },

        height: function(el) {
            return KTUtil.css(el, 'height');
        },

        visible: function(el) {
            return !(el.offsetWidth === 0 && el.offsetHeight === 0);
        },

        attr: function(el, name, value) {
            el = KTUtil.get(el);

            if (el == undefined) {
                return;
            }

            if (value !== undefined) {
                el.setAttribute(name, value);
            } else {
                return el.getAttribute(name);
            }
        },

        hasAttr: function(el, name) {
            el = KTUtil.get(el);

            if (el == undefined) {
                return;
            }

            return el.getAttribute(name) ? true : false;
        },

        removeAttr: function(el, name) {
            el = KTUtil.get(el);

            if (el == undefined) {
                return;
            }

            el.removeAttribute(name);
        },

        animate: function(from, to, duration, update, easing, done) {
            /**
             * TinyAnimate.easings
             *  Adapted from jQuery Easing
             */
            var easings = {};
            var easing;

            easings.linear = function(t, b, c, d) {
                return c * t / d + b;
            };

            easing = easings.linear;

            // Early bail out if called incorrectly
            if (typeof from !== 'number' ||
                typeof to !== 'number' ||
                typeof duration !== 'number' ||
                typeof update !== 'function') {
                return;
            }

            // Create mock done() function if necessary
            if (typeof done !== 'function') {
                done = function() {};
            }

            // Pick implementation (requestAnimationFrame | setTimeout)
            var rAF = window.requestAnimationFrame || function(callback) {
                window.setTimeout(callback, 1000 / 50);
            };

            // Animation loop
            var canceled = false;
            var change = to - from;

            function loop(timestamp) {
                var time = (timestamp || +new Date()) - start;

                if (time >= 0) {
                    update(easing(time, from, change, duration));
                }
                if (time >= 0 && time >= duration) {
                    update(to);
                    done();
                } else {
                    rAF(loop);
                }
            }

            update(from);

            // Start animation loop
            var start = window.performance && window.performance.now ? window.performance.now() : +new Date();

            rAF(loop);
        },

        actualCss: function(el, prop, cache) {
            el = KTUtil.get(el);
            var css = '';
            
            if (el instanceof HTMLElement === false) {
                return;
            }

            if (!el.getAttribute('kt-hidden-' + prop) || cache === false) {
                var value;

                // the element is hidden so:
                // making the el block so we can meassure its height but still be hidden
                css = el.style.cssText;
                el.style.cssText = 'position: absolute; visibility: hidden; display: block;';

                if (prop == 'width') {
                    value = el.offsetWidth;
                } else if (prop == 'height') {
                    value = el.offsetHeight;
                }

                el.style.cssText = css;

                // store it in cache
                el.setAttribute('kt-hidden-' + prop, value);

                return parseFloat(value);
            } else {
                // store it in cache
                return parseFloat(el.getAttribute('kt-hidden-' + prop));
            }
        },

        actualHeight: function(el, cache) {
            return KTUtil.actualCss(el, 'height', cache);
        },

        actualWidth: function(el, cache) {
            return KTUtil.actualCss(el, 'width', cache);
        },

        getScroll: function(element, method) {
            // The passed in `method` value should be 'Top' or 'Left'
            method = 'scroll' + method;
            return (element == window || element == document) ? (
                self[(method == 'scrollTop') ? 'pageYOffset' : 'pageXOffset'] ||
                (browserSupportsBoxModel && document.documentElement[method]) ||
                document.body[method]
            ) : element[method];
        },

        css: function(el, styleProp, value) {
            el = KTUtil.get(el);

            if (!el) {
                return;
            }

            if (value !== undefined) {
                el.style[styleProp] = value;
            } else {
                var value, defaultView = (el.ownerDocument || document).defaultView;
                // W3C standard way:
                if (defaultView && defaultView.getComputedStyle) {
                    // sanitize property name to css notation
                    // (hyphen separated words eg. font-Size)
                    styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
                    return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
                } else if (el.currentStyle) { // IE
                    // sanitize property name to camelCase
                    styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
                        return letter.toUpperCase();
                    });
                    value = el.currentStyle[styleProp];
                    // convert other units to pixels on IE
                    if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
                        return (function(value) {
                            var oldLeft = el.style.left,
                                oldRsLeft = el.runtimeStyle.left;
                            el.runtimeStyle.left = el.currentStyle.left;
                            el.style.left = value || 0;
                            value = el.style.pixelLeft + "px";
                            el.style.left = oldLeft;
                            el.runtimeStyle.left = oldRsLeft;
                            return value;
                        })(value);
                    }
                    return value;
                }
            }
        },

        slide: function(el, dir, speed, callback, recalcMaxHeight) {
            if (!el || (dir == 'up' && KTUtil.visible(el) === false) || (dir == 'down' && KTUtil.visible(el) === true)) {
                return;
            }

            speed = (speed ? speed : 600);
            var calcHeight = KTUtil.actualHeight(el);
            var calcPaddingTop = false;
            var calcPaddingBottom = false;

            if (KTUtil.css(el, 'padding-top') && KTUtil.data(el).has('slide-padding-top') !== true) {
                KTUtil.data(el).set('slide-padding-top', KTUtil.css(el, 'padding-top'));
            }

            if (KTUtil.css(el, 'padding-bottom') && KTUtil.data(el).has('slide-padding-bottom') !== true) {
                KTUtil.data(el).set('slide-padding-bottom', KTUtil.css(el, 'padding-bottom'));
            }

            if (KTUtil.data(el).has('slide-padding-top')) {
                calcPaddingTop = parseInt(KTUtil.data(el).get('slide-padding-top'));
            }

            if (KTUtil.data(el).has('slide-padding-bottom')) {
                calcPaddingBottom = parseInt(KTUtil.data(el).get('slide-padding-bottom'));
            }

            if (dir == 'up') { // up          
                el.style.cssText = 'display: block; overflow: hidden;';

                if (calcPaddingTop) {
                    KTUtil.animate(0, calcPaddingTop, speed, function(value) {
                        el.style.paddingTop = (calcPaddingTop - value) + 'px';
                    }, 'linear');
                }

                if (calcPaddingBottom) {
                    KTUtil.animate(0, calcPaddingBottom, speed, function(value) {
                        el.style.paddingBottom = (calcPaddingBottom - value) + 'px';
                    }, 'linear');
                }

                KTUtil.animate(0, calcHeight, speed, function(value) {
                    el.style.height = (calcHeight - value) + 'px';
                }, 'linear', function() {
                    callback();
                    el.style.height = '';
                    el.style.display = 'none';
                });


            } else if (dir == 'down') { // down
                el.style.cssText = 'display: block; overflow: hidden;';

                if (calcPaddingTop) {
                    KTUtil.animate(0, calcPaddingTop, speed, function(value) {
                        el.style.paddingTop = value + 'px';
                    }, 'linear', function() {
                        el.style.paddingTop = '';
                    });
                }

                if (calcPaddingBottom) {
                    KTUtil.animate(0, calcPaddingBottom, speed, function(value) {
                        el.style.paddingBottom = value + 'px';
                    }, 'linear', function() {
                        el.style.paddingBottom = '';
                    });
                }

                KTUtil.animate(0, calcHeight, speed, function(value) {
                    el.style.height = value + 'px';
                }, 'linear', function() {
                    callback();
                    el.style.height = '';
                    el.style.display = '';
                    el.style.overflow = '';
                });
            }
        },

        slideUp: function(el, speed, callback) {
            KTUtil.slide(el, 'up', speed, callback);
        },

        slideDown: function(el, speed, callback) {
            KTUtil.slide(el, 'down', speed, callback);
        },

        show: function(el, display) {
            if (typeof el !== 'undefined') {
                el.style.display = (display ? display : 'block');
            }
        },

        hide: function(el) {
            if (typeof el !== 'undefined') {
                el.style.display = 'none';
            }
        },

        addEvent: function(el, type, handler, one) {
            el = KTUtil.get(el);
            if (typeof el !== 'undefined') {
                el.addEventListener(type, handler);
            }
        },

        removeEvent: function(el, type, handler) {
            el = KTUtil.get(el);
            el.removeEventListener(type, handler);
        },

        on: function(element, selector, event, handler) {
            if (!selector) {
                return;
            }

            var eventId = KTUtil.getUniqueID('event');

            KTUtilDelegatedEventHandlers[eventId] = function(e) {
                var targets = element.querySelectorAll(selector);
                var target = e.target;

                while (target && target !== element) {
                    for (var i = 0, j = targets.length; i < j; i++) {
                        if (target === targets[i]) {
                            handler.call(target, e);
                        }
                    }

                    target = target.parentNode;
                }
            }

            KTUtil.addEvent(element, event, KTUtilDelegatedEventHandlers[eventId]);

            return eventId;
        },

        off: function(element, event, eventId) {
            if (!element || !KTUtilDelegatedEventHandlers[eventId]) {
                return;
            }

            KTUtil.removeEvent(element, event, KTUtilDelegatedEventHandlers[eventId]);

            delete KTUtilDelegatedEventHandlers[eventId];
        },

        one: function onetime(el, type, callback) {
            el = KTUtil.get(el);

            el.addEventListener(type, function callee(e) {
                // remove event
                if (e.target && e.target.removeEventListener) {
                    e.target.removeEventListener(e.type, callee);                    
                }
                
                // call handler
                return callback(e);
            });
        },

        hash: function(str) {
            var hash = 0,
                i, chr;

            if (str.length === 0) return hash;
            for (i = 0; i < str.length; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }

            return hash;
        },

        animateClass: function(el, animationName, callback) {
            var animation;
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
                msAnimation: 'msAnimationEnd'
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    animation = animations[t];
                }
            }

            KTUtil.addClass(el, 'animated ' + animationName);

            KTUtil.one(el, animation, function() {
                KTUtil.removeClass(el, 'animated ' + animationName);
            });

            if (callback) {
                KTUtil.one(el, animation, callback);
            }
        },

        transitionEnd: function(el, callback) {
            var transition;
            var transitions = {
                transition: 'transitionend',
                OTransition: 'oTransitionEnd',
                MozTransition: 'mozTransitionEnd',
                WebkitTransition: 'webkitTransitionEnd',
                msTransition: 'msTransitionEnd'
            };

            for (var t in transitions) {
                if (el.style[t] !== undefined) {
                    transition = transitions[t];
                }
            }

            KTUtil.one(el, transition, callback);
        },

        animationEnd: function(el, callback) {
            var animation;
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
                msAnimation: 'msAnimationEnd'
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    animation = animations[t];
                }
            }

            KTUtil.one(el, animation, callback);
        },

        animateDelay: function(el, value) {
            var vendors = ['webkit-', 'moz-', 'ms-', 'o-', ''];
            for (var i = 0; i < vendors.length; i++) {
                KTUtil.css(el, vendors[i] + 'animation-delay', value);
            }
        },

        animateDuration: function(el, value) {
            var vendors = ['webkit-', 'moz-', 'ms-', 'o-', ''];
            for (var i = 0; i < vendors.length; i++) {
                KTUtil.css(el, vendors[i] + 'animation-duration', value);
            }
        },

        scrollTo: function(target, offset, duration) {
            var duration = duration ? duration : 500;
            var target = KTUtil.get(target);
            var targetPos = target ? KTUtil.offset(target).top : 0;
            var scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            var from, to;

            if (targetPos > scrollPos) {
                from = targetPos;
                to = scrollPos;
            } else {
                from = scrollPos;
                to = targetPos;
            }

            if (offset) {
                to += offset;
            }

            KTUtil.animate(from, to, duration, function(value) {
                document.documentElement.scrollTop = value;
                document.body.parentNode.scrollTop = value;
                document.body.scrollTop = value;
            }); //, easing, done
        },

        scrollTop: function(offset, duration) {
            KTUtil.scrollTo(null, offset, duration);
        },

        isArray: function(obj) {
            return obj && Array.isArray(obj);
        },

        ready: function(callback) {
            if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
                callback();
            } else {
                document.addEventListener('DOMContentLoaded', callback);
            }
        },

        isEmpty: function(obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    return false;
                }
            }

            return true;
        },

        numberString: function(nStr) {
            nStr += '';
            var x = nStr.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        },

        detectIE: function() {
            var ua = window.navigator.userAgent;

            // Test values; Uncomment to check result …

            // IE 10
            // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

            // IE 11
            // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

            // Edge 12 (Spartan)
            // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

            // Edge 13
            // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

            var msie = ua.indexOf('MSIE ');
            if (msie > 0) {
                // IE 10 or older => return version number
                return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            }

            var trident = ua.indexOf('Trident/');
            if (trident > 0) {
                // IE 11 => return version number
                var rv = ua.indexOf('rv:');
                return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            }

            var edge = ua.indexOf('Edge/');
            if (edge > 0) {
                // Edge (IE 12+) => return version number
                return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
            }

            // other browser
            return false;
        },

        isRTL: function() {
            return (KTUtil.attr(KTUtil.get('html'), 'direction') == 'rtl');
        },

        // 

        /**
         * 初始化滚动条
         *
         * @param element {object} 元素
         * @param options {object} 选项
         */
        scrollInit: function(element, options) {
            if(!element) return;
            // Define init function
            function init() {
                var ps;
                var height;

                if (options.height instanceof Function) {
                    height = parseInt(options.height.call());
                } else {
                    height = parseInt(options.height);
                }

                // Destroy scroll on table and mobile modes
                if ((options.mobileNativeScroll || options.disableForMobile) && KTUtil.isInResponsiveRange('tablet-and-mobile')) {
                    if (ps = KTUtil.data(element).get('ps')) {
                        if (options.resetHeightOnDestroy) {
                            KTUtil.css(element, 'height', 'auto');
                        } else {
                            KTUtil.css(element, 'overflow', 'auto');
                            if (height > 0) {
                                KTUtil.css(element, 'height', height + 'px');
                            }
                        }

                        ps.destroy();
                        ps = KTUtil.data(element).remove('ps');
                    } else if (height > 0){
                        KTUtil.css(element, 'overflow', 'auto');
                        KTUtil.css(element, 'height', height + 'px');
                    }

                    return;
                }

                if (height > 0) {
                    KTUtil.css(element, 'height', height + 'px');
                }

                if (options.desktopNativeScroll) {
                    KTUtil.css(element, 'overflow', 'auto');
                    return;
                }
                
                // Init scroll
                KTUtil.css(element, 'overflow', 'hidden');

                if (ps = KTUtil.data(element).get('ps')) {
                    ps.update();
                } else {
                    KTUtil.addClass(element, 'kt-scroll');
                    ps = new PerfectScrollbar(element, {
                        wheelSpeed: 0.5,
                        swipeEasing: true,
                        wheelPropagation: options.windowScroll !== false,
                        minScrollbarLength: 40,
                        maxScrollbarLength: 300, 
                        suppressScrollX: KTUtil.attr(element, 'data-scroll-x') !== 'true'
                    });

                    KTUtil.data(element).set('ps', ps);
                }

                // Remember scroll position in cookie
                var uid = KTUtil.attr(element, 'id');

                if (options.rememberPosition === true && Cookies && uid) {
                    if (Cookies.get(uid)) {
                        var pos = parseInt(Cookies.get(uid));

                        if (pos > 0) {
                            element.scrollTop = pos;
                        }
                    } 

                    element.addEventListener('ps-scroll-y', function() {
                        Cookies.set(uid, element.scrollTop);
                    });                                      
                }
            }

            // Init
            init();

            // Handle window resize
            if (options.handleWindowResize) {
                KTUtil.addResizeHandler(function() {
                    init();
                });
            }
        },
        /**
         * 更新滚动条
         *
         * @param element {object} html element
         */
        scrollUpdate: function(element) {
            var ps;
            if (ps = KTUtil.data(element).get('ps')) {
                ps.update();
            }
        },
        /**
         * 更新滚动条
         *
         * @param selector {string} 要更新滚动条所在父元素选择器
         */
        scrollUpdateAll: function(selector) {
            $(selector).find('.ps').each(function () {
                KTUtil.scrollerUpdate(this);
            });
        },
        /**
         * 销毁滚动条
         *
         * @param element {object} html element
         */
        scrollDestroy: function(element) {
            var ps = KTUtil.data(element).get('ps');
            if (ps) {
                ps.destroy();
                KTUtil.data(element).remove('ps');
            }
        },

        setHTML: function(el, html) {
            $(el).html(html);
        },

        /**
         * 是否为空
         * @param str
         * @returns {boolean}
         */
        isBlank: function (str) {
            return typeof str === 'undefined' || str === null || str == '';
        },
        /**
         * 是否不为空
         * @param str
         * @returns {boolean}
         */
        isNotBlank: function (str) {
            return !KTUtil.isBlank(str);
        },
        /**
         * 检查对象是否为function
         * @param fn {object}
         * @returns {boolean}
         */
        isFunction: function (fn) {
            return Object.prototype.toString.call(fn) === '[object Function]';
        },
        /**
         * 判断是否是数字
         *
         * @param obj {object}
         * @returns {boolean}
         */
        isNumber: function (obj) {
            return typeof obj === 'number';
        },
        /**
         * 判断是否为字符串
         *
         * @param obj {object}
         * @returns {boolean}
         */
        isString: function (obj) {
            return typeof obj === 'string';
        },
        /**
         * 截取指定长度字符串
         * @param str
         * @param length 长度
         * @returns {*}
         */
        subStr: function (str, length) {
            if (str.length > length) {
                return str.substr(0, length) + "...";
            } else {
                return str;
            }
        },

        /**
         * 是否是顶级页面
         */
        isTopPage: function () {
            return window.top !== window.self;
        },
        /**
         * 自定义弹出
         *
         * @param obj {object}
         */
        alert: function (obj) {
            if (KTUtil.isTopPage()) {
                window.parent.KTUtil.alert(obj);
            } else {
                swal.fire(obj);
            }
        },
        /**
         * 弹出提示 (级别: 信息)
         *
         * @param title 标题
         * @param subtitle 副标题
         */
        alertInfo: function (title, subtitle) {
            if (KTUtil.isTopPage()) {
                window.parent.KTUtil.alertInfo(title, subtitle);
            } else {
                swal.fire(title, subtitle, 'info');
            }
        },
        /**
         * 弹出提示 (级别: 成功)
         *
         * @param title 标题
         * @param subtitle 副标题
         */
        alertSuccess: function (title, subtitle) {
            if (KTUtil.isTopPage()) {
                window.parent.KTUtil.alertSuccess(title, subtitle);
            } else {
                swal.fire(title, subtitle, 'success');
            }
        },
        /**
         * 弹出提示 (级别: 错误)
         *
         * @param title 标题
         * @param subtitle 副标题
         */
        alertError: function (title, subtitle) {
            if (KTUtil.isTopPage()) {
                window.parent.KTUtil.alertError(title, subtitle);
            } else {
                swal.fire(title, subtitle, "error");
            }
        },
        /**
         * 弹出提示 (级别: 警告)
         *
         * @param title 标题
         * @param subtitle 副标题
         */
        alertWarning: function (title, subtitle) {
            if (KTUtil.isTopPage()) {
                window.parent.KTUtil.alertWarning(title, subtitle);
            } else {
                swal.fire(title, subtitle, "warning");
            }
        },
        /**
         * 询问框
         *
         * @param title 标题
         * @param subtitle 副标题
         * @param okCallback 点击确定回调
         * @param cancelCallback 点击取消回调
         */
        alertConfirm: function (title, subtitle, okCallback, cancelCallback) {
            if (KTUtil.isTopPage()) {
                window.parent.KTUtil.alertConfirm(title, subtitle, okCallback, cancelCallback);
            } else {
                swal.fire({
                    title: title,
                    text: subtitle,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(function (obj) {
                    if (obj.value != null && obj.value) {
                        if (KTUtil.isFunction(okCallback)) {
                            okCallback();
                        }
                    } else {
                        if (KTUtil.isFunction(cancelCallback)) {
                            cancelCallback();
                        }
                    }
                })
            }
        },
        /**
         * ajax 请求返回异常
         *
         * @param XMLHttpRequest
         * @param textStatus
         * @param errorThrown
         */
        ajaxError: function (XMLHttpRequest, textStatus, errorThrown) {
            var res = XMLHttpRequest.responseJSON;
            if (KTTool.httpCode.bad_request === res.code) { // 无效请求
                if (typeof res.errors !== 'undefined') {
                    var errors = [];
                    $(res.errors).each(function (index, error) {
                        errors.push(error.defaultMessage);
                    });
                    KTTool.errorTip(KTTool.commonTips.fail, errors.join('<br/>'));
                } else {
                    KTTool.errorTip(KTTool.commonTips.fail, res.message);
                }
            } else {
                console.error(XMLHttpRequest);
                console.error(textStatus);
                console.error(errorThrown);
                KTTool.errorTip(XMLHttpRequest.responseJSON.error + '[' + XMLHttpRequest.responseJSON.code + ']', XMLHttpRequest.responseJSON.path);
            }
        },
        /**
         * 显示等待遮罩
         *
         * @param selector {string} jquery 选择器
         */
        openWait: function (selector) {
            KTApp.block(selector, {
                message: '请稍候...'
            });
        },
        /**
         * 移除等待遮罩
         *
         * @param selector {string} jquery 选择器
         */
        closeWait: function (selector) {
            KTApp.unblock(selector);
        },
        /**
         * 设置按钮为处理中状态
         *
         * @param el {object} html 元素对象 (必要)
         */
        setButtonWait: function (el) {
            KTApp.progress(el);
        },
        /**
         * 取消按钮为处理中状态
         *
         * @param el {object} html 元素对象 (必要)
         */
        offButtonWait: function (el) {
            KTApp.unprogress(el);
        },
        /**
         * 封装jquery.ajax方法
         * @param config {object} 参数
         *  config.wait 打开等待遮罩选择器
         *  config.needAlert 失败时是否使用系统KTTool.alertWarning弹出data.msg提示;
         *  当不需要提示时可以自定义config.fail(data)方法自定义错误提示
         *
         * @param config
         */
        ajax: function (config) {
            /**
             * 失败处理
             *
             * @param config {object} 参数
             * @param res {object} 服务器返回
             */
            var failCallback = function (config, res) {
                if (config.needAlert == null || config.needAlert) {
                    if (KTUtil.isNotBlank(res.message)) {
                        if (KTTool.httpCode.unauthorized === res.code) { // 无权访问
                            KTTool.errorTip(KTTool.commonTips.unauthorized, res.message);
                            // 权限可能被修改,刷新缓存用户数据
                            KTTool.getUser(false);
                        } else if (KTTool.httpCode.internalServerError === res.code) { // 业务异常
                            KTTool.errorTip(KTTool.commonTips.fail, res.message);
                        } else {
                            KTTool.errorTip('错误代码[' + res.code + ']', res.message);
                        }
                    }
                } else {
                    if (KTUtil.isNotBlank(res.message)) {
                        console.warn(res.message);
                    }
                }
                if (KTUtil.isFunction(config.fail)) {
                    config.fail(res);
                }
            };

            if (KTUtil.isNotBlank(config)) {
                if (KTUtil.isNotBlank(config.wait)) {
                    KTUtil.openWait(config.wait);
                }
                $.ajax({
                    async: config.async,
                    url: config.url,
                    cache: false,
                    data: config.data,
                    contentType: config.contentType,
                    type: KTUtil.isBlank(config.type) ? 'post' : config.type,
                    dataType: KTUtil.isBlank(config.dataType) ? 'json' : config.dataType,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (KTUtil.isNotBlank(config.wait)) {
                            KTUtil.closeWait(config.wait);
                        }
                        if (KTUtil.isFunction(config.error)) { // 如传入error回调,则不调用公用ajaxError
                            config.error(XMLHttpRequest, textStatus, errorThrown);
                        } else {
                            KTUtil.ajaxError(XMLHttpRequest, textStatus, errorThrown);
                        }
                    },
                    success: function (res) {
                        if (KTUtil.isNotBlank(config.wait)) {
                            KTUtil.closeWait(config.wait);
                        }
                        // 如果dataType未指定或者dataType为json
                        if (KTUtil.isBlank(config.dataType) || 'json' === config.dataType) {
                            if (KTTool.httpCode.success === res.code) {
                                if (KTUtil.isFunction(config.success)) {
                                    config.success(res);
                                }
                            } else {
                                failCallback(config, res);
                            }
                        } else {
                            if (KTUtil.isFunction(config.success)) {
                                config.success(res);
                            }
                        }
                    }
                });
            } else {
                console.warn('KTUtil.ajax方法不允许传入空参数');
            }
        },
        /**
         * 更新jstree节点信息
         *
         * @param tree {object} jstree对象
         * @param id {int} 节点id
         * @param name {string} 节点名称
         * @param icon {string} 图标
         */
        updateTreeNodeInfo: function (tree, id, name, icon) {
            var node = tree.get_node(id);
            if (node != null) { // 节点存在
                tree.rename_node(node, name);
                if (KTUtil.isNotBlank(icon)) {
                    tree.set_icon(node, icon);
                }
            }
        }
    }
}();

// 当页面加载完毕初始化EFUtil
KTUtil.ready(function() {
    KTUtil.init();
});

// 页面加载完毕移除加载提示
window.onload = function() {
    $('body').removeClass('kt-page--loading');
};
"use strict";

// plugin setup
var KTDialog = function(options) {
    // Main object
    var the = this;

    // Get element object
    var element;
    var body = KTUtil.get('body');  

    // Default options
    var defaultOptions = {
        'placement' : 'top center',
        'type'  : 'loader',
        'width' : 100,
        'state' : 'default',
        'message' : 'Loading...' 
    };    

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Construct
         */

        construct: function(options) {
            Plugin.init(options);

            return the;
        },

        /**
         * Handles subtoggle click toggle
         */
        init: function(options) {
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);

            the.state = false;
        },

        /**
         * Show dialog
         */
        show: function() {
            Plugin.eventTrigger('show');

            element = document.createElement("DIV");
            KTUtil.setHTML(element, the.options.message);
            
            KTUtil.addClass(element, 'kt-dialog kt-dialog--shown');
            KTUtil.addClass(element, 'kt-dialog--' + the.options.state);
            KTUtil.addClass(element, 'kt-dialog--' + the.options.type); 

            if (the.options.placement == 'top center') {
                KTUtil.addClass(element, 'kt-dialog--top-center');
            }

            body.appendChild(element);

            the.state = 'shown';

            Plugin.eventTrigger('shown');

            return the;
        },

        /**
         * Hide dialog
         */
        hide: function() {
            if (element) {
                Plugin.eventTrigger('hide');

                element.remove();
                the.state = 'hidden';

                Plugin.eventTrigger('hidden');
            }

            return the;
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name) {
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];

                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;                            
                            event.handler.call(this, the);
                        }
                    } else {
                        event.handler.call(this, the);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });

            return the;
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options 
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Check shown state 
     */
    the.shown = function() {
        return the.state == 'shown';
    };

    /**
     * Check hidden state 
     */
    the.hidden = function() {
        return the.state == 'hidden';
    };

    /**
     * Show dialog 
     */
    the.show = function() {
        return Plugin.show();
    };

    /**
     * Hide dialog
     */
    the.hide = function() {
        return Plugin.hide();
    };

    /**
     * Attach event
     * @returns {KTToggle}
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     * @returns {KTToggle}
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    // Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};
/**
 * 为类型添加一些自定义方法
 */

/**
 * 为string类型添加替换全部方法
 *
 * @param s1 {string} 替换前字符串
 * @param s2 {string} 要替换为的字符串
 * @return {string} 替换后的字符串
 */
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
};
/**
 * 序列化表单获取json数据
 */
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
"use strict";
var KTHeader = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.get(elementId);
    var body = KTUtil.get('body');

    if (element === undefined) {
        return;
    }

    // Default options
    var defaultOptions = {
        classic: false,
        offset: {
            mobile: 150,
            desktop: 200
        },
        minimize: {
            mobile: false,
            desktop: false
        }
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Run plugin
         * @returns {KTHeader}
         */
        construct: function(options) {
            if (KTUtil.data(element).has('header')) {
                the = KTUtil.data(element).get('header');
            } else {
                // reset header
                Plugin.init(options);

                // build header
                Plugin.build();

                KTUtil.data(element).set('header', the);
            }

            return the;
        },

        /**
         * Handles subheader click toggle
         * @returns {KTHeader}
         */
        init: function(options) {
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);
        },

        /**
         * Reset header
         * @returns {KTHeader}
         */
        build: function() {
            var lastScrollTop = 0;
            var eventTriggerState = true;
            var viewportHeight = KTUtil.getViewPort().height;

            if (the.options.minimize.mobile === false && the.options.minimize.desktop === false) {
                return;
            }

            window.addEventListener('scroll', function() {
                var offset = 0, on, off, st;

                if (KTUtil.isInResponsiveRange('desktop')) {
                    offset = the.options.offset.desktop;
                    on = the.options.minimize.desktop.on;
                    off = the.options.minimize.desktop.off;
                } else if (KTUtil.isInResponsiveRange('tablet-and-mobile')) {
                    offset = the.options.offset.mobile;
                    on = the.options.minimize.mobile.on;
                    off = the.options.minimize.mobile.off;
                }

                st = window.pageYOffset;

                if (
                    (KTUtil.isInResponsiveRange('tablet-and-mobile') && the.options.classic && the.options.classic.mobile) ||
                    (KTUtil.isInResponsiveRange('desktop') && the.options.classic && the.options.classic.desktop)

                ) {
                    if (st > offset) { // down scroll mode
                        KTUtil.addClass(body, on);
                        KTUtil.removeClass(body, off);
                        
                        if (eventTriggerState) {
                            Plugin.eventTrigger('minimizeOn', the);
                            eventTriggerState = false;
                        }
                    } else { // back scroll mode
                        KTUtil.addClass(body, off);
                        KTUtil.removeClass(body, on);

                        if (eventTriggerState == false) {
                            Plugin.eventTrigger('minimizeOff', the);
                            eventTriggerState = true; 
                        }
                    }
                } else {
                    if (st > offset && lastScrollTop < st) { // down scroll mode
                        KTUtil.addClass(body, on);
                        KTUtil.removeClass(body, off);

                        if (eventTriggerState) {
                            Plugin.eventTrigger('minimizeOn', the);
                            eventTriggerState = false;
                        }
                    } else { // back scroll mode
                        KTUtil.addClass(body, off);
                        KTUtil.removeClass(body, on);

                        if (eventTriggerState == false) {
                            Plugin.eventTrigger('minimizeOff', the);
                            eventTriggerState = true;
                        }
                    }

                    lastScrollTop = st;
                }
            });
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name, args) {
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            event.handler.call(this, the, args);
                        }
                    } else {
                        event.handler.call(this, the, args);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options 
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Register event
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    // Run plugin
    Plugin.construct.apply(the, [options]);

    // Init done
    init = true;

    // Return plugin instance
    return the;
};
"use strict";
var KTMenu = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.get(elementId);
    var body = KTUtil.get('body');  

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {       
        // scrollable area with Perfect Scroll
        scroll: {
            rememberPosition: false
        },
        
        // accordion submenu mode
        accordion: {
            slideSpeed: 200, // accordion toggle slide speed in milliseconds
            autoScroll: false, // enable auto scrolling(focus) to the clicked menu item
            autoScrollSpeed: 1200,
            expandAll: true // allow having multiple expanded accordions in the menu
        },

        // dropdown submenu mode
        dropdown: {
            timeout: 500 // timeout in milliseconds to show and hide the hoverable submenu dropdown
        }
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Run plugin
         * @returns {KTMenu}
         */
        construct: function(options) {
            if (KTUtil.data(element).has('menu')) {
                the = KTUtil.data(element).get('menu');
            } else {
                // reset menu
                Plugin.init(options);

                // reset menu
                Plugin.reset();

                // build menu
                Plugin.build();

                KTUtil.data(element).set('menu', the);
            }

            return the;
        },

        /**
         * Handles submenu click toggle
         * @returns {KTMenu}
         */
        init: function(options) {
            the.events = [];

            the.eventHandlers = {};

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);

            // pause menu
            the.pauseDropdownHoverTime = 0;

            the.uid = KTUtil.getUniqueID();
        },

        update: function(options) {
            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);

            // pause menu
            the.pauseDropdownHoverTime = 0;

             // reset menu
            Plugin.reset();

            the.eventHandlers = {};

            // build menu
            Plugin.build();

            KTUtil.data(element).set('menu', the);
        },

        reload: function() {
             // reset menu
            Plugin.reset();

            // build menu
            Plugin.build();

            // reset submenu props
            Plugin.resetSubmenuProps();
        },

        /**
         * Reset menu
         * @returns {KTMenu}
         */
        build: function() {
            // General accordion submenu toggle
            the.eventHandlers['event_1'] = KTUtil.on( element, '.kt-menu__toggle', 'click', Plugin.handleSubmenuAccordion);

            // Dropdown mode(hoverable)
            if (Plugin.getSubmenuMode() === 'dropdown' || Plugin.isConditionalSubmenuDropdown()) {
                // dropdown submenu - hover toggle
                the.eventHandlers['event_2'] = KTUtil.on( element, '[data-ktmenu-submenu-toggle="hover"]', 'mouseover', Plugin.handleSubmenuDrodownHoverEnter);
                the.eventHandlers['event_3'] = KTUtil.on( element, '[data-ktmenu-submenu-toggle="hover"]', 'mouseout', Plugin.handleSubmenuDrodownHoverExit);

                // dropdown submenu - click toggle
                the.eventHandlers['event_4'] = KTUtil.on( element, '[data-ktmenu-submenu-toggle="click"] > .kt-menu__toggle, [data-ktmenu-submenu-toggle="click"] > .kt-menu__link .kt-menu__toggle', 'click', Plugin.handleSubmenuDropdownClick);
                the.eventHandlers['event_5'] = KTUtil.on( element, '[data-ktmenu-submenu-toggle="tab"] > .kt-menu__toggle, [data-ktmenu-submenu-toggle="tab"] > .kt-menu__link .kt-menu__toggle', 'click', Plugin.handleSubmenuDropdownTabClick);
            }

            // handle link click
            the.eventHandlers['event_6'] = KTUtil.on(element, '.kt-menu__item > .kt-menu__link:not(.kt-menu__toggle):not(.kt-menu__link--toggle-skip)', 'click', Plugin.handleLinkClick);

            // Init scrollable menu
            if (the.options.scroll && the.options.scroll.height) {
                Plugin.scrollInit();
            }
        },

        /**
         * Reset menu
         * @returns {KTMenu}
         */
        reset: function() { 
            KTUtil.off( element, 'click', the.eventHandlers['event_1']);

            // dropdown submenu - hover toggle
            KTUtil.off( element, 'mouseover', the.eventHandlers['event_2']);
            KTUtil.off( element, 'mouseout', the.eventHandlers['event_3']);

            // dropdown submenu - click toggle
            KTUtil.off( element, 'click', the.eventHandlers['event_4']);
            KTUtil.off( element, 'click', the.eventHandlers['event_5']);
            
            // handle link click
            KTUtil.off(element, 'click', the.eventHandlers['event_6']);
        },

        /**
         * Init scroll menu
         *
        */
        scrollInit: function() {
            if ( the.options.scroll && the.options.scroll.height ) {
                KTUtil.scrollDestroy(element);
                KTUtil.scrollInit(element, {disableForMobile: true, resetHeightOnDestroy: true, handleWindowResize: true, height: the.options.scroll.height, rememberPosition: the.options.scroll.rememberPosition});
            } else {
                KTUtil.scrollDestroy(element);
            }           
        },

        /**
         * Update scroll menu
        */
        scrollUpdate: function() {
            if ( the.options.scroll && the.options.scroll.height ) {
                KTUtil.scrollUpdate(element);
            }
        },

        /**
         * Scroll top
        */
        scrollTop: function() {
            if ( the.options.scroll && the.options.scroll.height ) {
                KTUtil.scrollTop(element);
            }
        },

        /**
         * Get submenu mode for current breakpoint and menu state
         * @returns {KTMenu}
         */
        getSubmenuMode: function(el) {
            if ( KTUtil.isInResponsiveRange('desktop') ) {
                if (el && KTUtil.hasAttr(el, 'data-ktmenu-submenu-toggle') && KTUtil.attr(el, 'data-ktmenu-submenu-toggle') == 'hover') {
                    return 'dropdown';
                }

                if ( KTUtil.isset(the.options.submenu, 'desktop.state.body') ) {
                    if ( KTUtil.hasClasses(body, the.options.submenu.desktop.state.body) ) {
                        return the.options.submenu.desktop.state.mode;
                    } else {
                        return the.options.submenu.desktop.default;
                    }
                } else if ( KTUtil.isset(the.options.submenu, 'desktop') ) {
                    return the.options.submenu.desktop;
                }
            } else if ( KTUtil.isInResponsiveRange('tablet') && KTUtil.isset(the.options.submenu, 'tablet') ) {
                return the.options.submenu.tablet;
            } else if ( KTUtil.isInResponsiveRange('mobile') && KTUtil.isset(the.options.submenu, 'mobile') ) {
                return the.options.submenu.mobile;
            } else {
                return false;
            }
        },

        /**
         * Get submenu mode for current breakpoint and menu state
         * @returns {KTMenu}
         */
        isConditionalSubmenuDropdown: function() {
            if ( KTUtil.isInResponsiveRange('desktop') && KTUtil.isset(the.options.submenu, 'desktop.state.body') ) {
                return true;
            } else {
                return false;
            }
        },


        /**
         * Reset submenu attributes
         * @returns {KTMenu}
         */
        resetSubmenuProps: function(e) {
            var submenus = KTUtil.findAll(element, '.kt-menu__submenu');
            if ( submenus ) {
                for (var i = 0, len = submenus.length; i < len; i++) {
                    KTUtil.css(submenus[0], 'display', '');
                    KTUtil.css(submenus[0], 'overflow', '');                                        
                }
            }
        },

        /**
         * Handles submenu hover toggle
         * @returns {KTMenu}
         */
        handleSubmenuDrodownHoverEnter: function(e) {
            if ( Plugin.getSubmenuMode(this) === 'accordion' ) {
                return;
            }

            if ( the.resumeDropdownHover() === false ) {
                return;
            }

            var item = this;

            if ( item.getAttribute('data-hover') == '1' ) {
                item.removeAttribute('data-hover');
                clearTimeout( item.getAttribute('data-timeout') );
                item.removeAttribute('data-timeout');
                //Plugin.hideSubmenuDropdown(item, false);
            }

            // console.log('test!');

            Plugin.showSubmenuDropdown(item);
        },

        /**
         * Handles submenu hover toggle
         * @returns {KTMenu}
         */
        handleSubmenuDrodownHoverExit: function(e) {
            if ( the.resumeDropdownHover() === false ) {
                return;
            }

            if ( Plugin.getSubmenuMode(this) === 'accordion' ) {
                return;
            }

            var item = this;
            var time = the.options.dropdown.timeout;

            var timeout = setTimeout(function() {
                if ( item.getAttribute('data-hover') == '1' ) {
                    Plugin.hideSubmenuDropdown(item, true);
                } 
            }, time);

            item.setAttribute('data-hover', '1');
            item.setAttribute('data-timeout', timeout);  
        },

        /**
         * Handles submenu click toggle
         * @returns {KTMenu}
         */
        handleSubmenuDropdownClick: function(e) {
            if ( Plugin.getSubmenuMode(this) === 'accordion' ) {
                return;
            }
 
            var item = this.closest('.kt-menu__item');

            if ( item.getAttribute('data-ktmenu-submenu-mode') == 'accordion' ) {
                return;
            }

            if ( KTUtil.hasClass(item, 'kt-menu__item--hover') === false ) {
                KTUtil.addClass(item, 'kt-menu__item--open-dropdown');
                Plugin.showSubmenuDropdown(item);
            } else {
                KTUtil.removeClass(item, 'kt-menu__item--open-dropdown' );
                Plugin.hideSubmenuDropdown(item, true);
            }

            e.preventDefault();
        },

        /**
         * Handles tab click toggle
         * @returns {KTMenu}
         */
        handleSubmenuDropdownTabClick: function(e) {
            if (Plugin.getSubmenuMode(this) === 'accordion') {
                return;
            }

            var item = this.closest('.kt-menu__item');

            if (item.getAttribute('data-ktmenu-submenu-mode') == 'accordion') {
                return;
            }

            if (KTUtil.hasClass(item, 'kt-menu__item--hover') == false) {
                KTUtil.addClass(item, 'kt-menu__item--open-dropdown');
                Plugin.showSubmenuDropdown(item);
            }

            e.preventDefault();
        },

        /**
         * Handles link click
         * @returns {KTMenu}
         */
        handleLinkClick: function(e) {
            var submenu = this.closest('.kt-menu__item.kt-menu__item--submenu'); //
            if ( submenu && Plugin.getSubmenuMode(submenu) === 'dropdown' ) {
                Plugin.hideSubmenuDropdowns();
            }
        },

        /**
         * Handles submenu dropdown close on link click
         * @returns {KTMenu}
         */
        handleSubmenuDropdownClose: function(e, el) {
            // exit if its not submenu dropdown mode
            if (Plugin.getSubmenuMode(el) === 'accordion') {
                return;
            }

            var shown = element.querySelectorAll('.kt-menu__item.kt-menu__item--submenu.kt-menu__item--hover:not(.kt-menu__item--tabs)');

            // check if currently clicked link's parent item ha
            if (shown.length > 0 && KTUtil.hasClass(el, 'kt-menu__toggle') === false && el.querySelectorAll('.kt-menu__toggle').length === 0) {
                // close opened dropdown menus
                for (var i = 0, len = shown.length; i < len; i++) {
                    Plugin.hideSubmenuDropdown(shown[0], true);
                }
            }
        },

        /**
         * helper functions
         * @returns {KTMenu}
         */
        handleSubmenuAccordion: function(e, el) {
            var query;
            var item = el ? el : this;

            if ( Plugin.getSubmenuMode(el) === 'dropdown' && (query = item.closest('.kt-menu__item') ) ) {
                if (query.getAttribute('data-ktmenu-submenu-mode') != 'accordion' ) {
                    e.preventDefault();
                    return;
                }
            }

            var li = item.closest('.kt-menu__item');
            var submenu = KTUtil.child(li, '.kt-menu__submenu, .kt-menu__inner');

            if (KTUtil.hasClass(item.closest('.kt-menu__item'), 'kt-menu__item--open-always')) {
                return;
            }

            if ( li && submenu ) {
                e.preventDefault();
                var speed = the.options.accordion.slideSpeed;
                var hasClosables = false;

                if ( KTUtil.hasClass(li, 'kt-menu__item--open') === false ) {
                    // hide other accordions                    
                    if ( the.options.accordion.expandAll === false ) {
                        var subnav = item.closest('.kt-menu__nav, .kt-menu__subnav');
                        var closables = KTUtil.children(subnav, '.kt-menu__item.kt-menu__item--open.kt-menu__item--submenu:not(.kt-menu__item--here):not(.kt-menu__item--open-always)');

                        if ( subnav && closables ) {
                            for (var i = 0, len = closables.length; i < len; i++) {
                                var el_ = closables[0];
                                var submenu_ = KTUtil.child(el_, '.kt-menu__submenu');
                                if ( submenu_ ) {
                                    KTUtil.slideUp(submenu_, speed, function() {
                                        Plugin.scrollUpdate();
                                        KTUtil.removeClass(el_, 'kt-menu__item--open');
                                    });                    
                                }
                            }
                        }
                    }

                    KTUtil.slideDown(submenu, speed, function() {
                        Plugin.scrollToItem(item);
                        Plugin.scrollUpdate();
                        
                        Plugin.eventTrigger('submenuToggle', submenu);
                    });
                
                    KTUtil.addClass(li, 'kt-menu__item--open');

                } else {
                    KTUtil.slideUp(submenu, speed, function() {
                        Plugin.scrollToItem(item);
                        Plugin.eventTrigger('submenuToggle', submenu);
                    });

                    KTUtil.removeClass(li, 'kt-menu__item--open');
                }
            }
        },

        /**
         * scroll to item function
         * @returns {KTMenu}
         */
        scrollToItem: function(item) {
            // handle auto scroll for accordion submenus
            if ( KTUtil.isInResponsiveRange('desktop') && the.options.accordion.autoScroll && element.getAttribute('data-ktmenu-scroll') !== '1' ) {
                KTUtil.scrollTo(item, the.options.accordion.autoScrollSpeed);
            }
        },

        /**
         * Hide submenu dropdown
         * @returns {KTMenu}
         */
        hideSubmenuDropdown: function(item, classAlso) {
            // remove submenu activation class
            if ( classAlso ) {
                KTUtil.removeClass(item, 'kt-menu__item--hover');
                KTUtil.removeClass(item, 'kt-menu__item--active-tab');
            }

            // clear timeout
            item.removeAttribute('data-hover');

            if ( item.getAttribute('data-ktmenu-dropdown-toggle-class') ) {
                KTUtil.removeClass(body, item.getAttribute('data-ktmenu-dropdown-toggle-class'));
            }

            var timeout = item.getAttribute('data-timeout');
            item.removeAttribute('data-timeout');
            clearTimeout(timeout);
        },

        /**
         * Hide submenu dropdowns
         * @returns {KTMenu}
         */
        hideSubmenuDropdowns: function() {
            var items;
            if ( items = element.querySelectorAll('.kt-menu__item--submenu.kt-menu__item--hover:not(.kt-menu__item--tabs):not([data-ktmenu-submenu-toggle="tab"])') ) {
                for (var j = 0, cnt = items.length; j < cnt; j++) {
                    Plugin.hideSubmenuDropdown(items[j], true);
                }
            }
        },

        /**
         * helper functions
         * @returns {KTMenu}
         */
        showSubmenuDropdown: function(item) {
            // close active submenus
            var list = element.querySelectorAll('.kt-menu__item--submenu.kt-menu__item--hover, .kt-menu__item--submenu.kt-menu__item--active-tab');

            if ( list ) {
                for (var i = 0, len = list.length; i < len; i++) {
                    var el = list[i];
                    if ( item !== el && el.contains(item) === false && item.contains(el) === false ) {
                        Plugin.hideSubmenuDropdown(el, true);
                    }
                }
            } 

            // add submenu activation class
            KTUtil.addClass(item, 'kt-menu__item--hover');
            
            if ( item.getAttribute('data-ktmenu-dropdown-toggle-class') ) {
                KTUtil.addClass(body, item.getAttribute('data-ktmenu-dropdown-toggle-class'));
            }
        },

        /**
         * Handles submenu slide toggle
         * @returns {KTMenu}
         */
        createSubmenuDropdownClickDropoff: function(el) {
            var query;
            var zIndex = (query = KTUtil.child(el, '.kt-menu__submenu') ? KTUtil.css(query, 'z-index') : 0) - 1;

            var dropoff = document.createElement('<div class="kt-menu__dropoff" style="background: transparent; position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: ' + zIndex + '"></div>');

            body.appendChild(dropoff);

            KTUtil.addEvent(dropoff, 'click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                KTUtil.remove(this);
                Plugin.hideSubmenuDropdown(el, true);
            });
        },

        /**
         * Handles submenu hover toggle
         * @returns {KTMenu}
         */
        pauseDropdownHover: function(time) {
            var date = new Date();

            the.pauseDropdownHoverTime = date.getTime() + time;
        },

        /**
         * Handles submenu hover toggle
         * @returns {KTMenu}
         */
        resumeDropdownHover: function() {
            var date = new Date();

            return (date.getTime() > the.pauseDropdownHoverTime ? true : false);
        },

        /**
         * Reset menu's current active item
         * @returns {KTMenu}
         */
        resetActiveItem: function(item) {
            var list;
            var parents;

            list = element.querySelectorAll('.kt-menu__item--active');
            
            for (var i = 0, len = list.length; i < len; i++) {
                var el = list[0];
                KTUtil.removeClass(el, 'kt-menu__item--active');
                KTUtil.hide( KTUtil.child(el, '.kt-menu__submenu') );
                parents = KTUtil.parents(el, '.kt-menu__item--submenu') || [];

                for (var i_ = 0, len_ = parents.length; i_ < len_; i_++) {
                    var el_ = parents[i];
                    KTUtil.removeClass(el_, 'kt-menu__item--open');
                    KTUtil.hide( KTUtil.child(el_, '.kt-menu__submenu') );
                }
            }

            // close open submenus
            if ( the.options.accordion.expandAll === false ) {
                if ( list = element.querySelectorAll('.kt-menu__item--open') ) {
                    for (var i = 0, len = list.length; i < len; i++) {
                        KTUtil.removeClass(parents[0], 'kt-menu__item--open');
                    }
                }
            }
        },

        /**
         * Sets menu's active item
         * @returns {KTMenu}
         */
        setActiveItem: function(item) {
            // reset current active item
            Plugin.resetActiveItem();

            var parents = KTUtil.parents(item, '.kt-menu__item--submenu') || [];
            for (var i = 0, len = parents.length; i < len; i++) {
                KTUtil.addClass(KTUtil.get(parents[i]), 'kt-menu__item--open');
            }

            KTUtil.addClass(KTUtil.get(item), 'kt-menu__item--active');
        },

        /**
         * Returns page breadcrumbs for the menu's active item
         * @returns {KTMenu}
         */
        getBreadcrumbs: function(item) {
            var query;
            var breadcrumbs = [];
            var link = KTUtil.child(item, '.kt-menu__link');

            breadcrumbs.push({
                text: (query = KTUtil.child(link, '.kt-menu__link-text') ? query.innerHTML : ''),
                title: link.getAttribute('title'),
                href: link.getAttribute('href')
            });

            var parents = KTUtil.parents(item, '.kt-menu__item--submenu');
            for (var i = 0, len = parents.length; i < len; i++) {
                var submenuLink = KTUtil.child(parents[i], '.kt-menu__link');

                breadcrumbs.push({
                    text: (query = KTUtil.child(submenuLink, '.kt-menu__link-text') ? query.innerHTML : ''),
                    title: submenuLink.getAttribute('title'),
                    href: submenuLink.getAttribute('href')
                });
            }

            return  breadcrumbs.reverse();
        },

        /**
         * Returns page title for the menu's active item
         * @returns {KTMenu}
         */
        getPageTitle: function(item) {
            var query;

            return (query = KTUtil.child(item, '.kt-menu__link-text') ? query.innerHTML : '');
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name, args) {
            for (var i = 0; i < the.events.length; i++ ) {
                var event = the.events[i];
                if ( event.name == name ) {
                    if ( event.one == true ) {
                        if ( event.fired == false ) {
                            the.events[i].fired = true;
                            event.handler.call(this, the, args);
                        }
                    } else {
                        event.handler.call(this, the, args);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });
        },

        removeEvent: function(name) {
            if (the.events[name]) {
                delete the.events[name];
            }
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options 
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Update scroll
     */
    the.scrollUpdate = function() {
        return Plugin.scrollUpdate();
    };

    /**
     * Re-init scroll
     */
    the.scrollReInit = function() {
        return Plugin.scrollInit();
    };

    /**
     * Scroll top
     */
    the.scrollTop = function() {
        return Plugin.scrollTop();
    };

    /**
     * Set active menu item
     */
    the.setActiveItem = function(item) {
        return Plugin.setActiveItem(item);
    };

    the.reload = function() {
        return Plugin.reload();
    };

    the.update = function(options) {
        return Plugin.update(options);
    };

    /**
     * Set breadcrumb for menu item
     */
    the.getBreadcrumbs = function(item) {
        return Plugin.getBreadcrumbs(item);
    };

    /**
     * Set page title for menu item
     */
    the.getPageTitle = function(item) {
        return Plugin.getPageTitle(item);
    };

    /**
     * Get submenu mode
     */
    the.getSubmenuMode = function(el) {
        return Plugin.getSubmenuMode(el);
    };

    /**
     * Hide dropdown
     * @returns {Object}
     */
    the.hideDropdown = function(item) {
        Plugin.hideSubmenuDropdown(item, true);
    };

    /**
     * Hide dropdowns
     * @returns {Object}
     */
    the.hideDropdowns = function() {
        Plugin.hideSubmenuDropdowns();
    };

    /**
     * Disable menu for given time
     * @returns {Object}
     */
    the.pauseDropdownHover = function(time) {
        Plugin.pauseDropdownHover(time);
    };

    /**
     * Disable menu for given time
     * @returns {Object}
     */
    the.resumeDropdownHover = function() {
        return Plugin.resumeDropdownHover();
    };

    /**
     * Register event
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    the.off = function(name) {
        return Plugin.removeEvent(name);
    };

    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    // Run plugin
    Plugin.construct.apply(the, [options]);

    // Handle plugin on window resize
    KTUtil.addResizeHandler(function() {
        if (init) {
            the.reload();
        }  
    });

    // Init done
    init = true;

    // Return plugin instance
    return the;
};

// Plugin global lazy initialization
document.addEventListener("click", function (e) {
    var body = KTUtil.get('body');
    var query;
    if ( query = body.querySelectorAll('.kt-menu__nav .kt-menu__item.kt-menu__item--submenu.kt-menu__item--hover:not(.kt-menu__item--tabs)[data-ktmenu-submenu-toggle="click"]') ) {
        for (var i = 0, len = query.length; i < len; i++) {
            var element = query[i].closest('.kt-menu__nav').parentNode;

            if ( element ) {
                var the = KTUtil.data(element).get('menu');

                if ( !the ) {
                    break;
                }

                if ( !the || the.getSubmenuMode() !== 'dropdown' ) {
                    break;
                }

                if ( e.target !== element && element.contains(e.target) === false ) {
                    the.hideDropdowns();
                }
            }            
        }
    } 
});
"use strict";
var KTOffcanvas = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.get(elementId);
    var body = KTUtil.get('body');

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {};

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        construct: function(options) {
            if (KTUtil.data(element).has('offcanvas')) {
                the = KTUtil.data(element).get('offcanvas');
            } else {
                // reset offcanvas
                Plugin.init(options);
                
                // build offcanvas
                Plugin.build();

                KTUtil.data(element).set('offcanvas', the);
            }

            return the;
        },

        init: function(options) {
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);
            the.overlay;

            the.classBase = the.options.baseClass;
            the.classShown = the.classBase + '--on';
            the.classOverlay = the.classBase + '-overlay';

            the.state = KTUtil.hasClass(element, the.classShown) ? 'shown' : 'hidden';
        },

        build: function() {
            // offcanvas toggle
            if (the.options.toggleBy) {
                if (typeof the.options.toggleBy === 'string') { 
                    KTUtil.addEvent( the.options.toggleBy, 'click', function(e) {
                        e.preventDefault();
                        Plugin.toggle();
                    }); 
                } else if (the.options.toggleBy && the.options.toggleBy[0]) {
                    if (the.options.toggleBy[0].target) {
                        for (var i in the.options.toggleBy) { 
                            KTUtil.addEvent( the.options.toggleBy[i].target, 'click', function(e) {
                                e.preventDefault();
                                Plugin.toggle();
                            }); 
                        }
                    } else {
                        for (var i in the.options.toggleBy) { 
                            KTUtil.addEvent( the.options.toggleBy[i], 'click', function(e) {
                                e.preventDefault();
                                Plugin.toggle();
                            }); 
                        }
                    }
                    
                } else if (the.options.toggleBy && the.options.toggleBy.target) {
                    KTUtil.addEvent( the.options.toggleBy.target, 'click', function(e) {
                        e.preventDefault();
                        Plugin.toggle();
                    }); 
                } 
            }

            // offcanvas close
            var closeBy = KTUtil.get(the.options.closeBy);
            if (closeBy) {
                KTUtil.addEvent(closeBy, 'click', function(e) {
                    e.preventDefault();
                    Plugin.hide();
                });
            }

            // Window resize
            KTUtil.addResizeHandler(function() {
                if (parseInt(KTUtil.css(element, 'left')) >= 0 || parseInt(KTUtil.css(element, 'right') >= 0) || KTUtil.css(element, 'position') != 'fixed') {
                    KTUtil.css(element, 'opacity', '1');
                }
            });
        },

        isShown: function(target) {
            return (the.state == 'shown' ? true : false);
        },

        toggle: function() {;
            Plugin.eventTrigger('toggle'); 

            if (the.state == 'shown') {
                Plugin.hide(this);
            } else {
                Plugin.show(this);
            }
        },

        show: function(target) {
            if (the.state == 'shown') {
                return;
            }

            Plugin.eventTrigger('beforeShow');

            Plugin.togglerClass(target, 'show');

            // Offcanvas panel
            KTUtil.addClass(body, the.classShown);
            KTUtil.addClass(element, the.classShown);
            KTUtil.css(element, 'opacity', '1');

            the.state = 'shown';

            if (the.options.overlay) {
                the.overlay = KTUtil.insertAfter(document.createElement('DIV') , element );
                KTUtil.addClass(the.overlay, the.classOverlay);
                KTUtil.addEvent(the.overlay, 'click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    Plugin.hide(target);       
                });
            }

            Plugin.eventTrigger('afterShow');
        },

        hide: function(target) {
            if (the.state == 'hidden') {
                return;
            }

            Plugin.eventTrigger('beforeHide');

            Plugin.togglerClass(target, 'hide');

            KTUtil.removeClass(body, the.classShown);
            KTUtil.removeClass(element, the.classShown);

            the.state = 'hidden';

            if (the.options.overlay && the.overlay) {
                KTUtil.remove(the.overlay);
            }

            KTUtil.transitionEnd(element, function() {
                KTUtil.css(element, 'opacity', '0');
            });

            Plugin.eventTrigger('afterHide');
        },

        togglerClass: function(target, mode) {
            // Toggler
            var id = KTUtil.attr(target, 'id');
            var toggleBy;

            if (the.options.toggleBy && the.options.toggleBy[0] && the.options.toggleBy[0].target) {
                for (var i in the.options.toggleBy) {
                    if (the.options.toggleBy[i].target === id) {
                        toggleBy = the.options.toggleBy[i];
                    }        
                }
            } else if (the.options.toggleBy && the.options.toggleBy.target) {
                toggleBy = the.options.toggleBy;
            }

            if (toggleBy) {                
                var el = KTUtil.get(toggleBy.target);
                
                if (mode === 'show') {
                    KTUtil.addClass(el, toggleBy.state);
                }

                if (mode === 'hide') {
                    KTUtil.removeClass(el, toggleBy.state);
                }
            }
        },

        eventTrigger: function(name, args) {
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            event.handler.call(this, the, args);
                        }
                    } else {
                        event.handler.call(this, the, args);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////
    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    the.isShown = function() {
        return Plugin.isShown();
    };

    the.hide = function() {
        return Plugin.hide();
    };

    the.show = function() {
        return Plugin.show();
    };

    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    // Run plugin
    Plugin.construct.apply(the, [options]);

    // Init done
    init = true;

    // Return plugin instance
    return the;
};
"use strict";
// plugin setup
var KTPortlet = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.get(elementId);
    var body = KTUtil.get('body');

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {
        bodyToggleSpeed: 400,
        tooltips: true,
        tools: {
            toggle: {
                collapse: 'Collapse',
                expand: 'Expand'
            },
            reload: 'Reload',
            remove: 'Remove',
            fullscreen: {
                on: 'Fullscreen',
                off: 'Exit Fullscreen'
            }
        },
        sticky: {
            offset: 300,
            zIndex: 101
        }
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Construct
         */

        construct: function(options) {
            if (KTUtil.data(element).has('portlet')) {
                the = KTUtil.data(element).get('portlet');
            } else {
                // reset menu
                Plugin.init(options);

                // build menu
                Plugin.build();

                KTUtil.data(element).set('portlet', the);
            }

            return the;
        },

        /**
         * Init portlet
         */
        init: function(options) {
            the.element = element;
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);
            the.head = KTUtil.child(element, '.kt-portlet__head');
            the.foot = KTUtil.child(element, '.kt-portlet__foot');

            if (KTUtil.child(element, '.kt-portlet__body')) {
                the.body = KTUtil.child(element, '.kt-portlet__body');
            } else if (KTUtil.child(element, '.kt-form')) {
                the.body = KTUtil.child(element, '.kt-form');
            }
        },

        /**
         * Build Form Wizard
         */
        build: function() {
            // Remove
            var remove = KTUtil.find(the.head, '[data-ktportlet-tool=remove]');
            if (remove) {
                KTUtil.addEvent(remove, 'click', function(e) {
                    e.preventDefault();
                    Plugin.remove();
                });
            }

            // Reload
            var reload = KTUtil.find(the.head, '[data-ktportlet-tool=reload]');
            if (reload) {
                KTUtil.addEvent(reload, 'click', function(e) {
                    e.preventDefault();
                    Plugin.reload();
                });
            }

            // Toggle
            var toggle = KTUtil.find(the.head, '[data-ktportlet-tool=toggle]');
            if (toggle) {
                KTUtil.addEvent(toggle, 'click', function(e) {
                    e.preventDefault();
                    Plugin.toggle();
                });
            }

            //== Fullscreen
            var fullscreen = KTUtil.find(the.head, '[data-ktportlet-tool=fullscreen]');
            if (fullscreen) {
                KTUtil.addEvent(fullscreen, 'click', function(e) {
                    e.preventDefault();
                    Plugin.fullscreen();
                });
            }

            Plugin.setupTooltips();
        },

        /**
         * Enable stickt mode
         */
        initSticky: function() {
            var lastScrollTop = 0;
            var offset = the.options.sticky.offset;

            if (!the.head) {
                return;
            }

	        window.addEventListener('scroll', Plugin.onScrollSticky);
        },

	    /**
	     * Window scroll handle event for sticky portlet
	     */
	    onScrollSticky: function(e) {
		    var offset = the.options.sticky.offset;
		    if(isNaN(offset)) return;

		    var st = document.documentElement.scrollTop;

		    if (st >= offset && KTUtil.hasClass(body, 'kt-portlet--sticky') === false) {
			    Plugin.eventTrigger('stickyOn');

			    KTUtil.addClass(body, 'kt-portlet--sticky');
			    KTUtil.addClass(element, 'kt-portlet--sticky');

			    Plugin.updateSticky();

		    } else if ((st*1.5) <= offset && KTUtil.hasClass(body, 'kt-portlet--sticky')) {
			    // back scroll mode
			    Plugin.eventTrigger('stickyOff');

			    KTUtil.removeClass(body, 'kt-portlet--sticky');
			    KTUtil.removeClass(element, 'kt-portlet--sticky');

			    Plugin.resetSticky();
		    }
	    },

        updateSticky: function() {
            if (!the.head) {
                return;
            }

            var top;

            if (KTUtil.hasClass(body, 'kt-portlet--sticky')) {
                if (the.options.sticky.position.top instanceof Function) {
                    top = parseInt(the.options.sticky.position.top.call());
                } else {
                    top = parseInt(the.options.sticky.position.top);
                }

                var left;
                if (the.options.sticky.position.left instanceof Function) {
                    left = parseInt(the.options.sticky.position.left.call());
                } else {
                    left = parseInt(the.options.sticky.position.left);
                }

                var right;
                if (the.options.sticky.position.right instanceof Function) {
                    right = parseInt(the.options.sticky.position.right.call());
                } else {
                    right = parseInt(the.options.sticky.position.right);
                }

                KTUtil.css(the.head, 'z-index', the.options.sticky.zIndex);
                KTUtil.css(the.head, 'top', top + 'px');
                KTUtil.css(the.head, 'left', left + 'px');
                KTUtil.css(the.head, 'right', right + 'px');
            }
        },

        resetSticky: function() {
            if (!the.head) {
                return;
            }

            if (KTUtil.hasClass(body, 'kt-portlet--sticky') === false) {
                KTUtil.css(the.head, 'z-index', '');
                KTUtil.css(the.head, 'top', '');
                KTUtil.css(the.head, 'left', '');
                KTUtil.css(the.head, 'right', '');
            }
        },

        /**
         * Remove portlet
         */
        remove: function() {
            if (Plugin.eventTrigger('beforeRemove') === false) {
                return;
            }

            if (KTUtil.hasClass(body, 'kt-portlet--fullscreen') && KTUtil.hasClass(element, 'kt-portlet--fullscreen')) {
                Plugin.fullscreen('off');
            }

            Plugin.removeTooltips();

            KTUtil.remove(element);

            Plugin.eventTrigger('afterRemove');
        },

        /**
         * Set content
         */
        setContent: function(html) {
            if (html) {
                the.body.innerHTML = html;
            }
        },

        /**
         * Get body
         */
        getBody: function() {
            return the.body;
        },

        /**
         * Get self
         */
        getSelf: function() {
            return element;
        },

        /**
         * Setup tooltips
         */
        setupTooltips: function() {
            if (the.options.tooltips) {
                var collapsed = KTUtil.hasClass(element, 'kt-portlet--collapse') || KTUtil.hasClass(element, 'kt-portlet--collapsed');
                var fullscreenOn = KTUtil.hasClass(body, 'kt-portlet--fullscreen') && KTUtil.hasClass(element, 'kt-portlet--fullscreen');

                //== Remove
                var remove = KTUtil.find(the.head, '[data-ktportlet-tool=remove]');
                if (remove) {
                    var placement = (fullscreenOn ? 'bottom' : 'top');
                    var tip = new Tooltip(remove, {
                        title: the.options.tools.remove,
                        placement: placement,
                        offset: (fullscreenOn ? '0,10px,0,0' : '0,5px'),
                        trigger: 'hover',
                        template: '<div class="tooltip tooltip-portlet tooltip bs-tooltip-' + placement + '" role="tooltip">\
                            <div class="tooltip-arrow arrow"></div>\
                            <div class="tooltip-inner"></div>\
                        </div>'
                    });

                    KTUtil.data(remove).set('tooltip', tip);
                }

                //== Reload
                var reload = KTUtil.find(the.head, '[data-ktportlet-tool=reload]');
                if (reload) {
                    var placement = (fullscreenOn ? 'bottom' : 'top');
                    var tip = new Tooltip(reload, {
                        title: the.options.tools.reload,
                        placement: placement,
                        offset: (fullscreenOn ? '0,10px,0,0' : '0,5px'),
                        trigger: 'hover',
                        template: '<div class="tooltip tooltip-portlet tooltip bs-tooltip-' + placement + '" role="tooltip">\
                            <div class="tooltip-arrow arrow"></div>\
                            <div class="tooltip-inner"></div>\
                        </div>'
                    });

                    KTUtil.data(reload).set('tooltip', tip);
                }

                //== Toggle
                var toggle = KTUtil.find(the.head, '[data-ktportlet-tool=toggle]');
                if (toggle) {
                    var placement = (fullscreenOn ? 'bottom' : 'top');
                    var tip = new Tooltip(toggle, {
                        title: (collapsed ? the.options.tools.toggle.expand : the.options.tools.toggle.collapse),
                        placement: placement,
                        offset: (fullscreenOn ? '0,10px,0,0' : '0,5px'),
                        trigger: 'hover',
                        template: '<div class="tooltip tooltip-portlet tooltip bs-tooltip-' + placement + '" role="tooltip">\
                            <div class="tooltip-arrow arrow"></div>\
                            <div class="tooltip-inner"></div>\
                        </div>'
                    });

                    KTUtil.data(toggle).set('tooltip', tip);
                }

                //== Fullscreen
                var fullscreen = KTUtil.find(the.head, '[data-ktportlet-tool=fullscreen]');
                if (fullscreen) {
                    var placement = (fullscreenOn ? 'bottom' : 'top');
                    var tip = new Tooltip(fullscreen, {
                        title: (fullscreenOn ? the.options.tools.fullscreen.off : the.options.tools.fullscreen.on),
                        placement: placement,
                        offset: (fullscreenOn ? '0,10px,0,0' : '0,5px'),
                        trigger: 'hover',
                        template: '<div class="tooltip tooltip-portlet tooltip bs-tooltip-' + placement + '" role="tooltip">\
                            <div class="tooltip-arrow arrow"></div>\
                            <div class="tooltip-inner"></div>\
                        </div>'
                    });

                    KTUtil.data(fullscreen).set('tooltip', tip);
                }
            }
        },

        /**
         * Setup tooltips
         */
        removeTooltips: function() {
            if (the.options.tooltips) {
                //== Remove
                var remove = KTUtil.find(the.head, '[data-ktportlet-tool=remove]');
                if (remove && KTUtil.data(remove).has('tooltip')) {
                    KTUtil.data(remove).get('tooltip').dispose();
                }

                //== Reload
                var reload = KTUtil.find(the.head, '[data-ktportlet-tool=reload]');
                if (reload && KTUtil.data(reload).has('tooltip')) {
                    KTUtil.data(reload).get('tooltip').dispose();
                }

                //== Toggle
                var toggle = KTUtil.find(the.head, '[data-ktportlet-tool=toggle]');
                if (toggle && KTUtil.data(toggle).has('tooltip')) {
                    KTUtil.data(toggle).get('tooltip').dispose();
                }

                //== Fullscreen
                var fullscreen = KTUtil.find(the.head, '[data-ktportlet-tool=fullscreen]');
                if (fullscreen && KTUtil.data(fullscreen).has('tooltip')) {
                    KTUtil.data(fullscreen).get('tooltip').dispose();
                }
            }
        },

        /**
         * Reload
         */
        reload: function() {
            Plugin.eventTrigger('reload');
        },

        /**
         * Toggle
         */
        toggle: function() {
            if (KTUtil.hasClass(element, 'kt-portlet--collapse') || KTUtil.hasClass(element, 'kt-portlet--collapsed')) {
                Plugin.expand();
            } else {
                Plugin.collapse();
            }
        },

        /**
         * Collapse
         */
        collapse: function() {
            if (Plugin.eventTrigger('beforeCollapse') === false) {
                return;
            }

            KTUtil.slideUp(the.body, the.options.bodyToggleSpeed, function() {
                Plugin.eventTrigger('afterCollapse');
            });

            KTUtil.addClass(element, 'kt-portlet--collapse');

            var toggle = KTUtil.find(the.head, '[data-ktportlet-tool=toggle]');
            if (toggle && KTUtil.data(toggle).has('tooltip')) {
                KTUtil.data(toggle).get('tooltip').updateTitleContent(the.options.tools.toggle.expand);
            }
        },

        /**
         * Expand
         */
        expand: function() {
            if (Plugin.eventTrigger('beforeExpand') === false) {
                return;
            }

            KTUtil.slideDown(the.body, the.options.bodyToggleSpeed, function() {
                Plugin.eventTrigger('afterExpand');
            });

            KTUtil.removeClass(element, 'kt-portlet--collapse');
            KTUtil.removeClass(element, 'kt-portlet--collapsed');

            var toggle = KTUtil.find(the.head, '[data-ktportlet-tool=toggle]');
            if (toggle && KTUtil.data(toggle).has('tooltip')) {
                KTUtil.data(toggle).get('tooltip').updateTitleContent(the.options.tools.toggle.collapse);
            }
        },

        /**
         * fullscreen
         */
        fullscreen: function(mode) {
            var d = {};
            var speed = 300;

            if (mode === 'off' || (KTUtil.hasClass(body, 'kt-portlet--fullscreen') && KTUtil.hasClass(element, 'kt-portlet--fullscreen'))) {
                Plugin.eventTrigger('beforeFullscreenOff');

                KTUtil.removeClass(body, 'kt-portlet--fullscreen');
                KTUtil.removeClass(element, 'kt-portlet--fullscreen');

                Plugin.removeTooltips();
                Plugin.setupTooltips();

                if (the.foot) {
                    KTUtil.css(the.body, 'margin-bottom', '');
                    KTUtil.css(the.foot, 'margin-top', '');
                }

                Plugin.eventTrigger('afterFullscreenOff');
            } else {
                Plugin.eventTrigger('beforeFullscreenOn');

                KTUtil.addClass(element, 'kt-portlet--fullscreen');
                KTUtil.addClass(body, 'kt-portlet--fullscreen');

                Plugin.removeTooltips();
                Plugin.setupTooltips();


                if (the.foot) {
                    var height1 = parseInt(KTUtil.css(the.foot, 'height'));
                    var height2 = parseInt(KTUtil.css(the.foot, 'height')) + parseInt(KTUtil.css(the.head, 'height'));
                    KTUtil.css(the.body, 'margin-bottom', height1 + 'px');
                    KTUtil.css(the.foot, 'margin-top', '-' + height2 + 'px');
                }

                Plugin.eventTrigger('afterFullscreenOn');
            }
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name) {
            //KTUtil.triggerCustomEvent(name);
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            event.handler.call(this, the);
                        }
                    } else {
                        event.handler.call(this, the);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });

            return the;
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Remove portlet
     * @returns {KTPortlet}
     */
    the.remove = function() {
        return Plugin.remove(html);
    };

    /**
     * Remove portlet
     * @returns {KTPortlet}
     */
    the.initSticky = function() {
        return Plugin.initSticky();
    };

    /**
     * Remove portlet
     * @returns {KTPortlet}
     */
    the.updateSticky = function() {
        return Plugin.updateSticky();
    };

    /**
     * Remove portlet
     * @returns {KTPortlet}
     */
    the.resetSticky = function() {
        return Plugin.resetSticky();
    };

	/**
	 * Destroy sticky portlet
	 */
	the.destroySticky = function() {
		Plugin.resetSticky();
		window.removeEventListener('scroll', Plugin.onScrollSticky);
	};

    /**
     * Reload portlet
     * @returns {KTPortlet}
     */
    the.reload = function() {
        return Plugin.reload();
    };

    /**
     * Set portlet content
     * @returns {KTPortlet}
     */
    the.setContent = function(html) {
        return Plugin.setContent(html);
    };

    /**
     * Toggle portlet
     * @returns {KTPortlet}
     */
    the.toggle = function() {
        return Plugin.toggle();
    };

    /**
     * Collapse portlet
     * @returns {KTPortlet}
     */
    the.collapse = function() {
        return Plugin.collapse();
    };

    /**
     * Expand portlet
     * @returns {KTPortlet}
     */
    the.expand = function() {
        return Plugin.expand();
    };

    /**
     * Fullscreen portlet
     * @returns {MPortlet}
     */
    the.fullscreen = function() {
        return Plugin.fullscreen('on');
    };

    /**
     * Fullscreen portlet
     * @returns {MPortlet}
     */
    the.unFullscreen = function() {
        return Plugin.fullscreen('off');
    };

    /**
     * Get portletbody
     * @returns {jQuery}
     */
    the.getBody = function() {
        return Plugin.getBody();
    };

    /**
     * Get portletbody
     * @returns {jQuery}
     */
    the.getSelf = function() {
        return Plugin.getSelf();
    };

    /**
     * Attach event
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    // Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};
"use strict";
var KTScrolltop = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.get(elementId);
    var body = KTUtil.get('body');

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {
        offset: 300,
        speed: 600,
        toggleClass: 'kt-scrolltop--on'
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Run plugin
         * @returns {mscrolltop}
         */
        construct: function(options) {
            if (KTUtil.data(element).has('scrolltop')) {
                the = KTUtil.data(element).get('scrolltop');
            } else {
                // reset scrolltop
                Plugin.init(options);

                // build scrolltop
                Plugin.build();

                KTUtil.data(element).set('scrolltop', the);
            }

            return the;
        },

        /**
         * Handles subscrolltop click toggle
         * @returns {mscrolltop}
         */
        init: function(options) {
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);
        },

        build: function() {
            // handle window scroll
            if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                window.addEventListener('touchend', function() {
                    Plugin.handle();
                });

                window.addEventListener('touchcancel', function() {
                    Plugin.handle();
                });

                window.addEventListener('touchleave', function() {
                    Plugin.handle();
                });
            } else {
                window.addEventListener('scroll', function() { 
                    Plugin.handle();
                });
            }

            // handle button click 
            KTUtil.addEvent(element, 'click', Plugin.scroll);
        },

        /**
         * Handles scrolltop click scrollTop
         */
        handle: function() {
            var pos = window.pageYOffset; // current vertical position
            if (pos > the.options.offset) {
                KTUtil.addClass(body, the.options.toggleClass);
            } else {
                KTUtil.removeClass(body, the.options.toggleClass);
            }
        },

        /**
         * Handles scrolltop click scrollTop
         */
        scroll: function(e) {
            e.preventDefault();

            KTUtil.scrollTop(0, the.options.speed);
        },


        /**
         * Trigger events
         */
        eventTrigger: function(name, args) {
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            event.handler.call(this, the, args);
                        }
                    } else {
                        event.handler.call(this, the, args);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options 
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Get subscrolltop mode
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Set scrolltop content
     * @returns {mscrolltop}
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    // Run plugin
    Plugin.construct.apply(the, [options]);

    // Init done
    init = true;

    // Return plugin instance
    return the;
};
/**
 * @class KTTabPage 标签页
 */
var KTTabPage = function (selector, options) {
    var app = KTApp;
    var util = KTUtil;

    var the = this;
    var element = $(selector);
    if (element.length > 0) {
        return;
    }

    /**
     * 默认设置
     * @type {{}}
     */
    var defaultOptions = {
        tabNameLength: 10,
        toLeft: $('.to-left'),
        toRight: $('.to-right'),
        tool: {
            refreshPage: $('.refresh-page'),
            closeOther: $('.close-other'),
            closeAll: $('.close-all')
        },
        containerScroll: $('.container-scroll'),
        conTabs: $('.con-tabs'),
        pageContainer: $('.page-container'),
        tabPage: $('.tab-page')
    };

    /**
     * 私有方法
     */
    var Plugin = {
        index: 1,
        /**
         * Construct
         */
        construct: function (options) {
            // 初始化
            Plugin.init(options);
            // 绑定事件
            Plugin.build();
            return the;
        },
        build: function () {
            // 点击向左按钮
            defaultOptions.toLeft.click(function () {
                var marginLeft = Number(defaultOptions.conTabs.css('margin-left').replace('px', ''));
                if (marginLeft !== 0) {
                    var tabsScrollWidth = Plugin.calcWidth(defaultOptions.containerScroll); // tab 工具条可视宽度
                    var targetMarginLeft = marginLeft + (tabsScrollWidth * 0.8);
                    if (targetMarginLeft > 0) {
                        targetMarginLeft = 0;
                    }
                    defaultOptions.conTabs.animate({marginLeft: targetMarginLeft + 'px'}, 'fast');
                }
            });
            // 点击向右按钮
            defaultOptions.toRight.click(function () {
                var marginLeft = Number(defaultOptions.conTabs.css('margin-left').replace('px', ''));
                var tabsScrollWidth = Plugin.calcWidth(defaultOptions.containerScroll); // tab 工具条可视宽度
                var conTabsWidth = Plugin.calcWidth(defaultOptions.conTabs.children()); // tab 总宽
                var targetMarginLeft = marginLeft - (tabsScrollWidth * 0.8);

                if (Math.abs(targetMarginLeft) > (conTabsWidth - tabsScrollWidth)) {
                    targetMarginLeft = (conTabsWidth - tabsScrollWidth) * -1;
                }
                if(targetMarginLeft > 0){
                    targetMarginLeft = 0;
                }
                defaultOptions.conTabs.animate({marginLeft: targetMarginLeft + 'px'}, 'fast');
            });
            // 刷新按钮
            defaultOptions.tool.refreshPage.click(function () {
                Plugin.refreshActivePage();
            });
            // 关闭全部 (只关闭允许关闭的tab)
            defaultOptions.tool.closeAll.click(function () {
                var retainTab = null;
                defaultOptions.conTabs.children().each(function () {
                    var $this = $(this);
                    var $tabClose = $this.find('.tab-close');
                    if ($tabClose != null && $tabClose.length > 0) {
                        Plugin.closeTab($this);
                    } else {
                        retainTab = $this;
                    }
                });
                if (retainTab != null) {
                    Plugin.setTabState(retainTab.find('a.btn'), true);
                }
                Plugin.toActiveTab();
            });
            // 关闭其他
            defaultOptions.tool.closeOther.click(function () {
                defaultOptions.conTabs.children().each(function () {
                    var $this = $(this);
                    var $tabClose = $this.find('.tab-close');
                    if ($tabClose != null && $tabClose.length > 0 && !$this.hasClass('active')) {
                        Plugin.closeTab($this);
                    }
                });
                Plugin.toActiveTab();
            });
        },
        /**
         * 初始化
         */
        init: function () {
            Plugin.bindClickTab(); // 绑定点击tab事件
        },

        /**
         * 关闭tab事件
         */
        bindClose: function () {
            defaultOptions.conTabs.find('.tab-close').unbind('click').click(function () {
                Plugin.closeTab($(this).parents('li'));
            });
        },
        /**
         * 点击tab事件
         */
        bindClickTab: function () {
            var alreadyClickedTimeout;
            defaultOptions.conTabs.on('click', 'a.btn', function () {
                var $tab = $(this);
                if ($tab.data('alreadyClicked')) {
                    // 双击
                    console.log('dblclick');
                    $tab.data('alreadyClicked', false); // 重置点击状态
                    clearTimeout(alreadyClickedTimeout); // 阻止单击事件执行

                    if ($tab.parent().hasClass('active')) { // 如果用户双击已激活tab,刷新页面
                        Plugin.refreshActivePage();
                    }
                } else {
                    $tab.data('alreadyClicked', true);
                    alreadyClickedTimeout = setTimeout(function () {
                        $tab.data('alreadyClicked', false); // 重置点击状态
                        // 单击
                        console.log('click');
                        if(!$tab.parent().hasClass('active')){
                            $tab.data('alreadyClicked', false); // 重置点击状态
                            defaultOptions.conTabs.children('.active').removeClass('active');
                            defaultOptions.pageContainer.children('.active').removeClass('active');
                            Plugin.setTabState($tab, true);
                            Plugin.toActiveTab();
                            Plugin.customCallback();
                        }
                    }, 200); // 点击事件间隔300毫秒以内会被认为是双击
                }
                return false;
            });
        },

        /**
         * 刷新当前激活标签页
         */
        refreshActivePage: function (url) {
            if(KTUtil.isBlank(url)){
                url = defaultOptions.conTabs.children('.active').find('a.btn').attr('data-url');
            }
            var $iframe = defaultOptions.pageContainer.find('iframe.page-frame[src="' + url + '"]');
            if($iframe.length){
                $iframe.attr('src', url);
            }
        },
        /**
         * 显示请等待提示
         */
        showWaitTip: function () {
            app.blockPage({
                overlayColor: '#000000',
                type: 'loader',
                state: 'success',
                message: '请稍候...'
            });
        },
        /**
         * 隐藏请等待提示
         */
        hideWaitTip: function () {
            app.unblockPage();
        },

        /**
         * 显示指定tab内容
         *
         * @param $tab (a.btn)
         * @param isShow {boolean} 是否显示
         */
        setTabState: function ($tab, isShow) {
            var url = $tab.attr('data-url');
            if (isShow) {
                defaultOptions.pageContainer.find('iframe.page-frame[src="' + url + '"]').addClass('active');
                $tab.parent().addClass('active');
            } else {
                defaultOptions.pageContainer.find('iframe.page-frame[src="' + url + '"]').removeClass('active');
                $tab.parent().removeClass('active');
            }
        },
        /**
         * 关闭标签页
         * @param $tab 标签页 (li)
         */
        closeTab: function ($tab) {
            var url = $tab.find('a').data('url');
            var nextTab;
            if ($tab.hasClass('active')) { // 如果关闭的是当前激活tab,自动切换到前/后的标签
                nextTab = $tab.prev();
                if (nextTab == null || nextTab.length === 0) {
                    nextTab = $tab.next();
                }
            }
            $tab.remove();
            defaultOptions.pageContainer.find('iframe.page-frame[src="' + url + '"]').remove();
            if (nextTab != null) {
                Plugin.setTabState(nextTab.find('a.btn'), true);
                Plugin.toActiveTab();
                Plugin.customCallback();
            }
        },
        /**
         * 关闭指定url页面
         * @param url 页面url
         */
        closeTabByUrl: function (url) {
            var a = defaultOptions.conTabs.find('a.btn[data-url="' + url + '"]');
            if (a != null && a.length > 0) {
                Plugin.closeTab(a.parent());
            } else {
                console.warn('关闭页面[' + url + ']失败,url未在应用中打开');
            }
        },
        /**
         * 添加Tab页
         * @param name 标签页名称
         * @param url 地址
         * @param canClose 是否可以关闭
         */
        addTab: function (name, url, canClose) {
                if (util.isBlank(url)) return;
            if (Plugin.needOpen(url)) {
                Plugin.index++;
                name = name.trim();
                var _tab = '<li class="active">' +
                    '<a class="btn btn-default m-btn--icon tab" href="javascript:;" data-url="' + url + '" title="' + name + '" target="iframe-' + Plugin.index + '" data-alreadyClicked="false"><span>' +
                    Plugin.getTabName(name) + ((typeof canClose === 'undefined' || canClose) ? '<i class="tab-close la la-close"></i>' : '') + '</span></a></li>';
                var _iframe = '<iframe src="' + url + '" frameborder="0" name="iframe-' + Plugin.index + '" class="page-frame active animation-fade"></iframe>';
                defaultOptions.conTabs.children('.active').removeClass('active');
                defaultOptions.pageContainer.children('.active').removeClass('active');
                defaultOptions.conTabs.append(_tab);
                defaultOptions.pageContainer.append(_iframe);
                defaultOptions.conTabs.width(Plugin.calcWidth(defaultOptions.conTabs.children()));
                Plugin.bindClose(); // 绑定点击关闭事件
            } else {
                Plugin.setTabState(defaultOptions.conTabs.find('.active').find('a.btn'), false);
                Plugin.setTabState(defaultOptions.conTabs.find('[data-url="' + url + '"]'), true);
                Plugin.customCallback();
            }
            Plugin.toActiveTab();
        },
        /**
         * 执行自定义回调
         */
        customCallback: function () {
            var iframe = defaultOptions.pageContainer.children('.active');
            if (iframe.length > 0) {
                if(typeof iframe[0].contentWindow.KTTab !== 'undefined'){
                    // 检查是否需要刷新页面
                    if (util.isFunction(iframe[0].contentWindow.KTTab.needRefresh) && iframe[0].contentWindow.KTTab.needRefresh()) {
                        Plugin.refreshActivePage();
                    }
                    // 检查是否需要提交表单
                    if (util.isFunction(iframe[0].contentWindow.KTTab.needSubmitForm) && iframe[0].contentWindow.KTTab.needSubmitForm()) {
                        var $btn = $(iframe[0].contentDocument).find('.btn.btn-search');
                        if ($btn.length > 0) {
                            $btn.click();
                        }
                    }
                }
            }
        },
        /**
         * 跳转到当前激活
         */
        toActiveTab: function () {
            var $activeTab = defaultOptions.conTabs.find('.active');
            var activeWidth = Plugin.calcWidth($activeTab); // 当前激活tab宽度
            var prevAllWidth = Plugin.calcWidth($activeTab.prevAll()); // 当前激活tab前面tabs总宽
            var tabsScrollWidth = Plugin.calcWidth(defaultOptions.containerScroll); // tab 工具条可视宽度
            var conTabsWidth = Plugin.calcWidth(defaultOptions.conTabs.children()); // tab 总宽
            var marginLeft = Number(defaultOptions.conTabs.css('margin-left').replace('px', ''));
            if (conTabsWidth > tabsScrollWidth) {
                if (Math.abs(marginLeft) > prevAllWidth) { // 目标标签页隐藏在左侧
                    marginLeft = prevAllWidth * -1;
                } else if ((Math.abs(marginLeft) + tabsScrollWidth) < (prevAllWidth + activeWidth)) { // 目标标签页隐藏在右侧
                    marginLeft = (prevAllWidth + activeWidth - tabsScrollWidth) * -1;
                }
            } else {
                marginLeft = 0;
            }
            defaultOptions.conTabs.animate({marginLeft: marginLeft + 'px'}, 'fast');
        },
        /**
         * 计算总宽度
         * @param $tabs
         * @returns {number}
         */
        calcWidth: function ($tabs) {
            if ($tabs != null && $tabs.length > 0) {
                var width = 0;
                $($tabs).each(function () {
                    width += $(this).outerWidth(true);
                });
                // 有时会出现标签页换行问题,所以这里多加30px
                width += 30;
                return Math.ceil(width);
            }
            return 0;
        },
        /**
         * 获取标签页名称
         * @param name
         * @returns {string}
         */
        getTabName: function (name) {
            if (util.isNotBlank(name)) {
                return util.subStr(name, defaultOptions.tabNameLength);
            } else {
                return '新建标签页';
            }
        },
        /**
         * 检查url是否需要打开
         * @param url 链接地址
         * @returns {boolean}
         */
        needOpen: function (url) {
            if (util.isNotBlank(url)) {
                var $tab = defaultOptions.conTabs.find('[data-url="' + url + '"]');
                return $tab.length === 0;
            }
            return false;
        }
    };

    //////////////////////////
    // **     开放方法    ** //
    //////////////////////////
    /**
     * 添加Tab页
     * @param name {string} 标签页名称
     * @param url {string} 页面url
     * @param canClose {boolean} 是否可以关闭
     */
    the.addTab = function (name, url, canClose) {
        return Plugin.addTab(name, url, canClose);
    };
    /**
     * 关闭指定url页面
     *
     * @param url {string} 页面url
     */
    the.closeTabByUrl = function (url) {
        return Plugin.closeTabByUrl(url);
    };
    /**
     * 刷新指定页面
     *
     * @param url {string} 页面url
     */
    the.refresh = function (url) {
        Plugin.refreshActivePage(url);
    };
    //== Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};
/**
 * tab callback
 * @type {{needRefresh: (function(): boolean), needSubmitForm: (function(): boolean)}}
 */
var KTTab = {
    /**
     * 激活当前TAB是否需要刷新当前页面
     *
     * @returns {boolean}
     */
    needRefresh: function () {
        return false;
    },
    /**
     * 激活当前tab是否需要提交查询表单
     *
     * @returns {boolean}
     */
    needSubmitForm: function () {
        return false;
    }
};
"use strict";

// plugin setup
var KTToggle = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.get(elementId);
    var body = KTUtil.get('body');  

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {
        togglerState: '',
        targetState: ''
    };    

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Construct
         */

        construct: function(options) {
            if (KTUtil.data(element).has('toggle')) {
                the = KTUtil.data(element).get('toggle');
            } else {
                // reset menu
                Plugin.init(options);

                // build menu
                Plugin.build();

                KTUtil.data(element).set('toggle', the);
            }

            return the;
        },

        /**
         * Handles subtoggle click toggle
         */
        init: function(options) {
            the.element = element;
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);

            the.target = KTUtil.get(the.options.target);
            the.targetState = the.options.targetState;
            the.togglerState = the.options.togglerState;

            the.state = KTUtil.hasClasses(the.target, the.targetState) ? 'on' : 'off';
        },

        /**
         * Setup toggle
         */
        build: function() {
            KTUtil.addEvent(element, 'mouseup', Plugin.toggle);
        },
        
        /**
         * Handles offcanvas click toggle
         */
        toggle: function(e) {
            Plugin.eventTrigger('beforeToggle');

            if (the.state == 'off') {
                Plugin.toggleOn();
            } else {
                Plugin.toggleOff();
            }

            Plugin.eventTrigger('afterToggle');

            e.preventDefault();

            return the;
        },

        /**
         * Handles toggle click toggle
         */
        toggleOn: function() {
            Plugin.eventTrigger('beforeOn');

            KTUtil.addClass(the.target, the.targetState);

            if (the.togglerState) {
                KTUtil.addClass(element, the.togglerState);
            }

            the.state = 'on';

            Plugin.eventTrigger('afterOn');

            Plugin.eventTrigger('toggle');

            return the;
        },

        /**
         * Handles toggle click toggle
         */
        toggleOff: function() {
            Plugin.eventTrigger('beforeOff');

            KTUtil.removeClass(the.target, the.targetState);

            if (the.togglerState) {
                KTUtil.removeClass(element, the.togglerState);
            }

            the.state = 'off';

            Plugin.eventTrigger('afterOff');

            Plugin.eventTrigger('toggle');

            return the;
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name) {
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];

                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;                            
                            event.handler.call(this, the);
                        }
                    } else {
                        event.handler.call(this, the);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });

            return the;
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options 
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Get toggle state 
     */
    the.getState = function() {
        return the.state;
    };

    /**
     * Toggle 
     */
    the.toggle = function() {
        return Plugin.toggle();
    };

    /**
     * Toggle on 
     */
    the.toggleOn = function() {
        return Plugin.toggleOn();
    };

    /**
     * Toggle off 
     */
    the.toggleOff = function() {
        return Plugin.toggleOff();
    };

    /**
     * Attach event
     * @returns {KTToggle}
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     * @returns {KTToggle}
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    // Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};
/**
 * 业务工具类
 */
var KTTool = function () {
    var util = KTUtil;
    var app = KTApp;
    // 默认设置
    var defaultOptions = {
        currentUser: 'current_user', // 缓存中当前登录用户key
        httpCode: {
            success: 200, // 成功
            bad_request: 400, // 无效请求
            unauthorized: 403, // 无权访问
            internalServerError: 500 // 异常
        },
        /**
         * 默认提示文字
         */
        commonTips: {
            unauthorized: '无权访问',
            delete: {
                title: '确定要删除吗？',
                subtitle: '删除后无法恢复，请谨慎操作',
                success: '数据已删除'
            },
            save: {
                default: '您的数据已保存!',
                add: '您新增的数据已保存!',
                update: '您修改的数据已保存!'
            },
            noIds: '请在下方表格中勾选需要操作的数据后重试',
            success: '操作成功',
            fail: '操作失败'
        },
        urlSuffix: {
            /**
             * 新增默认访问后缀 (示例: /add、/add/{pId})
             */
            add: 'add/',
            /**
             * 根据id删除数据默认访问后缀 (示例: delete/1)
             */
            deleteById: 'delete/',
            /**
             * 根据id修改数据默认访问后缀 (示例: input/1)
             */
            input: 'input/',
            /**
             * 批量删除默认访问后缀 (示例: /batch/delete/1,2,3)
             * 获取当前表单中已选中表格中的checkbox的值使用[,]拼接,并将其作为参数传入
             */
            // batchDelete: 'batch/delete/',
            /**
             * 保存默认访问后缀 (示例: /save/data)
             * 会将当前所在form中表单元素作为参数传入
             */
            saveData: 'save/data',
            /**
             * 查询默认访问后缀 (示例: /select)
             * 会将当前所在form中表单元素作为参数传入
             */
            select: 'select',
            /**
             * 导出数据默认访问后缀 (示例: /export/data)
             * 会将当前所在form中表单元素作为参数传入
             */
            exportData: 'export/data',

            /**
             * 导入数据默认访问后缀 (示例: /export/data/templateCode)
             */
            importData: 'import/data'
        },
        /**
         * DataTable 默认参数
         */
        dataTable: {
            page: {
                // 默认页大小
                size: 15
            },
            layout: {
                // 默认高度
                height: 435
            }
        }
    };
    // controller 根路径
    var baseUrl = null;
    /**
     * 设置业务通用url部分
     *
     * @param url {string} 访问地址
     */
    var setBaseUrl = function (url) {
        baseUrl = url;
    };
    /**
     * 打开新增页面
     * @param element {object} html 元素对象 (必要)
     * @param name {string|null} tab页名称 (非必要,默认: 新增数据)
     * @param url {string|null} 请求地址 (非必要,默认规则生成)
     * @param pId {string|null} 父Id (非必要)
     */
    var addData = function (element, name, url, pId) {
        if (typeof element !== 'undefined') {
            util.setButtonWait(element);
        }
        // 检查&获取请求地址
        if(util.isBlank(url)){
            url = getUrl(url, 'add', pId);
            if (util.isBlank(url)) return;
        }

        var params = getAutoParams(element);
        if (util.isNotBlank(params)) {
            url += '?' + params;
        }
        if (util.isBlank(name)) {
            name = $(element).text();
            if (util.isBlank(name)) {
                name = '新增数据';
            }else{
                name = name.trim();
            }
        }
        app.openPage(name, url);
        if (typeof element !== 'undefined') {
            util.offButtonWait(element);
        }
    };
    /**
     * 获取需要自动添加到url中的参数
     *
     * @param element {object} html 元素对象
     * @returns {*}
     */
    var getAutoParams = function (element) {
        if (typeof element !== 'undefined') {
            return $(element).parents('.kt-form').find('.auto-params').serialize();
        } else {
            return null;
        }
    };
    /**
     * 删除数据
     *
     * @param element {object} html 元素对象 (必要)
     * @param id {string|null} 要删除的id (非必要)
     * @param url {string|null} 请求地址 (非必要,默认规则生成)
     * @param needAlert {boolean|null} 是否需要弹出处理结果提示 (非必要,默认true)
     * @param callback {function|null}  回调函数 (非必要)
     */
    var deleteData = function (element, id, url, needAlert, callback) {
        var $dataTable = $(element).parents('.kt-form').find('.kt_datatable');
        // 检查&获取数据id
        if (util.isBlank(id)) {
            if (typeof $dataTable !== 'undefined' && $dataTable.length > 0) {
                // 从表格中获取已选中select
                var ids = getSelectData($dataTable);
                if (checkSelectDataIsNotEmpty(ids, true)) {
                    id = ids.join(',');
                } else {
                    return;
                }
            } else {
                printWarn('无法获取要删除的数据id');
                return;
            }
        }
        util.alertConfirm(KTTool.commonTips.delete.title, KTTool.commonTips.delete.subtitle, function () {
            util.setButtonWait(element);
            if (typeof needAlert === 'undefined') needAlert = true;
            // 检查&获取请求地址
            if(util.isBlank(url)){
                url = getUrl(url, 'deleteById', id);
                if (util.isBlank(url)) {
                    util.offButtonWait(element);
                    return;
                }
            }


            util.ajax({
                url: url,
                wait: $dataTable,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    util.offButtonWait(element);
                    util.ajaxError(XMLHttpRequest, textStatus, errorThrown);
                },
                fail: function () {
                    util.offButtonWait(element);
                },
                success: function (res) {
                    util.offButtonWait(element);
                    // 弹出提示
                    if (needAlert) {
                        KTTool.successTip(KTTool.commonTips.success, KTTool.commonTips.delete.success);
                    }
                    // 删除表格中数据
                    if (typeof $dataTable !== 'undefined' && $dataTable.length > 0) {
                        var dataTable = $dataTable.KTDatatable();
                        dataTable.removeRows(dataTable.getSelectedRecords());
                    }
                    // 回调函数
                    if (util.isFunction(callback)) {
                        callback(res);
                    }
                }
            });
        });
    };

    /**
     * 根据数据id删除数据
     *
     * @param element {object} html 元素对象 (必要)
     * @param id {string} 要删除的id (必要)
     * @param url {string|null} 请求地址 (非必要,默认规则生成)
     * @param needAlert {boolean|null} 是否需要弹出处理结果提示 (非必要,默认true)
     * @param callback {function|null}  回调函数 (非必要)
     */
    var deleteById = function (element, id, url, needAlert, callback) {
        util.alertConfirm(KTTool.commonTips.delete.title, KTTool.commonTips.delete.subtitle, function () {
            if (typeof needAlert === 'undefined') needAlert = true;
            var row = $(element).parents('tr.m-datatable__row');
            var $dataTable = $(element).parents('.kt-form').find('.kt_datatable');
            // 检查&获取请求地址
            if(util.isBlank(url)){
                url = getUrl(url, 'deleteById', id);
                if (util.isBlank(url)) return;
            }
            util.ajax({
                wait: row,
                // needAlert: false,
                url: url,
                fail: function (res) {
                    // errorTip(res.message, KTTool.commonTips.fail);
                },
                success: function (res) {
                    // 弹出提示
                    if (needAlert) {
                        KTTool.successTip(KTTool.commonTips.success, KTTool.commonTips.delete.success);
                    }
                    // 删除表格中数据
                    if (typeof $dataTable !== 'undefined' && $dataTable.length > 0) {
                        var dataTable = $dataTable.KTDatatable();
                        dataTable.setActive(id);
                        dataTable.removeRows(dataTable.getSelectedRecords());
                    }
                    // 回调函数
                    if (util.isFunction(callback)) {
                        callback(res);
                    }
                }
            });
        });
    };
    /**
     * 根据数据id修改数据
     *
     * @param element {object} html 元素对象 (必要)
     * @param id {string} 要修改的id (必要)
     * @param name {string|null} tab页名称 (非必要,默认: 修改)
     * @param url {string|null} 请求地址 (非必要,默认规则生成)
     * @param callback {function|null}  回调函数 (非必要)
     */
    var editById = function (element, id, name, url, callback) {
        url = getUrl(url, 'input', id);
        if (util.isBlank(url)) return;
        if (util.isBlank(name)) {
            name = $(element).text();
            if (util.isBlank(name)) {
                name = '修改数据';
            }
        }
        app.openPage(name, url);
        // 回调函数
        if (util.isFunction(callback)) {
            callback(res);
        }
    };
    /**
     * 导出数据
     *
     * @param element {object} html 元素对象 (必要)
     * @param url {string|null} 请求地址 (非必要,如没有则根据默认规则生成)
     */
    var exportData = function (element, url) {
        util.setButtonWait(element);
        var $form = $(element).parents('.kt-form');
        if (util.isBlank(url)) {
            // 检查&获取请求地址
            url = getUrl(url, 'exportData', null);
            if (util.isBlank(url)) {
                util.offButtonWait(element);
                return;
            }
        }
        if (url.indexOf('?') > -1) {
            url += '&' + $form.serialize()
        } else {
            url += '?' + $form.serialize()
        }
        downloadFile(url);
        util.offButtonWait(element);
    };
    /**
     * 打开导入页面
     * @param importCode {number|string} 导入模板代码
     */
    var importData = function (importCode) {
        app.openPage('导入数据', basePath + '/auth/sys/import/excel/data/' + importCode);
    };
    /**
     * 保存数据
     *
     * @param element {object} html 元素对象 (必要)
     * @param url {string|null} 请求地址 (非必要,默认取form的data-action,如没有则根据默认规则生成)
     * @param needAlert {boolean|null} 是否需要弹出处理结果提示 (非必要,默认true)
     * @param needValidate {boolean|null} 是否需要表单验证 (非必要,默认true)
     * @param callback {function|null} 回调函数 (非必要)
     */
    var saveData = function (element, url, needAlert, needValidate, callback) {
        if (needAlert == null) needAlert = true;
        if (needValidate == null) needValidate = true;
        var $form = $(element).parents('.kt-form');
        // 如果不需要验证或者表单验证通过
        if (!needValidate || $form.valid()) {
            util.setButtonWait(element);
            if ($form != null && $form.length > 0) {
                if (util.isBlank(url)) {
                    url = $form.attr('data-action');
                    // 检查&获取请求地址
                    url = getUrl(url, 'saveData', null);
                    if (util.isBlank(url)) {
                        util.offButtonWait(element);
                        return;
                    }
                }
                util.ajax({
                    url: url,
                    data: $form.serialize(),
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        util.offButtonWait(element);
                        util.ajaxError(XMLHttpRequest, textStatus, errorThrown);
                    },
                    fail: function () {
                        util.offButtonWait(element);
                    },
                    success: function (res) {
                        util.offButtonWait(element);
                        if (needAlert) {
                            var $id = $form.find('#id');
                            if ($id != null && $id.length > 0) {
                                if (util.isBlank($id.val())) {
                                    successTip(KTTool.commonTips.success, KTTool.commonTips.save.add);
                                    $id.val(res.data.id);
                                } else {
                                    successTip(KTTool.commonTips.success, KTTool.commonTips.save.update);
                                }
                            } else {
                                successTip(KTTool.commonTips.success, KTTool.commonTips.save.default);
                            }
                        }
                        if (util.isFunction(callback)) {
                            callback(res);
                        }
                    }
                });
            } else {
                printWarn('KTTool.saveData() -> 缺少表单对象');
            }
        }
    };
    /**
     * 查询数据
     *
     * @param element {object} html 元素对象
     */
    var selectData = function (element) {
        var $dataTable = $(element).parents('.kt-form').find('.kt_datatable');
        if (typeof $dataTable !== 'undefined' && $dataTable.length > 0) {
            $dataTable.KTDatatable().reload();
        }
    };
    /**
     * 初始化DataTable
     *
     * @param options 配置
     * @returns {*|jQuery}
     */
    var initDataTable = function (options) {
        // 检查&获取请求地址
        var url = options.url;
        if(util.isBlank(url)){
            url = getUrl(options.url, 'select', null);
            delete options['url'];
            if (util.isBlank(url)) return;
        }

        /**
         * 默认设置
         */
        var _defaultOptions = {
            selector: '.kt_datatable',
            // 数据源
            data: {
                type: 'remote',
                source: {
                    autoQuery: true, // 带入表单参数
                    read: {
                        url: url,
                        map: function (res) {
                            if (typeof res !== 'undefined' && KTTool.httpCode.success === res.code) {
                                if (typeof res.data.records !== 'undefined') { // 带有分页信息
                                    return res.data.records;
                                } else {
                                    return res.data;
                                }
                            }
                        }
                    }
                },
                saveState: {
                    // 使用cookie/webstorage 保存表格状态(分页, 筛选, 排序)
                    cookie: false,
                    webstorage: true
                },
                pageSize: KTTool.dataTable.page.size, // 页大小
                serverPaging: true, // 在服务器进行数据分页
                serverFiltering: true, // 在服务器进行数据过滤
                serverSorting: true // 在服务器进行数据排序
            },
            toolbar: {
                items: {
                    pagination: {
                        pagination: [10, 15, 20, 30, 50, 100, -1]
                    }
                }
            },
            // 布局
            layout: {
                theme: 'default', // 主题
                class: '', // 自定义class
                scroll: true, // 启用滚动条
                height: KTTool.dataTable.layout.height, // 高度
                footer: false // 显示/隐藏 footer
            },
            search: {
                // 查询条件(仅用于数据在local)
                input: '.query-modular input, .query-modular select',
                // 在输入框按回车查询
                onEnter: true
            },
            // 列滚动
            sortable: true,
            // 分页
            pagination: true
        };
        // 合并配置
        options = $.extend(true, {}, _defaultOptions, options);

        var $form = $(options.selector).parents('form.kt-form');
        if (typeof $form !== 'undefined' && $form.length > 0) {
            // 如果有查询按钮,绑定点击重新加载数据事件
            var $searchBtn = $form.find('.btn-search');
            if (typeof $searchBtn !== 'undefined' && $searchBtn.length > 0) {
                $searchBtn.click(function () {
                    selectData(this);
                });
            }
            // 如果有重置按钮,绑定点击重置事件
            var $resetBtn = $form.find('.btn-reset');
            if (typeof $resetBtn !== 'undefined' && $resetBtn.length > 0) {
                $resetBtn.click(function () {
                    $form.resetForm();
                    var $selectPicker = $form.find('.select-picker');
                    if (typeof $selectPicker !== 'undefined' && $selectPicker.length > 0) {
                        $form.find('.select-picker').trigger("change");
                    }
                });
            }
        }

        return $(options.selector).KTDatatable(options);
    };

    /********************
     ** 工具
     ********************/

    /**
     * 验证url是否为空,如为空根据默认规则生成
     *
     * @param url {string} url
     * @param method {string} 方法名
     * @param suffix {string|null} 后缀
     * @returns {string|*} 处理后的url
     */
    var getUrl = function (url, method, suffix) {
        if (util.isBlank(url)) {
            if (checkBaseUrl()) {
                url = baseUrl + KTTool.urlSuffix[method] + (util.isNotBlank(suffix) ? suffix : '');
            } else {
                return null;
            }
        }
        return url;
    };

    /**
     * 检查ids是否为空
     *
     * @param ids {array} ids
     * @param tip {boolean} 是否需要弹出提示
     * @returns {boolean}
     */
    var checkSelectDataIsNotEmpty = function (ids, tip) {
        if (ids == null || ids.length === 0) {
            if (tip) {
                warnTip(KTTool.commonTips.fail, KTTool.commonTips.noIds);
            }
            return false;
        } else {
            return true;
        }
    };
    /**
     * 获取选中数据
     *
     * @param $dataTable {object} dataTable 对象
     * @returns {Array}
     */
    var getSelectData = function ($dataTable) {
        return $dataTable.KTDatatable().getValue();
    };

    /**
     * 检查业务根url是否已设置
     *
     * @returns {boolean}
     */
    var checkBaseUrl = function () {
        if (util.isNotBlank(baseUrl)) {
            return true;
        } else {
            printWarn('请使用KTTool.setBaseUrl(\'string\');设置业务url根目录');
            return false;
        }
    };

    /**
     * 获取表单数据
     *
     * @param $form 表单
     * @returns {null|object}
     */
    var queryParams = function ($form) {
        var data = $form.serializeArray();
        if (typeof data !== 'undefined' && data.length > 0) {
            var params = {};
            for (var i = 0; i < data.length; i++) {
                if (util.isNotBlank(data[i].value)) {
                    params[data[i].name] = data[i].value;
                }
            }
            return params;
        } else {
            return null;
        }
    };
    /**
     * 获取操作按钮class
     *
     * @param type {string} 按钮类型
     * @returns {string}
     */
    var getActionsBtnClass = function (type) {
        if (util.isBlank(type)) {
            type = 'success';
        }
        return 'table-actions btn btn-sm btn-icon btn-icon-md btn-light-hover-' + type;
    };
    /**
     * 根据路径获取对象
     *
     * @param path {string} 属性路径
     * @param object {object}
     * @param separate {string|null} 分隔符
     * @returns {*}
     */
    var getObject = function (path, object, separate) {
        if (util.isBlank(separate)) {
            separate = '.';
        }
        return path.split(separate).reduce(function (obj, i) {
            return obj !== null && typeof obj[i] !== 'undefined' ? obj[i] : null;
        }, object);
    };
    /**
     * 下载文件
     * @param url {string} 下载地址
     */
    var downloadFile = function (url) {
        var form = document.createElement('form');
        form.setAttribute('action', url);
        form.setAttribute('method', 'post');
        form.setAttribute('style', 'display:none');
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form)
    };
    /********************
     ** 用户权限
     ********************/
    /**
     * 获取当前登录用户
     * 默认优先从缓存获取
     *
     * @param cache {boolean|null} 是否使用缓存数据
     * @return {Object}
     */
    var getUser = function (cache) {
        var user = null;
        if (typeof cache === 'undefined' || cache) {
            user = getCache(defaultOptions.currentUser);
            if (user == null) {
                user = _getUser();
                setCache(defaultOptions.currentUser, user);
            } else {
                user = $.parseJSON(user);
            }
        } else {
            user = _getUser();
            setCache(defaultOptions.currentUser, user);
        }
        return user;
    };
    /**
     * 获取用户
     *
     * @returns {*}
     */
    var _getUser = function () {
        var data = {};

        /**
         * 将attr:attr数组转为对象
         * @param data
         * @returns {object}
         */
        var arrayToObject = function (data) {
            var obj = {};
            if (util.isArray(data)) {
                $(data).each(function (i, _obj) {
                    var levels = _obj.split(':'), _i = 0;

                    function createLevel(child) {
                        var name = levels[_i++];
                        if (typeof child[name] !== 'undefined' && child[name] !== null) {
                            if (typeof child[name] !== 'object') {
                                child[name] = {};
                            }
                        } else {
                            child[name] = {};
                        }
                        if (_i === levels.length) {
                            child[name] = true;
                        } else {
                            createLevel(child[name]);
                        }
                    }

                    createLevel(obj);
                });
                return obj;
            } else {
                return null;
            }
        };

        util.ajax({
            async: false,
            url: basePath + '/auth/sys/user/current',
            success: function (res) {
                data = res.data;
            }
        });
        if (typeof data.roleList !== 'undefined') {
            data.role = arrayToObject(data.roleList);
        }
        if (typeof data.permissionList !== 'undefined') {
            data.permissions = arrayToObject(data.permissionList);
        }
        return data;
    };

    /**
     * 用户是否拥有指定权限标识
     *
     * @param code 权限标识
     * @return {boolean}
     */
    var hasPermissions = function (code) {
        var user = getUser(true);
        return checkPermissions(code, user.permissions);
    };
    /**
     * 用户是否没有指定权限标识
     *
     * @param code 权限标识
     * @return {boolean} true/false
     */
    var notHasPermissions = function (code) {
        return !hasPermissions(code);
    };
    /**
     * 用户是否属于指定角色标识
     *
     * @param code 角色标识
     * @return {boolean}
     */
    var hasRole = function (code) {
        var user = getUser(true);
        return checkPermissions(code, user.role);
    };
    /**
     * 用户是否不属于指定角色标识
     *
     * @param code 角色标识
     * @return {boolean}
     */
    var notHasRole = function (code) {
        return !hasRole(code);
    };
    /**
     * 检查权限
     *
     * @param code {string} 权限标识
     * @param permissions {object} 权限对象
     * @return {boolean}
     */
    var checkPermissions = function (code, permissions) {
        if (util.isNotBlank(code) && permissions != null && typeof permissions === 'object') {
            return Boolean(getObject(code, permissions, ':'));
        }
        return false;
    };
    /**
     * 获取cookies/localStorage中的变量
     *
     * @param key {string} 关键字
     * @return {object}
     */
    var getCache = function (key) {
        var obj;
        if (localStorage) {
            obj = localStorage.getItem(key);
        }
        if (obj == null) {
            obj = Cookies.get(key);
        }
        return obj;
    };
    /**
     * 设置cookies/localStorage中的变量
     *
     * @param key {string} 关键字
     * @param value {object} 值
     */
    var setCache = function (key, value) {
        if (util.isNotBlank(key)) {
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
        }
        if (localStorage) {
            localStorage.setItem(key, value);
        }
        Cookies.set(key, value);
    };

    /**
     * 移除指定cookies/localStorage
     *
     * @param key {string} key
     */
    var cacheRemove = function (key) {
        if (localStorage) {
            localStorage.removeItem(key);
        }
        Cookies.remove(key);
    };


    /********************
     ** jsTree
     ********************/

    /**
     * 保存/修改节点信息
     *
     * @param tree {object|string} 选择器或者jsTree对象
     * @param node {object} 节点信息
     */
    var saveNode = function (tree, node) {
        tree = getTree(tree);
        var _node = tree.get_node(node.id, false);
        if (_node != null && _node) { // 节点存在, 更新节点名称、图标
            if (util.isString(node.type)) {
                tree.set_type(_node, node.type);
            }
            if (util.isString(node.text)) {
                tree.rename_node(_node, node.text);
            }
            if (util.isString(node.icon)) {
                tree.set_icon(_node, node.icon);
            }
        } else {
            var pNode = tree.get_node(node.pId, false); // 查找父节点
            if (tree.is_open(pNode) || tree.is_leaf(pNode)) {// 父节点已展开并且没有子节点
                tree.create_node(pNode, node);//创建节点
                if (!tree.is_open(pNode)) { // 如果节点没展开,则展开
                    tree.open_node(pNode);
                }
            } else {
                tree.open_node(pNode); // 展开父节点,异步加载数据
            }
        }
    };
    /**
     * 删除节点
     *
     * @param tree {object|string} 选择器或者jsTree对象
     * @param ids {number|string} 要删除的id
     */
    var deleteNode = function (tree, ids) {
        tree = getTree(tree);
        if (util.isNumber(ids)) {
            tree.delete_node(tree.get_node(ids, false));
        } else if (util.isString(ids)) {
            _deleteNode(tree, ids.split(','));
        } else if (util.isArray(ids)) {
            _deleteNode(tree, ids);
        }
    };
    /**
     * 删除jsTree指定节点
     * @param tree {object}
     * @param ids
     */
    var _deleteNode = function (tree, ids) {
        $(ids).each(function (i, id) {
            tree.delete_node(tree.get_node(id, false));
        });
    };
    /**
     * 右键点击时获取用户想操作的数据
     * 1.右键点击的节点属于多选节点, 返回所有已选中节点
     * 2.右键点击的节点不属于多选的节点, 返回右键点击节点并选中
     * @param data {object}
     */
    var getOperationNodes = function (data) {
        var tree = $.jstree.reference(data.reference);
        var cur_click = tree.get_node(data.reference);
        var selectNodes = tree.get_selected();
        for (var i = 0; i < selectNodes.length; i++) {
            if (selectNodes[i] == cur_click.id) {
                return selectNodes;
            }
        }
        tree.deselect_all();
        tree.select_node(cur_click);
        return [cur_click.id];
    };
    /**
     * 获取右键点击的节点
     * @param data {object}
     * @returns {*|Object|jQuery|void}
     */
    var getClickNode = function (data) {
        var tree = $.jstree.reference(data.reference);
        return tree.get_node(data.reference);
    };
    /**
     * 获取jsTree选中节点
     * 注: id='#' 节点会被过滤
     *
     * @param tree {object|string} 选择器或者jsTree对象
     * @param attr 要获取的属性,如果为空,则返回节点全部信息
     * @returns {array}
     */
    var getCheckedNodes = function (tree, attr) {
        tree = getTree(tree);
        var checked = [];
        for (var node in tree._model.data) {
            if (tree.is_undetermined(node) || tree.is_checked(node)) {
                if (typeof tree._model.data[node]['id'] === 'undefined' || tree._model.data[node]['id'] != '#') {
                    checked.push(util.isNotBlank(attr) ? tree._model.data[node][attr] : tree._model.data[node]);
                }
            }
        }
        return checked;
    };
    /**
     * jsTree 设置节点选中
     *
     * @param tree {object|string} 选择器或者jsTree对象
     * @param values {array|string} 选中的值,数组或字符串(1,2,3)
     */
    var checkNodes = function (tree, values) {
        tree = getTree(tree);
        // 暂时禁用级联,防止选中父节点后全选子节点
        var cascade = tree.settings.checkbox.cascade;
        tree.settings.checkbox.cascade = '';
        if (typeof values === 'string') {
            values = values.split(',');
        }
        tree.check_node(values);
        // 恢复级联
        tree.settings.checkbox.cascade = cascade;
    };
    /**
     * jsTree 全选
     * @param tree {object|string} 选择器或者jsTree对象
     */
    var checkAll = function (tree) {
        tree = getTree(tree);
        tree.check_all();
    };
    /**
     * jsTree 全不选
     * @param tree {object|string} 选择器或者jsTree对象
     */
    var unCheckAll = function (tree) {
        tree = getTree(tree);
        tree.uncheck_all();
    };
    /**
     * 获取jsTree对象
     * @param tree {object|string} 选择器或者jsTree对象
     * @returns {object}
     */
    var getTree = function (tree) {
        if (typeof tree === 'string') {
            tree = $(tree).jstree(true);
        }
        return tree;
    };

    /********************
     ** 提示
     ********************/

    /**
     * 普通信息提示
     * 会根据用户偏好设置中设置的提示方式进行提示
     *
     * @param title {string} 标题
     * @param subtitle {string} 副标题
     */
    var infoTip = function (title, subtitle) {
        if (useSimpleTip()) {
            toastr.info(subtitle, title);
        } else {
            util.alertInfo(title, subtitle);
        }
    };

    /**
     * 成功提示
     * 会根据用户偏好设置中设置的提示方式进行提示
     *
     * @param title {string} 标题
     * @param subtitle {string} 副标题
     */
    var successTip = function (title, subtitle) {
        if (useSimpleTip()) {
            toastr.success(subtitle, title);
        } else {
            util.alertSuccess(title, subtitle);
        }
    };
    /**
     * 警告提示
     * 会根据用户偏好设置中设置的提示方式进行提示
     *
     * @param title {string} 标题
     * @param subtitle {string} 副标题
     */
    var warnTip = function (title, subtitle) {
        if (useSimpleTip()) {
            toastr.warning(subtitle, title);
        } else {
            util.alertWarning(title, subtitle);
        }
    };
    /**
     * 失败提示
     * 会根据用户偏好设置中设置的提示方式进行提示
     *
     * @param title {string} 标题
     * @param subtitle {string} 副标题
     */
    var errorTip = function (title, subtitle) {
        if (useSimpleTip()) {
            toastr.error(subtitle, title);
        } else {
            util.alertError(title, subtitle);
        }
    };
    /**
     * 根据用户偏好设置判断是否使用弹框提示
     *
     * @returns {boolean}
     */
    var useSimpleTip = function () {
        var simpleTip = true;
        var cacheSettings = KTTool.getCache('preference-settings');
        if (KTUtil.isNotBlank(cacheSettings)) {
            simpleTip = $.parseJSON(cacheSettings)['simpleTip'];
        }
        // 暂时默认false
        return simpleTip;
    };
    /**
     * 输出警告信息
     *
     * @param str {string} 警告信息
     */
    var printWarn = function (str) {
        if (true) {
            console.warn(str);
        }
    };

    /********************
     ** 字典
     ********************/

    /**
     * 根据字典类型获取字典数组
     *
     * @param dictType {string} 字典类型
     * @returns {array|null} 示例[{...}, {...}]
     */
    var getSysDictArrayByDictType = function (dictType) {
        if (typeof sysDict !== 'undefined' && util.isNotBlank(dictType)) {
            return sysDict[dictType];
        }
        return null;
    };
    /**
     * 根据字典类型获取字典对象
     *
     * @param dictType {string} 字典类型
     * @returns {object|null} 示例{1 : {...}, 2: {...}}
     */
    var getSysDictsObjectByDictType = function (dictType) {
        var dicts = getSysDictArrayByDictType(dictType);
        if (dicts != null && dicts.length > 0) {
            var dictsObject = {};
            $(dicts).each(function (index, dict) {
                dictsObject[dict.code] = dict;
            });
            return dictsObject;
        }
        return null;
    };
    /**
     * 根据字典类型与编码获取字典信息
     *
     * @param dictType {string} 字典类型
     * @param code {string} 编码
     * @returns {object|null}
     */
    var getSysDictObjectByQuery = function (dictType, code) {
        var dicts = getSysDictArrayByDictType(dictType);
        if (dicts != null && dicts.length > 0) {
            for(var i = 0;i < dicts.length;i++){
                if (dicts[i].code === code) {
                    return dicts[i];
                }
            }
        }
        return null;
    };
    /**
     * 根据字典类型与编码获取字典名称
     *
     * @param dictType {string} 字典类型
     * @param code {string} 编码
     * @returns {string|null}
     */
    var getSysDictNameByQuery = function (dictType, code) {
        var dict = getSysDictObjectByQuery(dictType, code);
        if (dict != null) {
            return dict.name;
        }
        return null;
    };
    /**
     * 将字典转为html对象
     *
     * @param code {string} 字典编码
     * @param dict {object} 字典数组
     * @returns {string}
     */
    var getDictElement = function (code, dict) {
        var cur_dict = dict[code];
        if (cur_dict == null) {
            // 如果没有对应的字典,检查已知字典是否设置了css
            if (dict != null && dict.length > 0 && util.isNotBlank(dict[0].css)) {
                cur_dict = {
                    css: 'kt-badge kt-badge--success kt-badge--inline kt-badge--pill kt-badge--rounded',
                    name: code
                }
            }
        }
        if (cur_dict != null) {
            if (util.isNotBlank(cur_dict.css)) {
                return '<span class="' + cur_dict.css + '">' + cur_dict.name + '</span>';
            } else {
                return cur_dict.name;
            }
        } else {
            return code;
        }
    };

    return {
        /**
         * Main class 初始化
         */
        init: function (options) {
        },
        /**
         * 设置业务通用url部分
         *
         * @param url {string} 访问地址
         */
        setBaseUrl: function (url) {
            setBaseUrl(url);
        },
        /**
         * 获取业务通用url部分
         */
        getBaseUrl: function () {
            return baseUrl;
        },
        /**
         * 打开导入页面
         * @param importCode {number|string} 导入模板代码
         */
        importData: function (importCode) {
            importData(importCode);
        },
        /**
         * 导出数据
         *
         * @param element {object} html 元素对象 (必要)
         * @param url {string|null} 请求地址 (非必要,如没有则根据默认规则生成)
         */
        exportData: function (element, url) {
            exportData(element, url);
        },
        /**
         * 保存数据
         *
         * @param el {object} html 元素对象 (必要)
         * @param url {string|null} 请求地址 (非必要,默认取form的data-action,如没有则根据默认规则生成)
         * @param needAlert {boolean|null} 是否需要弹出处理结果提示 (非必要,默认true)
         * @param needValidate {boolean|null} 是否需要表单验证 (非必要,默认true)
         * @param callback {function|null} 回调函数 (非必要)
         */
        saveData: function (el, url, needAlert, needValidate, callback) {
            saveData(el, url, needAlert, needValidate, callback);
        },
        /**
         * 保存并关闭
         * 注: 方法不支持回调函数
         *
         * @param el {object} html 元素对象 (必要)
         * @param url {string|null} 请求地址 (非必要,默认取form的data-action,如没有则根据默认规则生成)
         * @param needAlert {boolean|null} 是否需要弹出处理结果提示 (非必要,默认true)
         * @param needValidate {boolean|null} 是否需要表单验证 (非必要,默认true)
         */
        saveAndClose: function (el, url, needAlert, needValidate) {
            saveData(el, url, needAlert, needValidate, function () {
                app.closeCurrentPage();
            });
        },
        /**
         * 打开新增页面
         * @param element {object} html 元素对象 (必要)
         * @param name {string} tab页名称 (非必要,默认: 新增)
         * @param url {string} 请求地址 (非必要,默认规则生成)
         * @param pId {string} 父Id (非必要)
         */
        addData: function (element, name, url, pId) {
            addData(element, name, url, pId);
        },
        /**
         * 根据数据id删除数据
         *
         * @param element {object} html 元素对象 (必要)
         * @param id {string} 要删除的id (必要)
         * @param url {string|null} 请求地址 (非必要,默认规则生成)
         * @param needAlert {boolean|null} 是否需要弹出处理结果提示 (非必要,默认true)
         * @param callback {function|null}  回调函数 (非必要)
         */
        deleteById: function (element, id, url, needAlert, callback) {
            deleteById(element, id, url, needAlert, callback);
        },
        /**
         * 根据id删除数据
         * 参数[id]与[url]必须有一个不为空,两个都传入优先使用[url]
         *
         * @param el {object} html 元素对象 (必要)
         * @param id {string} 要删除的id (非必要)
         * @param url {string} 请求地址 (非必要,默认规则生成)
         * @param needAlert {boolean} 是否需要弹出处理结果提示 (非必要,默认true)
         * @param callback {function}  回调函数 (非必要)
         */
        deleteData: function (el, id, url, needAlert, callback) {
            deleteData(el, id, url, needAlert, callback);
        },
        /**
         * 根据数据id修改数据
         *
         * @param element {object} html 元素对象 (必要)
         * @param id {string} 要修改的id (必要)
         * @param name {string} tab页名称 (非必要,默认: 修改)
         * @param url {string} 请求地址 (非必要,默认规则生成)
         * @param callback {function}  回调函数 (非必要)
         */
        editById: function (element, id, name, url, callback) {
            editById(element, id, name, url, callback);
        },
        /**
         * 查询数据
         *
         * @param element {object} html 元素对象
         */
        selectData: function (element) {
            selectData(element);
        },
        /**
         * 初始化DataTable
         *
         * @param options 配置
         * @returns {*|jQuery}
         */
        initDataTable: function (options) {
            return initDataTable(options);
        },
        /**
         * 获取表单数据
         *
         * @param $form 表单
         * @returns {null|object}
         */
        queryParams: function ($form) {
            return queryParams($form);
        },
        /******************** 提示 ********************/
        /**
         * 普通信息提示
         * 会根据用户偏好设置中设置的提示方式进行提示
         *
         * @param title {string} 标题
         * @param subtitle {string} 副标题
         */
        infoTip: function (title, subtitle) {
            infoTip(title, subtitle);
        },
        /**
         * 成功提示
         * 会根据用户偏好设置中设置的提示方式进行提示
         *
         * @param title {string} 标题
         * @param subtitle {string} 副标题
         */
        successTip: function (title, subtitle) {
            successTip(title, subtitle);
        },
        /**
         * 警告提示
         * 会根据用户偏好设置中设置的提示方式进行提示
         *
         * @param title {string} 标题
         * @param subtitle {string} 副标题
         */
        warnTip: function (title, subtitle) {
            warnTip(title, subtitle);
        },
        /**
         * 失败提示
         * 会根据用户偏好设置中设置的提示方式进行提示
         *
         * @param title {string} 标题
         * @param subtitle {string} 副标题
         */
        errorTip: function (title, subtitle) {
            errorTip(title, subtitle);
        },
        /******************** 字典 ********************/
        /**
         * 将字典转为html对象
         *
         * @param code {string} 字典编码
         * @param dict {object} 字典数组
         * @returns {string}
         */
        getDictElement: function (code, dict) {
            return getDictElement(code, dict);
        },
        /**
         * 根据字典类型获取字典数组
         *
         * @param dictType {string} 字典类型
         * @returns {array|null} 示例[{...}, {...}]
         */
        getSysDictArray: function (dictType) {
            return getSysDictArrayByDictType(dictType);
        },
        /**
         * 根据字典类型获取字典对象
         *
         * @param dictType {string} 字典类型
         * @returns {object|null} 示例{1 : {...}, 2: {...}}
         */
        getSysDictsObject: function (dictType) {
            return getSysDictsObjectByDictType(dictType);
        },
        /**
         * 根据字典类型与编码获取字典信息
         *
         * @param dictType {string} 字典类型
         * @param code {string} 编码
         * @returns {object|null}
         */
        getSysDictObjectByQuery: function (dictType, code) {
            return getSysDictObjectByQuery(dictType, code);
        },
        /**
         * 根据字典类型与编码获取字典名称
         *
         * @param dictType {string} 字典类型
         * @param code {string} 编码
         * @returns {string|null}
         */
        getSysDictNameByQuery: function (dictType, code) {
            return getSysDictNameByQuery(dictType, code);
        },
        /********************
         ** 用户权限
         ********************/
        /**
         * 用户是否拥有指定权限标识
         *
         * @param code 权限标识
         * @return {boolean}
         */
        hasPermissions: function (code) {
            return hasPermissions(code);
        },
        /**
         * 用户是否没有指定权限标识
         *
         * @param code 权限标识
         * @return {boolean}
         */
        notHasPermissions: function (code) {
            return notHasPermissions(code);
        },
        /**
         * 用户是否属于指定角色标识
         *
         * @param code 角色标识
         * @return {boolean}
         */
        hasRole: function (code) {
            return hasRole(code);
        },
        /**
         * 用户是否不属于指定角色标识
         *
         * @param code 角色标识
         * @return {boolean}
         */
        notHasRole: function (code) {
            return notHasRole(code);
        },
        /**
         * 获取当前登录用户
         * 默认优先从缓存获取
         *
         * @param cache {boolean} 是否使用缓存数据
         * @returns {*}
         */
        getUser: function (cache) {
            return getUser(cache);
        },
        /********************  工具  *********************/
        /**
         * 获取cookies/localStorage中的变量
         *
         * @param key {string} 关键字
         * @return {object}
         */
        getCache: function (key) {
            return getCache(key);
        },
        /**
         * 设置cookies/localStorage中的变量
         *
         * @param key {string} 关键字
         * @param value {object} 值
         */
        setCache: function (key, value) {
            setCache(key, value);
        },
        /**
         * 根据路径获取对象
         *
         * @param path {string} 属性路径
         * @param object {object}
         * @param separate {string|null} 分隔符
         * @returns {*}
         */
        getObject: function (path, object, separate) {
            return getObject(path, object, separate);
        },
        /**
         * 移除指定cookies/localStorage
         *
         * @param key {string} key
         */
        cacheRemove: function (key) {
            cacheRemove(key);
        },
        /**
         * 获取操作按钮class
         *
         * @param type {string} 按钮类型
         * @returns {string}
         */
        getActionsBtnClass: function (type) {
            return getActionsBtnClass(type);
        },
        /**
         * 下载文件
         *
         * @param url {string} 下载地址
         */
        downloadFile: function(url) {
            downloadFile(url);
        },
        ACTIONS_INFO: getActionsBtnClass('info'),
        ACTIONS_SUCCESS: getActionsBtnClass('success'),
        ACTIONS_WARN: getActionsBtnClass('warning'),
        ACTIONS_DANGER: getActionsBtnClass('danger'),
        /******************** jsTree ********************/
        /**
         * 获取jsTree对象
         * @param tree {object|string} 选择器或者jsTree对象
         * @returns {object}
         */
        getTree: function (tree) {
            return getTree(tree);
        },
        /**
         * 保存/修改节点信息
         *
         * @param tree {object|string} 选择器或者jstree对象
         * @param node {object} 节点信息
         */
        saveNode: function (tree, node) {
            saveNode(tree, node);
        },
        /**
         * 删除节点
         *
         * @param tree {object|string} 选择器或者jstree对象
         * @param ids {number|string} 要删除的id
         */
        deleteNode: function (tree, ids) {
            deleteNode(tree, ids);
        },
        /**
         * 右键点击时获取用户想操作的数据
         * 1.右键点击的节点属于多选节点, 返回所有已选中节点
         * 2.右键点击的节点不属于多选的节点, 返回右键点击节点并选中
         *
         * @param data {object}
         */
        getOperationNodes: function (data) {
            return getOperationNodes(data);
        },
        /**
         * 获取右键点击的节点
         * @param data {object}
         *
         * @returns {object}
         */
        getClickNode: function (data) {
            return getClickNode(data);
        },
        /**
         * 获取jsTree选中节点
         *
         * @param tree {object|string} 选择器或者jsTree对象
         * @param attr 要获取的属性,如果为空,则返回节点全部信息
         * @returns {array}
         */
        getCheckedNodes: function (tree, attr) {
            return getCheckedNodes(tree, attr);
        },
        /**
         * jsTree 设置节点选中
         *
         * @param tree {object|string} 选择器或者jsTree对象
         * @param values {array|string} 选中的值,数组或字符串(1,2,3)
         */
        checkNodes: function (tree, values) {
            checkNodes(tree, values);
        },
        /**
         * 设置jsTree checkbox 全选
         * @param tree {object|string} 选择器或者jsTree对象
         */
        checkAll: function (tree) {
            checkAll(tree);
        },
        /**
         * 设置jsTree checkbox 全不选
         * @param tree {object|string} 选择器或者jsTree对象
         */
        unCheckAll: function (tree) {
            unCheckAll(tree);
        },
        /**
         * 获取表格中选中的数据
         *
         * @param $dataTable {object} dataTable 对象
         * @returns {Array}
         */
        getSelectData: function ($dataTable) {
            return getSelectData($dataTable);
        },
        /**
         * 检查ids是否为空
         *
         * @param ids {array} ids
         * @param tip {boolean} 是否需要弹出提示
         * @returns {boolean}
         */
        checkSelectDataIsNotEmpty: function (ids, tip) {
            return checkSelectDataIsNotEmpty(ids, tip);
        },
        /**
         * 通用提示文字
         */
        commonTips: defaultOptions.commonTips,
        commonDict: getSysDictsObjectByDictType('commonStatus'),
        dataTable: defaultOptions.dataTable,
        urlSuffix: defaultOptions.urlSuffix,
        httpCode: defaultOptions.httpCode,
        currentUser: defaultOptions.currentUser
    };
}();
//== 页面加载完毕初始化mTool
$(document).ready(function () {
    KTTool.init({});
});
// plugin setup
var KTWizard = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.get(elementId);
    var body = KTUtil.get('body');

    if (!element) {
        return; 
    }

    // Default options
    var defaultOptions = {
        startStep: 1,
        manualStepForward: false
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Construct
         */

        construct: function(options) {
            if (KTUtil.data(element).has('wizard')) {
                the = KTUtil.data(element).get('wizard');
            } else {
                // reset menu
                Plugin.init(options);

                // build menu
                Plugin.build();

                KTUtil.data(element).set('wizard', the);
            }

            return the;
        },

        /**
         * Init wizard
         */
        init: function(options) {
            the.element = element;
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);

            // Elements
            the.steps = KTUtil.findAll(element, '[data-ktwizard-type="step"]');

            the.btnSubmit = KTUtil.find(element, '[data-ktwizard-type="action-submit"]');
            the.btnNext = KTUtil.find(element, '[data-ktwizard-type="action-next"]');
            the.btnPrev = KTUtil.find(element, '[data-ktwizard-type="action-prev"]');
            the.btnLast = KTUtil.find(element, '[data-ktwizard-type="action-last"]');
            the.btnFirst = KTUtil.find(element, '[data-ktwizard-type="action-first"]');

            // Variables
            the.events = [];
            the.currentStep = 1;
            the.stopped = false;
            the.totalSteps = the.steps.length;

            // Init current step
            if (the.options.startStep > 1) {
                Plugin.goTo(the.options.startStep);
            }

            // Init UI
            Plugin.updateUI();
        },

        /**
         * Build Form Wizard
         */
        build: function() {
            // Next button event handler
            KTUtil.addEvent(the.btnNext, 'click', function(e) {
                e.preventDefault();
                Plugin.goNext();
            });

            // Prev button event handler
            KTUtil.addEvent(the.btnPrev, 'click', function(e) {
                e.preventDefault();
                Plugin.goPrev();
            });

            // First button event handler
            KTUtil.addEvent(the.btnFirst, 'click', function(e) {
                e.preventDefault();
                Plugin.goFirst();
            });

            // Last button event handler
            KTUtil.addEvent(the.btnLast, 'click', function(e) {
                e.preventDefault();
                Plugin.goLast();
            });

            KTUtil.on(element, 'a[data-ktwizard-type="step"]', 'click', function() {
                var index = KTUtil.index(this) + 1;
                if (index !== the.currentStep) {
                    Plugin.goTo(index);
                }                
            });
        },

        /**
         * Handles wizard click wizard
         */
        goTo: function(number) {
            // Skip if this step is already shown
            if (number === the.currentStep || number > the.totalSteps || number < 0) {
                return;
            }

            // Validate step number
            if (number) {
                number = parseInt(number);
            } else {
                number = Plugin.getNextStep();
            }

            // Before next and prev events
            var callback;

            if (number > the.currentStep) {
                callback = Plugin.eventTrigger('beforeNext');
            } else {
                callback = Plugin.eventTrigger('beforePrev');
            }
            
            // Skip if stopped
            if (the.stopped === true) {
                the.stopped = false;
                return;
            }

            // Continue if no exit
            if (callback !== false) {
                // Before change
                Plugin.eventTrigger('beforeChange');

                // Set current step 
                the.currentStep = number;

                Plugin.updateUI();

                // Trigger change event
                Plugin.eventTrigger('change');
            }

            // After next and prev events
            if (number > the.startStep) {
                Plugin.eventTrigger('afterNext');
            } else {
                Plugin.eventTrigger('afterPrev');
            }

            return the;
        },

        /**
         * Cancel
         */
        stop: function() {
            the.stopped = true;
        },

        /**
         * Resume
         */
        start: function() {
            the.stopped = false;
        },

        /**
         * Check last step
         */
        isLastStep: function() {
            return the.currentStep === the.totalSteps;
        },

        /**
         * Check first step
         */
        isFirstStep: function() {
            return the.currentStep === 1;
        },

        /**
         * Check between step
         */
        isBetweenStep: function() {
            return Plugin.isLastStep() === false && Plugin.isFirstStep() === false;
        },

        /**
         * Go to the next step
         */
        goNext: function() {
            return Plugin.goTo(Plugin.getNextStep());
        },

        /**
         * Go to the prev step
         */
        goPrev: function() {
            return Plugin.goTo(Plugin.getPrevStep());
        },

        /**
         * Go to the last step
         */
        goLast: function() {
            return Plugin.goTo(the.totalSteps);
        },

        /**
         * Go to the first step
         */
        goFirst: function() {
            return Plugin.goTo(1);
        },

        /**
         * Go to the first step
         */
        updateUI: function() {
            var stepType = '';
            var index = the.currentStep - 1;

            if (Plugin.isLastStep()) {
                stepType = 'last';
            } else if (Plugin.isFirstStep()) {
                stepType = 'first';
            } else {
                stepType = 'between';
            }

            KTUtil.attr(the.element, 'data-ktwizard-state', stepType);

            // Steps
            var steps = KTUtil.findAll(the.element, '[data-ktwizard-type="step"]');

            if (steps && steps.length > 0) {
                for (var i = 0, len = steps.length; i < len; i++) {
                    if (i == index) {
                        KTUtil.attr(steps[i], 'data-ktwizard-state', 'current');
                    } else {
                        if (i < index) {
                            KTUtil.attr(steps[i], 'data-ktwizard-state', 'done');
                        } else {
                            KTUtil.attr(steps[i], 'data-ktwizard-state', 'pending');
                        }
                    }
                }
            }

            // Steps Info
            var stepsInfo = KTUtil.findAll(the.element, '[data-ktwizard-type="step-info"]');
            if (stepsInfo &&stepsInfo.length > 0) {
                for (var i = 0, len = stepsInfo.length; i < len; i++) {
                    if (i == index) {
                        KTUtil.attr(stepsInfo[i], 'data-ktwizard-state', 'current');
                    } else {
                        KTUtil.removeAttr(stepsInfo[i], 'data-ktwizard-state');
                    }
                }
            }  

            // Steps Content
            var stepsContent = KTUtil.findAll(the.element, '[data-ktwizard-type="step-content"]');
            if (stepsContent&& stepsContent.length > 0) {
                for (var i = 0, len = stepsContent.length; i < len; i++) {
                    if (i == index) {
                        KTUtil.attr(stepsContent[i], 'data-ktwizard-state', 'current');
                    } else {
                        KTUtil.removeAttr(stepsContent[i], 'data-ktwizard-state');
                    }
                }
            }            
        },

        /**
         * Get next step
         */
        getNextStep: function() {
            if (the.totalSteps >= (the.currentStep + 1)) {
                return the.currentStep + 1;
            } else {
                return the.totalSteps;
            }
        },

        /**
         * Get prev step
         */
        getPrevStep: function() {
            if ((the.currentStep - 1) >= 1) {
                return the.currentStep - 1;
            } else {
                return 1;
            }
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name) {
            //KTUtil.triggerCustomEvent(name);
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            event.handler.call(this, the);
                        }
                    } else {
                        event.handler.call(this, the);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });

            return the;
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options 
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Go to the next step 
     */
    the.goNext = function() {
        return Plugin.goNext();
    };

    /**
     * Go to the prev step 
     */
    the.goPrev = function() {
        return Plugin.goPrev();
    };

    /**
     * Go to the last step 
     */
    the.goLast = function() {
        return Plugin.goLast();
    };

    /**
     * Cancel step 
     */
    the.stop = function() {
        return Plugin.stop();
    };

    /**
     * Resume step 
     */
    the.start = function() {
        return Plugin.start();
    };

    /**
     * Go to the first step 
     */
    the.goFirst = function() {
        return Plugin.goFirst();
    };

    /**
     * Go to a step
     */
    the.goTo = function(number) {
        return Plugin.goTo(number);
    };

    /**
     * Get current step number 
     */
    the.getStep = function() {
        return the.currentStep;
    };

    /**
     * Check last step 
     */
    the.isLastStep = function() {
        return Plugin.isLastStep();
    };

    /**
     * Check first step 
     */
    the.isFirstStep = function() {
        return Plugin.isFirstStep();
    };
    
    /**
     * Attach event
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    // Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};
'use strict';
(function ($) {

    var pluginName = 'KTDatatable';
    var pfx = 'kt-';
    var util = KTUtil;
    var app = KTApp;
    var tool = KTTool;

    // 插件设置
    $.fn[pluginName] = function (options) {
        if ($(this).length === 0) {
            console.log('No ' + pluginName + ' element exist.');
            return;
        }

        // global variables
        var datatable = this;

        // 开启调试?
        // 1) 每次刷新时将清除状态
        // 2) 输出一些日志
        datatable.debug = false;

        datatable.API = {
            record: null,
            value: null,
            params: null
        };

        var Plugin = {
            /********************
             ** 私有
             ********************/
            // 是否初始化
            isInit: false,
            // cell
            cellOffset: 110,
            // 图标
            iconOffset: 15,
            // 状态id
            stateId: 'meta',
            // ajax参数
            ajaxParams: {},
            // 分页
            pagingObject: {},

            init: function (options) {
                // 是否普通表格
                var isHtmlTable = false;
                // 数据源选项空
                if (options.data.source === null) {
                    // 当做普通表格处理
                    Plugin.extractTable();
                    isHtmlTable = true;
                }

                Plugin.setupBaseDOM.call();
                Plugin.setupDOM(datatable.table);
                // Plugin.spinnerCallback(true);

                // 设置查询条件
                Plugin.setDataSourceQuery(Plugin.getOption('data.source.read.params.query'));

                // 渲染后事件
                $(datatable).on(pfx + 'datatable--on-layout-updated', Plugin.afterRender);

                // 如果是调试模式,移除状态
                if (datatable.debug) Plugin.stateRemove(Plugin.stateId);

                // 初始化拓展方法
                $.each(Plugin.getOption('extensions'), function (extName, extOptions) {
                    if (typeof $.fn[pluginName][extName] === 'function')
                        new $.fn[pluginName][extName](datatable, extOptions);
                });

                // 获取数据
                if (options.data.type === 'remote' || options.data.type === 'local') {
                    if (options.data.saveState === false
                        || options.data.saveState.cookie === false
                        && options.data.saveState.webstorage === false) {
                        Plugin.stateRemove(Plugin.stateId);
                    }
                    // 如果数据在本地并且指定数据
                    if (options.data.type === 'local' && typeof options.data.source === 'object') {
                        datatable.dataSet = datatable.originalDataSet = Plugin.dataMapCallback(options.data.source);
                    }
                    Plugin.dataRender();
                }

                // 如果是普通表格,移除head/foot并重新设置
                if (isHtmlTable) {
                    $(datatable.tableHead).find('tr').remove();
                    $(datatable.tableFoot).find('tr').remove();
                }
                // 设置head
                Plugin.setHeadTitle();
                // 设置foot
                if (Plugin.getOption('layout.footer')) {
                    Plugin.setHeadTitle(datatable.tableFoot);
                }

                // 如果未设置header则删除thead
                if (typeof options.layout.header !== 'undefined' &&
                    options.layout.header === false) {
                    $(datatable.table).find('thead').remove();
                }

                // 如果未设置footer则删除tfoot
                if (typeof options.layout.footer !== 'undefined' &&
                    options.layout.footer === false) {
                    $(datatable.table).find('tfoot').remove();
                }

                // 如果数据阻碍本地,更新布局
                if (options.data.type === null ||
                    options.data.type === 'local') {
                    Plugin.setupCellField.call();
                    Plugin.setupTemplateCell.call();

                    // setup nested datatable, if option enabled
                    Plugin.setupSubDatatable.call();

                    // setup extra system column properties
                    Plugin.setupSystemColumn.call();
                    Plugin.redraw();
                }

                var width;
                var initialWidth = false;
                $(window).resize(function () {
                    // 获取初始宽度
                    if (!initialWidth) {
                        width = $(this).width();
                        initialWidth = true;
                    }
                    // 仅在浏览器窗口宽度改变时重选渲染
                    if ($(this).width() !== width) {
                        width = $(this).width();
                        Plugin.fullRender();
                    }
                });
                // 清空设置的高度
                $(datatable).height('');

                // search按回车时搜索
                $(Plugin.getOption('search.input')).on('keyup', function (e) {
                    if (Plugin.getOption('search.onEnter') && e.which !== 13) return;
                    Plugin.search($(this).val());
                });

                return datatable;
            },

            /**
             * 提取静态table内容放入dataSource
             */
            extractTable: function () {
                var columns = [];
                var headers = $(datatable).find('tr:first-child th').get().map(function (cell, i) {
                    var field = $(cell).data('field');
                    if (typeof field === 'undefined') {
                        field = $(cell).text().trim();
                    }
                    var column = {field: field, title: field};
                    for (var ii in options.columns) {
                        if (options.columns[ii].field === field) {
                            column = $.extend(true, {}, options.columns[ii], column);
                        }
                    }
                    columns.push(column);
                    return field;
                });
                // 自动创建 columns config
                options.columns = columns;

                var rowProp = [];
                var source = [];

                $(datatable).find('tr').each(function () {
                    if ($(this).find('td').length) {
                        rowProp.push($(this).prop('attributes'));
                    }
                    var td = {};
                    $(this).find('td').each(function (i, cell) {
                        td[headers[i]] = cell.innerHTML.trim();
                    });
                    if (!util.isEmpty(td)) {
                        source.push(td);
                    }
                });

                options.data.attr.rowProps = rowProp;
                options.data.source = source;
            },

            /**
             * 更新布局
             */
            layoutUpdate: function () {
                // setup nested datatable, if option enabled
                Plugin.setupSubDatatable.call();

                // setup extra system column properties
                Plugin.setupSystemColumn.call();

                // 设置 hover event
                Plugin.setupHover.call();

                if (typeof options.detail === 'undefined'
                    // temporary disable lock column in subtable
                    && Plugin.getDepth() === 1) {
                    // 锁定列
                    Plugin.lockTable.call();
                }

                Plugin.columnHide.call();

                Plugin.resetScroll();

                // 如果不是已锁定的列
                if (!Plugin.isLocked()) {
                    Plugin.redraw.call();
                    // check if its not a subtable and has autoHide option enabled
                    if (!Plugin.isSubtable() && Plugin.getOption('rows.autoHide') === true) {
                        Plugin.autoHide();
                    }
                    // reset row
                    $(datatable.table).find('.' + pfx + 'datatable__row').css('height', '');
                }

                Plugin.rowEvenOdd.call();

                Plugin.sorting.call();

                Plugin.scrollbar.call();

                if (!Plugin.isInit) {
                    // run once dropdown inside datatable
                    Plugin.dropdownFix();
                    $(datatable).trigger(pfx + 'datatable--on-init', {
                        table: $(datatable.wrap).attr('id'),
                        options: options
                    });
                    Plugin.isInit = true;
                }

                $(datatable).trigger(pfx + 'datatable--on-layout-updated', {table: $(datatable.wrap).attr('id')});
            },
            /**
             * 锁定表
             * @return {{init: init, lockEnabled: boolean, enable: enable}}
             */
            lockTable: function () {
                var lock = {
                    lockEnabled: false,
                    init: function () {
                        // check if table should be locked columns
                        lock.lockEnabled = Plugin.lockEnabledColumns();
                        if (lock.lockEnabled.left.length === 0 &&
                            lock.lockEnabled.right.length === 0) {
                            return;
                        }
                        lock.enable();
                    },
                    enable: function () {
                        var enableLock = function (tablePart) {
                            // 如果已经有锁定列
                            if ($(tablePart).find('.' + pfx + 'datatable__lock').length > 0) {
                                Plugin.log('Locked container already exist in: ', tablePart);
                                return;
                            }
                            // 如果为空
                            if ($(tablePart).find('.' + pfx + 'datatable__row').length === 0) {
                                Plugin.log('No row exist in: ', tablePart);
                                return;
                            }

                            // 锁定div容器
                            var lockLeft = $('<div/>').addClass(pfx + 'datatable__lock ' + pfx + 'datatable__lock--left');
                            var lockScroll = $('<div/>').addClass(pfx + 'datatable__lock ' + pfx + 'datatable__lock--scroll');
                            var lockRight = $('<div/>').addClass(pfx + 'datatable__lock ' + pfx + 'datatable__lock--right');

                            $(tablePart).find('.' + pfx + 'datatable__row').each(function () {
                                // 创建新row用于锁定列并设置数据
                                var rowLeft = $('<tr/>').addClass(pfx + 'datatable__row').data('obj', $(this).data('obj')).appendTo(lockLeft);
                                var rowScroll = $('<tr/>').addClass(pfx + 'datatable__row').data('obj', $(this).data('obj')).appendTo(lockScroll);
                                var rowRight = $('<tr/>').addClass(pfx + 'datatable__row').data('obj', $(this).data('obj')).appendTo(lockRight);
                                $(this).find('.' + pfx + 'datatable__cell').each(function () {
                                    var locked = $(this).data('locked');
                                    if (typeof locked !== 'undefined') {
                                        if (typeof locked.left !== 'undefined' || locked === true) {
                                            // 如果没设置锁定在左边还是右边,默认锁定在左边
                                            $(this).appendTo(rowLeft);
                                        }
                                        if (typeof locked.right !== 'undefined') {
                                            $(this).appendTo(rowRight);
                                        }
                                    } else {
                                        $(this).appendTo(rowScroll);
                                    }
                                });
                                rowLeft.attr('data-id', $(this).data('id'));
                                rowScroll.attr('data-id', $(this).data('id'));
                                rowRight.attr('data-id', $(this).data('id'));
                                // 移除旧row
                                $(this).remove();
                            });

                            if (lock.lockEnabled.left.length > 0) {
                                $(datatable.wrap).addClass(pfx + 'datatable--lock');
                                $(lockLeft).appendTo(tablePart);
                            }
                            if (lock.lockEnabled.left.length > 0 || lock.lockEnabled.right.length > 0) {
                                $(lockScroll).appendTo(tablePart);
                            }
                            if (lock.lockEnabled.right.length > 0) {
                                $(datatable.wrap).addClass(pfx + 'datatable--lock');
                                $(lockRight).appendTo(tablePart);
                            }
                        };

                        $(datatable.table).find('thead,tbody,tfoot').each(function () {
                            var tablePart = this;
                            if ($(this).find('.' + pfx + 'datatable__lock').length === 0) {
                                $(this).ready(function () {
                                    enableLock(tablePart);
                                });
                            }
                        });
                    }
                };
                lock.init();
                return lock;
            },

            /**
             * 调整大小后重新渲染
             */
            fullRender: function () {
                $(datatable.tableHead).empty();
                Plugin.setHeadTitle();
                if (Plugin.getOption('layout.footer')) {
                    $(datatable.tableFoot).empty();
                    Plugin.setHeadTitle(datatable.tableFoot);
                }

                Plugin.spinnerCallback(true);
                $(datatable.wrap).removeClass(pfx + 'datatable--loaded');

                Plugin.insertData();
            },
            /**
             * 获取锁定列
             * @return {{left: Array, right: Array}}
             */
            lockEnabledColumns: function () {
                var screen = $(window).width();
                var columns = options.columns;
                var enabled = {left: [], right: []};
                $.each(columns, function (i, column) {
                    if (typeof column.locked !== 'undefined') {
                        if (typeof column.locked.left !== 'undefined') {
                            if (util.getBreakpoint(column.locked.left) <= screen) {
                                enabled['left'].push(column.locked.left);
                            }
                        }
                        if (typeof column.locked.right !== 'undefined') {
                            if (util.getBreakpoint(column.locked.right) <= screen) {
                                enabled['right'].push(column.locked.right);
                            }
                        }
                    }
                });
                return enabled;
            },

            /**
             * 执行 render 事件后
             * '+pfx+'-datatable--on-layout-updated
             * @param e
             * @param args
             */
            afterRender: function (e, args) {
                $(datatable).ready(function () {
                    // 重绘表格的锁定列
                    if (Plugin.isLocked()) {
                        Plugin.redraw();
                    }

                    $(datatable.tableBody).css('visibility', '');
                    $(datatable.wrap).addClass(pfx + 'datatable--loaded');

                    Plugin.spinnerCallback(false);
                });
            },
            /**
             * 修复dropdown
             */
            dropdownFix: function () {
                var dropdownMenu;
                $('body').on('show.bs.dropdown', '.' + pfx + 'datatable .' + pfx + 'datatable__body', function (e) {
                    dropdownMenu = $(e.target).find('.dropdown-menu');
                    $('body').append(dropdownMenu.detach());
                    dropdownMenu.css('display', 'block');
                    dropdownMenu.position({
                        'my': 'right top',
                        'at': 'right bottom',
                        'of': $(e.relatedTarget)
                    });
                    // 如果表格在modal里面
                    if (datatable.closest('.modal').length) {
                        // 增加下拉的 z-index
                        dropdownMenu.css('z-index', '2000');
                    }
                }).on('hide.bs.dropdown', '.' + pfx + 'datatable .' + pfx + 'datatable__body', function (e) {
                    $(e.target).append(dropdownMenu.detach());
                    dropdownMenu.hide();
                });
            },

            hoverTimer: 0,
            isScrolling: false,

            setupHover: function () {
                $(window).scroll(function (e) {
                    // 滚动时停止hoverTimer
                    clearTimeout(Plugin.hoverTimer);
                    Plugin.isScrolling = true;
                });

                $(datatable.tableBody).find('.' + pfx + 'datatable__cell').off('mouseenter', 'mouseleave').on('mouseenter', function () {
                    // reset scroll timer to hover class
                    Plugin.hoverTimer = setTimeout(function () {
                        Plugin.isScrolling = false;
                    }, 200);
                    if (Plugin.isScrolling) return;

                    // normal table
                    var row = $(this).closest('.' + pfx + 'datatable__row').addClass(pfx + 'datatable__row--hover');
                    var index = $(row).index() + 1;

                    // 锁定表格
                    $(row).closest('.' + pfx + 'datatable__lock').parent().find('.' + pfx + 'datatable__row:nth-child(' + index + ')').addClass(pfx + 'datatable__row--hover');
                }).on('mouseleave', function () {
                    // 普通表格
                    var row = $(this).closest('.' + pfx + 'datatable__row').removeClass(pfx + 'datatable__row--hover');
                    var index = $(row).index() + 1;

                    // 锁定表格
                    $(row).closest('.' + pfx + 'datatable__lock').parent().find('.' + pfx + 'datatable__row:nth-child(' + index + ')').removeClass(pfx + 'datatable__row--hover');
                });
            },

            /**
             * Adjust width of locked table containers by resize handler
             * 大小改变时,调整锁定表容器宽度
             * @returns {number}
             */
            adjustLockContainer: function () {
                if (!Plugin.isLocked()) return 0;

                // refer to head dimension
                var containerWidth = $(datatable.tableHead).width();
                var lockLeft = $(datatable.tableHead).find('.' + pfx + 'datatable__lock--left').width();
                var lockRight = $(datatable.tableHead).find('.' + pfx + 'datatable__lock--right').width();

                if (typeof lockLeft === 'undefined') lockLeft = 0;
                if (typeof lockRight === 'undefined') lockRight = 0;

                var lockScroll = Math.floor(containerWidth - lockLeft - lockRight);
                $(datatable.table).find('.' + pfx + 'datatable__lock--scroll').css('width', lockScroll);

                return lockScroll;
            },

            /**
             * 拖拽调整大小
             *
             * todo; 暂未使用
             */
            dragResize: function () {
                var pressed = false;
                var start = undefined;
                var startX, startWidth;
                $(datatable.tableHead).find('.' + pfx + 'datatable__cell').mousedown(function (e) {
                    start = $(this);
                    pressed = true;
                    startX = e.pageX;
                    startWidth = $(this).width();
                    $(start).addClass(pfx + 'datatable__cell--resizing');

                }).mousemove(function (e) {
                    if (pressed) {
                        var i = $(start).index();
                        var tableBody = $(datatable.tableBody);
                        var ifLocked = $(start).closest('.' + pfx + 'datatable__lock');

                        if (ifLocked) {
                            var lockedIndex = $(ifLocked).index();
                            tableBody = $(datatable.tableBody).find('.' + pfx + 'datatable__lock').eq(lockedIndex);
                        }

                        $(tableBody).find('.' + pfx + 'datatable__row').each(function (tri, tr) {
                            $(tr).find('.' + pfx + 'datatable__cell').eq(i).width(startWidth + (e.pageX - startX)).children().width(startWidth + (e.pageX - startX));
                        });

                        $(start).children().css('width', startWidth + (e.pageX - startX));
                    }

                }).mouseup(function () {
                    $(start).removeClass(pfx + 'datatable__cell--resizing');
                    pressed = false;
                });

                $(document).mouseup(function () {
                    $(start).removeClass(pfx + 'datatable__cell--resizing');
                    pressed = false;
                });
            },

            /**
             * 在内容加载之前设置高度
             */
            initHeight: function () {
                if (options.layout.height && options.layout.scroll) {
                    var theadHeight = $(datatable.tableHead).find('.' + pfx + 'datatable__row').outerHeight();
                    var tfootHeight = $(datatable.tableFoot).find('.' + pfx + 'datatable__row').outerHeight();
                    var bodyHeight = options.layout.height;
                    if (theadHeight > 0) {
                        bodyHeight -= theadHeight;
                    }
                    if (tfootHeight > 0) {
                        bodyHeight -= tfootHeight;
                    }

                    // 滚动条抵消
                    bodyHeight -= 2;

                    $(datatable.tableBody).css('max-height', bodyHeight);

                    // 设置可滚动区域的固定高度
                    $(datatable.tableBody).find('.' + pfx + 'datatable__lock--scroll').css('height', bodyHeight);
                }
            },

            /**
             * 设置基本DOM(table, thead, tbody, tfoot),如果不存在则创建
             */
            setupBaseDOM: function () {
                // 在初始化之前保持原始状态
                datatable.initialDatatable = $(datatable).clone();

                // 检查指定元素是否是table,如果不是就创建
                if ($(datatable).prop('tagName') === 'TABLE') {
                    // 如果初始化的元素是table,用div包裹
                    datatable.table = $(datatable).removeClass(pfx + 'datatable').addClass(pfx + 'datatable__table');
                    if ($(datatable.table).parents('.' + pfx + 'datatable').length === 0) {
                        datatable.table.wrap($('<div/>').addClass(pfx + 'datatable').addClass(pfx + 'datatable--' + options.layout.theme));
                        datatable.wrap = $(datatable.table).parent();
                    }
                } else {
                    // 创建表格
                    datatable.wrap = $(datatable).addClass(pfx + 'datatable').addClass(pfx + 'datatable--' + options.layout.theme);
                    datatable.table = $('<table/>').addClass(pfx + 'datatable__table').appendTo(datatable);
                }

                if (typeof options.layout.class !== 'undefined') {
                    $(datatable.wrap).addClass(options.layout.class);
                }

                $(datatable.table).removeClass(pfx + 'datatable--destroyed').css('display', 'block');

                // 如果表格id为空
                if (typeof $(datatable).attr('id') === 'undefined') {
                    // 禁用保存表格状态
                    Plugin.setOption('data.saveState', false);
                    // 设置唯一id
                    $(datatable.table).attr('id', util.getUniqueID(pfx + 'datatable--'));
                }

                // 设置表格最小高度
                if (Plugin.getOption('layout.minHeight'))
                    $(datatable.table).css('min-height', Plugin.getOption('layout.minHeight'));
                // 设置表格高度
                if (Plugin.getOption('layout.height'))
                    $(datatable.table).css('max-height', Plugin.getOption('layout.height'));

                if (options.data.type === null) {
                    // 移除表格width/display样式
                    $(datatable.table).css('width', '').css('display', '');
                }

                // 创建table > thead 元素
                datatable.tableHead = $(datatable.table).find('thead');
                if ($(datatable.tableHead).length === 0) {
                    datatable.tableHead = $('<thead/>').prependTo(datatable.table);
                }

                // 创建table > tbody 元素
                datatable.tableBody = $(datatable.table).find('tbody');
                if ($(datatable.tableBody).length === 0) {
                    datatable.tableBody = $('<tbody/>').appendTo(datatable.table);
                }
                // 创建table > tfoot 元素
                if (typeof options.layout.footer !== 'undefined' && options.layout.footer) {
                    datatable.tableFoot = $(datatable.table).find('tfoot');
                    if ($(datatable.tableFoot).length === 0) {
                        datatable.tableFoot = $('<tfoot/>').appendTo(datatable.table);
                    }
                }
            },

            /**
             * 设置列data属性
             */
            setupCellField: function (tableParts) {
                if (typeof tableParts === 'undefined') tableParts = $(datatable.table).children();
                var columns = options.columns;
                $.each(tableParts, function (part, tablePart) {
                    $(tablePart).find('.' + pfx + 'datatable__row').each(function (tri, tr) {
                        // prepare data
                        $(tr).find('.' + pfx + 'datatable__cell').each(function (tdi, td) {
                            if (typeof columns[tdi] !== 'undefined') {
                                $(td).data(columns[tdi]);
                            }
                        });
                    });
                });
            },

            /**
             * 执行列template回调
             *
             * @param tablePart
             */
            setupTemplateCell: function (tablePart) {
                if (typeof tablePart === 'undefined') tablePart = datatable.tableBody;
                var columns = options.columns;
                $(tablePart).find('.' + pfx + 'datatable__row').each(function (tri, tr) {
                    // 获取row上面的data-obj属性
                    var obj = $(tr).data('obj') || {};

                    // 执行template之前的回调函数
                    var beforeTemplate = Plugin.getOption('rows.beforeTemplate');
                    if (typeof beforeTemplate === 'function') {
                        beforeTemplate($(tr), obj, tri);
                    }
                    // 如果 data-obj 是 undefined, 从表中收集
                    if (typeof obj === 'undefined') {
                        obj = {};
                        $(tr).find('.' + pfx + 'datatable__cell').each(function (tdi, td) {
                            // 根据列名称获取列设置
                            var column = $.grep(columns, function (n, i) {
                                return $(td).data('field') === n.field;
                            })[0];
                            if (typeof column !== 'undefined') {
                                obj[column['field']] = $(td).text();
                            }
                        });
                    }

                    $(tr).find('.' + pfx + 'datatable__cell').each(function (tdi, td) {
                        // 根据列名称获取列设置
                        var column = $.grep(columns, function (n, i) {
                            return $(td).data('field') === n.field;
                        })[0];
                        if (typeof column !== 'undefined') {
                            if (typeof column.dictType !== 'undefined' && column.dictType != null) {
                                column.template = function (row) {
                                    var dicts = null;
                                    if (typeof column.dictType === 'string') {
                                        dicts = tool.getSysDictsObject(column.dictType);
                                    } else if (util.isFunction(column.dictType)) {
                                        dicts = tool.getSysDictsObject(column.dictType(row, tdi, datatable));
                                    } else {
                                        dicts = column.dictType;
                                    }
                                    return tool.getDictElement(row[column.field], dicts);
                                }
                            }
                            // 列 template
                            if (typeof column.template !== 'undefined') {
                                var finalValue = '';
                                // template 设置
                                if (typeof column.template === 'string') {
                                    finalValue = Plugin.dataPlaceholder(column.template, obj);
                                }
                                // template 回调函数
                                if (typeof column.template === 'function') {
                                    finalValue = column.template(obj, tri, datatable);
                                } else {
                                    // 如果引入了DOMPurify,用DOMPurify过滤xss
                                    if (typeof DOMPurify !== 'undefined') {
                                        finalValue = DOMPurify.sanitize(finalValue);
                                    }
                                }

                                var span = document.createElement('span');
                                span.innerHTML = finalValue;

                                // 用span包起来放到td中
                                $(td).html(span);

                                // 设置 span overflow
                                if (typeof column.overflow !== 'undefined') {
                                    $(span).css('overflow', column.overflow);
                                    $(span).css('position', 'relative');
                                }
                            } else {
                                // 给span设置title
                                $(td).find('span').attr({
                                    title: $(this).text()
                                })
                            }
                        }
                    });

                    // 行template之后的回调函数
                    var afterTemplate = Plugin.getOption('rows.afterTemplate');
                    if (typeof afterTemplate === 'function') {
                        afterTemplate($(tr), obj, tri);
                    }
                });

                $(tablePart).find('.table-actions').each(function () {
                    app.initTooltip($(this));
                });
            },

            /**
             * 设置额外的列属性
             * 比如: checkbox
             */
            setupSystemColumn: function () {
                datatable.dataSet = datatable.dataSet || [];
                // 无数据
                if (datatable.dataSet.length === 0) return;

                var columns = options.columns;
                $(datatable.tableBody).find('.' + pfx + 'datatable__row').each(function (tri, tr) {
                    $(tr).find('.' + pfx + 'datatable__cell').each(function (tdi, td) {
                        // 根据列名获取列设置
                        var column = $.grep(columns, function (n, i) {
                            return $(td).data('field') === n.field;
                        })[0];
                        if (typeof column !== 'undefined') {
                            var value = $(td).text();

                            // 启用列选择器
                            if (typeof column.selector !== 'undefined' && column.selector !== false) {
                                // 检查checkbox是否已经存在
                                if ($(td).find('.' + pfx + 'checkbox [type="checkbox"]').length > 0) return;

                                $(td).addClass(pfx + 'datatable__cell--check');

                                // 添加 checkbox
                                var chk = $('<label/>').addClass(pfx + 'checkbox ' + pfx + 'checkbox--single').append($('<input/>').attr('type', 'checkbox').attr('value', value).on('click', function () {
                                    if ($(this).is(':checked')) {
                                        // 添加已勾选class
                                        Plugin.setActive(this);
                                    } else {
                                        // 移除已勾选class
                                        Plugin.setInactive(this);
                                    }
                                })).append('&nbsp;<span></span>');

                                // 自定义class
                                if (typeof column.selector.class !== 'undefined') {
                                    $(chk).addClass(column.selector.class);
                                }

                                $(td).children().html(chk);
                            }

                            // 启用子表切换
                            if (typeof column.subtable !== 'undefined' && column.subtable) {
                                // 检查子表是否存
                                if ($(td).find('.' + pfx + 'datatable__toggle-subtable').length > 0) return;
                                // 添加切换
                                $(td).children().html($('<a/>').addClass(pfx + 'datatable__toggle-subtable').attr('href', '#').attr('data-value', value).append($('<i/>').addClass(Plugin.getOption('layout.icons.rowDetail.collapse'))));
                            }
                        }
                    });
                });

                /**
                 * 为header/footer初始化checkbox
                 * @param tr
                 */
                var initCheckbox = function (tr) {
                    // 获取列设置
                    var column = $.grep(columns, function (n, i) {
                        return typeof n.selector !== 'undefined' && n.selector !== false;
                    })[0];

                    if (typeof column !== 'undefined') {
                        // 启用列checkbox
                        if (typeof column.selector !== 'undefined' && column.selector !== false) {
                            var td = $(tr).find('[data-field="' + column.field + '"]');
                            // 检查checkbox是否已经存在
                            if ($(td).find('.' + pfx + 'checkbox [type="checkbox"]').length > 0) return;

                            $(td).addClass(pfx + 'datatable__cell--check');

                            // 添加 checkbox
                            var chk = $('<label/>').addClass(pfx + 'checkbox ' + pfx + 'checkbox--single ' + pfx + 'checkbox--all').append($('<input/>').attr('type', 'checkbox').on('click', function () {
                                if ($(this).is(':checked')) {
                                    Plugin.setActiveAll(true);
                                } else {
                                    Plugin.setActiveAll(false);
                                }
                            })).append('&nbsp;<span></span>');

                            // 自定义class
                            if (typeof column.selector.class !== 'undefined') {
                                $(chk).addClass(column.selector.class);
                            }

                            $(td).children().html(chk);
                        }
                    }
                };

                if (options.layout.header) {
                    initCheckbox($(datatable.tableHead).find('.' + pfx + 'datatable__row').first());
                }
                if (options.layout.footer) {
                    initCheckbox($(datatable.tableFoot).find('.' + pfx + 'datatable__row').first());
                }
            },

            /**
             * 调整宽度以匹配容器大小
             */
            adjustCellsWidth: function () {
                // 获取表格宽度
                var containerWidth = $(datatable.tableBody).innerWidth() - Plugin.iconOffset;

                // 获取总列数
                var columns = $(datatable.tableBody).find('.' + pfx + 'datatable__row:first-child').find('.' + pfx + 'datatable__cell').// exclude expand icon
                not('.' + pfx + 'datatable__toggle-detail').not(':hidden').length;

                if (columns > 0) {
                    //  删除保留排序图标宽度
                    containerWidth = containerWidth - (Plugin.iconOffset * columns);
                    var minWidth = Math.floor(containerWidth / columns);

                    // 最小宽度
                    if (minWidth <= Plugin.cellOffset) {
                        minWidth = Plugin.cellOffset;
                    }

                    var maxWidthList = {};
                    $(datatable.table).find('.' + pfx + 'datatable__row').find('.' + pfx + 'datatable__cell').// exclude expand icon
                    not('.' + pfx + 'datatable__toggle-detail').not(':hidden').each(function (tdi, td) {

                        var width = minWidth;
                        var dataWidth = $(td).data('width');

                        if (typeof dataWidth !== 'undefined') {

                            if (dataWidth === 'auto') {
                                var field = $(td).data('field');
                                if (maxWidthList[field]) {
                                    width = maxWidthList[field];
                                } else {
                                    var cells = $(datatable.table).find('.' + pfx + 'datatable__cell[data-field="' + field + '"]');
                                    width = maxWidthList[field] = Math.max.apply(null,
                                        $(cells).map(function () {
                                            return $(this).outerWidth();
                                        }).get());
                                }
                            } else {
                                width = dataWidth;
                            }
                        }
                        $(td).children().css('width', Math.ceil(width));
                    });
                }

                return datatable;
            },

            /**
             * 调整高度以匹配容器大小
             */
            adjustCellsHeight: function () {
                $.each($(datatable.table).children(), function (part, tablePart) {
                    var totalRows = $(tablePart).find('.' + pfx + 'datatable__row').first().parent().find('.' + pfx + 'datatable__row').length;
                    for (var i = 1; i <= totalRows; i++) {
                        var rows = $(tablePart).find('.' + pfx + 'datatable__row:nth-child(' + i + ')');
                        if ($(rows).length > 0) {
                            var maxHeight = Math.max.apply(null, $(rows).map(function () {
                                return $(this).outerHeight();
                            }).get());
                            $(rows).css('height', Math.ceil(maxHeight));
                        }
                    }
                });
            },

            /**
             * 设置table DOM class
             */
            setupDOM: function (table) {
                $(table).find('> thead').addClass(pfx + 'datatable__head');
                $(table).find('> tbody').addClass(pfx + 'datatable__body');
                $(table).find('> tfoot').addClass(pfx + 'datatable__foot');
                $(table).find('tr').addClass(pfx + 'datatable__row');
                $(table).find('tr > th, tr > td').addClass(pfx + 'datatable__cell');
                $(table).find('tr > th, tr > td').each(function (i, td) {
                    if ($(td).find('span').length === 0) {
                        $(td).wrapInner($('<span/>').css('width', Plugin.cellOffset));
                    }
                });
            },

            /**
             * 默认滚动条
             * @returns {{tableLocked: null, init: init, onScrolling: onScrolling}}
             */
            scrollbar: function () {
                var scroll = {
                    scrollable: null,
                    tableLocked: null,
                    initPosition: null,
                    init: function () {
                        var screen = util.getViewPort().width;
                        // 设置滚动条
                        if (options.layout.scroll) {
                            // 设置滚动class
                            $(datatable.wrap).addClass(pfx + 'datatable--scroll');

                            var scrollable = $(datatable.tableBody).find('.' + pfx + 'datatable__lock--scroll');

                            // 检查表格是否有数据
                            if ($(scrollable).find('.' + pfx + 'datatable__row').length > 0 && $(scrollable).length > 0) {
                                scroll.scrollHead = $(datatable.tableHead).find('> .' + pfx + 'datatable__lock--scroll > .' + pfx + 'datatable__row');
                                scroll.scrollFoot = $(datatable.tableFoot).find('> .' + pfx + 'datatable__lock--scroll > .' + pfx + 'datatable__row');
                                scroll.tableLocked = $(datatable.tableBody).find('.' + pfx + 'datatable__lock:not(.' + pfx + 'datatable__lock--scroll)');
                                if (Plugin.getOption('layout.customScrollbar') && util.detectIE() != 10 && screen > util.getBreakpoint('lg')) {
                                    scroll.initCustomScrollbar(scrollable[0]);
                                } else {
                                    scroll.initDefaultScrollbar(scrollable);
                                }
                            } else if ($(datatable.tableBody).find('.' + pfx + 'datatable__row').length > 0 && !datatable.isLocked()) {
                                scroll.scrollHead = $(datatable.tableHead).find('> .' + pfx + 'datatable__row');
                                scroll.scrollFoot = $(datatable.tableFoot).find('> .' + pfx + 'datatable__row');
                                if (Plugin.getOption('layout.customScrollbar') && util.detectIE() != 10 && screen > util.getBreakpoint('lg')) {
                                    scroll.initCustomScrollbar(datatable.tableBody);
                                } else {
                                    scroll.initDefaultScrollbar(datatable.tableBody);
                                }
                            }
                        }
                    },
                    initDefaultScrollbar: function (scrollable) {
                        // 获取初始坐标
                        scroll.initPosition = $(scrollable).scrollLeft();
                        $(scrollable).css('overflow-y', 'auto').off().on('scroll', scroll.onScrolling);
                        if (Plugin.getOption('rows.autoHide') !== true) {
                            $(scrollable).css('overflow-x', 'auto');
                        }
                    },
                    /**
                     * 滚动回调
                     * @param e
                     */
                    onScrolling: function (e) {
                        var left = $(this).scrollLeft();
                        var top = $(this).scrollTop();
                        $(scroll.scrollHead).css('left', -left);
                        $(scroll.scrollFoot).css('left', -left);
                        $(scroll.tableLocked).each(function (i, table) {
                            if (Plugin.isLocked()) {
                                // scrollbar offset
                                top -= 1;
                            }
                            $(table).css('top', -top);
                        });
                    },
                    initCustomScrollbar: function (scrollable) {
                        scroll.scrollable = scrollable;
                        // create a new instance for table body with scrollbar
                        Plugin.initScrollbar(scrollable);
                        // 获取初始坐标
                        scroll.initPosition = $(scrollable).scrollLeft();
                        $(scrollable).off().on('scroll', scroll.onScrolling);
                    }
                };
                scroll.init();
                return scroll;
            },

            /**
             * 初始化滚动条和复位位置
             * @param element
             * @param options
             */
            initScrollbar: function (element, options) {
                if (!element || !element.nodeName) {
                    return;
                }
                $(datatable.tableBody).css('overflow', '');
                if (util.hasClass(element, 'ps')) {
                    $(element).data('ps').update();
                } else {
                    var ps = new PerfectScrollbar(element, Object.assign({}, {
                        wheelSpeed: 0.5,
                        swipeEasing: true,
                        // wheelPropagation: false,
                        minScrollbarLength: 40,
                        maxScrollbarLength: 300,
                        suppressScrollX: Plugin.getOption('rows.autoHide') && !Plugin.isLocked()
                    }, options));
                    $(element).data('ps', ps);

                    // 拖动窗口大小重新设置滚动条
                    $(window).resize(function () {
                        ps.update();
                    });
                }
            },

            /**
             * 根据options.columns设置表头标题
             */
            setHeadTitle: function (tablePart) {
                if (typeof tablePart === 'undefined') tablePart = datatable.tableHead;
                tablePart = $(tablePart)[0];
                var columns = options.columns;
                var row = tablePart.getElementsByTagName('tr')[0];
                var ths = tablePart.getElementsByTagName('td');

                if (typeof row === 'undefined') {
                    row = document.createElement('tr');
                    tablePart.appendChild(row);
                }

                $.each(columns, function (i, column) {
                    var th = ths[i];
                    if (typeof th === 'undefined') {
                        th = document.createElement('th');
                        row.appendChild(th);
                    }

                    // 设置列标题
                    if (typeof column['title'] !== 'undefined') {
                        th.innerHTML = column.title;
                        th.setAttribute('data-field', column.field);
                        util.addClass(th, column.class);
                        // set disable autoHide or force enable
                        if (typeof column.autoHide !== 'undefined') {
                            if (column.autoHide !== true) {
                                th.setAttribute('data-autohide-disabled', column.autoHide);
                            } else {
                                th.setAttribute('data-autohide-enabled', column.autoHide);
                            }
                        }
                        $(th).data(column);
                    }

                    // 设置 header attr 属性
                    if (typeof column.attr !== 'undefined') {
                        $.each(column.attr, function (key, val) {
                            th.setAttribute(key, val);
                        });
                    }

                    // 为thead/tfoot添加文本对齐方式
                    if (typeof column.textAlign !== 'undefined') {
                        var align = typeof datatable.textAlign[column.textAlign] !== 'undefined' ? datatable.textAlign[column.textAlign] : '';
                        util.addClass(th, align);
                    }
                });
                Plugin.setupDOM(tablePart);
            },

            /**
             * 通过Ajax获取数据或本地数据
             */
            dataRender: function (action) {
                $(datatable.table).siblings('.' + pfx + 'datatable__pager').removeClass(pfx + 'datatable--paging-loaded');
                /**
                 * 构建参数
                 * @return {*}
                 */
                var buildMeta = function () {
                    datatable.dataSet = datatable.dataSet || [];
                    Plugin.localDataUpdate();
                    // local pagination meta
                    var meta = Plugin.getDataSourceParam('page');
                    if (meta.size == null || meta.size === 0) {
                        meta.size = options.data.pageSize || 10;
                    }
                    if (meta.current == null || meta.current === 0) {
                        meta.current = 1;
                    }
                    meta.total = datatable.dataSet.length;
                    var start = Math.max(meta.size * (meta.current - 1), 0);
                    var end = Math.min(start + meta.size, meta.total);
                    datatable.dataSet = $(datatable.dataSet).slice(start, end);
                    return meta;
                };
                /**
                 * 获取数据后
                 * @param result
                 */
                var afterGetData = function (result) {
                    if (result == null || tool.httpCode.success === result.code) {
                        var localPagingCallback = function (ctx, meta) {
                            if (!$(ctx.pager).hasClass(pfx + 'datatable--paging-loaded')) {
                                $(ctx.pager).remove();
                                ctx.init(meta);
                            }
                            $(ctx.pager).off().on(pfx + 'datatable--on-goto-page', function (e) {
                                $(ctx.pager).remove();
                                ctx.init(meta);
                            });

                            var start = Math.max(meta.size * (meta.current - 1), 0);
                            var end = Math.min(start + meta.size, meta.total);

                            Plugin.localDataUpdate();
                            datatable.dataSet = $(datatable.dataSet).slice(start, end);

                            // 将数据插入到表格中
                            Plugin.insertData();
                        };
                        $(datatable.wrap).removeClass(pfx + 'datatable--error');
                        // 启用分页
                        if (options.pagination) {
                            if (options.data.serverPaging && options.data.type !== 'local') {
                                // 服务端分页
                                // 服务器端分页
                                if (tool.httpCode.success !== result.code) {
                                    tool.errorTip('查询数据失败', result.message);
                                    result.data = [];
                                    result.data.current = 0;
                                    result.data.size = 15;
                                    result.data.total = 0;
                                }
                                var serverMeta = result.data;
                                if (serverMeta !== null) {
                                    Plugin.pagingObject = Plugin.paging(serverMeta);
                                } else {
                                    // 没有来自服务器响应的分页，使用本地分页
                                    Plugin.pagingObject = Plugin.paging(buildMeta(), localPagingCallback);
                                }
                            } else {
                                // local pagination can be used by remote data also
                                // 本地分页也可由远程数据使用
                                Plugin.pagingObject = Plugin.paging(buildMeta(), localPagingCallback);
                            }
                        } else {
                            // 禁用分页
                            Plugin.localDataUpdate();
                        }
                        // 将数据插入到表格中
                        Plugin.insertData();
                    }
                };

                // 数据在本地
                if (options.data.type === 'local'
                    || options.data.serverSorting === false && action === 'sort'
                    || options.data.serverFiltering === false && action === 'search'
                ) {
                    setTimeout(function () {
                        afterGetData();
                        Plugin.setAutoColumns();
                    });
                    return;
                }

                // 获取远程数据
                Plugin.getData().done(afterGetData);
            },

            /**
             * 插入ajax数据
             */
            insertData: function () {
                datatable.dataSet = datatable.dataSet || [];
                var params = Plugin.getDataSourceParam();

                // 获取行属性
                var pagination = params.pagination;
                var start = (Math.max(pagination.current, 1) - 1) * pagination.size;
                var end = Math.min(pagination.current, pagination.pages) * pagination.size;
                var rowProps = {};
                if (typeof options.data.attr.rowProps !== 'undefined' && options.data.attr.rowProps.length) {
                    rowProps = options.data.attr.rowProps.slice(start, end);
                }

                var tableBody = document.createElement('tbody');
                tableBody.style.visibility = 'hidden';
                var colLength = options.columns.length;

                $.each(datatable.dataSet, function (rowIndex, row) {
                    var tr = document.createElement('tr');
                    tr.setAttribute('data-row', rowIndex);
                    if (typeof row.id !== 'undefined') {
                        tr.setAttribute('data-id', row.id);
                    }
                    // 设置tr上的data-obj
                    $(tr).data('obj', row);

                    if (typeof rowProps[rowIndex] !== 'undefined') {
                        $.each(rowProps[rowIndex], function () {
                            tr.setAttribute(this.name, this.value);
                        });
                    }

                    for (var a = 0; a < colLength; a += 1) {
                        var column = options.columns[a];
                        var classes = [];
                        // 添加排序class
                        if (Plugin.getObject('sort.field', params) === column.field) {
                            classes.push(pfx + 'datatable__cell--sorted');
                        }

                        // 设置文本对齐方式
                        if (typeof column.textAlign !== 'undefined') {
                            var align = typeof datatable.textAlign[column.textAlign] !== 'undefined' ? datatable.textAlign[column.textAlign] : '';
                            classes.push(align);
                        }

                        // var classAttr = '';
                        // 设置列class
                        if (typeof column.class !== 'undefined') {
                            classes.push(column.class);
                        }

                        var td = document.createElement('td');
                        util.addClass(td, classes.join(' '));
                        td.setAttribute('data-field', column.field);
                        // set disable autoHide or force enable
                        // 设置禁用自动隐藏或强制启用
                        if (typeof column.autoHide !== 'undefined') {
                            if (column.autoHide !== true) {
                                td.setAttribute('data-autohide-disabled', column.autoHide);
                            } else {
                                td.setAttribute('data-autohide-enabled', column.autoHide);
                            }
                        }
                        td.innerHTML = Plugin.getObject(column.field, row);
                        tr.appendChild(td);
                    }

                    tableBody.appendChild(tr);
                });

                // 显示无记录消息
                if (datatable.dataSet.length === 0) {
                    var errorSpan = document.createElement('span');
                    util.addClass(errorSpan, pfx + 'datatable--error');
                    errorSpan.innerHTML = Plugin.getOption('translate.records.noRecords');
                    tableBody.appendChild(errorSpan);
                    $(datatable.wrap).addClass(pfx + 'datatable--error ' + pfx + 'datatable--loaded');
                    Plugin.spinnerCallback(false);
                }

                // 替换已存在的table body
                $(datatable.tableBody).replaceWith(tableBody);
                datatable.tableBody = tableBody;

                // 更新布局
                Plugin.setupDOM(datatable.table);
                Plugin.setupCellField([datatable.tableBody]);
                Plugin.setupTemplateCell(datatable.tableBody);
                Plugin.layoutUpdate();
            },
            /**
             * 更新table组件
             */
            updateTableComponents: function () {
                datatable.tableHead = $(datatable.table).children('thead');
                datatable.tableBody = $(datatable.table).children('tbody');
                datatable.tableFoot = $(datatable.table).children('tfoot');
            },

            /**
             * 使用ajax获取数据
             */
            getData: function () {
                // Plugin.spinnerCallback(true);

                var ajaxParams = {
                    contentType: 'application/json',
                    dataType: 'json',
                    method: 'POST',
                    data: {},
                    timeout: Plugin.getOption('data.source.read.timeout') || 1000 * 30
                };

                if (options.data.type === 'local') {
                    ajaxParams.url = options.data.source;
                }

                if (options.data.type === 'remote') {
                    var data = Plugin.getDataSourceParam();
                    // 如果没有启用服务端分页,删除参数中的分页信息
                    if (!Plugin.getOption('data.serverPaging')) {
                        delete data['page'];
                    } else {
                        // 如果数据来源于服务器并且在服务器分页,将排序信息放到参数中
                        if (typeof data.sort !== 'undefined') {
                            if ('asc' === data.sort.sort) {
                                data.page.ascs = [data.sort.field];
                            } else if ('desc' === data.sort.sort) {
                                data.page.descs = [data.sort.field];
                            }
                        }
                        delete data['sort'];
                    }

                    // 表单内参数是否需要带入
                    if (Plugin.getOption('data.source.autoQuery')) {
                        var formParams = tool.queryParams($(datatable.table).parents('form.kt-form').find('.query-modular input,.query-modular select'));
                        ajaxParams.data = $.extend(true, ajaxParams.data, formParams);
                    }

                    ajaxParams.data = $.extend({}, ajaxParams.data, data, Plugin.getOption('data.source.read.params'));
                    ajaxParams = $.extend({}, ajaxParams, Plugin.getOption('data.source.read'));

                    if (typeof ajaxParams.url !== 'string') ajaxParams.url = Plugin.getOption('data.source.read');
                    if (typeof ajaxParams.url !== 'string') ajaxParams.url = Plugin.getOption('data.source');
                    ajaxParams.method = Plugin.getOption('data.source.read.method') || 'POST';
                    ajaxParams.data = JSON.stringify(ajaxParams.data);
                }
                /**
                 * 失败
                 * @param jqXHR
                 * @param textStatus
                 * @param errorThrown
                 */
                var failBack = function (jqXHR, textStatus, errorThrown) {
                    $(datatable).trigger(pfx + 'datatable--on-ajax-fail', [jqXHR]);
                    $(datatable.tableBody).html($('<span/>').addClass(pfx + 'datatable--error').html(Plugin.getOption('translate.records.noRecords')));
                    $(datatable.wrap).addClass(pfx + 'datatable--error ' + pfx + 'datatable--loaded');
                    Plugin.spinnerCallback(false);
                };

                return $.ajax(ajaxParams).done(function (response, textStatus, jqXHR) {
                    if (tool.httpCode.success === response.code) {
                        datatable.lastResponse = response;
                        // extendible data map callback for custom dataSource
                        datatable.dataSet = datatable.originalDataSet = Plugin.dataMapCallback(response);
                        Plugin.setAutoColumns();
                        $(datatable).trigger(pfx + 'datatable--on-ajax-done', [datatable.dataSet]);
                    } else {
                        tool.errorTip('查询数据失败', response.message);
                        failBack(response.message);
                    }
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    failBack(jqXHR, textStatus, errorThrown);
                }).always(function () {
                });
            },

            /**
             * 分页
             * @param meta if null, 本地分页, 否则服务器分页
             * @param callback 回调
             */
            paging: function (meta, callback) {
                var pg = {
                    meta: null,
                    pager: null,
                    paginateEvent: null,
                    pagerLayout: {pagination: null, info: null},
                    callback: null,
                    init: function (meta) {
                        pg.meta = meta;

                        // 转为int类型
                        pg.meta.current = parseInt(pg.meta.current);
                        pg.meta.pages = parseInt(pg.meta.pages);
                        pg.meta.size = parseInt(pg.meta.size);
                        pg.meta.total = parseInt(pg.meta.total);

                        // 计算总页数
                        pg.meta.pages = Math.max(Math.ceil(pg.meta.total / pg.meta.size), 1);

                        // 当前页不能超过总页数
                        if (pg.meta.current > pg.meta.pages) pg.meta.current = pg.meta.pages;

                        // 设置唯一事件
                        pg.paginateEvent = Plugin.getTablePrefix();

                        pg.pager = $(datatable.table).siblings('.' + pfx + 'datatable__pager');
                        if ($(pg.pager).hasClass(pfx + 'datatable--paging-loaded')) return;

                        // 重新创建分页
                        $(pg.pager).remove();

                        // 无分页
                        if (pg.meta.pages === 0) return;

                        // 设置分页参数
                        Plugin.setDataSourceParam('page', {
                            current: pg.meta.current,
                            pages: pg.meta.pages,
                            size: pg.meta.size,
                            total: pg.meta.total
                        });

                        // 默认回调函数, 包含服务器分页
                        pg.callback = pg.serverCallback;
                        // 自定义回调函数
                        if (typeof callback === 'function') pg.callback = callback;

                        pg.addPaginateEvent();
                        pg.populate();

                        pg.meta.current = Math.max(pg.meta.current || 1, pg.meta.current);

                        $(datatable).trigger(pg.paginateEvent, pg.meta);

                        pg.pagingBreakpoint.call();
                        $(window).resize(pg.pagingBreakpoint);
                    },
                    serverCallback: function (ctx, meta) {
                        Plugin.dataRender();
                    },
                    /**
                     * 生成分页工具条
                     */
                    populate: function () {
                        var icons = Plugin.getOption('layout.icons.pagination');
                        var title = Plugin.getOption('translate.toolbar.pagination.items.default');
                        // 分页根元素
                        pg.pager = $('<div/>').addClass(pfx + 'datatable__pager ' + pfx + 'datatable--paging-loaded');
                        // 页码链接
                        var pagerNumber = $('<ul/>').addClass(pfx + 'datatable__pager-nav');
                        pg.pagerLayout['pagination'] = pagerNumber;

                        // 第一页/上一页 按钮
                        $('<li/>').append($('<a/>').attr('title', title.first).addClass(pfx + 'datatable__pager-link ' + pfx + 'datatable__pager-link--first').append($('<i/>').addClass(icons.first)).on('click', pg.gotoMorePage).attr('data-page', 1)).appendTo(pagerNumber);
                        $('<li/>').append($('<a/>').attr('title', title.prev).addClass(pfx + 'datatable__pager-link ' + pfx + 'datatable__pager-link--prev').append($('<i/>').addClass(icons.prev)).on('click', pg.gotoMorePage)).appendTo(pagerNumber);

                        // more previous pages
                        $('<li/>').append($('<a/>').attr('title', title.more).addClass(pfx + 'datatable__pager-link ' + pfx + 'datatable__pager-link--more-prev').html($('<i/>').addClass(icons.more)).on('click', pg.gotoMorePage)).appendTo(pagerNumber);

                        $('<li/>').append($('<input/>').attr('type', 'text').addClass(pfx + 'pager-input form-control').attr('title', title.input).on('keyup', function () {
                            // 当 keyup 更新 [data-page]
                            $(this).attr('data-page', Math.abs($(this).val()));
                        }).on('keypress', function (e) {
                            // 按回车
                            if (e.which === 13) pg.gotoMorePage(e);
                        })).appendTo(pagerNumber);

                        var pagesNumber = Plugin.getOption('toolbar.items.pagination.pages.desktop.pagesNumber');
                        var end = Math.ceil(pg.meta.current / pagesNumber) * pagesNumber;
                        var start = end - pagesNumber;
                        if (end > pg.meta.pages) {
                            end = pg.meta.pages;
                        }
                        for (var x = start; x < end; x++) {
                            var pageNumber = x + 1;
                            $('<li/>').append($('<a/>').addClass(pfx + 'datatable__pager-link ' + pfx + 'datatable__pager-link-number').text(pageNumber).attr('data-page', pageNumber).attr('title', pageNumber).on('click', pg.gotoPage)).appendTo(pagerNumber);
                        }

                        // more next pages
                        $('<li/>').append($('<a/>').attr('title', title.more).addClass(pfx + 'datatable__pager-link ' + pfx + 'datatable__pager-link--more-next').html($('<i/>').addClass(icons.more)).on('click', pg.gotoMorePage)).appendTo(pagerNumber);

                        // 下一页/最后一页 按钮
                        $('<li/>').append($('<a/>').attr('title', title.next).addClass(pfx + 'datatable__pager-link ' + pfx + 'datatable__pager-link--next').append($('<i/>').addClass(icons.next)).on('click', pg.gotoMorePage)).appendTo(pagerNumber);
                        $('<li/>').append($('<a/>').attr('title', title.last).addClass(pfx + 'datatable__pager-link ' + pfx + 'datatable__pager-link--last').append($('<i/>').addClass(icons.last)).on('click', pg.gotoMorePage).attr('data-page', pg.meta.pages)).appendTo(pagerNumber);

                        // 分页信息
                        if (Plugin.getOption('toolbar.items.info')) {
                            pg.pagerLayout['info'] = $('<div/>').addClass(pfx + 'datatable__pager-info').append($('<span/>').addClass(pfx + 'datatable__pager-detail'));
                        }

                        $.each(Plugin.getOption('toolbar.layout'), function (i, layout) {
                            $(pg.pagerLayout[layout]).appendTo(pg.pager);
                        });

                        // 页大小 select
                        var pageSizeSelect = $('<select/>').addClass('selectpicker ' + pfx + 'datatable__pager-size').attr('title', Plugin.getOption('translate.toolbar.pagination.items.default.select')).attr('data-width', '60px').val(pg.meta.size).on('change', pg.updatePerpage).prependTo(pg.pagerLayout['info']);

                        var pageSizes = Plugin.getOption('toolbar.items.pagination.pageSizeSelect');
                        // 如果未指定页大小设置,使用默认设置
                        if (pageSizes.length === 0) pageSizes = [10, 15, 20, 30, 50, 100];
                        $.each(pageSizes, function (i, size) {
                            var display = size;
                            if (size === -1) display = Plugin.getOption('translate.toolbar.pagination.items.default.all');
                            $('<option/>').attr('value', size).html(display).appendTo(pageSizeSelect);
                        });

                        // 初始化下拉插件
                        $(datatable).ready(function () {
                            $('.selectpicker').selectpicker().on('hide.bs.select', function () {
                                // fix dropup arrow icon on hide
                                $(this).closest('.bootstrap-select').removeClass('dropup');
                            }).siblings('.dropdown-toggle').attr('title', Plugin.getOption('translate.toolbar.pagination.items.default.select'));
                        });

                        pg.paste();
                    },
                    /**
                     * 将分页工具条插入页码
                     */
                    paste: function () {
                        // 根据toolbar.placement(top|bottom)插入分页工具条
                        $.each($.unique(Plugin.getOption('toolbar.placement')),
                            function (i, position) {
                                if (position === 'bottom') {
                                    $(pg.pager).clone(true).insertAfter(datatable.table);
                                }
                                if (position === 'top') {
                                    // 分页放到顶部需要额外的空间
                                    $(pg.pager).clone(true).addClass(pfx + 'datatable__pager--top').insertBefore(datatable.table);
                                }
                            });
                    },
                    gotoMorePage: function (e) {
                        e.preventDefault();
                        // $(this) is a link of .'+pfx+'datatable__pager-link

                        if ($(this).attr('disabled') === 'disabled') return false;

                        var page = $(this).attr('data-page');

                        // event from text input
                        if (typeof page === 'undefined') {
                            page = $(e.target).attr('data-page');
                        }

                        pg.openPage(parseInt(page));
                        return false;
                    },
                    /**
                     * 点击页码按钮
                     *
                     * @param e
                     */
                    gotoPage: function (e) {
                        e.preventDefault();
                        // 如果点击的是当前页,忽略
                        if ($(this).hasClass(pfx + 'datatable__pager-link--active')) return;

                        pg.openPage(parseInt($(this).data('page')));
                    },
                    /**
                     * 跳转到多少页
                     * @param page {string} 页码
                     */
                    openPage: function (page) {
                        // 当前页从1开始
                        pg.meta.current = parseInt(page);

                        $(datatable).trigger(pg.paginateEvent, pg.meta);
                        pg.callback(pg, pg.meta);

                        // 更新分页回调函数
                        $(pg.pager).trigger(pfx + 'datatable--on-goto-page', pg.meta);
                    },
                    /**
                     * 改变页大小
                     * @param e
                     */
                    updatePerpage: function (e) {
                        e.preventDefault();

                        pg.pager = $(datatable.table).siblings('.' + pfx + 'datatable__pager').removeClass(pfx + 'datatable--paging-loaded');

                        // 改变页大小
                        if (e.originalEvent) {
                            pg.meta.size = parseInt($(this).val());
                        }

                        $(pg.pager).find('select.' + pfx + 'datatable__pager-size').val(pg.meta.size).attr('data-selected', pg.meta.size);

                        // 更新 dataSource 参数
                        Plugin.setDataSourceParam('page', {
                            current: pg.meta.current,
                            pages: pg.meta.pages,
                            size: pg.meta.size,
                            total: pg.meta.total
                        });

                        // 更新分页回调函数
                        $(pg.pager).trigger(pfx + 'datatable--on-update-perpage', pg.meta);
                        $(datatable).trigger(pg.paginateEvent, pg.meta);
                        pg.callback(pg, pg.meta);

                        // 更新分页信息
                        pg.updateInfo.call();
                    },
                    /**
                     * 绑定分页事件
                     *
                     * @param e
                     */
                    addPaginateEvent: function (e) {
                        $(datatable).off(pg.paginateEvent).on(pg.paginateEvent, function (e, meta) {
                            Plugin.spinnerCallback(true);

                            pg.pager = $(datatable.table).siblings('.' + pfx + 'datatable__pager');
                            var pagerNumber = $(pg.pager).find('.' + pfx + 'datatable__pager-nav');

                            // 设置当前页按钮状态
                            $(pagerNumber).find('.' + pfx + 'datatable__pager-link--active').removeClass(pfx + 'datatable__pager-link--active');
                            $(pagerNumber).find('.' + pfx + 'datatable__pager-link-number[data-page="' + meta.current + '"]').addClass(pfx + 'datatable__pager-link--active');

                            // 设置上一页下一页按钮页码
                            $(pagerNumber).find('.' + pfx + 'datatable__pager-link--prev').attr('data-page', Math.max(meta.current - 1, 1));
                            $(pagerNumber).find('.' + pfx + 'datatable__pager-link--next').attr('data-page', Math.min(meta.current + 1, meta.pages));

                            // 设置当前页页码
                            $(pg.pager).each(function () {
                                $(this).find('.' + pfx + 'pager-input[type="text"]').prop('value', meta.current);
                            });

                            $(pg.pager).find('.' + pfx + 'datatable__pager-nav').show();
                            if (meta.pages <= 1) {
                                // 如果不足2页,隐藏工具条
                                $(pg.pager).find('.' + pfx + 'datatable__pager-nav').hide();
                            }

                            // 更新 dataSource 参数
                            Plugin.setDataSourceParam('page', {
                                current: pg.meta.current,
                                pages: pg.meta.pages,
                                size: pg.meta.size,
                                total: pg.meta.total
                            });

                            $(pg.pager).find('select.' + pfx + 'datatable__pager-size').val(meta.size).attr('data-selected', meta.size);

                            // 清除选中行
                            $(datatable.table).find('.' + pfx + 'checkbox > [type="checkbox"]').prop('checked', false);
                            $(datatable.table).find('.' + pfx + 'datatable__row--active').removeClass(pfx + 'datatable__row--active');

                            pg.updateInfo.call();
                            pg.pagingBreakpoint.call();
                            // Plugin.resetScroll();
                        });
                    },
                    /**
                     * 更新分页信息
                     */
                    updateInfo: function () {
                        var start = Math.max(pg.meta.size * (pg.meta.current - 1) + 1, 1);
                        var end = Math.min(start + pg.meta.size - 1, pg.meta.total);
                        // 更新分页信息
                        $(pg.pager).find('.' + pfx + 'datatable__pager-info').find('.' + pfx + 'datatable__pager-detail').html(Plugin.dataPlaceholder(
                            Plugin.getOption('translate.toolbar.pagination.items.info'), {
                                start: start,
                                end: pg.meta.size === -1 ? pg.meta.total : end,
                                pageSize: pg.meta.size === -1 ||
                                pg.meta.size >= pg.meta.total
                                    ? pg.meta.total
                                    : pg.meta.size,
                                total: pg.meta.total,
                            }));
                    },

                    /**
                     * 根据当前屏幕尺寸更新分页工具条显示方式
                     */
                    pagingBreakpoint: function () {
                        // keep page links reference
                        var pagerNumber = $(datatable.table).siblings('.' + pfx + 'datatable__pager').find('.' + pfx + 'datatable__pager-nav');
                        if ($(pagerNumber).length === 0) return;

                        var currentPage = Plugin.getCurrentPage();
                        var pagerInput = $(pagerNumber).find('.' + pfx + 'pager-input').closest('li');

                        // 重置
                        $(pagerNumber).find('li').show();

                        // 更新分页工具条
                        $.each(Plugin.getOption('toolbar.items.pagination.pages'),
                            function (mode, option) {
                                if (util.isInResponsiveRange(mode)) {
                                    switch (mode) {
                                        case 'desktop':
                                        case 'tablet':
                                            var end = Math.ceil(currentPage / option.pagesNumber) *
                                                option.pagesNumber;
                                            // var start = end - option.pagesNumber;
                                            $(pagerInput).hide();
                                            pg.meta = Plugin.getDataSourceParam('page');
                                            pg.paginationUpdate();
                                            break;

                                        case 'mobile':
                                            $(pagerInput).show();
                                            $(pagerNumber).find('.' + pfx + 'datatable__pager-link--more-prev').closest('li').hide();
                                            $(pagerNumber).find('.' + pfx + 'datatable__pager-link--more-next').closest('li').hide();
                                            $(pagerNumber).find('.' + pfx + 'datatable__pager-link-number').closest('li').hide();
                                            break;
                                    }

                                    return false;
                                }
                            });
                    },

                    /**
                     * Update pagination number and button display
                     */
                    paginationUpdate: function () {
                        var pager = $(datatable.table).siblings('.' + pfx + 'datatable__pager').find('.' + pfx + 'datatable__pager-nav'),
                            pagerMorePrev = $(pager).find('.' + pfx + 'datatable__pager-link--more-prev'),
                            pagerMoreNext = $(pager).find('.' + pfx + 'datatable__pager-link--more-next'),
                            pagerFirst = $(pager).find('.' + pfx + 'datatable__pager-link--first'),
                            pagerPrev = $(pager).find('.' + pfx + 'datatable__pager-link--prev'),
                            pagerNext = $(pager).find('.' + pfx + 'datatable__pager-link--next'),
                            pagerLast = $(pager).find('.' + pfx + 'datatable__pager-link--last');

                        // 获取可见页码
                        var pagerNumber = $(pager).find('.' + pfx + 'datatable__pager-link-number');
                        // 获取第一个页码的上一页页码
                        var morePrevPage = Math.max($(pagerNumber).first().data('page') - 1,
                            1);
                        $(pagerMorePrev).each(function (i, prev) {
                            $(prev).attr('data-page', morePrevPage);
                        });
                        // 判断是否要显示上一页按钮
                        if (morePrevPage === 1) {
                            $(pagerMorePrev).parent().hide();
                        } else {
                            $(pagerMorePrev).parent().show();
                        }

                        // 获取最后一个页码的下一页页码
                        var moreNextPage = Math.min($(pagerNumber).last().data('page') + 1,
                            pg.meta.pages);
                        $(pagerMoreNext).each(function (i, prev) {
                            $(pagerMoreNext).attr('data-page', moreNextPage).show();
                        });

                        // 判断是否要显示下一页按钮
                        if (moreNextPage === pg.meta.pages
                            // missing dot fix when last hidden page is one left
                            && moreNextPage === $(pagerNumber).last().data('page')) {
                            $(pagerMoreNext).parent().hide();
                        } else {
                            $(pagerMoreNext).parent().show();
                        }

                        // 第一页/最后一页按钮状态
                        if (pg.meta.current === 1) {
                            $(pagerFirst).attr('disabled', true).addClass(pfx + 'datatable__pager-link--disabled');
                            $(pagerPrev).attr('disabled', true).addClass(pfx + 'datatable__pager-link--disabled');
                        } else {
                            $(pagerFirst).removeAttr('disabled').removeClass(pfx + 'datatable__pager-link--disabled');
                            $(pagerPrev).removeAttr('disabled').removeClass(pfx + 'datatable__pager-link--disabled');
                        }
                        if (pg.meta.current === pg.meta.pages) {
                            $(pagerNext).attr('disabled', true).addClass(pfx + 'datatable__pager-link--disabled');
                            $(pagerLast).attr('disabled', true).addClass(pfx + 'datatable__pager-link--disabled');
                        } else {
                            $(pagerNext).removeAttr('disabled').removeClass(pfx + 'datatable__pager-link--disabled');
                            $(pagerLast).removeAttr('disabled').removeClass(pfx + 'datatable__pager-link--disabled');
                        }

                        // 根据配置设置按钮显示/隐藏
                        var nav = Plugin.getOption('toolbar.items.pagination.navigation');
                        if (!nav.first) $(pagerFirst).remove();
                        if (!nav.prev) $(pagerPrev).remove();
                        if (!nav.next) $(pagerNext).remove();
                        if (!nav.last) $(pagerLast).remove();
                    }
                };
                pg.init(meta);
                return pg;
            },

            /**
             * 根据屏幕尺寸与设置,隐藏/显示列
             * options[columns][i][responsive][visible/hidden]
             */
            columnHide: function () {
                var screen = util.getViewPort().width;
                // foreach columns setting
                $.each(options.columns, function (i, column) {
                    if (typeof column.responsive !== 'undefined') {
                        var field = column.field;
                        var tds = $.grep($(datatable.table).find('.' + pfx + 'datatable__cell'), function (n, i) {
                            return field === $(n).data('field');
                        });
                        if (util.getBreakpoint(column.responsive.hidden) >= screen) {
                            $(tds).hide();
                        } else {
                            $(tds).show();
                        }
                        if (util.getBreakpoint(column.responsive.visible) <= screen) {
                            $(tds).show();
                        } else {
                            $(tds).hide();
                        }
                    }
                });
            },

            /**
             * 设置子表
             */
            setupSubDatatable: function () {
                var subTableCallback = Plugin.getOption('detail.content');
                if (typeof subTableCallback !== 'function') return;

                // subtable already exist
                if ($(datatable.table).find('.' + pfx + 'datatable__subtable').length > 0) return;

                $(datatable.wrap).addClass(pfx + 'datatable--subtable');

                options.columns[0]['subtable'] = true;

                // toggle on open sub table
                var toggleSubTable = function (e) {
                    e.preventDefault();
                    // get parent row of this subtable
                    var parentRow = $(this).closest('.' + pfx + 'datatable__row');

                    // get subtable row for sub table
                    var subTableRow = $(parentRow).next('.' + pfx + 'datatable__row-subtable');
                    if ($(subTableRow).length === 0) {
                        // prepare DOM for sub table, each <tr> as parent and add <tr> as child table
                        subTableRow = $('<tr/>').addClass(pfx + 'datatable__row-subtable ' + pfx + 'datatable__row-loading').hide().append($('<td/>').addClass(pfx + 'datatable__subtable').attr('colspan', Plugin.getTotalColumns()));
                        $(parentRow).after(subTableRow);
                        // add class to even row
                        if ($(parentRow).hasClass(pfx + 'datatable__row--even')) {
                            $(subTableRow).addClass(pfx + 'datatable__row-subtable--even');
                        }
                    }

                    $(subTableRow).toggle();

                    var subTable = $(subTableRow).find('.' + pfx + 'datatable__subtable');

                    // get id from first column of parent row
                    var primaryKey = $(this).closest('[data-field]:first-child').find('.' + pfx + 'datatable__toggle-subtable').data('value');

                    var icon = $(this).find('i').removeAttr('class');

                    // prevent duplicate datatable init
                    if ($(parentRow).hasClass(pfx + 'datatable__row--subtable-expanded')) {
                        $(icon).addClass(Plugin.getOption('layout.icons.rowDetail.collapse'));
                        // remove expand class from parent row
                        $(parentRow).removeClass(pfx + 'datatable__row--subtable-expanded');
                        // trigger event on collapse
                        $(datatable).trigger(pfx + 'datatable--on-collapse-subtable', [parentRow]);
                    } else {
                        // expand and run callback function
                        $(icon).addClass(Plugin.getOption('layout.icons.rowDetail.expand'));
                        // add expand class to parent row
                        $(parentRow).addClass(pfx + 'datatable__row--subtable-expanded');
                        // trigger event on expand
                        $(datatable).trigger(pfx + 'datatable--on-expand-subtable', [parentRow]);
                    }

                    // prevent duplicate datatable init
                    if ($(subTable).find('.' + pfx + 'datatable').length === 0) {
                        // get data by primary id
                        $.map(datatable.dataSet, function (n, i) {
                            // primary id must be at the first column, otherwise e.data will be undefined
                            if (primaryKey === n[options.columns[0].field]) {
                                e.data = n;
                                return true;
                            }
                            return false;
                        });

                        // deprecated in v5.0.6
                        e.detailCell = subTable;

                        e.parentRow = parentRow;
                        e.subTable = subTable;

                        // run callback with event
                        subTableCallback(e);

                        $(subTable).children('.' + pfx + 'datatable').on(pfx + 'datatable--on-init', function (e) {
                            $(subTableRow).removeClass(pfx + 'datatable__row-loading');
                        });
                        if (Plugin.getOption('data.type') === 'local') {
                            $(subTableRow).removeClass(pfx + 'datatable__row-loading');
                        }
                    }
                };

                var columns = options.columns;
                $(datatable.tableBody).find('.' + pfx + 'datatable__row').each(function (tri, tr) {
                    $(tr).find('.' + pfx + 'datatable__cell').each(function (tdi, td) {
                        // get column settings by field
                        var column = $.grep(columns, function (n, i) {
                            return $(td).data('field') === n.field;
                        })[0];
                        if (typeof column !== 'undefined') {
                            var value = $(td).text();
                            // enable column subtable toggle
                            if (typeof column.subtable !== 'undefined' && column.subtable) {
                                // check if subtable toggle exist
                                if ($(td).find('.' + pfx + 'datatable__toggle-subtable').length > 0) return;
                                // append subtable toggle
                                $(td).html($('<a/>').addClass(pfx + 'datatable__toggle-subtable').attr('href', '#').attr('data-value', value).attr('title', Plugin.getOption('detail.title')).on('click', toggleSubTable).append($('<i/>').css('width', $(td).data('width')).addClass(Plugin.getOption('layout.icons.rowDetail.collapse'))));
                            }
                        }
                    });
                });

                // $(datatable.tableHead).find('.'+pfx+'-datatable__row').first()
            },

            /**
             * dataSource mapping callback
             */
            dataMapCallback: function (raw) {
                // static dataset array
                var dataSet = raw;
                // dataset mapping callback
                if (typeof Plugin.getOption('data.source.read.map') === 'function') {
                    return Plugin.getOption('data.source.read.map')(raw);
                } else {
                    // default data mapping fallback
                    if (typeof raw !== 'undefined' && typeof raw.data !== 'undefined') {
                        dataSet = raw.data;
                    }
                }
                return dataSet;
            },

            isSpinning: false,
            /**
             * 打开/关闭 BlockUI 等待提示
             * @param block
             * @param target
             */
            spinnerCallback: function (block, target) {
                if (typeof target === 'undefined') target = datatable;
                // 获取遮罩设置
                var spinnerOptions = Plugin.getOption('layout.spinner');
                // spinner 被禁用
                if (typeof spinnerOptions === 'undefined' || !spinnerOptions) {
                    return;
                }
                if (block) {
                    if (!Plugin.isSpinning) {
                        if (typeof spinnerOptions.message !== 'undefined' && spinnerOptions.message === true) {
                            // 使用默认提示文字
                            spinnerOptions.message = Plugin.getOption('translate.records.processing');
                        }
                        Plugin.isSpinning = true;
                        if (typeof app !== 'undefined') {
                            app.block(target, spinnerOptions);
                        }
                    }
                } else {
                    Plugin.isSpinning = false;
                    if (typeof app !== 'undefined') {
                        app.unblock(target);
                    }
                }
            },

            /**
             * 默认排序回调函数
             * @param data {array} 数据
             * @param sort {string} asc|desc 排序方式
             * @param column {object} 排序的列
             * @returns {*|Array.<T>|{sort, field}|{asc, desc}}
             */
            sortCallback: function (data, sort, column) {
                var type = column['type'] || 'string';
                var format = column['format'] || '';
                var field = column['field'];

                return $(data).sort(function (a, b) {
                    var aField = a[field];
                    var bField = b[field];

                    switch (type) {
                        case 'date':
                            if (typeof moment === 'undefined') {
                                throw new Error('Moment.js is required.');
                            }
                            var diff = moment(aField, format).diff(moment(bField, format));
                            if (sort === 'asc') {
                                return diff > 0 ? 1 : diff < 0 ? -1 : 0;
                            } else {
                                return diff < 0 ? 1 : diff > 0 ? -1 : 0;
                            }
                            break;

                        case 'number':
                            if (isNaN(parseFloat(aField)) && aField != null) {
                                aField = Number(aField.replace(/[^0-9\.-]+/g, ''));
                            }
                            if (isNaN(parseFloat(bField)) && bField != null) {
                                bField = Number(bField.replace(/[^0-9\.-]+/g, ''));
                            }
                            aField = parseFloat(aField);
                            bField = parseFloat(bField);
                            if (sort === 'asc') {
                                return aField > bField ? 1 : aField < bField ? -1 : 0;
                            } else {
                                return aField < bField ? 1 : aField > bField ? -1 : 0;
                            }
                            break;

                        case 'string':
                        default:
                            if (sort === 'asc') {
                                return aField > bField ? 1 : aField < bField ? -1 : 0;
                            } else {
                                return aField < bField ? 1 : aField > bField ? -1 : 0;
                            }
                            break;
                    }
                });
            },

            /**
             * 日志
             *
             * @param text {object} 文字
             * @param obj {object}
             */
            log: function (text, obj) {
                if (typeof obj === 'undefined') obj = '';
                if (datatable.debug) {
                    console.log(text, obj);
                }
            },

            /**
             *  Auto hide columnds overflow in row
             *  自动隐藏溢出列
             */
            autoHide: function () {
                var hiddenExist = false;
                // force hide enabled
                var hidDefault = $(datatable.table).find('[data-autohide-enabled]');
                if (hidDefault.length) {
                    hiddenExist = true;
                    hidDefault.hide();
                }

                var toggleHiddenColumns = function (e) {
                    e.preventDefault();

                    var row = $(this).closest('.' + pfx + 'datatable__row');
                    var detailRow = $(row).next();

                    if (!$(detailRow).hasClass(pfx + 'datatable__row-detail')) {
                        $(this).find('i').removeClass(Plugin.getOption('layout.icons.rowDetail.collapse')).addClass(Plugin.getOption('layout.icons.rowDetail.expand'));

                        var hiddenCells = $(row).find('.' + pfx + 'datatable__cell:hidden');
                        var clonedCells = hiddenCells.clone().show();

                        detailRow = $('<tr/>').addClass(pfx + 'datatable__row-detail').insertAfter(row);
                        var detailRowTd = $('<td/>').addClass(pfx + 'datatable__detail').attr('colspan', Plugin.getTotalColumns()).appendTo(detailRow);

                        var detailSubTable = $('<table/>');
                        $(clonedCells).each(function () {
                            var field = $(this).data('field');
                            var column = $.grep(options.columns, function (n, i) {
                                return field === n.field;
                            })[0];
                            $(detailSubTable).append($('<tr class="' + pfx + 'datatable__row"></tr>').append($('<td class="' + pfx + 'datatable__cell"></td>').append($('<span/>').append(column.title))).append(this));
                        });
                        $(detailRowTd).append(detailSubTable);

                    } else {
                        $(this).find('i').removeClass(Plugin.getOption('layout.icons.rowDetail.expand')).addClass(Plugin.getOption('layout.icons.rowDetail.collapse'));
                        $(detailRow).remove();
                    }
                };

                setTimeout(function () {
                    $(datatable.table).find('.' + pfx + 'datatable__cell').show();
                    $(datatable.tableBody).each(function () {
                        var recursive = 0;
                        while ($(this)[0].offsetWidth < $(this)[0].scrollWidth && recursive < options.columns.length) {
                            $(datatable.table).find('.' + pfx + 'datatable__row').each(function (i) {
                                var cell = $(this).find('.' + pfx + 'datatable__cell:not(:hidden):not([data-autohide-disabled])').last();
                                $(cell).hide();
                                hiddenExist = true;
                            });
                            recursive++;
                        }
                    });

                    if (hiddenExist) {
                        // 改变列隐藏/显示
                        $(datatable.tableBody).find('.' + pfx + 'datatable__row').each(function () {
                            // if no toggle yet
                            if ($(this).find('.' + pfx + 'datatable__toggle-detail').length === 0) {
                                // add toggle
                                $(this).prepend($('<td/>').addClass(pfx + 'datatable__cell ' + pfx + 'datatable__toggle-detail').append($('<a/>').addClass(pfx + 'datatable__toggle-detail').attr('href', '').on('click', toggleHiddenColumns).append('<i class="' + Plugin.getOption('layout.icons.rowDetail.collapse') + '"></i>')));
                            }

                            // check if subtable toggle exist
                            if ($(datatable.tableHead).find('.' + pfx + 'datatable__toggle-detail').length === 0) {
                                // add empty column to the header and footer
                                $(datatable.tableHead).find('.' + pfx + 'datatable__row').first().prepend('<th class="' + pfx + 'datatable__cell ' + pfx + 'datatable__toggle-detail"><span></span></th>');
                                $(datatable.tableFoot).find('.' + pfx + 'datatable__row').first().prepend('<th class="' + pfx + 'datatable__cell ' + pfx + 'datatable__toggle-detail"><span></span></th>');
                            } else {
                                $(datatable.tableHead).find('.' + pfx + 'datatable__toggle-detail').find('span');
                            }
                        });
                    }
                });

                Plugin.adjustCellsWidth.call();
            },

            /**
             * 自动将服务器返回数据第一条作为表格标题
             */
            setAutoColumns: function () {
                if (Plugin.getOption('data.autoColumns')) {
                    $.each(datatable.dataSet[0], function (k, v) {
                        var found = $.grep(options.columns, function (n, i) {
                            return k === n.field;
                        });
                        if (found.length === 0) {
                            options.columns.push({field: k, title: k});
                        }
                    });
                    $(datatable.tableHead).find('.' + pfx + 'datatable__row').remove();
                    Plugin.setHeadTitle();
                    if (Plugin.getOption('layout.footer')) {
                        $(datatable.tableFoot).find('.' + pfx + 'datatable__row').remove();
                        Plugin.setHeadTitle(datatable.tableFoot);
                    }
                }
            },

            /********************
             ** 工具
             ********************/

            /**
             * 检查表格中是否有锁定列
             */
            isLocked: function () {
                var isLocked = Plugin.lockEnabledColumns();
                return isLocked.left.length > 0 || isLocked.right.length > 0;
            },

            isSubtable: function () {
                return util.hasClass(datatable.wrap[0], pfx + 'datatable--subtable') || false;
            },

            /**
             * 获取用于宽度计算的元素的额外空间 (包括 padding, margin, border)
             * @param element
             * @returns {number}
             */
            getExtraSpace: function (element) {
                var padding = parseInt($(element).css('paddingRight')) +
                    parseInt($(element).css('paddingLeft'));
                var margin = parseInt($(element).css('marginRight')) +
                    parseInt($(element).css('marginLeft'));
                var border = Math.ceil(
                    $(element).css('border-right-width').replace('px', ''));
                return padding + margin + border;
            },

            /**
             * 将数组的数据插入{{}}模板占位符中
             * @param template {string} 模板
             * @param data {array} 数据
             * @returns {*}
             */
            dataPlaceholder: function (template, data) {
                var result = template;
                $.each(data, function (key, val) {
                    result = result.replace('{{' + key + '}}', val);
                });
                return result;
            },

            /**
             * 获取表格唯一id
             *
             * @param suffix {string} 后缀
             * @returns {*}
             */
            getTableId: function (suffix) {
                if (typeof suffix === 'undefined') suffix = '';
                var id = $(datatable).attr('id');
                if (typeof id === 'undefined') {
                    id = $(datatable).attr('class').split(' ')[0];
                }
                return id + suffix;
            },

            /**
             * 根据表格级别获取表格前缀
             */
            getTablePrefix: function (suffix) {
                if (typeof suffix !== 'undefined') suffix = '-' + suffix;
                return Plugin.getTableId() + '-' + Plugin.getDepth() + suffix;
            },

            /**
             * 获取当前表格在子表中的级别
             *
             * @returns {number}
             */
            getDepth: function () {
                var depth = 0;
                var table = datatable.table;
                do {
                    table = $(table).parents('.' + pfx + 'datatable__table');
                    depth++;
                } while ($(table).length > 0);
                return depth;
            },

            /**
             * 保存表格状态
             *
             * @param key {string} 关键字
             * @param value {object} 值
             */
            stateKeep: function (key, value) {
                key = Plugin.getTablePrefix(key);
                if (Plugin.getOption('data.saveState') === false) return;
                if (Plugin.getOption('data.saveState.webstorage') && localStorage) {
                    localStorage.setItem(key, JSON.stringify(value));
                }
                if (Plugin.getOption('data.saveState.cookie')) {
                    Cookies.set(key, JSON.stringify(value));
                }
            },

            /**
             * 获取表格状态
             *
             * @param key {string} 关键字
             */
            stateGet: function (key, defValue) {
                key = Plugin.getTablePrefix(key);
                if (Plugin.getOption('data.saveState') === false) return;
                var value = null;
                if (Plugin.getOption('data.saveState.webstorage') && localStorage) {
                    value = localStorage.getItem(key);
                } else {
                    value = Cookies.get(key);
                }
                if (typeof value !== 'undefined' && value !== null) {
                    return JSON.parse(value);
                }
            },

            /**
             * 更新cookies/localStorage中的状态
             *
             * @param key {string} 关键字
             * @param value {object} 值
             */
            stateUpdate: function (key, value) {
                var ori = Plugin.stateGet(key);
                if (typeof ori === 'undefined' || ori === null) ori = {};
                Plugin.stateKeep(key, $.extend({}, ori, value));
            },

            /**
             * 移除指定cookies/localStorage
             *
             * @param key {string} key
             */
            stateRemove: function (key) {
                key = Plugin.getTablePrefix(key);
                if (localStorage) {
                    localStorage.removeItem(key);
                }
                Cookies.remove(key);
            },

            /**
             * 获取列数量
             */
            getTotalColumns: function (tablePart) {
                if (typeof tablePart === 'undefined') tablePart = datatable.tableBody;
                return $(tablePart).find('.' + pfx + 'datatable__row').first().find('.' + pfx + 'datatable__cell').length;
            },

            /**
             * 获取表格中的一行
             *
             * @param tablePart {string} 表格选择器
             * @param row {int} 行号 从1开始
             * @param tdOnly {boolean} 只返回td
             * @returns {*}
             */
            getOneRow: function (tablePart, row, tdOnly) {
                if (typeof tdOnly === 'undefined') tdOnly = true;
                // get list of <tr>
                var result = $(tablePart).find('.' + pfx + 'datatable__row:not(.' + pfx + 'datatable__row-detail):nth-child(' + row + ')');
                if (tdOnly) {
                    // get list of <td> or <th>
                    result = result.find('.' + pfx + 'datatable__cell');
                }
                return result;
            },

            /**
             * Sort table row at HTML level by column index.
             * todo; Not in use.
             * @param header Header sort clicked
             * @param sort asc|desc. Optional. Default asc
             * @param int Boolean. Optional. Comparison value parse to integer.
             *     Default false
             */
            sortColumn: function (header, sort, int) {
                if (typeof sort === 'undefined') sort = 'asc'; // desc
                if (typeof int === 'undefined') int = false;

                var column = $(header).index();
                var rows = $(datatable.tableBody).find('.' + pfx + 'datatable__row');
                var hIndex = $(header).closest('.' + pfx + 'datatable__lock').index();
                if (hIndex !== -1) {
                    rows = $(datatable.tableBody).find('.' + pfx + 'datatable__lock:nth-child(' + (hIndex + 1) + ')').find('.' + pfx + 'datatable__row');
                }

                var container = $(rows).parent();
                $(rows).sort(function (a, b) {
                    var tda = $(a).find('td:nth-child(' + column + ')').text();
                    var tdb = $(b).find('td:nth-child(' + column + ')').text();

                    if (int) {
                        // useful for integer type sorting
                        tda = parseInt(tda);
                        tdb = parseInt(tdb);
                    }

                    if (sort === 'asc') {
                        return tda > tdb ? 1 : tda < tdb ? -1 : 0;
                    } else {
                        return tda < tdb ? 1 : tda > tdb ? -1 : 0;
                    }
                }).appendTo(container);
            },

            /**
             * 排序
             */
            sorting: function () {
                var sortObj = {
                    init: function () {
                        if (options.sortable) {
                            $(datatable.tableHead).find('.' + pfx + 'datatable__cell:not(.' + pfx + 'datatable__cell--check)').addClass(pfx + 'datatable__cell--sort').off('click').on('click', sortObj.sortClick);
                            // first init
                            sortObj.setIcon();
                        }
                    },
                    setIcon: function () {
                        var meta = Plugin.getDataSourceParam('sort');
                        if ($.isEmptyObject(meta)) return;

                        var column = Plugin.getColumnByField(meta.field);
                        // sort is disabled for this column
                        if (typeof column !== 'undefined' && typeof column.sortable !== 'undefined' && column.sortable === false) return;

                        // 获取head中的图标
                        var td = $(datatable.tableHead).find('.' + pfx + 'datatable__cell[data-field="' + meta.field + '"]').attr('data-sort', meta.sort);
                        var sorting = $(td).find('span');
                        var icon = $(sorting).find('i');

                        var icons = Plugin.getOption('layout.icons.sort');
                        // 更新图标; desc & asc
                        if ($(icon).length > 0) {
                            $(icon).removeAttr('class').addClass(icons[meta.sort]);
                        } else {
                            $(sorting).append($('<i/>').addClass(icons[meta.sort]));
                        }

                        // set sorted class to header on init
                        $(td).addClass(pfx + 'datatable__cell--sorted');
                    },
                    sortClick: function (e) {
                        var meta = Plugin.getDataSourceParam('sort');
                        var field = $(this).data('field');
                        var column = Plugin.getColumnByField(field);
                        // 如果该列已经禁用排序,移除排序按钮
                        if (typeof column.sortable !== 'undefined' && column.sortable === false) return;

                        // 设置header排序class
                        $(datatable.tableHead).find('th').removeClass(pfx + 'datatable__cell--sorted');
                        util.addClass(this, pfx + 'datatable__cell--sorted');

                        $(datatable.tableHead).find('.' + pfx + 'datatable__cell > span > i').remove();

                        if (options.sortable) {
                            Plugin.spinnerCallback(true);

                            var sort = 'desc';
                            if (Plugin.getObject('field', meta) === field) {
                                sort = Plugin.getObject('sort', meta);
                            }

                            // 排序方式
                            sort = typeof sort === 'undefined' || sort === 'desc'
                                ? 'asc'
                                : 'desc';

                            // 更新排序方式
                            meta = {field: field, sort: sort};
                            Plugin.setDataSourceParam('sort', meta);

                            sortObj.setIcon();

                            setTimeout(function () {
                                Plugin.dataRender('sort');
                                $(datatable).trigger(pfx + 'datatable--on-sort', meta);
                            }, 300);
                        }
                    },
                };
                sortObj.init();
            },

            /**
             * 更新本地数据的 排序,过滤,分页
             * 在使用dataSet变量之前调用该方法
             *
             * @returns {*|null}
             */
            localDataUpdate: function () {
                var params = Plugin.getDataSourceParam();
                if (typeof datatable.originalDataSet === 'undefined') {
                    datatable.originalDataSet = datatable.dataSet;
                }

                var field = Plugin.getObject('sort.field', params);
                var sort = Plugin.getObject('sort.sort', params);
                var column = Plugin.getColumnByField(field);
                if (typeof column !== 'undefined' && Plugin.getOption('data.serverSorting') !== true) {
                    if (typeof column.sortCallback === 'function') {
                        datatable.dataSet = column.sortCallback(datatable.originalDataSet, sort, column);
                    } else {
                        datatable.dataSet = Plugin.sortCallback(datatable.originalDataSet, sort, column);
                    }
                } else {
                    datatable.dataSet = datatable.originalDataSet;
                }

                // 如果启用服务端分页,不用在本地过滤
                if (typeof params.query === 'object' && !Plugin.getOption('data.serverFiltering')) {
                    params.query = params.query || {};

                    var nestedSearch = function (obj) {
                        for (var field in obj) {
                            if (!obj.hasOwnProperty(field)) continue;
                            if (typeof obj[field] === 'string') {
                                if (obj[field].toLowerCase() === search || obj[field].toLowerCase().indexOf(search) !== -1) {
                                    return true;
                                }
                            } else if (typeof obj[field] === 'number') {
                                if (obj[field] === search) {
                                    return true;
                                }
                            } else if (typeof obj[field] === 'object') {
                                if (nestedSearch(obj[field])) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    };
                    // 获取查询条件
                    $(Plugin.getOption('search.input')).each(function (index, element) {
                        var search = $(element).val();
                        var key = Plugin.getGeneralSearchKey(element);
                        if (util.isNotBlank(key)) {
                            if (util.isNotBlank(search)) {
                                params.query[key] = search;
                            } else {
                                delete params.query[key];
                            }
                        }
                    });

                    // 移除数组中的空元素
                    $.each(params.query, function (k, v) {
                        if (v === '') {
                            delete params.query[k];
                        }
                    });

                    // 根据查询条件过滤
                    datatable.dataSet = Plugin.filterArray(datatable.dataSet, params.query);

                    // 重置数组index
                    datatable.dataSet = datatable.dataSet.filter(function () {
                        return true;
                    });
                }

                return datatable.dataSet;
            },

            /**
             * 过滤{key:value}数组
             *
             * @param list {array} 数组
             * @param args 查询条件
             * @param operator 关联(AND/OR/NOT)
             * @returns {*}
             */
            filterArray: function (list, args, operator) {
                if (typeof list !== 'object') {
                    return [];
                }

                if (typeof operator === 'undefined') operator = 'AND';

                if (typeof args !== 'object') {
                    return list;
                }

                operator = operator.toUpperCase();

                if ($.inArray(operator, ['AND', 'OR', 'NOT']) === -1) {
                    return [];
                }

                var count = Object.keys(args).length;
                var filtered = [];

                $.each(list, function (key, obj) {
                    var to_match = obj;

                    var matched = 0;
                    $.each(args, function (m_key, m_value) {
                        m_value = m_value instanceof Array ? m_value : [m_value];
                        var match_property = Plugin.getObject(m_key, to_match);
                        if (typeof match_property !== 'undefined' && match_property) {
                            var lhs = match_property.toString().toLowerCase();
                            m_value.forEach(function (item, index) {
                                if (item.toString().toLowerCase() === lhs || lhs.indexOf(item.toString().toLowerCase()) !== -1) {
                                    matched++;
                                }
                            });
                        }
                    });

                    if (('AND' === operator && matched == count) ||
                        ('OR' === operator && matched > 0) ||
                        ('NOT' === operator && 0 == matched)) {
                        filtered[key] = obj;
                    }
                });

                list = filtered;

                return list;
            },

            /**
             * 重置滚动条
             */
            resetScroll: function () {
                if (typeof options.detail === 'undefined' && Plugin.getDepth() === 1) {
                    $(datatable.table).find('.' + pfx + 'datatable__row').css('left', 0);
                    $(datatable.table).find('.' + pfx + 'datatable__lock').css('top', 0);
                    $(datatable.tableBody).scrollTop(0);
                }
            },

            /**
             * 根据列名获取列
             *
             * @param field 列名
             * @returns {object}
             */
            getColumnByField: function (field) {
                if (typeof field === 'undefined') return;
                var result;
                $.each(options.columns, function (i, column) {
                    if (field === column.field) {
                        result = column;
                        return false;
                    }
                });
                return result;
            },

            /**
             * 获取默认排序列
             */
            getDefaultSortColumn: function () {
                var result;
                $.each(options.columns, function (i, column) {
                    if (typeof column.sortable !== 'undefined'
                        && $.inArray(column.sortable, ['asc', 'desc']) !== -1) {
                        result = {sort: column.sortable, field: column.field};
                        return false;
                    }
                });
                return result;
            },

            /**
             * 获取隐藏元素属性
             * @param element {object} 元素
             * @param includeMargin {boolean} 包括margin
             * @returns {{width: number, height: number, innerWidth: number, innerHeight: number, outerWidth: number, outerHeight: number}}
             */
            getHiddenDimensions: function (element, includeMargin) {
                var props = {
                        position: 'absolute',
                        visibility: 'hidden',
                        display: 'block'
                    },
                    dim = {
                        width: 0,
                        height: 0,
                        innerWidth: 0,
                        innerHeight: 0,
                        outerWidth: 0,
                        outerHeight: 0
                    },
                    hiddenParents = $(element).parents().addBack().not(':visible');
                includeMargin = (typeof includeMargin === 'boolean')
                    ? includeMargin
                    : false;

                var oldProps = [];
                hiddenParents.each(function () {
                    var old = {};

                    for (var name in props) {
                        old[name] = this.style[name];
                        this.style[name] = props[name];
                    }

                    oldProps.push(old);
                });

                dim.width = $(element).width();
                dim.outerWidth = $(element).outerWidth(includeMargin);
                dim.innerWidth = $(element).innerWidth();
                dim.height = $(element).height();
                dim.innerHeight = $(element).innerHeight();
                dim.outerHeight = $(element).outerHeight(includeMargin);

                hiddenParents.each(function (i) {
                    var old = oldProps[i];
                    for (var name in props) {
                        this.style[name] = old[name];
                    }
                });

                return dim;
            },
            /**
             * 获取查询条件元素的name/id
             *
             * @returns {*}
             */
            getGeneralSearchKey: function () {
                var searchInput = $(Plugin.getOption('search.input'));
                return $(searchInput).prop('name') || $(searchInput).prop('id');
            },

            /**
             * 根据路径获取对象
             *
             * @param path {string} 属性路径
             * @param object {object}
             * @returns {*}
             */
            getObject: function (path, object) {
                return path.split('.').reduce(function (obj, i) {
                    return obj !== null && typeof obj[i] !== 'undefined' ? obj[i] : null;
                }, object);
            },

            /**
             * Extend object
             * @param obj
             * @param path
             * @param value
             * @returns {*}
             */
            extendObj: function (obj, path, value) {
                var levels = path.split('.'),
                    i = 0;

                function createLevel(child) {
                    var name = levels[i++];
                    if (typeof child[name] !== 'undefined' && child[name] !== null) {
                        if (typeof child[name] !== 'object' &&
                            typeof child[name] !== 'function') {
                            child[name] = {};
                        }
                    } else {
                        child[name] = {};
                    }
                    if (i === levels.length) {
                        child[name] = value;
                    } else {
                        createLevel(child[name]);
                    }
                }

                createLevel(obj);
                return obj;
            },

            rowEvenOdd: function () {
                // row even class
                $(datatable.tableBody).find('.' + pfx + 'datatable__row').removeClass(pfx + 'datatable__row--even');
                if ($(datatable.wrap).hasClass(pfx + 'datatable--subtable')) {
                    $(datatable.tableBody).find('.' + pfx + 'datatable__row:not(.' + pfx + 'datatable__row-detail):even').addClass(pfx + 'datatable__row--even');
                } else {
                    $(datatable.tableBody).find('.' + pfx + 'datatable__row:nth-child(even)').addClass(pfx + 'datatable__row--even');
                }
            },

            /********************
             ** 公开方法
             ********************/

            // 延迟时间
            timer: 0,

            /**
             * 重绘
             * @returns {jQuery}
             */
            redraw: function () {
                Plugin.adjustCellsWidth.call();
                if (Plugin.isLocked()) {
                    // fix hiding cell width issue
                    Plugin.scrollbar();
                    Plugin.resetScroll();
                    Plugin.adjustCellsHeight.call();
                }
                Plugin.adjustLockContainer.call();
                Plugin.initHeight.call();
                return datatable;
            },

            /**
             * 重新加载数据
             *
             * @returns {jQuery}
             */
            load: function () {
                Plugin.reload();
                return datatable;
            },

            /**
             * 重新加载数据
             *
             * @returns {jQuery}
             */
            reload: function () {
                var delay = (function () {
                    return function (callback, ms) {
                        clearTimeout(Plugin.timer);
                        Plugin.timer = setTimeout(callback, ms);
                    };
                })();
                delay(function () {
                    // local only. remote pagination will skip this block
                    if (!options.data.serverFiltering) {
                        Plugin.localDataUpdate();
                    }
                    Plugin.dataRender();
                    $(datatable).trigger(pfx + 'datatable--on-reloaded');
                }, Plugin.getOption('search.delay'));
                return datatable;
            },

            /**
             * 根据数据id获取数据
             *
             * @param id {string} 数据id
             * @returns {jQuery}
             */
            getRecord: function (id) {
                if (typeof datatable.tableBody === 'undefined') datatable.tableBody = $(datatable.table).children('tbody');
                $(datatable.tableBody).find('.' + pfx + 'datatable__cell:first-child').each(function (i, cell) {
                    if (id == $(cell).text()) {
                        var rowNumber = $(cell).closest('.' + pfx + 'datatable__row').index() + 1;
                        datatable.API.record = datatable.API.value = Plugin.getOneRow(datatable.tableBody, rowNumber);
                        return datatable;
                    }
                });
                return datatable;
            },

            /**
             * 根据列名获取列
             *
             * @param columnName {string} 列名
             * @returns {jQuery}
             */
            getColumn: function (columnName) {
                datatable.API.value = $(datatable.API.record).find('[data-field="' + columnName + '"]');
                return datatable;
            },

            /**
             * 销毁并还原表格
             *
             * @returns {jQuery}
             */
            destroy: function () {
                $(datatable).parent().find('.' + pfx + 'datatable__pager').remove();
                var initialDatatable = $(datatable.initialDatatable).addClass(pfx + 'datatable--destroyed').show();
                $(datatable).replaceWith(initialDatatable);
                datatable = initialDatatable;
                $(datatable).trigger(pfx + 'datatable--on-destroy');
                Plugin.isInit = false;
                initialDatatable = null;
                return initialDatatable;
            },

            /**
             * 根据指定列排序
             *
             * @param field {string} 列名
             * @param sort {string} asc/desc 排序方式 (默认:asc)
             */
            sort: function (field, sort) {
                // toggle sort
                sort = typeof sort === 'undefined' ? 'asc' : sort;

                Plugin.spinnerCallback(true);

                // 更新排序方式
                var meta = {field: field, sort: sort};
                Plugin.setDataSourceParam('sort', meta);

                setTimeout(function () {
                    Plugin.dataRender('sort');
                    $(datatable).trigger(pfx + 'datatable--on-sort', meta);
                    $(datatable.tableHead).find('.' + pfx + 'datatable__cell > span > i').remove();
                }, 300);

                return datatable;
            },

            /**
             * 获取当前选中数据值
             *
             * @returns {array}
             */
            getValue: function () {
                var ids = [];
                var selectedRecords = datatable.getSelectedRecords();
                if(datatable.hasClass(pfx + 'datatable--lock')){
                    selectedRecords = selectedRecords.filter('.' + pfx + 'datatable__lock--scroll > .' + pfx + 'datatable__row');
                }
                if (selectedRecords != null && selectedRecords.length > 0) {
                    for (var i = 0; i < selectedRecords.length; i++) {
                        var _id = $(selectedRecords[i]).data('id');
                        if (typeof _id !== 'undefined') {
                            ids.push(_id);
                        }
                    }
                }
                return ids;
            },

            /**
             * 根据CheckBox设置行选中
             *
             * @param cell {string|number|object} checkbox value / checkbox element
             */
            setActive: function (cell) {
                if (typeof cell === 'string' || typeof cell === 'number') {
                    // 根据CheckBox id
                    cell = $(datatable.tableBody).find('.' + pfx + 'checkbox--single > [type="checkbox"][value="' + cell + '"]');
                }

                $(cell).prop('checked', true);

                var ids = [];
                $(cell).each(function (i, td) {
                    // 查找选中行
                    var row = $(td).closest('tr').addClass(pfx + 'datatable__row--active');
                    var colIndex = $(row).index() + 1;

                    // 锁定的列
                    $(row).closest('tbody').find('tr:nth-child(' + colIndex + ')').not('.' + pfx + 'datatable__row-subtable').addClass(pfx + 'datatable__row--active');

                    var id = $(td).attr('value');
                    if (typeof id !== 'undefined') {
                        ids.push(id);
                    }
                });

                $(datatable).trigger(pfx + 'datatable--on-check', [ids]);
            },

            /**
             * 根据CheckBox设置行不选中
             *
             * @param cell {string|number|object} checkbox value / checkbox element
             */
            setInactive: function (cell) {
                if (typeof cell === 'string' || typeof cell === 'number') {
                    // 根据CheckBox id
                    cell = $(datatable.tableBody).find('.' + pfx + 'checkbox--single > [type="checkbox"][value="' + cell + '"]');
                }

                $(cell).prop('checked', false);

                var ids = [];
                $(cell).each(function (i, td) {
                    // 获取选中行
                    var row = $(td).closest('tr').removeClass(pfx + 'datatable__row--active');
                    var colIndex = $(row).index() + 1;

                    // 锁定列
                    $(row).closest('tbody').find('tr:nth-child(' + colIndex + ')').not('.' + pfx + 'datatable__row-subtable').removeClass(pfx + 'datatable__row--active');

                    var id = $(td).attr('value');
                    if (typeof id !== 'undefined') {
                        ids.push(id);
                    }
                });

                $(datatable).trigger(pfx + 'datatable--on-uncheck', [ids]);
            },

            /**
             * Set all checkboxes active or inactive
             * @param active
             */
            setActiveAll: function (active) {
                var checkboxes = $(datatable.table).find('> tbody, > thead').find('tr').not('.' + pfx + 'datatable__row-subtable').find('.' + pfx + 'datatable__cell--check [type="checkbox"]');
                if (active) {
                    Plugin.setActive(checkboxes);
                } else {
                    Plugin.setInactive(checkboxes);
                }
            },

            /**
             * 获取选中记录
             * @returns {null}
             */
            getSelectedRecords: function () {
                datatable.API.record = datatable.rows('.' + pfx + 'datatable__row--active').nodes();
                return datatable.API.record;
            },

            /**
             * 获取选项
             *
             * @param path 属性路径
             * @returns {object} 选项
             */
            getOption: function (path) {
                return Plugin.getObject(path, options);
            },

            /**
             * 设置选项
             *
             * @param path 属性路径
             * @param object {object} 选项
             */
            setOption: function (path, object) {
                options = Plugin.extendObj(options, path, object);
            },

            /**
             * 查询数据
             *
             * @param value 值
             * @param columns {array/string} 列名称
             */
            search: function (value, columns) {
                if (typeof columns !== 'undefined') columns = $.makeArray(columns);
                var delay = (function () {
                    return function (callback, ms) {
                        clearTimeout(Plugin.timer);
                        Plugin.timer = setTimeout(callback, ms);
                    };
                })();

                delay(function () {
                    // 获取查询条件
                    var query = Plugin.getDataSourceQuery();

                    // 如果列名为空
                    if (typeof columns === 'undefined' && typeof value !== 'undefined') {
                        var key = Plugin.getGeneralSearchKey();
                        query[key] = value;
                    }

                    // 根据指定列明搜索,支持多列名
                    if (typeof columns === 'object') {
                        $.each(columns, function (k, column) {
                            query[column] = value;
                        });
                        // 移除空值
                        $.each(query, function (k, v) {
                            if (v === '' || $.isEmptyObject(v)) {
                                delete query[k];
                            }
                        });
                    }

                    Plugin.setDataSourceQuery(query);

                    // 如果是本地筛选
                    if (!options.data.serverFiltering) {
                        Plugin.localDataUpdate();
                    }
                    Plugin.dataRender('search');
                }, Plugin.getOption('search.delay'));
            },

            /**
             * 设置数据源中对象
             *
             * @param param {string} 对象名称
             * @param value {object} 值
             */
            setDataSourceParam: function (param, value) {
                datatable.API.params = $.extend({}, {
                    pagination: {current: 1, size: Plugin.getOption('data.pageSize')},
                    sort: Plugin.getDefaultSortColumn(),
                    query: {}
                }, datatable.API.params, Plugin.stateGet(Plugin.stateId));

                datatable.API.params = Plugin.extendObj(datatable.API.params, param, value);

                Plugin.stateKeep(Plugin.stateId, datatable.API.params);
            },

            /**
             * 获取数据源中指定对象
             *
             * @param param {string|null} 对象名称
             */
            getDataSourceParam: function (param) {
                datatable.API.params = $.extend({}, {
                    page: {current: 1, size: Plugin.getOption('data.pageSize')},
                    sort: Plugin.getDefaultSortColumn(),
                    query: {}
                }, datatable.API.params, Plugin.stateGet(Plugin.stateId));

                if (typeof param === 'string') {
                    return Plugin.getObject(param, datatable.API.params);
                }

                return datatable.API.params;
            },

            /**
             * 获取查询条件
             * 示例: datatable.getDataSourceParam('query');
             *
             * @returns {*}
             */
            getDataSourceQuery: function () {
                return Plugin.getDataSourceParam('query') || {};
            },

            /**
             * 设置查询条件
             * 示例: datatable.setDataSourceParam('query', query);
             *
             * @param query {string} 查询条件
             */
            setDataSourceQuery: function (query) {
                Plugin.setDataSourceParam('query', query);
            },

            /**
             * 获取当前页
             *
             * @returns {number}
             */
            getCurrentPage: function () {
                return $(datatable.table).siblings('.' + pfx + 'datatable__pager').last().find('.' + pfx + 'datatable__pager-nav').find('.' + pfx + 'datatable__pager-link.' + pfx + 'datatable__pager-link--active').data('page') || 1;
            },

            /**
             * 获取当前选中页大小(默认10)
             *
             * @returns {*|number}
             */
            getPageSize: function () {
                return $(datatable.table).siblings('.' + pfx + 'datatable__pager').last().find('select.' + pfx + 'datatable__pager-size').val() || 10;
            },

            /**
             * 获取工具条
             */
            getTotalRows: function () {
                return datatable.API.params.pagination.total;
            },

            /**
             * 获取表格所有数据
             *
             * @returns {*|null|Array}
             */
            getDataSet: function () {
                return datatable.originalDataSet;
            },

            /**
             * @deprecated in v5.0.6
             * Hide column by column's field name
             * 根据列名隐藏列
             * @param fieldName
             */
            hideColumn: function (fieldName) {
                // add hide option for this column
                $.map(options.columns, function (column) {
                    if (fieldName === column.field) {
                        column.responsive = {hidden: 'xl'};
                    }
                    return column;
                });
                // hide current displayed column
                var tds = $.grep($(datatable.table).find('.' + pfx + 'datatable__cell'), function (n, i) {
                    return fieldName === $(n).data('field');
                });
                $(tds).hide();
            },

            /**
             * @deprecated in v5.0.6
             * Show column by column's field name
             * 根据列名显示列
             * @param fieldName
             */
            showColumn: function (fieldName) {
                // add hide option for this column
                $.map(options.columns, function (column) {
                    if (fieldName === column.field) {
                        delete column.responsive;
                    }
                    return column;
                });
                // hide current displayed column
                var tds = $.grep($(datatable.table).find('.' + pfx + 'datatable__cell'), function (n, i) {
                    return fieldName === $(n).data('field');
                });
                $(tds).show();
            },

            nodeTr: [],
            nodeTd: [],
            nodeCols: [],
            recentNode: [],

            table: function () {
                if (typeof datatable.table !== 'undefined') {
                    return datatable.table;
                }
            },

            /**
             * 根据选择器查找第一行
             *
             * @param selector {string} 选择器
             * @returns {jQuery}
             */
            row: function (selector) {
                Plugin.rows(selector);
                Plugin.nodeTr = Plugin.recentNode = $(Plugin.nodeTr).first();
                return datatable;
            },

            /**
             *
             * 根据选择器查找多行
             *
             * @param selector {string} 选择器
             * @returns {jQuery}
             */
            rows: function (selector) {
                Plugin.nodeTr = Plugin.recentNode = $(datatable.tableBody).find(selector);
                return datatable;
            },

            /**
             * Select a single column from the table
             * 根据下标获取列
             *
             * @param index {int} 下标 从0开始
             * @returns {jQuery}
             */
            column: function (index) {
                Plugin.nodeCols = Plugin.recentNode = $(datatable.tableBody).find('.' + pfx + 'datatable__cell:nth-child(' + (index + 1) + ')');
                return datatable;
            },

            /**
             * Select multiple columns from the table
             * 根据条件查询多列
             *
             * @param selector {String} 条件
             * @returns {jQuery}
             */
            columns: function (selector) {
                var context = datatable.table;
                if (Plugin.nodeTr === Plugin.recentNode) {
                    context = Plugin.nodeTr;
                }
                var columns = $(context).find('.' + pfx + 'datatable__cell[data-field="' + selector + '"]');
                if (columns.length > 0) {
                    Plugin.nodeCols = Plugin.recentNode = columns;
                } else {
                    Plugin.nodeCols = Plugin.recentNode = $(context).find(selector).filter('.' + pfx + 'datatable__cell');
                }
                return datatable;
            },
            /**
             * 根据选择器查找第一个 cell
             *
             * @param selector {string} 选择器
             * @returns {jQuery}
             */
            cell: function (selector) {
                Plugin.cells(selector);
                Plugin.nodeTd = Plugin.recentNode = $(Plugin.nodeTd).first();
                return datatable;
            },
            /**
             * 根据选择器查找 cells
             *
             * @param selector {string} 选择器
             * @returns {jQuery}
             */
            cells: function (selector) {
                var cells = $(datatable.tableBody).find('.' + pfx + 'datatable__cell');
                if (typeof selector !== 'undefined') {
                    cells = $(cells).filter(selector);
                }
                Plugin.nodeTd = Plugin.recentNode = cells;
                return datatable;
            },

            /**
             * 删除选中的行
             *
             * @returns {jQuery}
             */
            remove: function () {
                if ($(Plugin.nodeTr.length) && Plugin.nodeTr === Plugin.recentNode) {
                    $(Plugin.nodeTr).remove();
                }
                Plugin.layoutUpdate();
                return datatable;
            },
            /**
             * 删除指定的行

             * @param rows {jquery} 要删除的行
             * @returns {jQuery}
             */
            removeRows: function (rows) {
                if (typeof rows !== 'undefined' && rows.length > 0) {
                    rows.remove();
                }
                Plugin.layoutUpdate();
                return datatable;
            },
            /**
             * 显示或隐藏行或列
             *
             * @param bool {boolean} 显示/隐藏
             */
            visible: function (bool) {
                if ($(Plugin.recentNode.length)) {
                    var locked = Plugin.lockEnabledColumns();
                    if (Plugin.recentNode === Plugin.nodeCols) {
                        var index = Plugin.recentNode.index();

                        if (Plugin.isLocked()) {
                            var scrollColumns = $(Plugin.recentNode).closest('.' + pfx + 'datatable__lock--scroll').length;
                            if (scrollColumns) {
                                // is at center of scrollable area
                                index += locked.left.length + 1;
                            } else if ($(Plugin.recentNode).closest('.' + pfx + 'datatable__lock--right').length) {
                                // is at the right locked table
                                index += locked.left.length + scrollColumns + 1;
                            }
                        }
                    }

                    if (bool) {
                        if (Plugin.recentNode === Plugin.nodeCols) {
                            delete options.columns[index].responsive;
                        }
                        $(Plugin.recentNode).show();
                    } else {
                        if (Plugin.recentNode === Plugin.nodeCols) {
                            Plugin.setOption('columns.' + index + '.responsive', {hidden: 'xl'});
                        }
                        $(Plugin.recentNode).hide();
                    }
                    Plugin.redraw();
                }
            },

            /**
             * 根据选择的行或者列获取DOM元素
             *
             * @returns {Array}
             */
            nodes: function () {
                return Plugin.recentNode;
            },

            /**
             * 获取datatable
             *
             * @returns {jQuery}
             */
            dataset: function () {
                return datatable;
            },

            /**
             * 跳转到指定页
             * @param page {number} 页码
             */
            gotoPage: function (page) {
                Plugin.pagingObject.openPage(page);
            },
            /**
             * 新增一行数据
             */
            addRow: function () {
                var colLength = options.columns.length;
                var tr = document.createElement('tr');
                util.addClass(tr, pfx + 'datatable__row');
                for (var i = 0; i < colLength; i++) {
                    var column = options.columns[i];
                    var element = Plugin.getColumnElement(column);
                    var td = document.createElement('td');
                    td.setAttribute('data-field', column.field);
                    util.addClass(td, pfx + 'datatable__cell ' + (typeof column.class != 'undefined' ? column.class : ''));
                    td.appendChild(element);
                    tr.appendChild(td);
                }
                datatable.tableBody.append(tr);

                // 更新布局
                Plugin.setupDOM(datatable.table);
                Plugin.setupCellField([datatable.tableBody]);
                Plugin.layoutUpdate();

                if (datatable.hasClass( pfx + 'datatable--error')) {
                    datatable.removeClass(pfx + 'datatable--error');
                    datatable.find('span.' + pfx + 'datatable--error').remove();
                }
                // 滚动到新增行
                datatable.tableBody.scrollTop = datatable.tableBody.scrollHeight;
                $(tr).find('.table-actions').each(function () {
                    app.initTooltip($(this));
                });
            },
            /**
             * 获取编辑表格列元素
             *
             * @param column {object} 列配置
             * @param defaultVal {string} 默认值
             * @returns {HTMLSpanElement | HTMLInputElement | HTMLSelectElement | HTMLButtonElement}
             */
            getColumnElement: function (column, defaultVal) {
                var element;
                if (typeof column.edit !== 'undefined') {
                    switch (column.edit.tag) {
                        case 'input':
                            element = document.createElement('input');
                            element.setAttribute('type', column.edit.type);
                            util.addClass(element, 'form-control form-control-sm ' + column.edit.class);
                            if (typeof defaultVal !== 'undefined') {
                                element.value = defaultVal;
                            }
                            break;
                        case 'select':
                            element = document.createElement('select');
                            util.addClass(element, 'form-control form-control-sm ' + column.edit.class);
                            if (typeof column.edit.option !== 'undefined') {
                                if (typeof defaultVal === 'undefined') {
                                    defaultVal = column.edit.default;
                                }
                                for (var key in column.edit.option) {
                                    var opt = document.createElement('option');
                                    opt.setAttribute('value', key);
                                    if (key === defaultVal) {
                                        opt.setAttribute('selected', 'true');
                                    }
                                    opt.innerText = column.edit.option[key].name;
                                    element.appendChild(opt);
                                }
                            }
                            break;
                        case 'button':
                            element = document.createElement('button');
                            element.setAttribute('type', 'button');
                            element.setAttribute('title', column.edit.title);
                            element.innerHTML = column.edit.text;
                            util.addClass(element, tool.ACTIONS_SUCCESS);
                            if (typeof column.edit.click == 'function') {
                                element.onclick = function () {
                                    column.edit.click($(this).parents('.' + pfx + 'datatable__row'), $(this).parents('.' + pfx + 'datatable__row').find('input, select').serializeArray());
                                }
                            }
                            break;
                        default:
                            element = document.createElement('input');
                            element.setAttribute('type', 'text');
                            util.addClass(element, 'form-control form-control-sm ' + column.edit.class);
                            if (typeof defaultVal !== 'undefined') {
                                element.value = defaultVal;
                            }
                    }
                    element.setAttribute('name', column.field);
                    util.addClass(element, column.edit.classes);
                } else {
                    element = document.createElement('span');
                    element.innerText = '#';
                }
                return element;
            },
            /**
             * 编辑行
             *
             * @param element {object} 编辑按钮对象
             */
            editRow: function (element) {
                var colLength = options.columns.length;
                var tr = $(element).parents('.' + pfx + 'datatable__row');
                var data = datatable.dataSet[Number(tr.data('row'))];
                for (var i = 0; i < colLength; i++) {
                    var column = options.columns[i];
                    element = Plugin.getColumnElement(column, data[column.field]);
                    var td = tr.find('td:eq(' + i + ')');
                    if (td.hasClass('m-datatable__cell--check')) {
                        td.find('span').append(element);
                    } else {
                        td.find('span').html(element);
                    }
                }
                tr.find('.table-actions').each(function () {
                    app.initTooltip($(this));
                });
            }
        };

        /**
         * Public API methods can be used directly by datatable
         */
        $.each(Plugin, function (funcName, func) {
            datatable[funcName] = func;
        });

        // 初始化插件
        if (typeof options !== 'undefined') {
            if (typeof options === 'string') {
                var method = options;
                datatable = $(this).data(pluginName);
                if (typeof datatable !== 'undefined') {
                    options = datatable.options;
                    Plugin[method].apply(this, Array.prototype.slice.call(arguments, 1));
                }
            } else {
                if (!datatable.data(pluginName) && !$(this).hasClass(pfx + 'datatable--loaded')) {
                    datatable.dataSet = null;
                    datatable.textAlign = {
                        left: pfx + 'datatable__cell--left',
                        center: pfx + 'datatable__cell--center',
                        right: pfx + 'datatable__cell--right'
                    };

                    // 合并默认与自定义option
                    options = $.extend(true, {}, $.fn[pluginName].defaults, options);

                    datatable.options = options;

                    // 初始化插件
                    Plugin.init.apply(this, [options]);

                    $(datatable.wrap).data(pluginName, datatable);
                }
            }
        } else {
            // 获取现有datatable
            datatable = $(this).data(pluginName);
            if (typeof datatable === 'undefined') {
                $.error(pluginName + ' not initialized');
            }
            options = datatable.options;
        }

        return datatable;
    };

    // 默认设置
    $.fn[pluginName].defaults = {
        // 数据源
        data: {
            type: 'local',
            source: null,
            pageSize: 10, // 默认页大小
            saveState: {
                // 使用cookie/webstorage 保存表格状态(分页, 筛选, 排序)
                cookie: false,
                webstorage: true
            },

            serverPaging: false, // 在服务器分页
            serverFiltering: false, // 在服务器进行数据过滤
            serverSorting: false, // 在服务器进行排序

            autoColumns: false, // 自动列
            attr: {
                rowProps: []
            }
        },

        // 布局
        layout: {
            theme: 'default', // 主题
            class: pfx + 'datatable--brand', // 容器 class
            scroll: false, // 启用禁用垂直/水平滚动条
            height: null, // 高度
            minHeight: 300, // 最小高度
            footer: false, // 显示/隐藏 footer
            header: true, // 显示/隐藏 header
            customScrollbar: true, // 自定义滚动条

            // 等待提示样式
            spinner: {
                overlayColor: '#000',
                opacity: 0,
                type: 'loader',
                state: 'brand',
                message: true
            },

            // datatable 图标
            icons: {
                sort: {asc: 'flaticon2-arrow-up', desc: 'flaticon2-arrow-down'},
                pagination: {
                    next: 'flaticon2-next',
                    prev: 'flaticon2-back',
                    first: 'flaticon2-fast-back',
                    last: 'flaticon2-fast-next',
                    more: 'flaticon-more-1'
                },
                rowDetail: {expand: 'fa fa-caret-down', collapse: 'fa fa-caret-right'}
            }
        },

        // 列滚动
        sortable: true,
        // 分页
        pagination: true,

        // 列配置
        columns: [],

        search: {
            // 通过keyup事件搜索
            onEnter: false,
            // 搜索框中提示文字
            input: null,
            // 搜索延迟 单位: 毫秒
            delay: 400
        },

        rows: {
            // callback
            callback: function () {
            },
            // 在拼接<tr>内容前调用
            beforeTemplate: function () {
            },
            // 在拼接<tr>内容后调用
            afterTemplate: function () {
            },
            // 如果列溢出,自动隐藏非锁定列
            autoHide: true
        },

        // 工具条
        toolbar: {
            // 布局
            layout: ['pagination', 'info'],

            // 设置工具条位于底部还是顶部
            placement: ['bottom'],  //'top', 'bottom'

            // 工具条选项
            items: {
                // 分页
                pagination: {
                    // 分页类型(default or scroll)
                    type: 'default',

                    // 不同设备下页码按钮显示数量
                    pages: {
                        desktop: {
                            layout: 'default',
                            pagesNumber: 5
                        },
                        tablet: {
                            layout: 'default',
                            pagesNumber: 3
                        },
                        mobile: {
                            layout: 'compact'
                        }
                    },

                    // 导航按钮
                    navigation: {
                        prev: true, // 上一页
                        next: true, // 下一页
                        first: true, // 第一页
                        last: true // 最后一页
                    },

                    // 页大小select
                    pageSizeSelect: []
                },

                // 记录信息
                info: true
            }
        },

        // 自定义插件提示文字
        translate: {
            records: {
                processing: '请稍候...',
                noRecords: '未查找到数据'
            },
            toolbar: {
                pagination: {
                    items: {
                        default: {
                            first: '第一页',
                            prev: '上一页',
                            next: '下一页',
                            last: '最后一页',
                            more: '更多页码',
                            input: '请输入页码',
                            select: '每页显示',
                            all: '全部'
                        },
                        info: '当前显示 {{start}} - {{end}} 共 {{total}} 条数据'
                    }
                }
            }
        },
        extensions: {}
    };
}(jQuery));
"use strict";
(function($) {

	var pluginName = 'KTDatatable';
	var pfx = 'kt-';

	$.fn[pluginName] = $.fn[pluginName] || {};

	/**
	 * @param datatable Main datatable plugin instance
	 * @param options Extension options
	 * @returns {*}
	 */
	$.fn[pluginName].checkbox = function(datatable, options) {
		var Extension = {
			selectedAllRows: false,
			selectedRows: [],
			unselectedRows: [],

			init: function() {
				if (Extension.selectorEnabled()) {
					// reset
					datatable.setDataSourceParam(options.vars.selectedAllRows, false);
					datatable.stateRemove('checkbox');

					// requestIds is not null
					if (options.vars.requestIds) {
						// request ids in response
						datatable.setDataSourceParam(options.vars.requestIds, true);
					}

					// remove selected checkbox on datatable reload
					$(datatable).on(pfx + 'datatable--on-reloaded', function() {
						datatable.stateRemove('checkbox');
						datatable.setDataSourceParam(options.vars.selectedAllRows, false);
						Extension.selectedAllRows = false;
						Extension.selectedRows = [];
						Extension.unselectedRows = [];
					});

					// select all on extension init
					Extension.selectedAllRows = datatable.getDataSourceParam(options.vars.selectedAllRows);

					$(datatable).on(pfx + 'datatable--on-layout-updated', function(e, args) {
						if (args.table != $(datatable.wrap).attr('id')) {
							return;
						}
						datatable.ready(function() {
							Extension.initVars();
							Extension.initEvent();
							Extension.initSelect();
						});
					});

					$(datatable).on(pfx + 'datatable--on-check', function(e, ids) {
						ids.forEach(function(id) {
							Extension.selectedRows.push(id);
							// // remove from unselected rows
							Extension.unselectedRows = Extension.remove(Extension.unselectedRows, id);
						});
						var storage = {};
						storage['selectedRows'] = $.unique(Extension.selectedRows);
						storage['unselectedRows'] = $.unique(Extension.unselectedRows);
						datatable.stateKeep('checkbox', storage);
					});
					$(datatable).on(pfx + 'datatable--on-uncheck', function(e, ids) {
						ids.forEach(function(id) {
							Extension.unselectedRows.push(id);
							// // remove from selected rows
							Extension.selectedRows = Extension.remove(Extension.selectedRows, id);
						});
						var storage = {};
						storage['selectedRows'] = $.unique(Extension.selectedRows);
						storage['unselectedRows'] = $.unique(Extension.unselectedRows);
						datatable.stateKeep('checkbox', storage);
					});
				}
			},

			/**
			 * Init checkbox clicks event
			 */
			initEvent: function() {
				// select all checkbox click
				$(datatable.tableHead).find('.' + pfx + 'checkbox--all > [type="checkbox"]').click(function(e) {
					// clear selected and unselected rows
					Extension.selectedRows = Extension.unselectedRows = [];
					datatable.stateRemove('checkbox');

					// select all rows
					if ($(this).is(':checked')) {
						Extension.selectedAllRows = true;
					}
					else {
						Extension.selectedAllRows = false;
					}

					// local select all current page rows
					if (!options.vars.requestIds) {
						if ($(this).is(':checked')) {
							Extension.selectedRows = $.makeArray($(datatable.tableBody).find('.' + pfx + 'checkbox--single > [type="checkbox"]').map(function(i, chk) {
								return $(chk).val();
							}));
						}
						var storage = {};
						storage['selectedRows'] = $.unique(Extension.selectedRows);
						datatable.stateKeep('checkbox', storage);
					}

					// keep selectedAllRows in datasource params
					datatable.setDataSourceParam(options.vars.selectedAllRows, Extension.selectedAllRows);

					$(datatable).trigger(pfx + 'datatable--on-click-checkbox', [$(this)]);
				});

				// single row checkbox click
				$(datatable.tableBody).find('.' + pfx + 'checkbox--single > [type="checkbox"]').click(function(e) {
					var id = $(this).val();
					if ($(this).is(':checked')) {
						Extension.selectedRows.push(id);
						// remove from unselected rows
						Extension.unselectedRows = Extension.remove(Extension.unselectedRows, id);
					}
					else {
						Extension.unselectedRows.push(id);
						// remove from selected rows
						Extension.selectedRows = Extension.remove(Extension.selectedRows, id);
					}

					// local checkbox header check
					if (!options.vars.requestIds && Extension.selectedRows.length < 1) {
						// remove select all checkbox, if there is no checked checkbox left
						$(datatable.tableHead).find('.' + pfx + 'checkbox--all > [type="checkbox"]').prop('checked', false);
					}

					var storage = {};
					storage['selectedRows'] = $.unique(Extension.selectedRows);
					storage['unselectedRows'] = $.unique(Extension.unselectedRows);
					datatable.stateKeep('checkbox', storage);

					$(datatable).trigger(pfx + 'datatable--on-click-checkbox', [$(this)]);
				});
			},

			initSelect: function() {
				// selected all rows from server
				if (Extension.selectedAllRows && options.vars.requestIds) {
					if (!datatable.hasClass(pfx + 'datatable--error')) {
						// set header select all checkbox checked
						$(datatable.tableHead).find('.' + pfx + 'checkbox--all > [type="checkbox"]').prop('checked', true);
					}

					// set all checkbox in table body
					datatable.setActiveAll(true);

					// remove unselected rows
					Extension.unselectedRows.forEach(function(id) {
						datatable.setInactive(id);
					});

				}
				else {
					// single check for server and local
					Extension.selectedRows.forEach(function(id) {
						datatable.setActive(id);
					});

					// local checkbox; check if all checkboxes of currect page are checked
					if (!datatable.hasClass(pfx + 'datatable--error') && $(datatable.tableBody).find('.' + pfx + 'checkbox--single > [type="checkbox"]').not(':checked').length < 1) {
						// set header select all checkbox checked
						$(datatable.tableHead).find('.' + pfx + 'checkbox--all > [type="checkbox"]').prop('checked', true);
					}
				}
			},

			/**
			 * Check if selector is enabled from options
			 */
			selectorEnabled: function() {
				return $.grep(datatable.options.columns, function(n, i) {
					return n.selector || false;
				})[0];
			},

			initVars: function() {
				// get single select/unselect from localstorage
				var storage = datatable.stateGet('checkbox');
				if (typeof storage !== 'undefined') {
					Extension.selectedRows = storage['selectedRows'] || [];
					Extension.unselectedRows = storage['unselectedRows'] || [];
				}
			},

			getSelectedId: function(path) {
				Extension.initVars();

				// server selected all rows
				if (Extension.selectedAllRows && options.vars.requestIds) {
					if (typeof path === 'undefined') {
						path = options.vars.rowIds;
					}

					// if selected all rows, return id from response meta
					var selectedAllRows = datatable.getObject(path, datatable.lastResponse) || [];

					if (selectedAllRows.length > 0) {
						// remove single unselected rows from selectedAllRows ids from server response emta
						Extension.unselectedRows.forEach(function(id) {
							selectedAllRows = Extension.remove(selectedAllRows, parseInt(id));
						});
					}
					return selectedAllRows;
				}

				// else return single checked selected rows
				return Extension.selectedRows;
			},

			remove: function(array, element) {
				return array.filter(function(e) {
					return e !== element;
				});
			},
		};

		// make the extension accessible from datatable init
		datatable.checkbox = function() {
			return Extension;
		};

		if (typeof options === 'object') {
			options = $.extend(true, {}, $.fn[pluginName].checkbox.default, options);
			Extension.init.apply(this, [options]);
		}

		return datatable;
	};

	$.fn[pluginName].checkbox.default = {
		vars: {
			// select all rows flag to be sent to the server
			selectedAllRows: 'selectedAllRows',
			// request id parameter's name
			requestIds: 'requestIds',
			// response path to all rows id
			rowIds: 'meta.rowIds',
		},
	};

}(jQuery));
var defaults = {
	layout: {
		icons: {
			pagination: {
				next: 'flaticon2-next',
				prev: 'flaticon2-back',
				first: 'flaticon2-fast-back',
				last: 'flaticon2-fast-next',
				more: 'flaticon-more-1'
			},
			rowDetail: {expand: 'fa fa-caret-down', collapse: 'fa fa-caret-right'}
		}
	}
};
$.extend(true, $.fn.KTDatatable.defaults, defaults);
"use strict";

// Class definition
var KTChat = function () {
	var initChat = function (parentEl) {
		var messageListEl = KTUtil.find(parentEl, '.kt-scroll');

		if (!messageListEl) {
			return;
		}

		// initialize perfect scrollbar(see:  https://github.com/utatti/perfect-scrollbar) 
		KTUtil.scrollInit(messageListEl, {
			windowScroll: false, // allow browser scroll when the scroll reaches the end of the side
			mobileNativeScroll: true,  // enable native scroll for mobile
			desktopNativeScroll: false, // disable native scroll and use custom scroll for desktop 
			resetHeightOnDestroy: true,  // reset css height on scroll feature destroyed
			handleWindowResize: true, // recalculate hight on window resize
			rememberPosition: true, // remember scroll position in cookie
			height: function() {  // calculate height
				var height;

				// Mobile mode
				if (KTUtil.isInResponsiveRange('tablet-and-mobile')) {
					return KTUtil.hasAttr(messageListEl, 'data-mobile-height') ? parseInt(KTUtil.attr(messageListEl, 'data-mobile-height')) : 300;
				} 

				// Desktop mode
				if (KTUtil.isInResponsiveRange('desktop') && KTUtil.hasAttr(messageListEl, 'data-height')) {
					return parseInt(KTUtil.attr(messageListEl, 'data-height'));
				}

				var chatEl = KTUtil.find(parentEl, '.kt-chat');
				var portletHeadEl = KTUtil.find(parentEl, '.kt-portlet > .kt-portlet__head');
				var portletBodyEl = KTUtil.find(parentEl, '.kt-portlet > .kt-portlet__body');
				var portletFootEl = KTUtil.find(parentEl, '.kt-portlet > .kt-portlet__foot');
				
				if (KTUtil.isInResponsiveRange('desktop')) {
					height = KTLayout.getContentHeight();
				} else {
					height = KTUtil.getViewPort().height;
				}

				if (chatEl) {
					height = height - parseInt(KTUtil.css(chatEl, 'margin-top')) - parseInt(KTUtil.css(chatEl, 'margin-bottom'));
					height = height - parseInt(KTUtil.css(chatEl, 'padding-top')) - parseInt(KTUtil.css(chatEl, 'padding-bottom'));
				}

				if (portletHeadEl) {
					height = height - parseInt(KTUtil.css(portletHeadEl, 'height'));
					height = height - parseInt(KTUtil.css(portletHeadEl, 'margin-top')) - parseInt(KTUtil.css(portletHeadEl, 'margin-bottom'));
				}

				if (portletBodyEl) {
					height = height - parseInt(KTUtil.css(portletBodyEl, 'margin-top')) - parseInt(KTUtil.css(portletBodyEl, 'margin-bottom'));
					height = height - parseInt(KTUtil.css(portletBodyEl, 'padding-top')) - parseInt(KTUtil.css(portletBodyEl, 'padding-bottom'));
				}

				if (portletFootEl) {
					height = height - parseInt(KTUtil.css(portletFootEl, 'height'));
					height = height - parseInt(KTUtil.css(portletFootEl, 'margin-top')) - parseInt(KTUtil.css(portletFootEl, 'margin-bottom'));
				}

				// remove additional space
				height = height - 5;
				
				return height;
			} 
		});

		// messaging
		var handleMessaging = function() {
			var scrollEl = KTUtil.find(parentEl, '.kt-scroll');
			var messagesEl = KTUtil.find(parentEl, '.kt-chat__messages');
            var textarea = KTUtil.find(parentEl, '.kt-chat__input textarea');
            
            if (textarea.value.length === 0 ) {
                return;
            }

			var node = document.createElement("DIV");  
			KTUtil.addClass(node, 'kt-chat__message kt-chat__message--right');

			var html = 
				'<div class="kt-chat__user">' +				
					'<span class="kt-chat__datetime">Just now</span>' +
					'<a href="#" class="kt-chat__username">Jason Muller</span></a>' +					
					'<span class="kt-userpic kt-userpic--circle kt-userpic--sm">' +
						'<img src="./assets/media/users/100_12.jpg" alt="image">'  + 
					'</span>' +
				'</div>' +
				'<div class="kt-chat__text kt-bg-light-brand">' + 
					textarea.value
				'</div>';

			KTUtil.setHTML(node, html);
			messagesEl.appendChild(node);
			textarea.value = '';
			scrollEl.scrollTop = parseInt(KTUtil.css(messagesEl, 'height'));
			
			var ps;
			if (ps = KTUtil.data(scrollEl).get('ps')) {
				ps.update();
			}					
			
			setTimeout(function() {
				var node = document.createElement("DIV");  
				KTUtil.addClass(node, 'kt-chat__message');

				var html = 
					'<div class="kt-chat__user">' +
						'<span class="kt-userpic kt-userpic--circle kt-userpic--sm">' +
							'<img src="./assets/media/users/100_13.jpg" alt="image">'  + 
						'</span>' +
						'<a href="#" class="kt-chat__username">Max Born</span></a>' +
						'<span class="kt-chat__datetime">Just now</span>' +
					'</div>' +
					'<div class="kt-chat__text kt-bg-light-success">' + 
					'Right before vacation season we have the next Big Deal for you. <br>Book the car of your dreams and save up to <b>25%*</b> worldwide.'
					'</div>';

				KTUtil.setHTML(node, html);
				messagesEl.appendChild(node);
				textarea.value = '';
				scrollEl.scrollTop = parseInt(KTUtil.css(messagesEl, 'height'));
				
				var ps;
				if (ps = KTUtil.data(scrollEl).get('ps')) {
					ps.update();
				}					
			}, 2000);
		}

		// attach events
		KTUtil.on(parentEl, '.kt-chat__input textarea', 'keydown', function(e) {
			if (e.keyCode == 13) {
				handleMessaging();
				e.preventDefault();

				return false; 
			}
		});

		KTUtil.on(parentEl, '.kt-chat__input .kt-chat__reply', 'click', function(e) {
			handleMessaging();
		});
	}

	return {
		// public functions
		init: function() {
			// init modal chat example
			initChat( KTUtil.getByID('kt_chat_modal'));

			// trigger click to show popup modal chat on page load
			setTimeout(function() {
				//KTUtil.getByID('kt_app_chat_launch_btn').click();
			}, 1000);
        },
        
        setup: function(element) {
            initChat(element);
        }
	};
}();

KTUtil.ready(function() {	
	KTChat.init();
});
"use strict";

var KTDemoPanel = function() {
    var demoPanel = KTUtil.getByID('kt_demo_panel');
    var offcanvas;

    var init = function() {
        offcanvas = new KTOffcanvas(demoPanel, {
            overlay: true,  
            baseClass: 'kt-demo-panel',
            closeBy: 'kt_demo_panel_close',
            toggleBy: 'kt_demo_panel_toggle'
        }); 

        var head = KTUtil.find(demoPanel, '.kt-demo-panel__head');
        var body = KTUtil.find(demoPanel, '.kt-demo-panel__body');

        KTUtil.scrollInit(body, {
            disableForMobile: true, 
            resetHeightOnDestroy: true, 
            handleWindowResize: true, 
            height: function() {
                var height = parseInt(KTUtil.getViewPort().height);
               
                if (head) {
                    height = height - parseInt(KTUtil.actualHeight(head));
                    height = height - parseInt(KTUtil.css(head, 'marginBottom'));
                }
        
                height = height - parseInt(KTUtil.css(demoPanel, 'paddingTop'));
                height = height - parseInt(KTUtil.css(demoPanel, 'paddingBottom'));    

                return height;
            }
        });

        if (typeof offcanvas !== 'undefined' && offcanvas.length === 0) {
            offcanvas.on('hide', function() {
                var expires = new Date(new Date().getTime() + 60 * 60 * 1000); // expire in 60 minutes from now
                Cookies.set('kt_demo_panel_shown', 1, {expires: expires});
            });
        }
    }

    var remind = function() {
        if (!(encodeURI(window.location.hostname) == 'keenthemes.com' || encodeURI(window.location.hostname) == 'www.keenthemes.com')) {
            return;
        }

        setTimeout(function() {
            if (!Cookies.get('kt_demo_panel_shown')) {
                var expires = new Date(new Date().getTime() + 15 * 60 * 1000); // expire in 15 minutes from now
                Cookies.set('kt_demo_panel_shown', 1, { expires: expires });
                offcanvas.show();
            } 
        }, 4000);
    }

    return {     
        init: function() {  
            init(); 
            remind();
        }
    };
}();

$(document).ready(function() {
    KTDemoPanel.init();
});
"use strict";

var KTOffcanvasPanel = function() {
    var notificationPanel = KTUtil.get('kt_offcanvas_toolbar_notifications');
    var quickActionsPanel = KTUtil.get('kt_offcanvas_toolbar_quick_actions');
    var profilePanel = KTUtil.get('kt_offcanvas_toolbar_profile');
    var searchPanel = KTUtil.get('kt_offcanvas_toolbar_search');

    var initNotifications = function() {
        var head = KTUtil.find(notificationPanel, '.kt-offcanvas-panel__head');
        var body = KTUtil.find(notificationPanel, '.kt-offcanvas-panel__body');

        var offcanvas = new KTOffcanvas(notificationPanel, {
            overlay: true,  
            baseClass: 'kt-offcanvas-panel',
            closeBy: 'kt_offcanvas_toolbar_notifications_close',
            toggleBy: 'kt_offcanvas_toolbar_notifications_toggler_btn'
        }); 

        KTUtil.scrollInit(body, {
            mobileNativeScroll: true, 
            resetHeightOnDestroy: true, 
            handleWindowResize: true, 
            height: function() {
                var height = parseInt(KTUtil.getViewPort().height);
               
                if (head) {
                    height = height - parseInt(KTUtil.actualHeight(head));
                    height = height - parseInt(KTUtil.css(head, 'marginBottom'));
                }
        
                height = height - parseInt(KTUtil.css(notificationPanel, 'paddingTop'));
                height = height - parseInt(KTUtil.css(notificationPanel, 'paddingBottom'));    

                return height;
            }
        });
    }

    var initQucikActions = function() {
        var head = KTUtil.find(quickActionsPanel, '.kt-offcanvas-panel__head');
        var body = KTUtil.find(quickActionsPanel, '.kt-offcanvas-panel__body');

        var offcanvas = new KTOffcanvas(quickActionsPanel, {
            overlay: true,  
            baseClass: 'kt-offcanvas-panel',
            closeBy: 'kt_offcanvas_toolbar_quick_actions_close',
            toggleBy: 'kt_offcanvas_toolbar_quick_actions_toggler_btn'
        }); 

        KTUtil.scrollInit(body, {
            mobileNativeScroll: true, 
            resetHeightOnDestroy: true, 
            handleWindowResize: true, 
            height: function() {
                var height = parseInt(KTUtil.getViewPort().height);
               
                if (head) {
                    height = height - parseInt(KTUtil.actualHeight(head));
                    height = height - parseInt(KTUtil.css(head, 'marginBottom'));
                }
        
                height = height - parseInt(KTUtil.css(quickActionsPanel, 'paddingTop'));
                height = height - parseInt(KTUtil.css(quickActionsPanel, 'paddingBottom'));    

                return height;
            }
        });
    }

    var initProfile = function() {
        var head = KTUtil.find(profilePanel, '.kt-offcanvas-panel__head');
        var body = KTUtil.find(profilePanel, '.kt-offcanvas-panel__body');

        var offcanvas = new KTOffcanvas(profilePanel, {
            overlay: true,  
            baseClass: 'kt-offcanvas-panel',
            closeBy: 'kt_offcanvas_toolbar_profile_close',
            toggleBy: 'kt_offcanvas_toolbar_profile_toggler_btn'
        }); 

        KTUtil.scrollInit(body, {
            mobileNativeScroll: true, 
            resetHeightOnDestroy: true, 
            handleWindowResize: true, 
            height: function() {
                var height = parseInt(KTUtil.getViewPort().height);
               
                if (head) {
                    height = height - parseInt(KTUtil.actualHeight(head));
                    height = height - parseInt(KTUtil.css(head, 'marginBottom'));
                }
        
                height = height - parseInt(KTUtil.css(profilePanel, 'paddingTop'));
                height = height - parseInt(KTUtil.css(profilePanel, 'paddingBottom'));    

                return height;
            }
        });
    }

    var initSearch = function() {
        var head = KTUtil.find(searchPanel, '.kt-offcanvas-panel__head');
        var body = KTUtil.find(searchPanel, '.kt-offcanvas-panel__body');
        
        var offcanvas = new KTOffcanvas(searchPanel, {
            overlay: true,  
            baseClass: 'kt-offcanvas-panel',
            closeBy: 'kt_offcanvas_toolbar_search_close',
            toggleBy: 'kt_offcanvas_toolbar_search_toggler_btn'
        }); 

        KTUtil.scrollInit(body, {
            mobileNativeScroll: true, 
            resetHeightOnDestroy: true, 
            handleWindowResize: true, 
            height: function() {
                var height = parseInt(KTUtil.getViewPort().height);
               
                if (head) {
                    height = height - parseInt(KTUtil.actualHeight(head));
                    height = height - parseInt(KTUtil.css(head, 'marginBottom'));
                }
        
                height = height - parseInt(KTUtil.css(searchPanel, 'paddingTop'));
                height = height - parseInt(KTUtil.css(searchPanel, 'paddingBottom'));    

                return height;
            }
        });
    }

    return {     
        init: function() {  
            initNotifications(); 
            initQucikActions();
            initProfile();
            initSearch();
        }
    };
}();

$(document).ready(function() {
    KTOffcanvasPanel.init();
});
"use strict";

var KTQuickPanel = function() {
    var panel = KTUtil.get('kt_quick_panel');
    var notificationPanel = KTUtil.get('kt_quick_panel_tab_notifications');
    var logsPanel = KTUtil.get('kt_quick_panel_tab_logs');
    var settingsPanel = KTUtil.get('kt_quick_panel_tab_settings');

    var getContentHeight = function() {
        var height;
        var nav = KTUtil.find(panel, '.kt-quick-panel__nav');
        var content = KTUtil.find(panel, '.kt-quick-panel__content');

        height = parseInt(KTUtil.getViewPort().height) - parseInt(KTUtil.actualHeight(nav)) - (2 * parseInt(KTUtil.css(nav, 'padding-top'))) - 10;

        return height;
    }

    var initOffcanvas = function() {
        var offcanvas = new KTOffcanvas(panel, {
            overlay: true,  
            baseClass: 'kt-quick-panel',
            closeBy: 'kt_quick_panel_close_btn',
            toggleBy: 'kt_quick_panel_toggler_btn'
        });   
    }

    var initNotifications = function() {
        KTUtil.scrollInit(notificationPanel, {
            mobileNativeScroll: true, 
            resetHeightOnDestroy: true, 
            handleWindowResize: true, 
            height: function() {
                return getContentHeight();
            }
        });
    }

    var initLogs = function() {
        KTUtil.scrollInit(logsPanel, {
            mobileNativeScroll: true, 
            resetHeightOnDestroy: true, 
            handleWindowResize: true, 
            height: function() {
                return getContentHeight();
            }
        });
    }

    var initSettings = function() {
        KTUtil.scrollInit(settingsPanel, {
            mobileNativeScroll: true, 
            resetHeightOnDestroy: true, 
            handleWindowResize: true, 
            height: function() {
                return getContentHeight();
            }
        });
    }

    var updatePerfectScrollbars = function() {
        $(panel).find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) { 
            KTUtil.scrollUpdate(notificationPanel);
            KTUtil.scrollUpdate(logsPanel);
            KTUtil.scrollUpdate(settingsPanel);
        });
    }

    return {     
        init: function() {  
            initOffcanvas(); 
            initNotifications();
            initLogs();
            initSettings();
            updatePerfectScrollbars();
        }
    };
}();

$(document).ready(function() {
    KTQuickPanel.init();
});
"use strict";

var KTQuickSearch = function () {
    var target;
    var form;
    var input;
    var closeIcon;
    var resultWrapper;
    var resultDropdown;
    var resultDropdownToggle;
    var inputGroup;
    var query = '';

    var hasResult = false;
    var timeout = false;
    var isProcessing = false;
    var requestTimeout = 200; // ajax request fire timeout in milliseconds 
    var spinnerClass = 'kt-spinner kt-spinner--input kt-spinner--sm kt-spinner--brand kt-spinner--right';
    var resultClass = 'kt-quick-search--has-result';
    var minLength = 2;
    /**
     * 显示等待状态
     */
    var showProgress = function () {
        isProcessing = true;
        KTUtil.addClass(inputGroup, spinnerClass);

        if (closeIcon) {
            KTUtil.hide(closeIcon);
        }
    };
    /**
     * 隐藏等待状态
     */
    var hideProgress = function () {
        isProcessing = false;
        KTUtil.removeClass(inputGroup, spinnerClass);

        if (closeIcon) {
            if (input.value.length < minLength) {
                KTUtil.hide(closeIcon);
            } else {
                KTUtil.show(closeIcon, 'flex');
            }
        }
    };
    /**
     * 显示搜索
     */
    var showDropdown = function () {
        if (resultDropdownToggle && !KTUtil.hasClass(resultDropdown, 'show')) {
            $(resultDropdownToggle).dropdown('toggle');
            $(resultDropdownToggle).dropdown('update');
        }
    };
    /**
     * 隐藏搜索
     */
    var hideDropdown = function () {
        if (resultDropdownToggle && KTUtil.hasClass(resultDropdown, 'show')) {
            $(resultDropdownToggle).dropdown('toggle');
        }
    };
    /**
     * 执行搜索
     */
    var processSearch = function () {
        // 如果有结果并且查询条件=当前输入条件
        if (hasResult && query === input.value) {
            hideProgress();
            KTUtil.addClass(target, resultClass);
            showDropdown();
            KTUtil.scrollUpdate(resultWrapper[0]);
            return;
        }
        // 查询条件
        query = input.value;

        KTUtil.removeClass(target, resultClass);
        showProgress();
        // 这里暂时只对菜单进行搜索
        var result = searchMenu(query);
        resultWrapper.empty();
        if (result.length > 0) {
            hasResult = true;
            // 加载数据到搜索结果中
            $(result).each(function (index, menu) {
                resultWrapper.append(
                    '<a href="javascript:;" data-title="' + menu.relName + '" data-url="' + basePath + menu.url + '" class="kt-notification__item kt-menu-link">\
                        <div class="kt-notification__item-icon">' + menu.icon + '</div>\
                        <div class="kt-notification__item-details">\
                            <div class="kt-notification__item-title">' + menu.name + '</div>\
                        </div>\
                    </a>'
                );
            });
        } else {
            hasResult = false;
            resultWrapper.html(
                '<div class="kt-grid kt-grid--ver" style="min-height: 200px;">\
                    <div class="kt-grid kt-grid--hor kt-grid__item kt-grid__item--fluid kt-grid__item--middle">\
                        <div class="kt-grid__item kt-grid__item--middle kt-align-center">\
                            暂无数据\
                        </div>\
                    </div>\
                </div>'
            );
        }
        hideProgress();
        KTUtil.addClass(target, resultClass);
        showDropdown();
        KTUtil.scrollUpdate(resultWrapper[0]);
    };
    /**
     * 根据关键字搜索菜单
     *
     * @param query {string} 关键字
     * @return {Array} 菜单列表
     */
    var searchMenu = function (query) {
        var result = [];
        if(KTUtil.isNotBlank(query)){
            // query = query.toUpperCase();
            var menus = KTTool.getUser(true).menus;
            $(menus).each(function (index, menu) {
                if (KTUtil.isNotBlank(menu.url) && menu.name.indexOf(query) > -1) {
                    result.push({
                        name: menu.name.replaceAll(query, '<span class="kt-font-danger">' + query + '</span>'),
                        relName: menu.name,
                        icon: menu.icon,
                        url: menu.url
                    })
                }
            });
        }
        return result;
    };
    /**
     * 取消
     *
     * @param e
     */
    var handleCancel = function (e) {
        input.value = '';
        query = '';
        hasResult = false;
        KTUtil.hide(closeIcon);
        KTUtil.removeClass(target, resultClass);
        hideDropdown();
    };

    var handleSearch = function () {
        if (input.value.length < minLength) {
            hideProgress();
            hideDropdown();

            return;
        }

        if (isProcessing === true) {
            return;
        }

        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(function () {
            processSearch();
        }, requestTimeout);
    };

    return {
        init: function (element) {
            // Init
            target = element;
            form = KTUtil.find(target, '.kt-quick-search__form');
            input = KTUtil.find(target, '.kt-quick-search__input');
            closeIcon = KTUtil.find(target, '.kt-quick-search__close');
            resultDropdown = KTUtil.find(target, '.dropdown-menu');
            resultDropdownToggle = KTUtil.find(target, '[data-toggle="dropdown"]');
            inputGroup = KTUtil.find(target, '.input-group');
            resultWrapper = $(target).find('.kt-quick-search__wrapper');

            // Attach input keyup handler
            KTUtil.addEvent(input, 'keyup', handleSearch);
            KTUtil.addEvent(input, 'focus', handleSearch);

            // 按回车
            form.onkeypress = function (e) {
                var key = e.charCode || e.keyCode || 0;
                if (key === 13) {
                    e.preventDefault();
                }
            };

            KTUtil.addEvent(closeIcon, 'click', handleCancel);

            // 打开搜索将焦点放到input上
            var toggle = KTUtil.getByID('kt_quick_search_toggle');
            if (toggle) {
                $(toggle).on('shown.bs.dropdown', function () {
                    input.focus();
                });
            }
        }
    };
};

$(document).ready(function () {
    var $quickSearch = $('#kt_quick_search_inline');
    if ($quickSearch.length) {
        KTQuickSearch().init($quickSearch[0]);
    }
});
var appOptions = {
    'colors': {
        'state': {
            'brand': '#5d78ff',
            'dark': '#282a3c',
            'light': '#ffffff',
            'primary': '#5867dd',
            'success': '#34bfa3',
            'info': '#36a3f7',
            'warning': '#ffb822',
            'danger': '#fd3995'
        },
        'base': {
            'label': ['#c5cbe3', '#a1a8c3', '#3d4465', '#3e4466'],
            'shape': ['#f0f3ff', '#d9dffa', '#afb4d4', '#646c9a']
        }
    }
};
"use strict";

var KTLayout = function() {
	var body;

	var header;
	var headerMenu;
	var headerMenuOffcanvas;

	var asideMenu;
	var asideMenuOffcanvas;
	var asideToggler;

	var asideSecondary;
	var asideSecondaryToggler;

	var scrollTop;

	var pageStickyPortlet;

	/**
	 * Header
	 */
	var initHeader = function() {
		var tmp;
		var headerEl = KTUtil.get('kt_header');
		var options = {
			offset: {},
			minimize: {
				/*
				desktop: {
				    on: 'kt-header--minimize'
				},
				*/
				desktop: false,
				mobile: false
			}
		};

		if (tmp = KTUtil.attr(headerEl, 'data-ktheader-minimize-offset')) {
			options.offset.desktop = tmp;
		}

		if (tmp = KTUtil.attr(headerEl, 'data-ktheader-minimize-mobile-offset')) {
			options.offset.mobile = tmp;
		}

		header = new KTHeader('kt_header', options);
	};

	/**
	 * 头部菜单
	 */
	var initHeaderMenu = function() {
		headerMenuOffcanvas = new KTOffcanvas('kt_header_menu_wrapper', {
			overlay: true,
			baseClass: 'kt-header-menu-wrapper',
			closeBy: 'kt_header_menu_mobile_close_btn',
			toggleBy: {
				target: 'kt_header_mobile_toggler',
				state: 'kt-header-mobile__toolbar-toggler--active'
			}
		});

		headerMenu = new KTMenu('kt_header_menu', {
			submenu: {
				desktop: 'dropdown',
				tablet: 'accordion',
				mobile: 'accordion'
			},
			accordion: {
				slideSpeed: 200, // accordion toggle slide speed in milliseconds
				expandAll: false // allow having multiple expanded accordions in the menu
			}
		});
	};

	/**
	 * 头部工具
	 */
	var initHeaderTopbar = function() {
		asideToggler = new KTToggle('kt_header_mobile_topbar_toggler', {
			target: 'body',
			targetState: 'kt-header__topbar--mobile-on',
			togglerState: 'kt-header-mobile__toolbar-topbar-toggler--active'
		});
	};

	/**
	 * 侧边
	 */
	var initAside = function() {
		// init aside left offcanvas
		var asidBrandHover = false;
		var aside = KTUtil.get('kt_aside');
		var asideBrand = KTUtil.get('kt_aside_brand');
		var asideOffcanvasClass = KTUtil.hasClass(aside, 'kt-aside--offcanvas-default') ? 'kt-aside--offcanvas-default' : 'kt-aside';

		asideMenuOffcanvas = new KTOffcanvas('kt_aside', {
			baseClass: asideOffcanvasClass,
			overlay: true,
			closeBy: 'kt_aside_close_btn',
			toggleBy: {
				target: 'kt_aside_mobile_toggler',
				state: 'kt-header-mobile__toolbar-toggler--active'
			}
		});

		// Handle minimzied aside hover
		if (KTUtil.hasClass(body, 'kt-aside--fixed')) {
			var insideTm;
			var outsideTm;

			KTUtil.addEvent(aside, 'mouseenter', function(e) {
				e.preventDefault();

				if (KTUtil.isInResponsiveRange('desktop') === false) {
					return;
				}

				if (outsideTm) {
					clearTimeout(outsideTm);
					outsideTm = null;
				}

				insideTm = setTimeout(function() {
					if (KTUtil.hasClass(body, 'kt-aside--minimize') && KTUtil.isInResponsiveRange('desktop')) {
						KTUtil.removeClass(body, 'kt-aside--minimize');

						// Minimizing class
						KTUtil.addClass(body, 'kt-aside--minimizing');
						KTUtil.transitionEnd(body, function() {
							KTUtil.removeClass(body, 'kt-aside--minimizing');
						});

						// Hover class
						KTUtil.addClass(body, 'kt-aside--minimize-hover');
						asideMenu.scrollUpdate();
						asideMenu.scrollTop();
					}
				}, 50);
			});

			KTUtil.addEvent(aside, 'mouseleave', function(e) {
				e.preventDefault();

				if (KTUtil.isInResponsiveRange('desktop') === false) {
					return;
				}

				if (insideTm) {
					clearTimeout(insideTm);
					insideTm = null;
				}

				outsideTm = setTimeout(function() {
					if (KTUtil.hasClass(body, 'kt-aside--minimize-hover') && KTUtil.isInResponsiveRange('desktop')) {
						KTUtil.removeClass(body, 'kt-aside--minimize-hover');
						KTUtil.addClass(body, 'kt-aside--minimize');

						// Minimizing class
						KTUtil.addClass(body, 'kt-aside--minimizing');
						KTUtil.transitionEnd(body, function() {
							KTUtil.removeClass(body, 'kt-aside--minimizing');
						});

						// Hover class
						asideMenu.scrollUpdate();
						asideMenu.scrollTop();
					}
				}, 100);
			});
		}
	}

	/**
	 * 侧边菜单
	 */
	var initAsideMenu = function() {
		// Init aside menu
		var menu = KTUtil.get('kt_aside_menu');
		var menuDesktopMode = (KTUtil.attr(menu, 'data-ktmenu-dropdown') === '1' ? 'dropdown' : 'accordion');

		var scroll;
		if (KTUtil.attr(menu, 'data-ktmenu-scroll') === '1') {
			scroll = {
				rememberPosition: true, // remember position on page reload
				height: function() { // calculate available scrollable area height
					var height;

					if (KTUtil.isInResponsiveRange('desktop')) {
						height =
							parseInt(KTUtil.getViewPort().height) -
							parseInt(KTUtil.actualHeight('kt_aside_brand')) -
							parseInt(KTUtil.getByID('kt_aside_footer') ? KTUtil.actualHeight('kt_aside_footer') : 0);
					} else {
						height =
							parseInt(KTUtil.getViewPort().height) -
							parseInt(KTUtil.getByID('kt_aside_footer') ? KTUtil.actualHeight('kt_aside_footer') : 0);
					}

					height = height - (parseInt(KTUtil.css(menu, 'marginBottom')) + parseInt(KTUtil.css(menu, 'marginTop')));

					return height;
				}
			};
		}

		asideMenu = new KTMenu('kt_aside_menu', {
			// vertical scroll
			scroll: scroll,

			// submenu setup
			submenu: {
				desktop: menuDesktopMode,
				tablet: 'accordion', // menu set to accordion in tablet mode
				mobile: 'accordion' // menu set to accordion in mobile mode
			},

			//accordion setup
			accordion: {
				expandAll: false // allow having multiple expanded accordions in the menu
			}
		});

		// sample set active menu
		// asideMenu.setActiveItem($('a[href="?page=custom/pages/pricing/pricing-1&demo=demo1"]').closest('.kt-menu__item')[0]);
	}

	/**
	 * 侧边栏切换
	 */
	var initAsideToggler = function() {
		if (!KTUtil.get('kt_aside_toggler')) {
			return;
		}

		asideToggler = new KTToggle('kt_aside_toggler', {
			target: 'body',
			targetState: 'kt-aside--minimize',
			togglerState: 'kt-aside__brand-aside-toggler--active'
		});

		asideToggler.on('toggle', function(toggle) {
			KTUtil.addClass(body, 'kt-aside--minimizing');

			if (KTUtil.get('kt_page_portlet')) {
				pageStickyPortlet.updateSticky();
			}

			KTUtil.transitionEnd(body, function() {
				KTUtil.removeClass(body, 'kt-aside--minimizing');
			});

			headerMenu.pauseDropdownHover(800);
			asideMenu.pauseDropdownHover(800);

			// 记住cookie中的状态
			Cookies.set('kt_aside_toggle_state', toggle.getState());
			// to set default minimized left aside use this cookie value in your 
			// server side code and add "kt-brand--minimize kt-aside--minimize" classes to
			// the body tag in order to initialize the minimized left aside mode during page loading.
		});

		asideToggler.on('beforeToggle', function(toggle) {
			var body = KTUtil.get('body');
			if (KTUtil.hasClass(body, 'kt-aside--minimize') === false && KTUtil.hasClass(body, 'kt-aside--minimize-hover')) {
				KTUtil.removeClass(body, 'kt-aside--minimize-hover');
			}
		});
	};

	// Aside secondary
	var initAsideSecondary = function() {
		if (!KTUtil.get('kt_aside_secondary')) {
			return;
		}

		asideSecondaryToggler = new KTToggle('kt_aside_secondary_toggler', {
			target: 'body',
			targetState: 'kt-aside-secondary--expanded'
		});

		asideSecondaryToggler.on('toggle', function(toggle) {
			if (KTUtil.get('kt_page_portlet')) {
				pageStickyPortlet.updateSticky();
			}
		});
	};
	var initFullScreen = function () {
		/**
		 * 全屏
		 *
		 * @param element {object} 要全屏的元素
		 */
		function launchFullScreen(element) {
			if (element.requestFullscreen) {
				element.requestFullscreen();
			} else if (element.mozRequestFullScreen) {
				element.mozRequestFullScreen();
			} else if (element.webkitRequestFullscreen) {
				element.webkitRequestFullscreen();
			} else if (element.msRequestFullscreen) {
				element.msRequestFullscreen();
			}
		}

		/**
		 * 退出全屏
		 */
		function exitFullscreen() {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
		}
		var icon = {
			full: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">\n' +
				'    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
				'        <polygon id="Bound" points="0 0 24 0 24 24 0 24"/>\n' +
				'        <path d="M6,18 L9,18 C9.66666667,18.1143819 10,18.4477153 10,19 C10,19.5522847 9.66666667,19.8856181 9,20 L4,20 L4,15 C4,14.3333333 4.33333333,14 5,14 C5.66666667,14 6,14.3333333 6,15 L6,18 Z M18,18 L18,15 C18.1143819,14.3333333 18.4477153,14 19,14 C19.5522847,14 19.8856181,14.3333333 20,15 L20,20 L15,20 C14.3333333,20 14,19.6666667 14,19 C14,18.3333333 14.3333333,18 15,18 L18,18 Z M18,6 L15,6 C14.3333333,5.88561808 14,5.55228475 14,5 C14,4.44771525 14.3333333,4.11438192 15,4 L20,4 L20,9 C20,9.66666667 19.6666667,10 19,10 C18.3333333,10 18,9.66666667 18,9 L18,6 Z M6,6 L6,9 C5.88561808,9.66666667 5.55228475,10 5,10 C4.44771525,10 4.11438192,9.66666667 4,9 L4,4 L9,4 C9.66666667,4 10,4.33333333 10,5 C10,5.66666667 9.66666667,6 9,6 L6,6 Z" id="Combined-Shape" fill="#000000" fill-rule="nonzero"/>\n' +
				'    </g>\n' +
				'</svg>',
			cancel: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">\n' +
				'    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
				'        <polygon id="Bound" points="0 0 24 0 24 24 0 24"/>\n' +
				'        <path d="M10,14 L5,14 C4.33333333,13.8856181 4,13.5522847 4,13 C4,12.4477153 4.33333333,12.1143819 5,12 L12,12 L12,19 C12,19.6666667 11.6666667,20 11,20 C10.3333333,20 10,19.6666667 10,19 L10,14 Z M15,9 L20,9 C20.6666667,9.11438192 21,9.44771525 21,10 C21,10.5522847 20.6666667,10.8856181 20,11 L13,11 L13,4 C13,3.33333333 13.3333333,3 14,3 C14.6666667,3 15,3.33333333 15,4 L15,9 Z" id="Combined-Shape" fill="#000000" fill-rule="nonzero"/>\n' +
				'        <path d="M3.87867966,18.7071068 L6.70710678,15.8786797 C7.09763107,15.4881554 7.73079605,15.4881554 8.12132034,15.8786797 C8.51184464,16.2692039 8.51184464,16.9023689 8.12132034,17.2928932 L5.29289322,20.1213203 C4.90236893,20.5118446 4.26920395,20.5118446 3.87867966,20.1213203 C3.48815536,19.7307961 3.48815536,19.0976311 3.87867966,18.7071068 Z M16.8786797,5.70710678 L19.7071068,2.87867966 C20.0976311,2.48815536 20.7307961,2.48815536 21.1213203,2.87867966 C21.5118446,3.26920395 21.5118446,3.90236893 21.1213203,4.29289322 L18.2928932,7.12132034 C17.9023689,7.51184464 17.2692039,7.51184464 16.8786797,7.12132034 C16.4881554,6.73079605 16.4881554,6.09763107 16.8786797,5.70710678 Z" id="Combined-Shape" fill="#000000" opacity="0.3"/>\n' +
				'    </g>\n' +
				'</svg>'
		};
		$('#kt_full_screen').click(function () {
			var isFullScreen = document.fullscreenElement || document.mozFullScreenElement ||document.webkitFullscreenElement
			if (isFullScreen) {
				$(this).find('.kt-header__topbar-icon').html(icon.full);
				exitFullscreen();
			} else {
				$(this).find('.kt-header__topbar-icon').html(icon.cancel);
				launchFullScreen(document.documentElement);
			}
		});
	};
	/**
	 * 回到顶部
	 */
	var initScrolltop = function() {
		var scrolltop = new KTScrolltop('kt_scrolltop', {
			offset: 300,
			speed: 600
		});
	};

	/**
	 * 初始化固定头部的Portlet
	 * Init page sticky portlet
	 * @return {KTPortlet|KTPortlet|KTPortlet}
	 */
	var initPageStickyPortlet = function() {
		var asideWidth = 255;
		var asideMinimizeWidth = 78;
		var asideSecondaryWidth = 60;
		var asideSecondaryExpandedWidth = 310;

		return new KTPortlet('kt_page_portlet', {
			sticky: {
				offset: parseInt(KTUtil.css(KTUtil.get('kt_header'), 'height')),
				zIndex: 90,
				position: {
					top: function() {
						var h = 0;

						if (KTUtil.isInResponsiveRange('desktop')) {
							if (KTUtil.hasClass(body, 'kt-header--fixed')) {
								h = h + parseInt(KTUtil.css(KTUtil.get('kt_header'), 'height'));
							}

							if (KTUtil.hasClass(body, 'kt-subheader--fixed') && KTUtil.get('kt_subheader')) {
								h = h + parseInt(KTUtil.css(KTUtil.get('kt_subheader'), 'height'));
							}
						} else {
							if (KTUtil.hasClass(body, 'kt-header-mobile--fixed')) {
								h = h + parseInt(KTUtil.css(KTUtil.get('kt_header_mobile'), 'height'));
							}
						}

						return h;
					},
					left: function() {
						var left = 0;

						if (KTUtil.isInResponsiveRange('desktop')) {
							if (KTUtil.hasClass(body, 'kt-aside--minimize')) {
								left += asideMinimizeWidth;
							} else if (KTUtil.hasClass(body, 'kt-aside--enabled')) {
								left += asideWidth;
							}
						}

						left += parseInt(KTUtil.css(KTUtil.get('kt_content'), 'paddingLeft'));

						return left;
					},
					right: function() {
						var right = 0;

						if (KTUtil.isInResponsiveRange('desktop')) {
							if (KTUtil.hasClass(body, 'kt-aside-secondary--enabled')) {
								if (KTUtil.hasClass(body, 'kt-aside-secondary--expanded')) {
									right += asideSecondaryExpandedWidth + asideSecondaryWidth;
								} else {
									right += asideSecondaryWidth;
								}
							} else {
								right += parseInt(KTUtil.css(KTUtil.get('kt_content'), 'paddingRight'));
							}
						}

						if (KTUtil.get('kt_aside_secondary')) {
							right += parseInt(KTUtil.css(KTUtil.get('kt_content'), 'paddingRight'));
						}

						return right;
					}
				}
			}
		});
	};

	/**
	 * 获取页面可用高度
	 * @return {number}
	 */
	var getContentHeight = function() {
		var height;

		height = KTUtil.getViewPort().height;

		if (KTUtil.getByID('kt_header')) {
            height = height - KTUtil.actualHeight('kt_header');
		}

		if (KTUtil.getByID('kt_subheader')) {
            height = height - KTUtil.actualHeight('kt_subheader');
		}

		if (KTUtil.getByID('kt_footer')) {
			height = height - parseInt(KTUtil.css('kt_footer', 'height'));
		}

		if (KTUtil.getByID('kt_content')) {
			height = height - parseInt(KTUtil.css('kt_content', 'padding-top')) - parseInt(KTUtil.css('kt_content', 'padding-bottom'));
		}

		return height;
	};

	return {
		init: function() {
			body = KTUtil.get('body');
			this.initHeader();
			this.initAside();
			this.initAsideSecondary();
			this.initPageStickyPortlet();
		},

		initHeader: function() {
			initHeader();
			initHeaderMenu();
			initHeaderTopbar();
			initScrolltop();
			initFullScreen();
		},

		initAside: function() {
			initAside();
			initAsideMenu();
			initAsideToggler();

			this.onAsideToggle(function(e) {
				// 更新固定头部的portlet
				if (pageStickyPortlet) {
					pageStickyPortlet.updateSticky();
				}

				// 重绘表格
				var dataTables = $('.kt-datatable');
				if (dataTables) {
					dataTables.each(function() {
						$(this).KTDatatable('redraw');
					});
				}
			});
		},

		initAsideSecondary: function() {
			initAsideSecondary();
		},

		initPageStickyPortlet: function() {
			if (!KTUtil.get('kt_page_portlet')) {
				return;
			}

			pageStickyPortlet = initPageStickyPortlet();
			pageStickyPortlet.initSticky();

			KTUtil.addResizeHandler(function() {
				pageStickyPortlet.updateSticky();
			});

			initPageStickyPortlet();
		},

		getAsideMenu: function() {
			return asideMenu;
		},
		getHeaderMenu: function () {
			return headerMenu;
		},
		onAsideToggle: function(handler) {
			if (typeof asideToggler.element !== 'undefined') {
				asideToggler.on('toggle', handler);
			}
		},

		getAsideToggler: function() {
			return asideToggler;
		},

		openAsideSecondary: function() {
			asideSecondaryToggler.toggleOn();
		},

		closeAsideSecondary: function() {
			asideSecondaryToggler.toggleOff();
		},

		getAsideSecondaryToggler: function() {
			return asideSecondaryToggler;
		},

		onAsideSecondaryToggle: function(handler) {
			if (asideSecondaryToggler) {
				asideSecondaryToggler.on('toggle', handler);
			}
		},

		closeMobileAsideMenuOffcanvas: function() {
			if (KTUtil.isMobileDevice()) {
				asideMenuOffcanvas.hide();
			}
		},

		closeMobileHeaderMenuOffcanvas: function() {
			if (KTUtil.isMobileDevice()) {
				headerMenuOffcanvas.hide();
			}
		},

		getContentHeight: function() {
			return getContentHeight();
		}
	};
}();

KTUtil.ready(function() {
	KTLayout.init();
});