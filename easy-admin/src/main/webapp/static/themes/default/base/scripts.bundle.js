/**
 * @class mUtil 工具
 */
//== Polyfill
// matches polyfill
this.Element && function (ElementPrototype) {
    ElementPrototype.matches = ElementPrototype.matches ||
        ElementPrototype.matchesSelector ||
        ElementPrototype.webkitMatchesSelector ||
        ElementPrototype.msMatchesSelector ||
        function (selector) {
            var node = this,
                nodes = (node.parentNode || node.document).querySelectorAll(selector),
                i = -1;
            while (nodes[++i] && nodes[i] != node) ;
            return !!nodes[i];
        }
}(Element.prototype);

// closest polyfill
this.Element && function (ElementPrototype) {
    ElementPrototype.closest = ElementPrototype.closest ||
        function (selector) {
            var el = this;
            while (el.matches && !el.matches(selector)) el = el.parentNode;
            return el.matches ? el : null;
        }
}(Element.prototype);


// matches polyfill
this.Element && function (ElementPrototype) {
    ElementPrototype.matches = ElementPrototype.matches ||
        ElementPrototype.matchesSelector ||
        ElementPrototype.webkitMatchesSelector ||
        ElementPrototype.msMatchesSelector ||
        function (selector) {
            var node = this,
                nodes = (node.parentNode || node.document).querySelectorAll(selector),
                i = -1;
            while (nodes[++i] && nodes[i] != node) ;
            return !!nodes[i];
        }
}(Element.prototype);

(function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

(function (arr) {
    arr.forEach(function (item) {
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

                argArr.forEach(function (argItem) {
                    var isNode = argItem instanceof Node;
                    docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                });

                this.insertBefore(docFrag, this.firstChild);
            }
        });
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

//== 全局变量
window.mUtilElementDataStore = {};
window.mUtilElementDataStoreID = 0;
window.mUtilDelegatedEventHandlers = {};

var mUtil = function () {

    var resizeHandlers = [];

    /** @type {object} 设备宽度 **/
    var breakpoints = {
        sm: 544, // 小屏 / 手机
        md: 768, // 中等屏幕 / 平板电脑
        lg: 1024, // 大屏幕/ 电脑
        xl: 1200 // 超大屏幕 / 宽屏电脑
    };

    /**
     * 窗口大小调整事件
     * 调整完成时延迟事件处理
     */
    var _windowResizeHandler = function () {
        var _runResizeHandlers = function () {
            // 重新初始化注册元素
            for (var i = 0; i < resizeHandlers.length; i++) {
                var each = resizeHandlers[i];
                each.call();
            }
        };

        var timeout = false; // 超时标识
        var delay = 250; // 延迟时间

        window.addEventListener('resize', function () {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                _runResizeHandlers();
            }, delay); // 等待 1/4s 直到窗口大小调整完毕
        });
    };

    return {
        /**
         * Class main 初始化
         * @param {object} options.
         * @returns null
         */
        init: function (options) {
            if (options && options.breakpoints) {
                breakpoints = options.breakpoints;
            }

            _windowResizeHandler();
        },

        /**
         * 添加窗口大小调整事件回调
         * @param {function} callback 回调函数
         */
        addResizeHandler: function (callback) {
            resizeHandlers.push(callback);
        },

        /**
         * 移除窗口大小调整事件回调
         * @param {function} callback 回调函数
         */
        removeResizeHandler: function (callback) {
            for (var i = 0; i < resizeHandlers.length; i++) {
                if (callback === resizeHandlers[i]) {
                    delete resizeHandlers[i];
                }
            }
        },

        /**
         * 触发窗口大小调整时间
         */
        runResizeHandlers: function () {
            _runResizeHandlers();
        },

        resize: function () {
            if (typeof(Event) === 'function') {
                // 当代浏览器
                window.dispatchEvent(new Event('resize'));
            } else {
                // IE/其他老版本浏览器
                var evt = window.document.createEvent('UIEvents');
                evt.initUIEvent('resize', true, false, window, 0);
                window.dispatchEvent(evt);
            }
        },

        /**
         * 从url中获取参数
         * @param {string} paramName 参数名
         * @returns {string}
         */
        getURLParam: function (paramName) {
            var searchString = window.location.search.substring(1), i, val, params = searchString.split("&");
            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] == paramName) {
                    return unescape(val[1]);
                }
            }
            return null;
        },

        /**
         * 检查是否是移动设备
         * @returns {boolean}
         */
        isMobileDevice: function () {
            return (this.getViewPort().width < this.getBreakpoint('lg') ? true : false);
        },

        /**
         * 检查是否是电脑
         * @returns {boolean}
         */
        isDesktopDevice: function () {
            return mUtil.isMobileDevice() ? false : true;
        },

        /**
         * 获取浏览器窗口视口大小
         * @returns {object}
         */
        getViewPort: function () {
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
         * 检查当前设备是否为指定'响应模式名'
         * @param {string} mode 响应模式名(例如: desktop, desktop-and-tablet, tablet, tablet-and-mobile, mobile)
         * @returns {boolean}
         */
        isInResponsiveRange: function (mode) {
            var breakpoint = this.getViewPort().width;

            if (mode == 'general') {
                return true;
            } else if (mode == 'desktop' && breakpoint >= (this.getBreakpoint('lg') + 1)) {
                return true;
            } else if (mode == 'tablet' && (breakpoint >= (this.getBreakpoint('md') + 1) && breakpoint < this.getBreakpoint('lg'))) {
                return true;
            } else if (mode == 'mobile' && breakpoint <= this.getBreakpoint('md')) {
                return true;
            } else if (mode == 'desktop-and-tablet' && breakpoint >= (this.getBreakpoint('md') + 1)) {
                return true;
            } else if (mode == 'tablet-and-mobile' && breakpoint <= this.getBreakpoint('lg')) {
                return true;
            } else if (mode == 'minimal-desktop-and-below' && breakpoint <= this.getBreakpoint('xl')) {
                return true;
            }

            return false;
        },

        /**
         * 获取指定前缀的唯一id
         * @param {string} prefix 唯一id前缀
         * @returns {boolean}
         */
        getUniqueID: function (prefix) {
            return prefix + Math.floor(Math.random() * (new Date()).getTime());
        },

        /**
         * 根据'响应模式名'获取宽度
         * @param {string} mode 响应模式名(例如: xl, lg, md, sm)
         * @returns {number}
         */
        getBreakpoint: function (mode) {
            return breakpoints[mode];
        },

        /**
         * 检查对象是否具有指定密钥路径的属性匹配
         * @param {object} obj 对象包含与指定键路径配对的值
         * @param {string} keys Keys path seperated with dots
         * @returns {object}
         */
        isset: function (obj, keys) {
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
         * 获取指定元素父级最高 z-index
         * @param {object} el jquery对象
         * @returns {number}
         */
        getHighestZindex: function (el) {
            var elem = mUtil.get(el), position, value;

            while (elem && elem !== document) {
                position = mUtil.css(elem, 'position');
                if (position === "absolute" || position === "relative" || position === "fixed") {
                    value = parseInt(mUtil.css(elem, 'z-index'));
                    if (!isNaN(value) && value !== 0) {
                        return value;
                    }
                }
                elem = elem.parentNode;
            }
            return null;
        },

        /**
         * 是否有fixed定位的父级元素
         * @param {object} el jQuery element object
         * @returns {boolean}
         */
        hasFixedPositionedParent: function (el) {
            while (el && el !== document) {
                position = mUtil.css(el, 'position');

                if (position === "fixed") {
                    return true;
                }

                el = el.parentNode;
            }

            return false;
        },

        /**
         * 模拟延迟
         * @param milliseconds 延迟时间 (单位: 毫秒)
         */
        sleep: function (milliseconds) {
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds) {
                    break;
                }
            }
        },

        /**
         * 获取指定范围随机数
         * @param {number} min 最小值
         * @param {number} min 最大值
         * @returns {number}
         */
        getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        /**
         * 是否为使用Angular版本
         * @returns {boolean}
         */
        isAngularVersion: function () {
            return window.Zone !== undefined ? true : false;
        },

        //== jQuery 解决方案

        //== Deep extend:  $.extend(true, {}, objA, objB);
        deepExtend: function (out) {
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                var obj = arguments[i];

                if (!obj)
                    continue;

                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object')
                            out[key] = mUtil.deepExtend(out[key], obj[key]);
                        else
                            out[key] = obj[key];
                    }
                }
            }

            return out;
        },

        //== extend:  $.extend({}, objA, objB);
        extend: function (out) {
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
        /**
         * 查找元素
         * @param query 选择器
         * @returns {*}
         */
        get: function (query) {
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
        /**
         * 根据class查找元素
         * @param query class
         * @returns {*}
         */
        getByClass: function (query) {
            var el;

            if (el = document.getElementsByClassName(query)) {
                return el[0];
            } else {
                return null;
            }
        },

        /**
         * 检查元素是否有指定class
         * @param {object} el jQuery 对象
         * @param {string} Classes class 多个使用空格隔开
         * @returns {boolean}
         */
        hasClasses: function (el, classes) {
            if (!el) {
                return;
            }

            var classesArr = classes.split(" ");

            for (var i = 0; i < classesArr.length; i++) {
                if (mUtil.hasClass(el, mUtil.trim(classesArr[i])) == false) {
                    return false;
                }
            }

            return true;
        },
        /**
         * 检查元素是否有指定class
         * @param {object} el jQuery 对象
         * @param className
         * @returns {boolean}
         */
        hasClass: function (el, className) {
            if (!el) {
                return;
            }

            return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
        },
        /**
         * 添加class
         * @param {object} el jQuery 对象
         * @param className
         */
        addClass: function (el, className) {
            if (!el || typeof className === 'undefined') {
                return;
            }

            var classNames = className.split(' ');

            if (el.classList) {
                for (var i = 0; i < classNames.length; i++) {
                    if (classNames[i] && classNames[i].length > 0) {
                        el.classList.add(mUtil.trim(classNames[i]));
                    }
                }
            } else if (!mUtil.hasClass(el, className)) {
                for (var i = 0; i < classNames.length; i++) {
                    el.className += ' ' + mUtil.trim(classNames[i]);
                }
            }
        },
        /**
         * 删除class
         * @param {object} el jQuery 对象
         * @param className
         */
        removeClass: function (el, className) {
            if (!el) {
                return;
            }

            var classNames = className.split(' ');

            if (el.classList) {
                for (var i = 0; i < classNames.length; i++) {
                    el.classList.remove(mUtil.trim(classNames[i]));
                }
            } else if (mUtil.hasClass(el, className)) {
                for (var i = 0; i < classNames.length; i++) {
                    el.className = el.className.replace(new RegExp('\\b' + mUtil.trim(classNames[i]) + '\\b', 'g'), '');
                }
            }
        },

        triggerCustomEvent: function (el, eventName, data) {
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

        trim: function (string) {
            return string.trim();
        },

        eventTriggered: function (e) {
            if (e.currentTarget.dataset.triggered) {
                return true;
            } else {
                e.currentTarget.dataset.triggered = true;

                return false;
            }
        },

        remove: function (el) {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        },

        find: function (parent, query) {
            return parent.querySelector(query);
        },

        findAll: function (parent, query) {
            return parent.querySelectorAll(query);
        },

        insertAfter: function (el, referenceNode) {
            return referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
        },

        parents: function (el, query) {
            function collectionHas(a, b) { //helper function (see below)
                for (var i = 0, len = a.length; i < len; i++) {
                    if (a[i] == b) return true;
                }

                return false;
            }

            function findParentBySelector(el, selector) {
                var all = document.querySelectorAll(selector);
                var cur = el.parentNode;

                while (cur && !collectionHas(all, cur)) { //keep going up until you find a match
                    cur = cur.parentNode; //go up
                }

                return cur; //will return null if not found
            }

            return findParentBySelector(el, query);
        },

        children: function (el, selector, log) {
            if (!el || !el.childNodes) {
                return;
            }

            var result = [],
                i = 0,
                l = el.childNodes.length;

            for (var i; i < l; ++i) {
                if (el.childNodes[i].nodeType == 1 && mUtil.matches(el.childNodes[i], selector, log)) {
                    result.push(el.childNodes[i]);
                }
            }

            return result;
        },

        child: function (el, selector, log) {
            var children = mUtil.children(el, selector, log);

            return children ? children[0] : null;
        },

        matches: function (el, selector, log) {
            var p = Element.prototype;
            var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function (s) {
                return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
            };

            if (el && el.tagName) {
                return f.call(el, selector);
            } else {
                return false;
            }
        },

        data: function (element) {
            element = mUtil.get(element);

            return {
                set: function (name, data) {
                    if (element.customDataTag === undefined) {
                        mUtilElementDataStoreID++;
                        element.customDataTag = mUtilElementDataStoreID;
                    }

                    if (mUtilElementDataStore[element.customDataTag] === undefined) {
                        mUtilElementDataStore[element.customDataTag] = {};
                    }

                    mUtilElementDataStore[element.customDataTag][name] = data;
                },

                get: function (name) {
                    return this.has(name) ? mUtilElementDataStore[element.customDataTag][name] : null;
                },

                has: function (name) {
                    return (mUtilElementDataStore[element.customDataTag] && mUtilElementDataStore[element.customDataTag][name]) ? true : false;
                },

                remove: function (name) {
                    if (this.has(name)) {
                        delete mUtilElementDataStore[element.customDataTag][name];
                    }
                }
            };
        },

        outerWidth: function (el, margin) {
            var width;

            if (margin === true) {
                var width = parseFloat(el.offsetWidth);
                width += parseFloat(mUtil.css(el, 'margin-left')) + parseFloat(mUtil.css(el, 'margin-right'));

                return parseFloat(width);
            } else {
                var width = parseFloat(el.offsetWidth);

                return width;
            }
        },

        offset: function (elem) {
            var rect, win;
            elem = mUtil.get(elem);

            if (!elem) {
                return;
            }

            // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
            // Support: IE <=11 only
            // Running getBoundingClientRect on a
            // disconnected node in IE throws an error

            if (!elem.getClientRects().length) {
                return {top: 0, left: 0};
            }

            // Get document-relative position by adding viewport scroll to viewport-relative gBCR
            rect = elem.getBoundingClientRect();
            win = elem.ownerDocument.defaultView;

            return {
                top: rect.top + win.pageYOffset,
                left: rect.left + win.pageXOffset
            };
        },

        height: function (el) {
            return mUtil.css(el, 'height');
        },

        visible: function (el) {
            return !(el.offsetWidth === 0 && el.offsetHeight === 0);
        },

        attr: function (el, name, value) {
            el = mUtil.get(el);

            if (el == undefined) {
                return;
            }

            if (value !== undefined) {
                el.setAttribute(name, value);
            } else {
                return el.getAttribute(name);
            }
        },

        hasAttr: function (el, name) {
            el = mUtil.get(el);

            if (el == undefined) {
                return;
            }

            return el.getAttribute(name) ? true : false;
        },

        removeAttr: function (el, name) {
            el = mUtil.get(el);

            if (el == undefined) {
                return;
            }

            el.removeAttribute(name);
        },

        animate: function (from, to, duration, update, easing, done) {
            /**
             * TinyAnimate.easings
             *  Adapted from jQuery Easing
             */
            var easings = {};
            var easing;

            easings.linear = function (t, b, c, d) {
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
                done = function () {
                };
            }

            // Pick implementation (requestAnimationFrame | setTimeout)
            var rAF = window.requestAnimationFrame || function (callback) {
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

        actualCss: function (el, prop, cache) {
            if (el instanceof HTMLElement === false) {
                return;
            }

            if (!el.getAttribute('m-hidden-' + prop) || cache === false) {
                var value;

                // the element is hidden so:
                // making the el block so we can meassure its height but still be hidden
                el.style.cssText = 'position: absolute; visibility: hidden; display: block;';

                if (prop == 'width') {
                    value = el.offsetWidth;
                } else if (prop == 'height') {
                    value = el.offsetHeight;
                }

                el.style.cssText = '';

                // store it in cache
                el.setAttribute('m-hidden-' + prop, value);

                return parseFloat(value);
            } else {
                // store it in cache
                return parseFloat(el.getAttribute('m-hidden-' + prop));
            }
        },

        actualHeight: function (el, cache) {
            return mUtil.actualCss(el, 'height', cache);
        },

        actualWidth: function (el, cache) {
            return mUtil.actualCss(el, 'width', cache);
        },

        getScroll: function (element, method) {
            // The passed in `method` value should be 'Top' or 'Left'
            method = 'scroll' + method;
            return (element == window || element == document) ? (
                self[(method == 'scrollTop') ? 'pageYOffset' : 'pageXOffset'] ||
                (browserSupportsBoxModel && document.documentElement[method]) ||
                document.body[method]
            ) : element[method];
        },

        css: function (el, styleProp, value) {
            el = mUtil.get(el);

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
                    styleProp = styleProp.replace(/\-(\w)/g, function (str, letter) {
                        return letter.toUpperCase();
                    });
                    value = el.currentStyle[styleProp];
                    // convert other units to pixels on IE
                    if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
                        return (function (value) {
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

        slide: function (el, dir, speed, callback, recalcMaxHeight) {
            if (!el || (dir == 'up' && mUtil.visible(el) === false) || (dir == 'down' && mUtil.visible(el) === true)) {
                return;
            }

            speed = (speed ? speed : 600);
            var calcHeight = mUtil.actualHeight(el);
            var calcPaddingTop = false;
            var calcPaddingBottom = false;

            if (mUtil.css(el, 'padding-top') && mUtil.data(el).has('slide-padding-top') !== true) {
                mUtil.data(el).set('slide-padding-top', mUtil.css(el, 'padding-top'));
            }

            if (mUtil.css(el, 'padding-bottom') && mUtil.data(el).has('slide-padding-bottom') !== true) {
                mUtil.data(el).set('slide-padding-bottom', mUtil.css(el, 'padding-bottom'));
            }

            if (mUtil.data(el).has('slide-padding-top')) {
                calcPaddingTop = parseInt(mUtil.data(el).get('slide-padding-top'));
            }

            if (mUtil.data(el).has('slide-padding-bottom')) {
                calcPaddingBottom = parseInt(mUtil.data(el).get('slide-padding-bottom'));
            }

            if (dir == 'up') { // up
                el.style.cssText = 'display: block; overflow: hidden;';

                if (calcPaddingTop) {
                    mUtil.animate(0, calcPaddingTop, speed, function (value) {
                        el.style.paddingTop = (calcPaddingTop - value) + 'px';
                    }, 'linear');
                }

                if (calcPaddingBottom) {
                    mUtil.animate(0, calcPaddingBottom, speed, function (value) {
                        el.style.paddingBottom = (calcPaddingBottom - value) + 'px';
                    }, 'linear');
                }

                mUtil.animate(0, calcHeight, speed, function (value) {
                    el.style.height = (calcHeight - value) + 'px';
                }, 'linear', function () {
                    callback();
                    el.style.height = '';
                    el.style.display = 'none';
                });


            } else if (dir == 'down') { // down
                el.style.cssText = 'display: block; overflow: hidden;';

                if (calcPaddingTop) {
                    mUtil.animate(0, calcPaddingTop, speed, function (value) {
                        el.style.paddingTop = value + 'px';
                    }, 'linear', function () {
                        el.style.paddingTop = '';
                    });
                }

                if (calcPaddingBottom) {
                    mUtil.animate(0, calcPaddingBottom, speed, function (value) {
                        el.style.paddingBottom = value + 'px';
                    }, 'linear', function () {
                        el.style.paddingBottom = '';
                    });
                }

                mUtil.animate(0, calcHeight, speed, function (value) {
                    el.style.height = value + 'px';
                }, 'linear', function () {
                    callback();
                    el.style.height = '';
                    el.style.display = '';
                    el.style.overflow = '';
                });
            }
        },

        slideUp: function (el, speed, callback) {
            mUtil.slide(el, 'up', speed, callback);
        },

        slideDown: function (el, speed, callback) {
            mUtil.slide(el, 'down', speed, callback);
        },

        show: function (el, display) {
            el.style.display = (display ? display : 'block');
        },

        hide: function (el) {
            el.style.display = 'none';
        },

        addEvent: function (el, type, handler, one) {
            el = mUtil.get(el);
            if (typeof el !== 'undefined') {
                el.addEventListener(type, handler);
            }
        },

        removeEvent: function (el, type, handler) {
            el = mUtil.get(el);
            el.removeEventListener(type, handler);
        },

        on: function (element, selector, event, handler) {
            if (!selector) {
                return;
            }

            var eventId = mUtil.getUniqueID('event');

            mUtilDelegatedEventHandlers[eventId] = function (e) {
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

            mUtil.addEvent(element, event, mUtilDelegatedEventHandlers[eventId]);

            return eventId;
        },

        off: function (element, event, eventId) {
            if (!element || !mUtilDelegatedEventHandlers[eventId]) {
                return;
            }

            mUtil.removeEvent(element, event, mUtilDelegatedEventHandlers[eventId]);

            delete mUtilDelegatedEventHandlers[eventId];
        },

        one: function onetime(el, type, callback) {
            el = mUtil.get(el);

            el.addEventListener(type, function (e) {
                // remove event
                e.target.removeEventListener(e.type, arguments.callee);
                // call handler
                return callback(e);
            });
        },

        hash: function (str) {
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

        animateClass: function (el, animationName, callback) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

            mUtil.addClass(el, 'animated ' + animationName);

            mUtil.one(el, animationEnd, function () {
                mUtil.removeClass(el, 'animated ' + animationName);
            });

            if (callback) {
                mUtil.one(el.animationEnd, callback);
            }
        },

        animateDelay: function (el, value) {
            var vendors = ['webkit-', 'moz-', 'ms-', 'o-', ''];
            for (var i = 0; i < vendors.length; i++) {
                mUtil.css(el, vendors[i] + 'animation-delay', value);
            }
        },

        animateDuration: function (el, value) {
            var vendors = ['webkit-', 'moz-', 'ms-', 'o-', ''];
            for (var i = 0; i < vendors.length; i++) {
                mUtil.css(el, vendors[i] + 'animation-duration', value);
            }
        },

        scrollTo: function (target, offset, duration) {
            var duration = duration ? duration : 500;
            var target = mUtil.get(target);
            var targetPos = target ? mUtil.offset(target).top : 0;
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

            mUtil.animate(from, to, duration, function (value) {
                document.documentElement.scrollTop = value;
                document.body.parentNode.scrollTop = value;
                document.body.scrollTop = value;
            }); //, easing, done
        },

        scrollTop: function (offset, duration) {
            mUtil.scrollTo(null, offset, duration);
        },

        ready: function (callback) {
            if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
                callback();
            } else {
                document.addEventListener('DOMContentLoaded', callback);
            }
        },

        isEmpty: function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    return false;
                }
            }

            return true;
        },

        numberString: function (nStr) {
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

        detectIE: function () {
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

        isRTL: function () {
            return (mUtil.attr(mUtil.get('html'), 'direction') == 'rtl');
        },

        //== Scroller
        scrollerInit: function (element, options) {
            //== Define init function
            function init() {
                var ps;
                var height;

                if (options.height instanceof Function) {
                    height = parseInt(options.height.call());
                } else {
                    height = parseInt(options.height);
                }

                //== Destroy scroll on table and mobile modes
                if (options.disableForMobile && mUtil.isInResponsiveRange('tablet-and-mobile')) {
                    if (ps = mUtil.data(element).get('ps')) {
                        if (options.resetHeightOnDestroy) {
                            mUtil.css(element, 'height', 'auto');
                        } else {
                            mUtil.css(element, 'overflow', 'auto');
                            if (height > 0) {
                                mUtil.css(element, 'height', height + 'px');
                            }
                        }

                        ps.destroy();
                        ps = mUtil.data(element).remove('ps');
                    } else if (height > 0) {
                        mUtil.css(element, 'overflow', 'auto');
                        mUtil.css(element, 'height', height + 'px');
                    }

                    return;
                }

                if (height > 0) {
                    mUtil.css(element, 'height', height + 'px');
                }

                mUtil.css(element, 'overflow', 'hidden');

                //== Init scroll
                if (ps = mUtil.data(element).get('ps')) {
                    ps.update();
                } else {
                    mUtil.addClass(element, 'm-scroller');
                    ps = new PerfectScrollbar(element, {
                        wheelSpeed: 0.5,
                        swipeEasing: true,
                        wheelPropagation: false,
                        minScrollbarLength: 40,
                        suppressScrollX: true
                    });

                    mUtil.data(element).set('ps', ps);
                }
            }

            //== Init
            init();

            //== Handle window resize
            if (options.handleWindowResize) {
                mUtil.addResizeHandler(function () {
                    init();
                });
            }
        },

        scrollerUpdate: function (element) {
            var ps;
            if (ps = mUtil.data(element).get('ps')) {
                ps.update();
            }
        },

        scrollersUpdate: function (parent) {
            var scrollers = mUtil.findAll(parent, '.ps');
            for (var i = 0, len = scrollers.length; i < len; i++) {
                mUtil.scrollerUpdate(scrollers[i]);
            }
        },

        scrollerTop: function (element) {
            var ps;
            if (ps = mUtil.data(element).get('ps')) {
                element.scrollTop = 0;
            }
        },

        scrollerDestroy: function (element) {
            var ps;
            if (ps = mUtil.data(element).get('ps')) {
                ps.destroy();
                ps = mUtil.data(element).remove('ps');
            }
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
            return !mUtil.isBlank(str);
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
         * 判断是否是数组
         *
         * @param obj {object}
         * @returns {boolean}
         */
        isArray: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
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
            return window.top != window.self;
        },
        /**
         * 自定义弹出
         *
         * @param obj {object}
         */
        alert: function (obj) {
            if (mUtil.isTopPage()) {
                window.parent.mUtil.alert(obj);
            } else {
                swal(obj);
            }
        },
        /**
         * 弹出提示 (级别: 信息)
         *
         * @param title 标题
         * @param subTitle 副标题
         */
        alertInfo: function (title, subTitle) {
            if (mUtil.isTopPage()) {
                window.parent.mUtil.alertInfo(title, subTitle);
            } else {
                swal(title, subTitle, 'info');
            }
        },
        /**
         * 弹出提示 (级别: 成功)
         *
         * @param title 标题
         * @param subTitle 副标题
         */
        alertSuccess: function (title, subTitle) {
            if (mUtil.isTopPage()) {
                window.parent.mUtil.alertSuccess(title, subTitle);
            } else {
                swal(title, subTitle, 'success');
            }
        },
        /**
         * 弹出提示 (级别: 错误)
         *
         * @param title 标题
         * @param subTitle 副标题
         */
        alertError: function (title, subTitle) {
            if (mUtil.isTopPage()) {
                window.parent.mUtil.alertError(title, subTitle);
            } else {
                swal(title, subTitle, "error");
            }
        },
        /**
         * 弹出提示 (级别: 警告)
         *
         * @param title 标题
         * @param subTitle 副标题
         */
        alertWarning: function (title, subTitle) {
            if (mUtil.isTopPage()) {
                window.parent.mUtil.alertWarning(title, subTitle);
            } else {
                swal(title, subTitle, "warning");
            }
        },
        /**
         * 询问框
         *
         * @param title 标题
         * @param subTitle 副标题
         * @param okCallback 点击确定回调
         * @param cancelCallback 点击取消回调
         */
        alertConfirm: function (title, subTitle, okCallback, cancelCallback) {
            if (mUtil.isTopPage()) {
                window.parent.mUtil.alertConfirm(title, subTitle, okCallback, cancelCallback);
            } else {
                swal({
                    title: title,
                    text: subTitle,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(function (obj) {
                    if (obj.value != null && obj.value) {
                        if (mUtil.isFunction(okCallback)) {
                            okCallback();
                        }
                    } else {
                        if (mUtil.isFunction(cancelCallback)) {
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
            console.error(XMLHttpRequest);
            console.error(textStatus);
            console.error(errorThrown);
            mTool.errorTip(XMLHttpRequest.responseJSON.error + '[' + XMLHttpRequest.responseJSON.code + ']', XMLHttpRequest.responseJSON.path);
        },
        /**
         * 显示等待遮罩
         *
         * @param selector {string} jquery 选择器
         */
        openWait: function (selector) {
            mApp.block(selector, {
                overlayColor: '#000000',
                type: 'loader',
                state: 'success',
                message: 'Please wait...'
            });
        },
        /**
         * 移除等待遮罩
         *
         * @param selector {string} jquery 选择器
         */
        closeWait: function (selector) {
            mApp.unblock(selector);
        },
        /**
         * 设置按钮为处理中状态
         *
         * @param el {object} html 元素对象 (必要)
         */
        setButtonWait: function (el) {
            $(el).addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
        },
        /**
         * 取消按钮为处理中状态
         *
         * @param el {object} html 元素对象 (必要)
         */
        offButtonWait: function (el) {
            $(el).removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
        },
        /**
         * 封装jquery.ajax方法
         * 拓展属性如下
         *  config.wait 打开等待遮罩选择器
         *  config.needAlert 失败时是否使用系统mTool.alertWarning弹出data.msg提示;
         *  当不需要提示时可以自定义config.fail(data)方法自定义错误提示
         *
         * @param config
         */
        ajax: function (config) {
            if (mUtil.isNotBlank(config)) {
                if (mUtil.isNotBlank(config.wait)) {
                    mUtil.openWait(config.wait);
                }
                $.ajax({
                    async: config.async,
                    url: config.url,
                    cache: false,
                    data: config.data,
                    type: mUtil.isBlank(config.type) ? 'post' : config.type,
                    dataType: mUtil.isBlank(config.dataType) ? 'json' : config.dataType,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (mUtil.isNotBlank(config.wait)) {
                            mUtil.closeWait(config.wait);
                        }
                        if (mUtil.isFunction(config.error)) { // 如传入error回调,则不调用公用ajaxError
                            config.error(XMLHttpRequest, textStatus, errorThrown);
                        } else {
                            mUtil.ajaxError(XMLHttpRequest, textStatus, errorThrown);
                        }
                    },
                    success: function (res) {
                        if (mUtil.isNotBlank(config.wait)) {
                            mUtil.closeWait(config.wait);
                        }
                        if (mUtil.isBlank(config.dataType) || 'json' === config.dataType) {
                            if (mTool.httpCode.SUCCESS === res.code) {
                                if (mUtil.isFunction(config.success)) {
                                    config.success(res);
                                }
                            } else {
                                if (config.needAlert == null || config.needAlert) {
                                    if (mUtil.isNotBlank(res.message)) {
                                        if (mTool.httpCode.UNAUTHORIZED === res.code) { // 无权访问
                                            mTool.errorTip(mTool.commonTips.unauthorized, res.message);
                                            // 权限可能被修改,刷新缓存用户数据
                                            mTool.getUser(false);
                                        } else if (mTool.httpCode.INTERNAL_SERVER_ERROR === res.code) { // 业务异常
                                            mTool.errorTip(mTool.commonTips.fail, res.message);
                                        } else {
                                            mTool.errorTip('错误代码[' + res.code + ']', res.message);
                                        }
                                    }
                                } else {
                                    if (mUtil.isNotBlank(res.message)) {
                                        console.warn(res.message);
                                    }
                                }
                                if (mUtil.isFunction(config.fail)) {
                                    config.fail(res);
                                }
                            }
                        } else {
                            if (mUtil.isFunction(config.success)) {
                                config.success(res);
                            }
                        }
                    }
                });
            } else {
                console.warn('mUtil.ajax方法不允许传入空参数');
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
                if (mUtil.isNotBlank(icon)) {
                    tree.set_icon(node, icon);
                }
            }
        }
    }
}();

//== 当页面加载完毕初始化mUtil
mUtil.ready(function () {
    mUtil.init();
});
/**
 * @class mApp
 */

var mApp = function () {

    /** @type {object} colors State colors **/
    var colors = {
        brand: '#716aca',
        metal: '#c4c5d6',
        light: '#ffffff',
        accent: '#00c5dc',
        primary: '#5867dd',
        success: '#34bfa3',
        info: '#36a3f7',
        warning: '#ffb822',
        danger: '#f4516c',
        focus: '#9816f4'
    };

    /**
     * 初始化 bootstrap tooltip
     */
    var initTooltip = function (el) {
        var skin = el.data('skin') ? 'm-tooltip--skin-' + el.data('skin') : '';
        var width = el.data('width') == 'auto' ? 'm-tooltop--auto-width' : '';
        var triggerValue = el.data('trigger') ? el.data('trigger') : 'hover';
        var placement = el.data('placement') ? el.data('placement') : 'left';

        el.tooltip({
            trigger: triggerValue,
            template: '<div class="m-tooltip ' + skin + ' ' + width + ' tooltip" role="tooltip">\
                <div class="arrow"></div>\
                <div class="tooltip-inner"></div>\
            </div>'
        });
    };

    /**
     * 初始化 bootstrap tooltips
     */
    var initTooltips = function () {
        // init bootstrap tooltips
        $('[data-toggle="m-tooltip"]').each(function () {
            initTooltip($(this));
        });
    };

    /**
     * 初始化 bootstrap popover
     */
    var initPopover = function (el) {
        var skin = el.data('skin') ? 'm-popover--skin-' + el.data('skin') : '';
        var triggerValue = el.data('trigger') ? el.data('trigger') : 'hover';

        el.popover({
            trigger: triggerValue,
            template: '\
            <div class="m-popover ' + skin + ' popover" role="tooltip">\
                <div class="arrow"></div>\
                <h3 class="popover-header"></h3>\
                <div class="popover-body"></div>\
            </div>'
        });
    };

    /**
     * 初始化 bootstrap popovers
     */
    var initPopovers = function () {
        $('[data-toggle="m-popover"]').each(function () {
            initPopover($(this));
        });
    };

    /**
     * 初始化 bootstrap file input
     */
    var initFileInput = function () {
        $('.custom-file-input').on('change', function () {
            var fileName = $(this).val();
            $(this).next('.custom-file-label').addClass("selected").html(fileName);
        });
    };

    /**
     * 初始化 metronic portlet
     */
    var initPortlet = function (el, options) {
        var el = $(el);
        var portlet = new mPortlet(el[0], options);
    };

    /**
     * 初始化 metronic portlets
     */
    var initPortlets = function () {
        $('[m-portlet="true"]').each(function () {
            var el = $(this);

            if (el.data('portlet-initialized') !== true) {
                initPortlet(el, {});
                el.data('portlet-initialized', true);
            }
        });
    };

    /**
     * 初始化 scrollable contents
     */
    var initScrollers = function () {
        $('[data-scrollable="true"]').each(function () {
            var el = $(this);
            mUtil.scrollerInit(this, {
                disableForMobile: true, handleWindowResize: true, height: function () {
                    if (mUtil.isInResponsiveRange('tablet-and-mobile') && el.data('mobile-height')) {
                        return el.data('mobile-height');
                    } else {
                        return el.data('height');
                    }
                }
            });
        });
    };

    /**
     * 初始化 bootstrap alerts
     */
    var initAlerts = function () {
        $('body').on('click', '[data-close=alert]', function () {
            $(this).closest('.alert').hide();
        });
    };

    /**
     * 初始化 Metronic custom tabs
     */
    var initCustomTabs = function () {
        $('[data-tab-target]').each(function () {
            if ($(this).data('tabs-initialized') == true) {
                return;
            }

            $(this).click(function (e) {
                e.preventDefault();

                var tab = $(this);
                var tabs = tab.closest('[data-tabs="true"]');
                var contents = $(tabs.data('tabs-contents'));
                var content = $(tab.data('tab-target'));

                tabs.find('.m-tabs__item.m-tabs__item--active').removeClass('m-tabs__item--active');
                tab.addClass('m-tabs__item--active');

                contents.find('.m-tabs-content__item.m-tabs-content__item--active').removeClass('m-tabs-content__item--active');
                content.addClass('m-tabs-content__item--active');
            });

            $(this).data('tabs-initialized', true);
        });
    };

    var hideTouchWarning = function () {
        jQuery.event.special.touchstart = {
            setup: function (_, ns, handle) {
                if (typeof this === 'function')
                    if (ns.includes('noPreventDefault')) {
                        this.addEventListener('touchstart', handle, {passive: false});
                    } else {
                        this.addEventListener('touchstart', handle, {passive: true});
                    }
            },
        };
        jQuery.event.special.touchmove = {
            setup: function (_, ns, handle) {
                if (typeof this === 'function')
                    if (ns.includes('noPreventDefault')) {
                        this.addEventListener('touchmove', handle, {passive: false});
                    } else {
                        this.addEventListener('touchmove', handle, {passive: true});
                    }
            },
        };
        jQuery.event.special.wheel = {
            setup: function (_, ns, handle) {
                if (typeof this === 'function')
                    if (ns.includes('noPreventDefault')) {
                        this.addEventListener('wheel', handle, {passive: false});
                    } else {
                        this.addEventListener('wheel', handle, {passive: true});
                    }
            },
        };
    };
    /**
     * 初始化tab工具条
     */
    var initTabs = function () {
        window.siteTabs = new mTabs();
    };
    /**
     * 打开页面
     * @param name 页面名称
     * @param url 访问地址
     * @param canClose 是否可以关闭
     */
    var openPage = function (name, url, canClose) {
        if (top.location != self.location && typeof siteTabs === 'undefined') { // 有父页面,并且 siteTabs is null
            parent.mApp.openPage(name, url, canClose);
        } else {
            if (typeof siteTabs !== 'undefined') {
                siteTabs.addTab(name, url, canClose);
            } else {
                window.open(url);
            }
        }
    };
    /**
     * 关闭当前页面
     */
    var closeCurrentPage = function () {
        mApp.closeTabByUrl(window.location.href);
    };
    /**
     * 关闭指定url页面
     * @param url 页面url
     */
    var closeTabByUrl = function (url) {
        if (top.location != self.location && typeof siteTabs === 'undefined') { // 有父页面,并且 siteTabs is null
            parent.mApp.closeTabByUrl(url);
        } else {
            if (typeof siteTabs !== 'undefined') {
                siteTabs.closeTabByUrl(url);
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
            if (!$element.hasClass('is-loaded')) {
                $element.addClass('is-loaded');

                // 指定了字典类型
                if (typeof $element.data('dict-type') !== 'undefined') {
                    $element.append('<option value=""></option>');
                    initDictSelect($element);
                }
                // 指定了 data-url 属性,ajax请求接口获取下拉菜单
                if (typeof $element.data('url') !== 'undefined') {
                    $element.append('<option value=""></option>');
                    initSelectByUrl($element)
                }
                if (mUtil.isNotBlank($element.data('value'))) {
                    $element.val($element.data('value'));
                }
                $element.selectpicker();
            }
        });
    };
    /**
     * 根据字典类型加载select > option
     *
     * @param $element {jquery object} select对象
     */
    var initDictSelect = function ($element) {
        var dictType = $element.data('dict-type');
        var dicts = mTool.getSysDictArray(dictType);
        if (dicts != null && dicts.length > 0) {
            $(dicts).each(function (index, dict) {
                $element.append('<option value="' + dict.code + '">' + dict.name + '</option>');
            });
        }
    };
    /**
     * 根据 data-url 加载select > option
     *
     * @param $element {jquery object}
     */
    var initSelectByUrl = function ($element) {
        mUtil.ajax({
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
                if (mUtil.isNotBlank($element.data('value'))) {
                    $element.val($element.data('value'));
                }
                $element.selectpicker();
            }
        });
    };
    return {
        /**
         * Main class 初始化
         */
        init: function (options) {
            if (options && options.colors) {
                colors = options.colors;
            }
            mApp.initComponents();
        },

        /**
         * 初始化组件
         */
        initComponents: function () {
            hideTouchWarning();
            initScrollers();
            initTooltips();
            initPopovers();
            initAlerts();
            initPortlets();
            initFileInput();
            initCustomTabs();
            initSelectPicker('.select-picker');
        },
        /**
         * 初始化tab工具条
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
         * @param url 页面url
         */
        closeTabByUrl: function () {
            closeTabByUrl();
        },
        /**
         * 初始化自定义Tabs
         */
        initCustomTabs: function () {
            initCustomTabs();
        },
        /**
         * 初始化 Tooltips
         */
        initTooltips: function () {
            initTooltips();
        },

        /**
         * 初始化 Tooltips
         *
         * @param {object} jquery 对象
         */
        initTooltip: function (el) {
            initTooltip(el);
        },

        /**
         * 初始化 Popovers
         */
        initPopovers: function () {
            initPopovers();
        },

        /**
         * 初始化 Popovers
         * @param {object} jquery 对象
         */
        initPopover: function (el) {
            initPopover(el);
        },

        /**
         * 初始化 Portlet
         * @param {object} jquery 对象
         */
        initPortlet: function (el, options) {
            initPortlet(el, options);
        },

        /**
         *  初始化 Portlet
         * @param {object} jquery 对象
         */
        initPortlets: function () {
            initPortlets();
        },

        /**
         * Blocks element with loading indiciator using http://malsup.com/jquery/block/
         * @param {string} target jquery 选择器
         * @param {object} options 选项
         */
        block: function (target, options) {
            var el = $(target);

            options = $.extend(true, {
                opacity: 0.03,
                overlayColor: '#000000',
                state: 'brand',
                type: 'loader',
                size: 'lg',
                centerX: true,
                centerY: true,
                message: '',
                shadow: true,
                width: 'auto'
            }, options);

            var skin;
            var state;
            var loading;

            if (options.type == 'spinner') {
                skin = options.skin ? 'm-spinner--skin-' + options.skin : '';
                state = options.state ? 'm-spinner--' + options.state : '';
                loading = '<div class="m-spinner ' + skin + ' ' + state + '"></div';
            } else {
                skin = options.skin ? 'm-loader--skin-' + options.skin : '';
                state = options.state ? 'm-loader--' + options.state : '';
                size = options.size ? 'm-loader--' + options.size : '';
                loading = '<div class="m-loader ' + skin + ' ' + state + ' ' + size + '"></div';
            }

            if (options.message && options.message.length > 0) {
                var classes = 'm-blockui ' + (options.shadow === false ? 'm-blockui-no-shadow' : '');

                html = '<div class="' + classes + '"><span>' + options.message + '</span><span>' + loading + '</span></div>';

                var el = document.createElement('div');
                mUtil.get('body').prepend(el);
                mUtil.addClass(el, classes);
                el.innerHTML = '<span>' + options.message + '</span><span>' + loading + '</span>';
                options.width = mUtil.actualWidth(el) + 10;
                mUtil.remove(el);

                if (target == 'body') {
                    html = '<div class="' + classes + '" style="margin-left:-' + (options.width / 2) + 'px;"><span>' + options.message + '</span><span>' + loading + '</span></div>';
                }
            } else {
                html = loading;
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
                        mUtil.css(el[0], 'position', '');
                        mUtil.css(el[0], 'zoom', '');
                    }
                }
            };

            if (target == 'body') {
                params.css.top = '50%';
                $.blockUI(params);
            } else {
                var el = $(target);
                el.block(params);
            }
        },

        /**
         * 移除block
         * @param {string} target jquery 选择器
         */
        unblock: function (target) {
            if (target && target != 'body') {
                $(target).unblock();
            } else {
                $.unblockUI();
            }
        },

        /**
         * 使用等待框遮住整个页面
         * @param {object} options
         */
        blockPage: function (options) {
            return mApp.block('body', options);
        },

        /**
         * 移除页面等待框
         */
        unblockPage: function () {
            return mApp.unblock('body');
        },

        /**
         * 为元素添加进度条
         * @param {string} target jquery 选择器
         * @param {object} options
         */
        progress: function (target, options) {
            var skin = (options && options.skin) ? options.skin : 'light';
            var alignment = (options && options.alignment) ? options.alignment : 'right';
            var size = (options && options.size) ? 'm-spinner--' + options.size : '';
            var classes = 'm-loader ' + 'm-loader--' + skin + ' m-loader--' + alignment + ' m-loader--' + size;

            mApp.unprogress(target);

            $(target).addClass(classes);
            $(target).data('progress-classes', classes);
        },

        /**
         * 移除元素的进度条
         * @param {string} target jquery 选择器
         */
        unprogress: function (target) {
            $(target).removeClass($(target).data('progress-classes'));
        },

        /**
         * 根据颜色名称获取颜色值
         * @param {string} name 颜色名称
         * @returns {string}
         */
        getColor: function (name) {
            return colors[name];
        },
        /**
         * 初始化bootstrap select
         * @param selector {string} 选择器
         */
        initSelectPicker: function (selector) {
            return initSelectPicker(selector);
        }
    };
}();

//== 页面加载完毕初始化mApp
$(document).ready(function () {
    mApp.init({});
});
let mDropdown = function(elementId, options) {
    //== Main object
    let the = this;

    //== 获取元素
    let element = mUtil.get(elementId);
    let body = mUtil.get('body');

    if (!element) {
        return;
    }

    //== 默认选项
    let defaultOptions = {
        toggle: 'click',
        hoverTimeout: 300,
        skin: 'light',
        height: 'auto',
        maxHeight: false,
        minHeight: false,
        persistent: false,
        mobileOverlay: true
    };

    ////////////////////////////
    // **     私有方法      ** //
    ////////////////////////////

    let Plugin = {
        /**
         * Run plugin
         * @returns {mdropdown}
         */
        construct: function(options) {
            if (mUtil.data(element).has('dropdown')) {
                the = mUtil.data(element).get('dropdown');
            } else {
                // reset dropdown
                Plugin.init(options);

                Plugin.setup();

                mUtil.data(element).set('dropdown', the);
            }

            return the;
        },

        /**
         * Handles subdropdown click toggle
         * @returns {mdropdown}
         */
        init: function(options) {
            // merge default and user defined options
            the.options = mUtil.deepExtend({}, defaultOptions, options);
            the.events = [];
            the.eventHandlers = {};
            the.open = false;
            
            the.layout = {};
            the.layout.close = mUtil.find(element, '.m-dropdown__close');
            the.layout.toggle = mUtil.find(element, '.m-dropdown__toggle');
            the.layout.arrow = mUtil.find(element, '.m-dropdown__arrow');
            the.layout.wrapper = mUtil.find(element, '.m-dropdown__wrapper');
            the.layout.defaultDropPos = mUtil.hasClass(element, 'm-dropdown--up') ? 'up' : 'down';
            the.layout.currentDropPos = the.layout.defaultDropPos;

            if (mUtil.attr(element, 'm-dropdown-toggle') == "hover") {
                the.options.toggle = 'hover';
            }
        },

        /**
         * Setup dropdown
         */
        setup: function() {
            if (the.options.placement) {
                mUtil.addClass(element, 'm-dropdown--' + the.options.placement);
            }

            if (the.options.align) {
                mUtil.addClass(element, 'm-dropdown--align-' + the.options.align);
            }

            if (the.options.width) {
                mUtil.css(the.layout.wrapper, 'width', the.options.width + 'px');
            }

            if (mUtil.attr(element, 'm-dropdown-persistent') == '1') {
                the.options.persistent = true;
            }

            if (the.options.toggle == 'hover') {    
                mUtil.addEvent(element, 'mouseout', Plugin.hideMouseout);
            } 

            // set zindex
            Plugin.setZindex();
        },

        /**
         * Toggle dropdown
         */
        toggle: function() {
            if (the.open) {
                return Plugin.hide();
            } else {
                return Plugin.show();
            }
        },

        /**
         * Set content
         */
        setContent: function(content) {
            mUtil.find(element, '.m-dropdown__content').innerHTML = content;
            return the;
        },

        /**
         * Show dropdown
         */
        show: function() {
            if (the.options.toggle === 'hover' && mUtil.hasAttr(element, 'hover')) {
                Plugin.clearHovered();
                return the;
            }

            if (the.open) {
                return the;
            }

            if (the.layout.arrow) {
                Plugin.adjustArrowPos();
            }

            Plugin.eventTrigger('beforeShow');

            Plugin.hideOpened();

            mUtil.addClass(element, 'm-dropdown--open');

            if (mUtil.isMobileDevice() && the.options.mobileOverlay) {
                let zIndex = mUtil.css(element, 'z-index') - 1;

                let dropdownoff = mUtil.insertAfter(document.createElement('DIV'), element );

                mUtil.addClass(dropdownoff, 'm-dropdown__dropoff');
                mUtil.css(dropdownoff, 'z-index', zIndex);
                mUtil.data(dropdownoff).set('dropdown', element);
                mUtil.data(element).set('dropoff', dropdownoff);

                mUtil.addEvent(dropdownoff, 'click', function(e) {
                    Plugin.hide();
                    mUtil.remove(this);
                    e.preventDefault();
                });
            }

            element.focus();
            element.setAttribute('aria-expanded', 'true');
            the.open = true;

            //== Update scrollers
            mUtil.scrollersUpdate(element);

            Plugin.eventTrigger('afterShow');

            return the;
        },

        /**
         * Clear dropdown hover
         */
        clearHovered: function() {
            let timeout = mUtil.attr(element, 'timeout');

            mUtil.removeAttr(element, 'hover');            
            mUtil.removeAttr(element, 'timeout');

            clearTimeout(timeout);
        },

        /**
         * Hide hovered dropdown
         */
        hideHovered: function(force) {
            if (force === true) {
                if (Plugin.eventTrigger('beforeHide') === false) {
                    return;
                }

                Plugin.clearHovered();
                mUtil.removeClass(element, 'm-dropdown--open');
                the.open = false;
                Plugin.eventTrigger('afterHide');
            } else {
                if (mUtil.hasAttr(element, 'hover') === true) {
                    return;
                }

                if (Plugin.eventTrigger('beforeHide') === false) {
                    return;
                }

                let timeout = setTimeout(function() {
                    if (mUtil.attr(element, 'hover')) {
                        Plugin.clearHovered();
                        mUtil.removeClass(element, 'm-dropdown--open');
                        the.open = false;
                        Plugin.eventTrigger('afterHide');
                    }
                }, the.options.hoverTimeout);

                mUtil.attr(element, 'hover', '1');            
                mUtil.attr(element, 'timeout', timeout);
            }
        },

        /**
         * Hide clicked dropdown
         */
        hideClicked: function() {
            if (Plugin.eventTrigger('beforeHide') === false) {
                return;
            }

            mUtil.removeClass(element, 'm-dropdown--open');
            mUtil.data(element).remove('dropoff');
            the.open = false;
            Plugin.eventTrigger('afterHide');
        },

        /**
         * Hide dropdown
         */
        hide: function(force) {
            if (the.open === false) {
                return the;
            }

            if (mUtil.isDesktopDevice() && the.options.toggle == 'hover') {
                Plugin.hideHovered(force);
            } else {
                Plugin.hideClicked();
            }

            if (the.layout.defaultDropPos == 'down' && the.layout.currentDropPos == 'up') {
                mUtil.removeClass(element, 'm-dropdown--up');
                the.layout.arrow.prependTo(the.layout.wrapper);
                the.layout.currentDropPos = 'down';
            }

            return the;
        },

        /**
         * Hide on mouseout
         */
        hideMouseout: function() {
            if (mUtil.isDesktopDevice()) {
                Plugin.hide();
            }
        },

        /**
         * Hide opened dropdowns
         */
        hideOpened: function() {
            let query = mUtil.findAll(body, '.m-dropdown.m-dropdown--open');
            
            for (let i = 0, j = query.length; i < j; i++) {
                let dropdown = query[i];
                mUtil.data(dropdown).get('dropdown').hide(true);
            }
        },

        /**
         * Adjust dropdown arrow positions
         */
        adjustArrowPos: function() {
            let width = mUtil.outerWidth(element); // ?

            let alignment = mUtil.hasClass(the.layout.arrow, 'm-dropdown__arrow--right') ? 'right' : 'left';
            let pos = 0;

            if (the.layout.arrow) {
                if ( mUtil.isInResponsiveRange('mobile') && mUtil.hasClass(element, 'm-dropdown--mobile-full-width') ) {
                    pos = mUtil.offset(element).left + (width / 2) - Math.abs( parseInt(mUtil.css(the.layout.arrow, 'width')) / 2) - parseInt(mUtil.css(the.layout.wrapper, 'left'));
                    
                    mUtil.css(the.layout.arrow, 'right', 'auto');
                    mUtil.css(the.layout.arrow, 'left', pos + 'px');
                    
                    mUtil.css(the.layout.arrow, 'margin-left', 'auto');
                    mUtil.css(the.layout.arrow, 'margin-right', 'auto');
                } else if (mUtil.hasClass(the.layout.arrow, 'm-dropdown__arrow--adjust')) {
                    pos = width / 2 - Math.abs( parseInt(mUtil.css(the.layout.arrow, 'width')) / 2);
                    if (mUtil.hasClass(element, 'm-dropdown--align-push')) {
                        pos = pos + 20;
                    }

                    if (alignment == 'right') {
                        if (mUtil.isRTL()) {
                            mUtil.css(the.layout.arrow, 'right', 'auto');
                            mUtil.css(the.layout.arrow, 'left', pos + 'px');
                        } else {
                            mUtil.css(the.layout.arrow, 'left', 'auto');
                            mUtil.css(the.layout.arrow, 'right', pos + 'px');
                        }
                    } else {
                        if (mUtil.isRTL()) {
                            mUtil.css(the.layout.arrow, 'left', 'auto');
                            mUtil.css(the.layout.arrow, 'right', pos + 'px');
                        } else {
                            mUtil.css(the.layout.arrow, 'right', 'auto');
                            mUtil.css(the.layout.arrow, 'left', pos + 'px');
                        }                       
                    }
                }
            }
        },

        /**
         * Get zindex
         */
        setZindex: function() {
            let zIndex = 101; //mUtil.css(the.layout.wrapper, 'z-index');
            let newZindex = mUtil.getHighestZindex(element);
            if (newZindex >= zIndex) {
                zIndex = newZindex + 1;
            }
            
            mUtil.css(the.layout.wrapper, 'z-index', zIndex);
        },

        /**
         * Check persistent
         */
        isPersistent: function() {
            return the.options.persistent;
        },

        /**
         * Check persistent
         */
        isShown: function() {
            return the.open;
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name, args) {
            for (let i = 0; i < the.events.length; i++) {
                let event = the.events[i];
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
     * Show dropdown
     * @returns {mDropdown}
     */
    the.show = function() {
        return Plugin.show();
    };

    /**
     * Hide dropdown
     * @returns {mDropdown}
     */
    the.hide = function() {
        return Plugin.hide();
    };

    /**
     * Toggle dropdown
     * @returns {mDropdown}
     */
    the.toggle = function() {
        return Plugin.toggle();
    };

    /**
     * Toggle dropdown
     * @returns {mDropdown}
     */
    the.isPersistent = function() {
        return Plugin.isPersistent();
    };

    /**
     * Check shown state
     * @returns {mDropdown}
     */
    the.isShown = function() {
        return Plugin.isShown();
    };

    /**
     * Set dropdown content
     * @returns {mDropdown}
     */
    the.setContent = function(content) {
        return Plugin.setContent(content);
    };

    /**
     * Register event
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Register event
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    //== Run plugin
    Plugin.construct.apply(the, [options]);

    //== Init done
    init = true;

    // Return plugin instance
    return the;
};

//== Plugin global lazy initialization
mUtil.on(document, '[m-dropdown-toggle="click"] .m-dropdown__toggle', 'click', function(e) {
    let element = this.closest('.m-dropdown');  
    let dropdown;

    if (element) {
        if (mUtil.data(element).has('dropdown')) {
            dropdown = mUtil.data(element).get('dropdown');
        } else {                 
            dropdown = new mDropdown(element);
        }             

        dropdown.toggle();

        e.preventDefault();
    } 
});

mUtil.on(document, '[m-dropdown-toggle="hover"] .m-dropdown__toggle', 'click', function(e) {
    if (mUtil.isDesktopDevice()) {
        if (mUtil.attr(this, 'href') == '#') {
            e.preventDefault();
        }
    } else if (mUtil.isMobileDevice()) {
        let element = this.closest('.m-dropdown');
        let dropdown;

        if (element) {
            if (mUtil.data(element).has('dropdown')) {
                dropdown = mUtil.data(element).get('dropdown');
            } else {                        
                dropdown = new mDropdown(element);
            }  

            dropdown.toggle();

            e.preventDefault();
        }
    }
});

mUtil.on(document, '[m-dropdown-toggle="hover"]', 'mouseover', function(e) {
    if (mUtil.isDesktopDevice()) {
        let element = this;
        let dropdown;

        if (element) {
            if (mUtil.data(element).has('dropdown')) {
                dropdown = mUtil.data(element).get('dropdown');
            } else {                        
                dropdown = new mDropdown(element);
            }              

            dropdown.show();

            e.preventDefault();
        }
    }
});

document.addEventListener("click", function(e) {
    let query;
    let body = mUtil.get('body');
    let target = e.target;

    //== Handle dropdown close
    if (query = body.querySelectorAll('.m-dropdown.m-dropdown--open')) {
        for (let i = 0, len = query.length; i < len; i++) {
            let element = query[i];
            if (mUtil.data(element).has('dropdown') === false) {
                return;
            }

            let the = mUtil.data(element).get('dropdown');
            let toggle = mUtil.find(element, '.m-dropdown__toggle');

            if (mUtil.hasClass(element, 'm-dropdown--disable-close')) {
                e.preventDefault();
                e.stopPropagation();
                //return;
            }

            if (toggle && target !== toggle && toggle.contains(target) === false && target.contains(toggle) === false) {
                if (element.contains(target) === false) {
                    if (the.isPersistent() === true) {
                        the.hide();
                    } else {
                        the.hide();
                    }
               }
            } else if (element.contains(target) === false) {
                the.hide();
            }
        }
    }
});
/**
 * 为类型添加一些自定义方法
 */

/**
 * 为string类型添加替换全部方法
 * @param s1 替换前字符串
 * @param s2 要替换为的字符串
 * @return {string} 替换后的字符串
 */
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
};
let mHeader = function(elementId, options) {
    //== Main object
    let the = this;
    let init = false;

    //== 获取元素
    let element = mUtil.get(elementId);
    let body = mUtil.get('body');

    if (element === undefined) {
        return;
    }

    //== 默认选项
    let defaultOptions = {
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
    // **    私有方法     ** //
    ////////////////////////////

    let Plugin = {
        /**
         * Run plugin
         * @returns {mHeader}
         */
        construct: function(options) {
            if (mUtil.data(element).has('header')) {
                the = mUtil.data(element).get('header');
            } else {
                // reset header
                Plugin.init(options);

                // build header
                Plugin.build();

                mUtil.data(element).set('header', the);
            }

            return the;
        },

        /**
         * Handles subheader click toggle
         * @returns {mHeader}
         */
        init: function(options) {
            the.events = [];

            // merge default and user defined options
            the.options = mUtil.deepExtend({}, defaultOptions, options);
        },

        /**
         * Reset header
         * @returns {mHeader}
         */
        build: function() {
            let lastScrollTop = 0;

            if (the.options.minimize.mobile === false && the.options.minimize.desktop === false) {
                return;
            }

            window.addEventListener('scroll', function() {
                let offset = 0, on, off, st;

                if (mUtil.isInResponsiveRange('desktop')) {
                    offset = the.options.offset.desktop;
                    on = the.options.minimize.desktop.on;
                    off = the.options.minimize.desktop.off;
                } else if (mUtil.isInResponsiveRange('tablet-and-mobile')) {
                    offset = the.options.offset.mobile;
                    on = the.options.minimize.mobile.on;
                    off = the.options.minimize.mobile.off;
                }

                st = window.pageYOffset;

                if (
                    (mUtil.isInResponsiveRange('tablet-and-mobile') && the.options.classic && the.options.classic.mobile) ||
                    (mUtil.isInResponsiveRange('desktop') && the.options.classic && the.options.classic.desktop)

                ) {
                    if (st > offset) { // down scroll mode
                        mUtil.addClass(body, on);
                        mUtil.removeClass(body, off);
                    } else { // back scroll mode
                        mUtil.addClass(body, off);
                        mUtil.removeClass(body, on);
                    }
                } else {
                    if (st > offset && lastScrollTop < st) { // down scroll mode
                        mUtil.addClass(body, on);
                        mUtil.removeClass(body, off);
                    } else { // back scroll mode
                        mUtil.addClass(body, off);
                        mUtil.removeClass(body, on);
                    }

                    lastScrollTop = st;
                }
            });
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name, args) {
            for (let i = 0; i < the.events.length; i++) {
                let event = the.events[i];
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
    // **     开放方法    ** //
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

    //== Run plugin
    Plugin.construct.apply(the, [options]);

    //== Init done
    init = true;

    // Return plugin instance
    return the;
};
let mMenu = function(elementId, options) {
    //== Main object
    let the = this;
    let init = false;

    //== 获取元素
    let element = mUtil.get(elementId);
    let body = mUtil.get('body');

    if (!element) {
        return;
    }

    //== 默认选项
    let defaultOptions = {
        // accordion submenu mode
        accordion: {
            slideSpeed: 200, // 滑动速度 (单位: 毫秒)
            autoScroll: false, // enable auto scrolling(focus) to the clicked menu item
            autoScrollSpeed: 1200,
            expandAll: true // 菜单中允许包含子菜单
        },

        // dropdown submenu mode
        dropdown: {
            timeout: 500 // timeout in milliseconds to show and hide the hoverable submenu dropdown
        }
    };

    ////////////////////////////
    // **     私有方法      ** //
    ////////////////////////////

    let Plugin = {
        /**
         * Run plugin
         * @returns {mMenu}
         */
        construct: function(options) {
            if (mUtil.data(element).has('menu')) {
                the = mUtil.data(element).get('menu');
            } else {
                // reset menu
                Plugin.init(options);

                // reset menu
                Plugin.reset();

                // build menu
                Plugin.build();

                mUtil.data(element).set('menu', the);
            }

            return the;
        },

        /**
         * Handles submenu click toggle
         * @returns {mMenu}
         */
        init: function(options) {
            the.events = [];

            the.eventHandlers = {};

            // merge default and user defined options
            the.options = mUtil.deepExtend({}, defaultOptions, options);

            // pause menu
            the.pauseDropdownHoverTime = 0;

            the.uid = mUtil.getUniqueID();
        },
        /**
         * 更改默认选项
         *
         * @param options
         */
        update: function(options) {
            // 合并默认选项
            the.options = mUtil.deepExtend({}, defaultOptions, options);

            // 暂停菜单
            the.pauseDropdownHoverTime = 0;

             // 重置菜单
            Plugin.reset();

            the.eventHandlers = {};

            // 构建菜单
            Plugin.build();

            mUtil.data(element).set('menu', the);
        },
        /**
         * 重新加载
         */
        reload: function() {
            // 重置菜单
            Plugin.reset();

            // 构建菜单
            Plugin.build();
        },

        /**
         * 构建菜单
         * @returns {mMenu}
         */
        build: function() {
            //== General accordion submenu toggle
            the.eventHandlers['event_1'] = mUtil.on( element, '.m-menu__toggle', 'click', Plugin.handleSubmenuAccordion);

            //== Dropdown mode(hoverable)
            if (Plugin.getSubmenuMode() === 'dropdown' || Plugin.isConditionalSubmenuDropdown()) {
                // dropdown submenu - hover toggle
                the.eventHandlers['event_2'] = mUtil.on( element, '[m-menu-submenu-toggle="hover"]', 'mouseover', Plugin.handleSubmenuDrodownHoverEnter);
                the.eventHandlers['event_3'] = mUtil.on( element, '[m-menu-submenu-toggle="hover"]', 'mouseout', Plugin.handleSubmenuDrodownHoverExit);

                // dropdown submenu - click toggle
                the.eventHandlers['event_4'] = mUtil.on( element, '[m-menu-submenu-toggle="click"] > .m-menu__toggle, [m-menu-submenu-toggle="click"] > .m-menu__link .m-menu__toggle', 'click', Plugin.handleSubmenuDropdownClick);
                the.eventHandlers['event_5'] = mUtil.on( element, '[m-menu-submenu-toggle="tab"] > .m-menu__toggle, [m-menu-submenu-toggle="tab"] > .m-menu__link .m-menu__toggle', 'click', Plugin.handleSubmenuDropdownTabClick);
            }

            //== General link click
            the.eventHandlers['event_6'] = mUtil.on(element, '.m-menu__item:not(.m-menu__item--submenu) > .m-menu__link:not(.m-menu__toggle):not(.m-menu__link--toggle-skip)', 'click', Plugin.handleLinkClick);

            //== Init scrollable menu
            if (the.options.scroll && the.options.scroll.height) {
                Plugin.scrollerInit();
            }
        },

        /**
         * 重置菜单
         * @returns {mMenu}
         */
        reset: function() { 
            mUtil.off( element, 'click', the.eventHandlers['event_1']);

            // dropdown submenu - hover toggle
            mUtil.off( element, 'mouseover', the.eventHandlers['event_2']);
            mUtil.off( element, 'mouseout', the.eventHandlers['event_3']);

            // dropdown submenu - click toggle
            mUtil.off( element, 'click', the.eventHandlers['event_4']);
            mUtil.off( element, 'click', the.eventHandlers['event_5']);
            
            mUtil.off(element, 'click', the.eventHandlers['event_6']);
        },

        /**
         * 初始化菜单滚动条
         *
        */
        scrollerInit: function() {
            if ( the.options.scroll && the.options.scroll.height ) {
                mUtil.scrollerDestroy(element);
                mUtil.scrollerInit(element, {disableForMobile: true, resetHeightOnDestroy: true, handleWindowResize: true, height: the.options.scroll.height});
            }            
        },

        /**
         * 更新菜单滚动条
        */
        scrollerUpdate: function() {
            if ( the.options.scroll && the.options.scroll.height ) {
                mUtil.scrollerUpdate(element);
            } else {
                mUtil.scrollerDestroy(element);
            }
        },

        /**
         * 滚动到顶部
        */
        scrollerTop: function() {
            if ( the.options.scroll && the.options.scroll.height ) {
                mUtil.scrollerTop(element);
            }
        },

        /**
         * 根据当前窗口与菜单状态获取菜单模式
         * @returns {mMenu}
         */
        getSubmenuMode: function(el) {
            if ( mUtil.isInResponsiveRange('desktop') ) {
                if (el && mUtil.hasAttr(el, 'm-menu-submenu-toggle')) {
                    return mUtil.attr(el, 'm-menu-submenu-toggle');
                }

                if ( mUtil.isset(the.options.submenu, 'desktop.state.body') ) {
                    if ( mUtil.hasClass(body, the.options.submenu.desktop.state.body) ) {
                        return the.options.submenu.desktop.state.mode;
                    } else {
                        return the.options.submenu.desktop.default;
                    }
                } else if ( mUtil.isset(the.options.submenu, 'desktop') ) {
                    return the.options.submenu.desktop;
                }
            } else if ( mUtil.isInResponsiveRange('tablet') && mUtil.isset(the.options.submenu, 'tablet') ) {
                return the.options.submenu.tablet;
            } else if ( mUtil.isInResponsiveRange('mobile') && mUtil.isset(the.options.submenu, 'mobile') ) {
                return the.options.submenu.mobile;
            } else {
                return false;
            }
        },

        /**
         * 根据当前窗口与菜单状态获取菜单模式
         * @returns {mMenu}
         */
        isConditionalSubmenuDropdown: function() {
            if ( mUtil.isInResponsiveRange('desktop') && mUtil.isset(the.options.submenu, 'desktop.state.body') ) {
                return true;
            } else {
                return false;
            }
        },

        /**
         * 点击菜单链接
         * @returns {mMenu}
         */
        handleLinkClick: function(e) {
            if ( Plugin.eventTrigger('linkClick', this) === false ) {
                e.preventDefault();
            };

            if ( Plugin.getSubmenuMode(this) === 'dropdown' || Plugin.isConditionalSubmenuDropdown() ) {
                Plugin.handleSubmenuDropdownClose(e, this);
            }
        },

        /**
         * 菜单悬停
         * @returns {mMenu}
         */
        handleSubmenuDrodownHoverEnter: function(e) {
            if ( Plugin.getSubmenuMode(this) === 'accordion' ) {
                return;
            }

            if ( the.resumeDropdownHover() === false ) {
                return;
            }

            let item = this;

            if ( item.getAttribute('data-hover') == '1' ) {
                item.removeAttribute('data-hover');
                clearTimeout( item.getAttribute('data-timeout') );
                item.removeAttribute('data-timeout');
                //Plugin.hideSubmenuDropdown(item, false);
            }

            Plugin.showSubmenuDropdown(item);
        },

        /**
         * 菜单悬停
         * @returns {mMenu}
         */
        handleSubmenuDrodownHoverExit: function(e) {
            if ( the.resumeDropdownHover() === false ) {
                return;
            }

            if ( Plugin.getSubmenuMode(this) === 'accordion' ) {
                return;
            }

            let item = this;
            let time = the.options.dropdown.timeout;

            let timeout = setTimeout(function() {
                if ( item.getAttribute('data-hover') == '1' ) {
                    Plugin.hideSubmenuDropdown(item, true);
                } 
            }, time);

            item.setAttribute('data-hover', '1');
            item.setAttribute('data-timeout', timeout);  
        },

        /**
         * 点击打开子菜单
         * @returns {mMenu}
         */
        handleSubmenuDropdownClick: function(e) {
            if ( Plugin.getSubmenuMode(this) === 'accordion' ) {
                return;
            }
 
            let item = this.closest('.m-menu__item');

            if ( item.getAttribute('m-menu-submenu-mode') == 'accordion' ) {
                return;
            }

            if ( mUtil.hasClass(item, 'm-menu__item--hover') === false ) {
                mUtil.addClass(item, 'm-menu__item--open-dropdown');
                Plugin.showSubmenuDropdown(item);
            } else {
                mUtil.removeClass(item, 'm-menu__item--open-dropdown' );
                Plugin.hideSubmenuDropdown(item, true);
            }

            e.preventDefault();
        },

        /**
         * Handles tab click toggle
         * @returns {mMenu}
         */
        handleSubmenuDropdownTabClick: function(e) {
            if (Plugin.getSubmenuMode(this) === 'accordion') {
                return;
            }

            let item = this.closest('.m-menu__item');

            if (item.getAttribute('m-menu-submenu-mode') == 'accordion') {
                return;
            }

            if (mUtil.hasClass(item, 'm-menu__item--hover') == false) {
                mUtil.addClass(item, 'm-menu__item--open-dropdown');
                Plugin.showSubmenuDropdown(item);
            }

            e.preventDefault();
        },

        /**
         * Handles submenu dropdown close on link click
         * @returns {mMenu}
         */
        handleSubmenuDropdownClose: function(e, el) {
            // exit if its not submenu dropdown mode
            if (Plugin.getSubmenuMode(el) === 'accordion') {
                return;
            }

            let shown = element.querySelectorAll('.m-menu__item.m-menu__item--submenu.m-menu__item--hover:not(.m-menu__item--tabs)');

            // check if currently clicked link's parent item ha
            if (shown.length > 0 && mUtil.hasClass(el, 'm-menu__toggle') === false && el.querySelectorAll('.m-menu__toggle').length === 0) {
                // 关闭打开的子菜单
                for (let i = 0, len = shown.length; i < len; i++) {
                    Plugin.hideSubmenuDropdown(shown[0], true);
                }
            }
        },

        /**
         * 帮助函数
         *
         * @returns {mMenu}
         */
        handleSubmenuAccordion: function(e, el) {
            let query;
            let item = el ? el : this;

            if ( Plugin.getSubmenuMode(el) === 'dropdown' && (query = item.closest('.m-menu__item') ) ) {
                if (query.getAttribute('m-menu-submenu-mode') != 'accordion' ) {
                    e.preventDefault();
                    return;
                }
            }

            let li = item.closest('.m-menu__item');
            let submenu = mUtil.child(li, '.m-menu__submenu, .m-menu__inner');

            if (mUtil.hasClass(item.closest('.m-menu__item'), 'm-menu__item--open-always')) {
                return;
            }

            if ( li && submenu ) {
                e.preventDefault();
                let speed = the.options.accordion.slideSpeed;
                let hasClosables = false;

                if ( mUtil.hasClass(li, 'm-menu__item--open') === false ) {
                    // hide other accordions                    
                    if ( the.options.accordion.expandAll === false ) {
                        let subnav = item.closest('.m-menu__nav, .m-menu__subnav');
                        let closables = mUtil.children(subnav, '.m-menu__item.m-menu__item--open.m-menu__item--submenu:not(.m-menu__item--expanded):not(.m-menu__item--open-always)');

                        if ( subnav && closables ) {
                            for (let i = 0, len = closables.length; i < len; i++) {
                                let el_ = closables[0];
                                let submenu_ = mUtil.child(el_, '.m-menu__submenu');
                                if ( submenu_ ) {
                                    mUtil.slideUp(submenu_, speed, function() {
                                        Plugin.scrollerUpdate();
                                        mUtil.removeClass(el_, 'm-menu__item--open');
                                    });                    
                                }
                            }
                        }
                    }

                    mUtil.slideDown(submenu, speed, function() {
                        Plugin.scrollToItem(item);
                        Plugin.scrollerUpdate();
                        
                        Plugin.eventTrigger('submenuToggle', submenu);
                    });
                
                    mUtil.addClass(li, 'm-menu__item--open');

                } else {
                    mUtil.slideUp(submenu, speed, function() {
                        Plugin.scrollToItem(item);
                        Plugin.eventTrigger('submenuToggle', submenu);
                    });

                    mUtil.removeClass(li, 'm-menu__item--open');       
                }
            }
        },

        /**
         * scroll to item function
         * @returns {mMenu}
         */
        scrollToItem: function(item) {
            // handle auto scroll for accordion submenus
            if ( mUtil.isInResponsiveRange('desktop') && the.options.accordion.autoScroll && element.getAttribute('m-menu-scrollable') !== '1' ) {
                mUtil.scrollTo(item, the.options.accordion.autoScrollSpeed);
            }
        },

        /**
         * helper functions
         * @returns {mMenu}
         */
        hideSubmenuDropdown: function(item, classAlso) {
            // remove submenu activation class
            if ( classAlso ) {
                mUtil.removeClass(item, 'm-menu__item--hover');
                mUtil.removeClass(item, 'm-menu__item--active-tab');
            }

            // clear timeout
            item.removeAttribute('data-hover');

            if ( item.getAttribute('m-menu-dropdown-toggle-class') ) {
                mUtil.removeClass(body, item.getAttribute('m-menu-dropdown-toggle-class'));
            }

            let timeout = item.getAttribute('data-timeout');
            item.removeAttribute('data-timeout');
            clearTimeout(timeout);
        },

        /**
         * helper functions
         * @returns {mMenu}
         */
        showSubmenuDropdown: function(item) {
            // close active submenus
            let list = element.querySelectorAll('.m-menu__item--submenu.m-menu__item--hover, .m-menu__item--submenu.m-menu__item--active-tab');

            if ( list ) {
                for (let i = 0, len = list.length; i < len; i++) {
                    let el = list[i];
                    if ( item !== el && el.contains(item) === false && item.contains(el) === false ) {
                        Plugin.hideSubmenuDropdown(el, true);
                    }
                }
            } 

            // adjust submenu position
            Plugin.adjustSubmenuDropdownArrowPos(item);

            // add submenu activation class
            mUtil.addClass(item, 'm-menu__item--hover');
            
            if ( item.getAttribute('m-menu-dropdown-toggle-class') ) {
                mUtil.addClass(body, item.getAttribute('m-menu-dropdown-toggle-class'));
            }
        },

        /**
         * Handles submenu slide toggle
         * @returns {mMenu}
         */
        createSubmenuDropdownClickDropoff: function(el) {
            let query;
            let zIndex = (query = mUtil.child(el, '.m-menu__submenu') ? mUtil.css(query, 'z-index') : 0) - 1;

            let dropoff = document.createElement('<div class="m-menu__dropoff" style="background: transparent; position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: ' + zIndex + '"></div>');

            body.appendChild(dropoff);

            mUtil.addEvent(dropoff, 'click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                mUtil.remove(this);
                Plugin.hideSubmenuDropdown(el, true);
            });
        },

        /**
         * Handles submenu click toggle
         * @returns {mMenu}
         */
        adjustSubmenuDropdownArrowPos: function(item) {
            let submenu = mUtil.child(item, '.m-menu__submenu');
            let arrow = mUtil.child( submenu, '.m-menu__arrow.m-menu__arrow--adjust');
            let subnav = mUtil.child( submenu, '.m-menu__subnav');

            if ( arrow ) { 
                let pos = 0;
                let link = mUtil.child(item, '.m-menu__link');

                if ( mUtil.hasClass(submenu, 'm-menu__submenu--classic') || mUtil.hasClass(submenu, 'm-menu__submenu--fixed') ) {
                    if ( mUtil.hasClass(submenu, 'm-menu__submenu--right')) {
                        pos = mUtil.outerWidth(item) / 2;
                        if (mUtil.hasClass(submenu, 'm-menu__submenu--pull')) {
                            if (mUtil.isRTL()) {
                                pos = pos + Math.abs( parseFloat(mUtil.css(submenu, 'margin-left')) );
                            } else {
                                pos = pos + Math.abs( parseFloat(mUtil.css(submenu, 'margin-right')) );
                            }
                        }
                        pos = parseInt(mUtil.css(submenu, 'width')) - pos;
                    } else if ( mUtil.hasClass(submenu, 'm-menu__submenu--left') ) {
                        pos = mUtil.outerWidth(item) / 2;
                        if ( mUtil.hasClass(submenu, 'm-menu__submenu--pull')) {
                            if (mUtil.isRTL()) {
                                pos = pos + Math.abs( parseFloat(mUtil.css(submenu, 'margin-right')) );
                            } else {
                                pos = pos + Math.abs( parseFloat(mUtil.css(submenu, 'margin-left')) );
                            }
                        }
                    }

                    if (mUtil.isRTL()) {
                        mUtil.css(arrow, 'right', pos + 'px');  
                    } else {
                        mUtil.css(arrow, 'left', pos + 'px');  
                    }
                } else {
                    if ( mUtil.hasClass(submenu, 'm-menu__submenu--center') || mUtil.hasClass(submenu, 'm-menu__submenu--full') ) {
                        pos = mUtil.offset(item).left - ((mUtil.getViewPort().width - parseInt(mUtil.css(submenu, 'width'))) / 2);
                        pos = pos + (mUtil.outerWidth(item) / 2);

                        mUtil.css(arrow, 'left', pos + 'px');
                        if (mUtil.isRTL()) {
                            mUtil.css(arrow, 'right', 'auto');
                        }                        
                    }
                }
            }
        },

        /**
         * Handles submenu hover toggle
         * @returns {mMenu}
         */
        pauseDropdownHover: function(time) {
            let date = new Date();

            the.pauseDropdownHoverTime = date.getTime() + time;
        },

        /**
         * Handles submenu hover toggle
         * @returns {mMenu}
         */
        resumeDropdownHover: function() {
            let date = new Date();

            return (date.getTime() > the.pauseDropdownHoverTime ? true : false);
        },

        /**
         * 重置当前选中菜单
         * @returns {mMenu}
         */
        resetActiveItem: function(item) {
            let list;
            let parents;

            list = element.querySelectorAll('.m-menu__item--active');
            
            for (let i = 0, len = list.length; i < len; i++) {
                let el = list[0];
                mUtil.removeClass(el, 'm-menu__item--active');
                mUtil.hide( mUtil.child(el, '.m-menu__submenu') );
                parents = mUtil.parents(el, '.m-menu__item--submenu');

                for (let i_ = 0, len_ = parents.length; i_ < len_; i_++) {
                    let el_ = parents[i];
                    mUtil.removeClass(el_, 'm-menu__item--open');
                    mUtil.hide( mUtil.child(el_, '.m-menu__submenu') );
                }
            }

            // 关闭打开的子菜单
            if ( the.options.accordion.expandAll === false ) {
                if ( list = element.querySelectorAll('.m-menu__item--open') ) {
                    for (let i = 0, len = list.length; i < len; i++) {
                        mUtil.removeClass(parents[0], 'm-menu__item--open');
                    }
                }
            }
        },

        /**
         * 设置激活菜单
         * @returns {mMenu} element 对象
         */
        setActiveItem: function(item) {
            // 重置当前激活菜单
            Plugin.resetActiveItem();

            mUtil.addClass(item, 'm-menu__item--active');
            
            let parents = mUtil.parents(item, '.m-menu__item--submenu');
            for (let i = 0, len = parents.length; i < len; i++) {
                mUtil.addClass(parents[i], 'm-menu__item--open');
            }
        },

        /**
         * 根据菜单获取面包屑导航
         * @returns {mMenu}
         */
        getBreadcrumbs: function(item) {
            let query;
            let breadcrumbs = [];
            let link = mUtil.child(item, '.m-menu__link');
            query = mUtil.child(link, '.m-menu__link-text');

            breadcrumbs.push({
                text: ( query ? query.innerHTML : ''),
                title: link.getAttribute('title'),
                href: link.getAttribute('href')
            });

            let parents = mUtil.parents(item, '.m-menu__item--submenu');
            for (let i = 0, len = parents.length; i < len; i++) {
                let submenuLink = mUtil.child(parents[i], '.m-menu__link');

                breadcrumbs.push({
                    text: (query = mUtil.child(submenuLink, '.m-menu__link-text') ? query.innerHTML : ''),
                    title: submenuLink.getAttribute('title'),
                    href: submenuLink.getAttribute('href')
                });
            }

            return  breadcrumbs.reverse();
        },

        /**
         * 根据菜单获取页面名称
         * @returns {mMenu}
         */
        getPageTitle: function(item) {
            let query;

            return (query = mUtil.child(item, '.m-menu__link-text') ? query.innerHTML : '');
        },

        /**
         * 触发事件
         */
        eventTrigger: function(name, args) {
            for (let i = 0; i < the.events.length; i++ ) {
                let event = the.events[i];
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
        /**
         * 添加事件
         * @param name
         * @param handler
         * @param one
         */
        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });
        },
        /**
         * 移除事件
         * @param name
         */
        removeEvent: function(name) {
            if (the.events[name]) {
                delete the.events[name];
            }
        }
    };

    //////////////////////////
    // **     开放方法    ** //
    //////////////////////////

    /**
     * 设置默认选项
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * 更新滚动条
     */
    the.scrollerUpdate = function() {
        return Plugin.scrollerUpdate();
    };

    /**
     * 滚动到顶部
     */
    the.scrollerTop = function() {
        return Plugin.scrollerTop();
    };

    /**
     * 设置选中菜单
     */
    the.setActiveItem = function(item) {
        return Plugin.setActiveItem(item);
    };
    /**
     * 重新加载菜单
     * @returns {*|void}
     */
    the.reload = function() {
        return Plugin.reload();
    };
    /**
     * 更新默认选项
     *
     * @param options {object} 选项
     * @returns {*|void}
     */
    the.update = function(options) {
        return Plugin.update(options);
    };

    /**
     * 根据菜单获取面包屑导航
     */
    the.getBreadcrumbs = function(item) {
        return Plugin.getBreadcrumbs(item);
    };

    /**
     * 根据菜单获取页面名称
     */
    the.getPageTitle = function(item) {
        return Plugin.getPageTitle(item);
    };

    /**
     * 获取子菜单
     */
    the.getSubmenuMode = function(el) {
        return Plugin.getSubmenuMode(el);
    };

    /**
     * 隐藏下拉子菜单
     * @returns {jQuery}
     */
    the.hideDropdown = function(item) {
        Plugin.hideSubmenuDropdown(item, true);
    };

    /**
     * 在指定时间前,禁用菜单
     * @param time 时间(时间戳)
     */
    the.pauseDropdownHover = function(time) {
        Plugin.pauseDropdownHover(time);
    };

    /**
     * 禁用菜单直到超过pauseDropdownHover指定的时间
     * @returns {jQuery}
     */
    the.resumeDropdownHover = function() {
        return Plugin.resumeDropdownHover();
    };

    /**
     * 注册事件
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };
    /**
     * 解除事件
     * @param name 名称
     * @returns {*|void}
     */
    the.off = function(name) {
        return Plugin.removeEvent(name);
    };

    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    //== Run plugin
    Plugin.construct.apply(the, [options]);

    //== Handle plugin on window resize
    mUtil.addResizeHandler(function() {
        if (init) {
            the.reload();
        }  
    });

    //== Init done
    init = true;

    // Return plugin instance
    return the;
};

// 插件全局懒初始化
document.addEventListener("click", function (e) {
    let body = mUtil.get('body');
    let query;
    if ( query = body.querySelectorAll('.m-menu__nav .m-menu__item.m-menu__item--submenu.m-menu__item--hover:not(.m-menu__item--tabs)[m-menu-submenu-toggle="click"]') ) {
        for (let i = 0, len = query.length; i < len; i++) {
            let element = query[i].closest('.m-menu__nav').parentNode;

            if ( element ) {
                let the = mUtil.data(element).get('menu');

                if ( !the ) {
                    break;
                }

                if ( !the || the.getSubmenuMode() !== 'dropdown' ) {
                    break;
                }

                if ( e.target !== element && element.contains(e.target) === false ) {
                    let items;
                    if ( items = element.querySelectorAll('.m-menu__item--submenu.m-menu__item--hover:not(.m-menu__item--tabs)[m-menu-submenu-toggle="click"]') ) {
                        for (let j = 0, cnt = items.length; j < cnt; j++) {
                            the.hideDropdown(items[j]);
                        }
                    }
                }
            }            
        }
    } 
});
let mOffcanvas = function(elementId, options) {
    //== Main object
    let the = this;
    let init = false;

    //== 获取元素
    let element = mUtil.get(elementId);
    let body = mUtil.get('body');

    if (!element) {
        return;
    }

    //== 默认选项
    let defaultOptions = {};

    ////////////////////////////
    // **    私有方法     ** //
    ////////////////////////////

    let Plugin = {
        /**
         * Run plugin
         * @returns {moffcanvas}
         */
        construct: function(options) {
            if (mUtil.data(element).has('offcanvas')) {
                the = mUtil.data(element).get('offcanvas');
            } else {
                // reset offcanvas
                Plugin.init(options);
                
                // build offcanvas
                Plugin.build();

                mUtil.data(element).set('offcanvas', the);
            }

            return the;
        },

        /**
         * Handles suboffcanvas click toggle
         * @returns {moffcanvas}
         */
        init: function(options) {
            the.events = [];

            // merge default and user defined options
            the.options = mUtil.deepExtend({}, defaultOptions, options);
            the.overlay;

            the.classBase = the.options.baseClass;
            the.classShown = the.classBase + '--on';
            the.classOverlay = the.classBase + '-overlay';

            the.state = mUtil.hasClass(element, the.classShown) ? 'shown' : 'hidden';
        },

        build: function() {
            //== offcanvas toggle
            if (the.options.toggleBy) {
                if (typeof the.options.toggleBy === 'string') { 
                    mUtil.addEvent( the.options.toggleBy, 'click', Plugin.toggle); 
                } else if (the.options.toggleBy && the.options.toggleBy[0] && the.options.toggleBy[0].target) {
                    for (let i in the.options.toggleBy) {
                        mUtil.addEvent( the.options.toggleBy[i].target, 'click', Plugin.toggle); 
                    }
                } else if (the.options.toggleBy && the.options.toggleBy.target) {
                    mUtil.addEvent( the.options.toggleBy.target, 'click', Plugin.toggle); 
                } 
            }

            //== offcanvas close
            let closeBy = mUtil.get(the.options.closeBy);
            if (closeBy) {
                mUtil.addEvent(closeBy, 'click', Plugin.hide);
            }
        },


        /**
         * Handles offcanvas toggle
         */
        toggle: function() {;
            Plugin.eventTrigger('toggle'); 

            if (the.state == 'shown') {
                Plugin.hide(this);
            } else {
                Plugin.show(this);
            }
        },

        /**
         * Handles offcanvas show
         */
        show: function(target) {
            if (the.state == 'shown') {
                return;
            }

            Plugin.eventTrigger('beforeShow');

            Plugin.togglerClass(target, 'show');

            //== Offcanvas panel
            mUtil.addClass(body, the.classShown);
            mUtil.addClass(element, the.classShown);

            the.state = 'shown';

            if (the.options.overlay) {
                the.overlay = mUtil.insertAfter(document.createElement('DIV') , element );
                mUtil.addClass(the.overlay, the.classOverlay);
                mUtil.addEvent(the.overlay, 'click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    Plugin.hide(target);       
                });
            }

            Plugin.eventTrigger('afterShow');
        },

        /**
         * Handles offcanvas hide
         */
        hide: function(target) {
            if (the.state == 'hidden') {
                return;
            }

            Plugin.eventTrigger('beforeHide');

            Plugin.togglerClass(target, 'hide');

            mUtil.removeClass(body, the.classShown);
            mUtil.removeClass(element, the.classShown);

            the.state = 'hidden';

            if (the.options.overlay && the.overlay) {
                mUtil.remove(the.overlay);
            }

            Plugin.eventTrigger('afterHide');
        },

        /**
         * Handles toggler class
         */
        togglerClass: function(target, mode) {
            //== Toggler
            let id = mUtil.attr(target, 'id');
            let toggleBy;

            if (the.options.toggleBy && the.options.toggleBy[0] && the.options.toggleBy[0].target) {
                for (let i in the.options.toggleBy) {
                    if (the.options.toggleBy[i].target === id) {
                        toggleBy = the.options.toggleBy[i];
                    }        
                }
            } else if (the.options.toggleBy && the.options.toggleBy.target) {
                toggleBy = the.options.toggleBy;
            }

            if (toggleBy) {                
                let el = mUtil.get(toggleBy.target);
                
                if (mode === 'show') {
                    mUtil.addClass(el, toggleBy.state);
                }

                if (mode === 'hide') {
                    mUtil.removeClass(el, toggleBy.state);
                }
            }
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name, args) {
            for (let i = 0; i < the.events.length; i++) {
                let event = the.events[i];
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
     * Hide 
     */
    the.hide = function() {
        return Plugin.hide();
    };

    /**
     * Show 
     */
    the.show = function() {
        return Plugin.show();
    };

    /**
     * Get suboffcanvas mode
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Set offcanvas content
     * @returns {mOffcanvas}
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    //== Run plugin
    Plugin.construct.apply(the, [options]);

    //== Init done
    init = true;

    // Return plugin instance
    return the;
};
// plugin setup
let mPortlet = function(elementId, options) {
    //== Main object
    let the = this;
    let init = false;

    //== 获取元素
    let element = mUtil.get(elementId);
    let body = mUtil.get('body');

    if (!element) {
        return;
    }

    //== 默认选项
    let defaultOptions = {
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
            zIndex: 98
        }
    };

    ////////////////////////////
    // **    私有方法     ** //
    ////////////////////////////

    let Plugin = {
        /**
         * Construct
         */

        construct: function(options) {
            if (mUtil.data(element).has('portlet')) {
                the = mUtil.data(element).get('portlet');
            } else {
                // reset menu
                Plugin.init(options);

                // build menu
                Plugin.build();

                mUtil.data(element).set('portlet', the);
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
            the.options = mUtil.deepExtend({}, defaultOptions, options);
            the.head = mUtil.child(element, '.m-portlet__head');
            the.foot = mUtil.child(element, '.m-portlet__foot');

            if (mUtil.child(element, '.m-portlet__body')) {
                the.body = mUtil.child(element, '.m-portlet__body');
            } else if (mUtil.child(element, '.m-form').length !== 0) {
                the.body = mUtil.child(element, '.m-form');
            }
        },

        /**
         * Build Form Wizard
         */
        build: function() {
            //== Remove
            let remove = mUtil.find(the.head, '[m-portlet-tool=remove]');
            if (remove) {
                mUtil.addEvent(remove, 'click', function(e) {
                    e.preventDefault();
                    Plugin.remove();
                });
            }

            //== Reload
            let reload = mUtil.find(the.head, '[m-portlet-tool=reload]');
            if (reload) {
                mUtil.addEvent(reload, 'click', function(e) {
                    e.preventDefault();
                    Plugin.reload();
                });
            }

            //== Toggle
            let toggle = mUtil.find(the.head, '[m-portlet-tool=toggle]');
            if (toggle) {
                mUtil.addEvent(toggle, 'click', function(e) {
                    e.preventDefault();
                    Plugin.toggle();
                });
            }

            //== Fullscreen
            let fullscreen = mUtil.find(the.head, '[m-portlet-tool=fullscreen]');
            if (fullscreen) {
                mUtil.addEvent(fullscreen, 'click', function(e) {
                    e.preventDefault();
                    Plugin.fullscreen();
                });
            }

            Plugin.setupTooltips();
        },

        /**
         * Window scroll handle event for sticky portlet
         */
        onScrollSticky: function() {
            let st = window.pageYOffset;
            let offset = the.options.sticky.offset;


            if (st > offset) {
                if (mUtil.hasClass(body, 'm-portlet--sticky') === false) {
                    Plugin.eventTrigger('stickyOn');

                    mUtil.addClass(body, 'm-portlet--sticky');
                    mUtil.addClass(element, 'm-portlet--sticky');

                    Plugin.updateSticky();
                }
            } else { // back scroll mode
                if (mUtil.hasClass(body, 'm-portlet--sticky')) {
                    Plugin.eventTrigger('stickyOff');

                    mUtil.removeClass(body, 'm-portlet--sticky');
                    mUtil.removeClass(element, 'm-portlet--sticky');

                    Plugin.resetSticky();
                }
            }
        },

        /**
         * Init sticky portlet
         */
        initSticky: function() {
            if (!the.head) {
                return;
            }

            window.addEventListener('scroll', Plugin.onScrollSticky);
        },

        /**
         * Update sticky portlet positions
         */
        updateSticky: function() {
            if (!the.head) {
                return;
            }

            let top;

            if (mUtil.hasClass(body, 'm-portlet--sticky')) {
                if (the.options.sticky.position.top instanceof Function) {
                    top = parseInt(the.options.sticky.position.top.call());
                } else {
                    top = parseInt(the.options.sticky.position.top);
                }

                let left;
                if (the.options.sticky.position.left instanceof Function) {
                    left = parseInt(the.options.sticky.position.left.call());
                } else {
                    left = parseInt(the.options.sticky.position.left);
                }

                let right;
                if (the.options.sticky.position.right instanceof Function) {
                    right = parseInt(the.options.sticky.position.right.call());
                } else {
                    right = parseInt(the.options.sticky.position.right);
                }

                mUtil.css(the.head, 'z-index', the.options.sticky.zIndex);
                mUtil.css(the.head, 'top', top + 'px');

                if (mUtil.isRTL()) {
                    mUtil.css(the.head, 'left', right + 'px');
                    mUtil.css(the.head, 'right',left  + 'px');
                } else {
                    mUtil.css(the.head, 'left', left + 'px');
                    mUtil.css(the.head, 'right', right + 'px');
                }

            }
        },

        /**
         * Reset sticky portlet positions
         */
        resetSticky: function() {
            if (!the.head) {
                return;
            }

            if (mUtil.hasClass(body, 'm-portlet--sticky') === false) {
                mUtil.css(the.head, 'z-index', '');
                mUtil.css(the.head, 'top', '');
                mUtil.css(the.head, 'left', '');
                mUtil.css(the.head, 'right', '');
            }
        },

        /**
         * Destroy sticky portlet
         */
        destroySticky: function() {
            if (!the.head) {
                return;
            }

            Plugin.resetSticky();

            window.removeEventListener('scroll', Plugin.onScrollSticky);
        },

        /**
         * Remove portlet
         */
        remove: function() {
            if (Plugin.eventTrigger('beforeRemove') === false) {
                return;
            }

            if (mUtil.hasClass(body, 'm-portlet--fullscreen') && mUtil.hasClass(element, 'm-portlet--fullscreen')) {
                Plugin.fullscreen('off');
            }

            Plugin.removeTooltips();

            mUtil.remove(element);

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
                let collapsed = mUtil.hasClass(element, 'm-portlet--collapse') || mUtil.hasClass(element, 'm-portlet--collapsed');
                let fullscreenOn = mUtil.hasClass(body, 'm-portlet--fullscreen') && mUtil.hasClass(element, 'm-portlet--fullscreen');

                //== Remove
                let remove = mUtil.find(the.head, '[m-portlet-tool=remove]');
                if (remove) {
                    let placement = (fullscreenOn ? 'bottom' : 'top');
                    let tip = new Tooltip(remove, {
                        title: the.options.tools.remove,
                        placement: placement,
                        offset: (fullscreenOn ? '0,10px,0,0' : '0,5px'),
                        trigger: 'hover',
                        template: '<div class="m-tooltip m-tooltip--portlet tooltip bs-tooltip-' + placement + '" role="tooltip">\
                            <div class="tooltip-arrow arrow"></div>\
                            <div class="tooltip-inner"></div>\
                        </div>'
                    });

                    mUtil.data(remove).set('tooltip', tip);
                }

                //== Reload
                let reload = mUtil.find(the.head, '[m-portlet-tool=reload]');
                if (reload) {
                    let placement = (fullscreenOn ? 'bottom' : 'top');
                    let tip = new Tooltip(reload, {
                        title: the.options.tools.reload,
                        placement: placement,
                        offset: (fullscreenOn ? '0,10px,0,0' : '0,5px'),
                        trigger: 'hover',
                        template: '<div class="m-tooltip m-tooltip--portlet tooltip bs-tooltip-' + placement + '" role="tooltip">\
                            <div class="tooltip-arrow arrow"></div>\
                            <div class="tooltip-inner"></div>\
                        </div>'
                    });

                    mUtil.data(reload).set('tooltip', tip);
                }

                //== Toggle
                let toggle = mUtil.find(the.head, '[m-portlet-tool=toggle]');
                if (toggle) {
                    let placement = (fullscreenOn ? 'bottom' : 'top');
                    let tip = new Tooltip(toggle, {
                        title: (collapsed ? the.options.tools.toggle.expand : the.options.tools.toggle.collapse),
                        placement: placement,
                        offset: (fullscreenOn ? '0,10px,0,0' : '0,5px'),
                        trigger: 'hover',
                        template: '<div class="m-tooltip m-tooltip--portlet tooltip bs-tooltip-' + placement + '" role="tooltip">\
                            <div class="tooltip-arrow arrow"></div>\
                            <div class="tooltip-inner"></div>\
                        </div>'
                    });

                    mUtil.data(toggle).set('tooltip', tip);
                }

                //== Fullscreen
                let fullscreen = mUtil.find(the.head, '[m-portlet-tool=fullscreen]');
                if (fullscreen) {
                    let placement = (fullscreenOn ? 'bottom' : 'top');
                    let tip = new Tooltip(fullscreen, {
                        title: (fullscreenOn ? the.options.tools.fullscreen.off : the.options.tools.fullscreen.on),
                        placement: placement,
                        offset: (fullscreenOn ? '0,10px,0,0' : '0,5px'),
                        trigger: 'hover',
                        template: '<div class="m-tooltip m-tooltip--portlet tooltip bs-tooltip-' + placement + '" role="tooltip">\
                            <div class="tooltip-arrow arrow"></div>\
                            <div class="tooltip-inner"></div>\
                        </div>'
                    });

                    mUtil.data(fullscreen).set('tooltip', tip);
                }
            }
        },

        /**
         * Setup tooltips
         */
        removeTooltips: function() {
            if (the.options.tooltips) {
                //== Remove
                let remove = mUtil.find(the.head, '[m-portlet-tool=remove]');
                if (remove && mUtil.data(remove).has('tooltip')) {
                    mUtil.data(remove).get('tooltip').dispose();
                }

                //== Reload
                let reload = mUtil.find(the.head, '[m-portlet-tool=reload]');
                if (reload && mUtil.data(reload).has('tooltip')) {
                    mUtil.data(reload).get('tooltip').dispose();
                }

                //== Toggle
                let toggle = mUtil.find(the.head, '[m-portlet-tool=toggle]');
                if (toggle && mUtil.data(toggle).has('tooltip')) {
                    mUtil.data(toggle).get('tooltip').dispose();
                }

                //== Fullscreen
                let fullscreen = mUtil.find(the.head, '[m-portlet-tool=fullscreen]');
                if (fullscreen && mUtil.data(fullscreen).has('tooltip')) {
                    mUtil.data(fullscreen).get('tooltip').dispose();
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
            if (mUtil.hasClass(element, 'm-portlet--collapse') || mUtil.hasClass(element, 'm-portlet--collapsed')) {
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

            mUtil.slideUp(the.body, the.options.bodyToggleSpeed, function() {
                Plugin.eventTrigger('afterCollapse');
            });

            mUtil.addClass(element, 'm-portlet--collapse');

            let toggle = mUtil.find(the.head, '[m-portlet-tool=toggle]');
            if (toggle && mUtil.data(toggle).has('tooltip')) {
                mUtil.data(toggle).get('tooltip').updateTitleContent(the.options.tools.toggle.expand);
            }
        },

        /**
         * Expand
         */
        expand: function() {
            if (Plugin.eventTrigger('beforeExpand') === false) {
                return;
            }

            mUtil.slideDown(the.body, the.options.bodyToggleSpeed, function() {
                Plugin.eventTrigger('afterExpand');
            });

            mUtil.removeClass(element, 'm-portlet--collapse');
            mUtil.removeClass(element, 'm-portlet--collapsed');

            let toggle = mUtil.find(the.head, '[m-portlet-tool=toggle]');
            if (toggle && mUtil.data(toggle).has('tooltip')) {
                mUtil.data(toggle).get('tooltip').updateTitleContent(the.options.tools.toggle.collapse);
            }
        },

        /**
         * Toggle
         */
        fullscreen: function(mode) {
            let d = {};
            let speed = 300;

            if (mode === 'off' || (mUtil.hasClass(body, 'm-portlet--fullscreen') && mUtil.hasClass(element, 'm-portlet--fullscreen'))) {
                Plugin.eventTrigger('beforeFullscreenOff');

                mUtil.removeClass(body, 'm-portlet--fullscreen');
                mUtil.removeClass(element, 'm-portlet--fullscreen');

                Plugin.removeTooltips();
                Plugin.setupTooltips();

                if (the.foot) {
                    mUtil.css(the.body, 'margin-bottom', '');
                    mUtil.css(the.foot, 'margin-top', '');
                }

                Plugin.eventTrigger('afterFullscreenOff');
            } else {
                Plugin.eventTrigger('beforeFullscreenOn');

                mUtil.addClass(element, 'm-portlet--fullscreen');
                mUtil.addClass(body, 'm-portlet--fullscreen');

                Plugin.removeTooltips();
                Plugin.setupTooltips();


                if (the.foot) {
                    let height1 = parseInt(mUtil.css(the.foot, 'height'));
                    let height2 = parseInt(mUtil.css(the.foot, 'height')) + parseInt(mUtil.css(the.head, 'height'));
                    mUtil.css(the.body, 'margin-bottom', height1 + 'px');
                    mUtil.css(the.foot, 'margin-top', '-' + height2 + 'px');
                }

                Plugin.eventTrigger('afterFullscreenOn');
            }
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name) {
            //mUtil.triggerCustomEvent(name);
            for (i = 0; i < the.events.length; i++) {
                let event = the.events[i];
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
     * @returns {mPortlet}
     */
    the.remove = function() {
        return Plugin.remove(html);
    };

    /**
     * Init sticky portlet
     * @returns {mPortlet}
     */
    the.initSticky = function() {
        return Plugin.initSticky();
    };

    /**
     * Update sticky portlet scroll event
     * @returns {mPortlet}
     */
    the.updateSticky = function() {
        return Plugin.updateSticky();
    };

    /**
     * Reset sticky portlet positions
     * @returns {mPortlet}
     */
    the.resetSticky = function() {
        return Plugin.resetSticky();
    };

    /**
     * Destroy sticky portlet scroll event
     * @returns {mPortlet}
     */
    the.destroySticky = function() {
        return Plugin.destroySticky();
    };

    /**
     * Reload portlet
     * @returns {mPortlet}
     */
    the.reload = function() {
        return Plugin.reload();
    };

    /**
     * Set portlet content
     * @returns {mPortlet}
     */
    the.setContent = function(html) {
        return Plugin.setContent(html);
    };

    /**
     * Toggle portlet
     * @returns {mPortlet}
     */
    the.toggle = function() {
        return Plugin.toggle();
    };

    /**
     * Collapse portlet
     * @returns {mPortlet}
     */
    the.collapse = function() {
        return Plugin.collapse();
    };

    /**
     * Expand portlet
     * @returns {mPortlet}
     */
    the.expand = function() {
        return Plugin.expand();
    };

    /**
     * Fullscreen portlet
     * @returns {mPortlet}
     */
    the.fullscreen = function() {
        return Plugin.fullscreen('on');
    };

    /**
     * Fullscreen portlet
     * @returns {mPortlet}
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

    //== Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};
// plugin setup
let mQuicksearch = function(elementId, options) {
    //== Main object
    let the = this;
    let init = false;

    //== 获取元素
    let element = mUtil.get(elementId);
    let body = mUtil.get('body');

    if (!element) {
        return;
    }

    //== 默认选项
    let defaultOptions = {
        mode: 'default', //'default/dropdown'
        minLength: 1,
        maxHeight: 300,
        requestTimeout: 200, // ajax request fire timeout in milliseconds 
        inputTarget: 'm_quicksearch_input',
        iconCloseTarget: 'm_quicksearch_close',
        iconCancelTarget: 'm_quicksearch_cancel',
        iconSearchTarget: 'm_quicksearch_search',
        
        spinnerClass: 'm-loader m-loader--skin-light m-loader--right',
        hasResultClass: 'm-list-search--has-result',
        
        templates: {
            error: '<div class="m-search-results m-search-results--skin-light"><span class="m-search-result__message">{{message}}</div></div>'
        }
    };

    ////////////////////////////
    // **    私有方法     ** //
    ////////////////////////////

    let Plugin = {
        /**
         * Construct
         */

        construct: function(options) {
            if (mUtil.data(element).has('quicksearch')) {
                the = mUtil.data(element).get('quicksearch');
            } else {
                // reset menu
                Plugin.init(options);

                // build menu
                Plugin.build();

                mUtil.data(element).set('quicksearch', the);
            }

            return the;
        },

        init: function(options) {
            the.element = element;
            the.events = [];

            // merge default and user defined options
            the.options = mUtil.deepExtend({}, defaultOptions, options);

            // search query
            the.query = '';

            // form
            the.form = mUtil.find(element, 'form');

            // input element
            the.input = mUtil.get(the.options.inputTarget);

            // close icon
            the.iconClose = mUtil.get(the.options.iconCloseTarget);

            if (the.options.mode == 'default') {
                // search icon
                the.iconSearch = mUtil.get(the.options.iconSearchTarget);

                // cancel icon
                the.iconCancel = mUtil.get(the.options.iconCancelTarget);
            }

            // dropdown
            the.dropdown = new mDropdown(element, {
                mobileOverlay: false
            });

            // cancel search timeout
            the.cancelTimeout;

            // ajax processing state
            the.processing = false;

            // ajax request fire timeout
            the.requestTimeout = false;
        },

        /**
         * Build plugin
         */
        build: function() {
            // attach input keyup handler
            mUtil.addEvent(the.input, 'keyup', Plugin.search);

            if (the.options.mode == 'default') {
                mUtil.addEvent(the.input, 'focus', Plugin.showDropdown);
                mUtil.addEvent(the.iconCancel, 'click', Plugin.handleCancel);

                mUtil.addEvent(the.iconSearch, 'click', function() {
                    if (mUtil.isInResponsiveRange('tablet-and-mobile')) {
                        mUtil.addClass(body, 'm-header-search--mobile-expanded');
                        the.input.focus();
                    }
                });

                mUtil.addEvent(the.iconClose, 'click', function() {
                    if (mUtil.isInResponsiveRange('tablet-and-mobile')) {
                        mUtil.removeClass(body, 'm-header-search--mobile-expanded');
                        Plugin.closeDropdown();
                    }
                });
            } else if (the.options.mode == 'dropdown') {
                the.dropdown.on('afterShow', function() {
                    the.input.focus();
                });

                mUtil.addEvent(the.iconClose, 'click', Plugin.closeDropdown);
            }
        },

        showProgress: function() {
            the.processing = true;
            mUtil.addClass(the.form, the.options.spinnerClass);
            Plugin.handleCancelIconVisibility('off');

            return the;
        },

        hideProgress: function() {
            the.processing = false;
            mUtil.removeClass(the.form, the.options.spinnerClass);
            Plugin.handleCancelIconVisibility('on');
            mUtil.addClass(element, the.options.hasResultClass);

            return the;
        },

        /**
         * Search handler
         */
        search: function(e) {
            the.query = the.input.value;

            if (the.query.length === 0) {
                Plugin.handleCancelIconVisibility('on');
                mUtil.removeClass(element, the.options.hasResultClass);
                mUtil.removeClass(the.form, the.options.spinnerClass);
            }

            if (the.query.length < the.options.minLength || the.processing == true) {
                return;
            }

            if (the.requestTimeout) {
                clearTimeout(the.requestTimeout);
            }

            the.requestTimeout = false;

            the.requestTimeout = setTimeout(function() {
                Plugin.eventTrigger('search');
            }, the.options.requestTimeout);            

            return the;
        },

        /**
         * Handle cancel icon visibility
         */
        handleCancelIconVisibility: function(status) {
            if (status == 'on') {
                if (the.input.value.length === 0) {
                    if (the.iconCancel) mUtil.css(the.iconCancel, 'visibility', 'hidden');
                    if (the.iconClose) mUtil.css(the.iconClose, 'visibility', 'visible');
                } else {
                    clearTimeout(the.cancelTimeout);
                    the.cancelTimeout = setTimeout(function() {
                        if (the.iconCancel) mUtil.css(the.iconCancel, 'visibility', 'visible');
                        if (the.iconClose) mUtil.css(the.iconClose, 'visibility', 'visible');
                    }, 500);
                }
            } else {
                if (the.iconCancel) mUtil.css(the.iconCancel, 'visibility', 'hidden');
                if (the.iconClose) mUtil.css(the.iconClose, 'visibility', 'hidden');
            }
        },

        /**
         * Cancel handler
         */
        handleCancel: function(e) {
            the.input.value = '';
            mUtil.css(the.iconCancel, 'visibility', 'hidden');
            mUtil.removeClass(element, the.options.hasResultClass);

            Plugin.closeDropdown();
        },

        /**
         * Cancel handler
         */
        closeDropdown: function() {
            the.dropdown.hide();
        },

        /**
         * Show dropdown
         */
        showDropdown: function(e) {
            if (the.dropdown.isShown() == false && the.input.value.length > the.options.minLength && the.processing == false) {
                console.log('show!!!');
                the.dropdown.show();
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }                
            }
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name) {
            //mUtil.triggerCustomEvent(name);
            for (i = 0; i < the.events.length; i++) {
                let event = the.events[i];
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
     * quicksearch off 
     */
    the.search = function() {
        return Plugin.handleSearch();
    };

    the.showResult = function(res) {
        the.dropdown.setContent(res);
        Plugin.showDropdown();

        return the;
    };

    the.showError = function(text) {
        let msg = the.options.templates.error.replace('{{message}}', text);
        the.dropdown.setContent(msg);
        Plugin.showDropdown();

        return the;
    };

    /**
     *  
     */
    the.showProgress = function() {
        return Plugin.showProgress();
    };

    the.hideProgress = function() {
        return Plugin.hideProgress();
    };

    /**
     * quicksearch off 
     */
    the.search = function() {
        return Plugin.search();
    };

    /**
     * Attach event
     * @returns {mQuicksearch}
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     * @returns {mQuicksearch}
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    //== Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};
let mScrollTop = function(elementId, options) {
    //== Main object
    let the = this;
    let init = false;

    //== 获取元素
    let element = mUtil.get(elementId);
    let body = mUtil.get('body');

    if (!element) {
        return;
    }

    //== 默认选项
    let defaultOptions = {
        offset: 300,
        speed: 600
    };

    ////////////////////////////
    // **    私有方法     ** //
    ////////////////////////////

    let Plugin = {
        /**
         * Run plugin
         * @returns {mscrolltop}
         */
        construct: function(options) {
            if (mUtil.data(element).has('scrolltop')) {
                the = mUtil.data(element).get('scrolltop');
            } else {
                // reset scrolltop
                Plugin.init(options);

                // build scrolltop
                Plugin.build();

                mUtil.data(element).set('scrolltop', the);
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
            the.options = mUtil.deepExtend({}, defaultOptions, options);
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
            mUtil.addEvent(element, 'click', Plugin.scroll);
        },

        /**
         * Handles scrolltop click scrollTop
         */
        handle: function() {
            let pos = window.pageYOffset; // current vertical position
            if (pos > the.options.offset) {
                mUtil.addClass(body, 'm-scroll-top--shown');
            } else {
                mUtil.removeClass(body, 'm-scroll-top--shown');
            }
        },

        /**
         * Handles scrolltop click scrollTop
         */
        scroll: function(e) {
            e.preventDefault();

            mUtil.scrollTop(0, the.options.speed);
        },


        /**
         * Trigger events
         */
        eventTrigger: function(name, args) {
            for (let i = 0; i < the.events.length; i++) {
                let event = the.events[i];
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

    //== Run plugin
    Plugin.construct.apply(the, [options]);

    //== Init done
    init = true;

    // Return plugin instance
    return the;
};
/**
 * @class mTabs tab工具条
 */
let mTabs = function (selector, options) {
    let the = this;
    let element = $(selector);
    if (element.length > 0) {
        return;
    }

    /**
     * 默认设置
     * @type {{}}
     */
    let defaultOptions = {
        tabNameLength: 10,
        toLeft: $('.to-left'),
        toRight: $('.to-right'),
        tool: {
            refreshPage: $('.refresh-page'),
            closeOther: $('.close-other'),
            closeAll: $('.close-all')
        },
        contabsScorll: $('.contabs-scorll'),
        conTabs: $('.con-tabs'),
        pageContainer: $('.page-container'),
        siteContabs: $('.site-contabs')
    };

    /**
     * 私有方法
     */
    let Plugin = {
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
                let marginLeft = Number(defaultOptions.conTabs.css('margin-left').replace('px', ''));
                if (marginLeft != 0) {
                    let tabsScorllWidth = Plugin.calcWidth(defaultOptions.contabsScorll); // tab 工具条可视宽度
                    let targetMarginLeft = marginLeft + (tabsScorllWidth * 0.8);
                    if (targetMarginLeft > 0) {
                        targetMarginLeft = 0;
                    }
                    defaultOptions.conTabs.animate({marginLeft: targetMarginLeft + 'px'}, 'fast');
                }
            });
            // 点击向右按钮
            defaultOptions.toRight.click(function () {
                let marginLeft = Number(defaultOptions.conTabs.css('margin-left').replace('px', ''));
                let tabsScorllWidth = Plugin.calcWidth(defaultOptions.contabsScorll); // tab 工具条可视宽度
                let conTabsWidth = Plugin.calcWidth(defaultOptions.conTabs.children()); // tab 总宽
                let targetMarginLeft = marginLeft - (tabsScorllWidth * 0.8);

                if (Math.abs(targetMarginLeft) > (conTabsWidth - tabsScorllWidth)) {
                    targetMarginLeft = (conTabsWidth - tabsScorllWidth) * -1;
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
                let retainTab = null;
                defaultOptions.conTabs.children().each(function () {
                    let $this = $(this);
                    let $tabClose = $this.find('.tab-close');
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
                    let $this = $(this);
                    let $tabClose = $this.find('.tab-close');
                    if ($tabClose != null && $tabClose.length > 0 && !$this.hasClass('active')) {
                        Plugin.closeTab($this);
                    }
                });
                Plugin.toActiveTab();
            });
        },
        /**
         * Init portlet
         */
        init: function (options) {
            Plugin.bindClickTab(); // 绑定点击tab事件
        },

        /**
         * 关闭tab事件
         */
        bindClose: function () {
            defaultOptions.conTabs.find('.tab-close').unbind('click').click(function () {
                Plugin.closeTab($(this).parent().parent());
            });
        },
        /**
         * 点击tab事件
         */
        bindClickTab: function () {
            let alreadyClickedTimeout;
            defaultOptions.conTabs.on('click', 'a.btn', function () {
                let $tab = $(this);
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
        refreshActivePage: function () {
            // Plugin.showWaitTip();
            let url = defaultOptions.conTabs.children('.active').find('a.btn').attr('data-url');
            defaultOptions.pageContainer.find('iframe.page-frame[src="' + url + '"]').attr('src', url);
            // 这里暂时写假的
            // setTimeout(function () {
            //     Plugin.hideWaitTip();
            // }, 2000);
        },
        /**
         * 显示请等待提示
         */
        showWaitTip: function () {
            mApp.blockPage({
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
            mApp.unblockPage();
        },

        /**
         * 显示指定tab内容
         *
         * @param $tab (a.btn)
         */
        setTabState: function ($tab, isShow) {
            let url = $tab.attr('data-url');
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
            let url = $tab.find('a').attr('data-url');
            let nextTab;
            if ($tab.hasClass('active')) { // 如果关闭的是当前激活tab,自动切换到前/后的标签
                nextTab = $tab.prev();
                if (nextTab == null || nextTab.length == 0) {
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
            let a = defaultOptions.conTabs.find('a.btn[data-url="' + url + '"]');
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
            if (mUtil.isBlank(url)) return;
            if (Plugin.needOpen(url)) {
                Plugin.index++;
                let _tab = '<li class="active">' +
                    '<a class="btn btn-default tab" href="javascript:;" data-url="' + url + '" title="' + name + '" target="iframe-1" data-alreadyClicked="false">' +
                    Plugin.getTabName(name) + ((typeof canClose === 'undefined' || canClose) ? '<i class="tab-close la la-close"></i>' : '') + '</a></li>';
                let _iframe = '<iframe src="' + url + '" frameborder="0" name="iframe-' + Plugin.index + '" class="page-frame active animation-fade"></iframe>';
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
            let iframe = defaultOptions.pageContainer.children('.active');
            if (iframe.length > 0) {
                // 检查是否需要刷新页面
                if (mUtil.isFunction(iframe[0].contentWindow.mTab.needRefresh) && iframe[0].contentWindow.mTab.needRefresh()) {
                    Plugin.refreshActivePage();
                }
                // 检查是否需要提交表单
                if (mUtil.isFunction(iframe[0].contentWindow.mTab.needSubmitForm) && iframe[0].contentWindow.mTab.needSubmitForm()) {
                    // let form_element = $($(iframe[0].contentDocument).find('.m-form')[0]);
                    let $btn = $(iframe[0].contentDocument).find('.btn.btn-search');
                    if ($btn.length > 0) {
                        $btn.click();
                    }
                }
            }
        },
        /**
         * 跳转到当前激活
         */
        toActiveTab: function () {
            let $activeTab = defaultOptions.conTabs.find('.active');
            let activeWdith = Plugin.calcWidth($activeTab); // 当前激活tab宽度
            let prevAllWidth = Plugin.calcWidth($activeTab.prevAll()); // 当前激活tab前面tabs总宽
            //let nextAllWidth = Plugin.calcWidth($activeTab.nextAll());// 当前激活tab后面tabs总宽
            let tabsScorllWidth = Plugin.calcWidth(defaultOptions.contabsScorll); // tab 工具条可视宽度
            // let totalWidth = Plugin.calcWidth(defaultOptions.siteContabs); // 总宽
            let conTabsWidth = Plugin.calcWidth(defaultOptions.conTabs.children()); // tab 总宽
            let marginLeft = Number(defaultOptions.conTabs.css('margin-left').replace('px', ''));
            if (conTabsWidth > tabsScorllWidth) {
                if (Math.abs(marginLeft) > prevAllWidth) { // 目标标签页隐藏在左侧
                    marginLeft = prevAllWidth * -1;
                } else if ((Math.abs(marginLeft) + tabsScorllWidth) < (prevAllWidth + activeWdith)) { // 目标标签页隐藏在右侧
                    marginLeft = (prevAllWidth + activeWdith - tabsScorllWidth) * -1;
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
                let width = 0;
                $($tabs).each(function () {
                    width += $(this).outerWidth(true);
                });
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
            if (mUtil.isNotBlank(name)) {
                return mUtil.subStr(name, defaultOptions.tabNameLength);
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
            if (mUtil.isNotBlank(url)) {
                let $tab = defaultOptions.conTabs.find('[data-url="' + url + '"]');
                return $tab.length == 0;
            }
            return false;
        }
    };

    //////////////////////////
    // **     开放方法    ** //
    //////////////////////////
    /**
     * 添加Tab页
     * @param name 标签页名称
     * @param url 地址
     * @param canClose 是否可以关闭
     */
    the.addTab = function (name, url, canClose) {
        return Plugin.addTab(name, url, canClose);
    };
    /**
     * 关闭指定url页面
     * @param url 页面url
     */
    the.closeTabByUrl = function (url) {
        return Plugin.closeTabByUrl(url);
    };

    //== Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};
// plugin setup
let mToggle = function(elementId, options) {
    //== Main object
    let the = this;
    let init = false;

    //== 获取元素
    let element = mUtil.get(elementId);
    let body = mUtil.get('body');

    if (!element) {
        return;
    }

    //== 默认选项
    let defaultOptions = {
        togglerState: '',
        targetState: ''
    };    

    ////////////////////////////
    // **    私有方法     ** //
    ////////////////////////////

    let Plugin = {
        /**
         * Construct
         */

        construct: function(options) {
            if (mUtil.data(element).has('toggle')) {
                the = mUtil.data(element).get('toggle');
            } else {
                // reset menu
                Plugin.init(options);

                // build menu
                Plugin.build();

                mUtil.data(element).set('toggle', the);
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
            the.options = mUtil.deepExtend({}, defaultOptions, options);

            the.target = mUtil.get(the.options.target);
            the.targetState = the.options.targetState;
            the.togglerState = the.options.togglerState;

            the.state = mUtil.hasClasses(the.target, the.targetState) ? 'on' : 'off';
        },

        /**
         * Setup toggle
         */
        build: function() {
            mUtil.addEvent(element, 'mouseup', Plugin.toggle);
        },
        
        /**
         * Handles offcanvas click toggle
         */
        toggle: function() {
            Plugin.eventTrigger('beforeToggle');
            
            if (the.state == 'off') {
                Plugin.toggleOn();
            } else {
                Plugin.toggleOff();
            }

            return the;
        },

        /**
         * Handles toggle click toggle
         */
        toggleOn: function() {
            Plugin.eventTrigger('beforeOn');

            mUtil.addClass(the.target, the.targetState);

            if (the.togglerState) {
                mUtil.addClass(element, the.togglerState);
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

            mUtil.removeClass(the.target, the.targetState);

            if (the.togglerState) {
                mUtil.removeClass(element, the.togglerState);
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
            for (i = 0; i < the.events.length; i++) {
                let event = the.events[i];

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
    the.toggle = function() {
        return Plugin.toggleOff();
    };

    /**
     * Attach event
     * @returns {mToggle}
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     * @returns {mToggle}
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    //== Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};
/**
 * 业务工具类
 */
let mTool = function () {
    /**
     * 默认设置
     */
    let defaultOptions = {
        currentUser: 'current_user', // 缓存中当前登录用户key
        httpCode: {
            SUCCESS: 200, // 成功
            UNAUTHORIZED: 401, // 无权访问
            INTERNAL_SERVER_ERROR: 500 // 异常
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
            select: 'select'
        },
        /**
         * DataTable 默认参数
         */
        dataTable: {
            page: {
                size: 15
            },
            layout: {
                height: 435
            }
        }
    };
    /**
     * controller 根路径
     */
    let baseUrl = null;
    /**
     * 设置业务通用url部分
     *
     * @param url {string} 访问地址
     */
    let setBaseUrl = function (url) {
        baseUrl = url;
    };
    /**
     * 打开新增页面
     * @param element {object} html 元素对象 (必要)
     * @param name {string|null} tab页名称 (非必要,默认: 新增数据)
     * @param url {string|null} 请求地址 (非必要,默认规则生成)
     * @param pId {string|null} 父Id (非必要)
     */
    let addData = function (element, name, url, pId) {
        if (typeof element !== 'undefined') {
            mUtil.setButtonWait(element);
        }
        // 检查&获取请求地址
        url = getUrl(url, 'add', pId);
        if (mUtil.isBlank(url)) return;
        let params = getAutoParams(element);
        if (mUtil.isNotBlank(params)) {
            url += '?' + params;
        }
        if (mUtil.isBlank(name)) {
            name = $(element).text();
            if (mUtil.isBlank(name)) {
                name = '新增数据';
            }
        }
        mApp.openPage(name, url);
        if (typeof element !== 'undefined') {
            mUtil.offButtonWait(element);
        }
    };
    /**
     * 获取需要自动添加到url中的参数
     *
     * @param element {object} html 元素对象
     * @returns {*}
     */
    let getAutoParams = function (element) {
        if (typeof element !== 'undefined') {
            return $(element).parents('.m-form').find('.auto-params').serialize();
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
    let deleteData = function (element, id, url, needAlert, callback) {
        let $dataTable = $(element).parents('.m-form').find('.m_datatable');
        // 检查&获取数据id
        if (mUtil.isBlank(id)) {
            if (typeof $dataTable !== 'undefined' && $dataTable.length > 0) {
                // 从表格中获取已选中select
                let ids = getSelectData($dataTable);
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
        mUtil.alertConfirm(mTool.commonTips.delete.title, mTool.commonTips.delete.subtitle, function () {
            mUtil.setButtonWait(element);
            if (typeof needAlert === 'undefined') needAlert = true;
            // 检查&获取请求地址
            url = getUrl(url, 'deleteById', id);
            if (mUtil.isBlank(url)) {
                mUtil.offButtonWait(element);
                return;
            }

            mUtil.ajax({
                url: url,
                wait: $dataTable,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    mUtil.offButtonWait(element);
                    mUtil.ajaxError(XMLHttpRequest, textStatus, errorThrown);
                },
                fail: function (res) {
                    mUtil.offButtonWait(element);
                    // errorTip(mTool.commonTips.fail, res.message);
                },
                success: function (res) {
                    mUtil.offButtonWait(element);
                    // 弹出提示
                    if (needAlert) {
                        mTool.successTip(mTool.commonTips.success, mTool.commonTips.delete.success);
                    }
                    // 删除表格中数据
                    if (typeof $dataTable !== 'undefined' && $dataTable.length > 0) {
                        let dataTable = $dataTable.mDatatable();
                        dataTable.removeRows(dataTable.getSelectedRecords());
                    }
                    // 回调函数
                    if (mUtil.isFunction(callback)) {
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
    let deleteById = function (element, id, url, needAlert, callback) {
        mUtil.alertConfirm(mTool.commonTips.delete.title, mTool.commonTips.delete.subtitle, function () {
            let row = $(element).parents('tr.m-datatable__row');
            let $dataTable = $(element).parents('.m-form').find('.m_datatable');
            // 检查&获取请求地址
            url = getUrl(url, 'deleteById', id);
            if (mUtil.isBlank(url)) return;
            mUtil.ajax({
                wait: row,
                // needAlert: false,
                url: url,
                fail: function (res) {
                    // errorTip(res.message, mTool.commonTips.fail);
                },
                success: function (res) {
                    // 弹出提示
                    if (needAlert) {
                        mTool.successTip(mTool.commonTips.success, mTool.commonTips.delete.success);
                    }
                    // 删除表格中数据
                    if (typeof $dataTable !== 'undefined' && $dataTable.length > 0) {
                        let dataTable = $dataTable.mDatatable();
                        dataTable.setActive(id);
                        dataTable.removeRows(dataTable.getSelectedRecords());
                    }
                    // 回调函数
                    if (mUtil.isFunction(callback)) {
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
    let editById = function (element, id, name, url, callback) {
        url = getUrl(url, 'input', id);
        if (mUtil.isBlank(url)) return;
        if (mUtil.isBlank(name)) {
            name = $(element).text();
            if (mUtil.isBlank(name)) {
                name = '修改数据';
            }
        }
        mApp.openPage(name, url);
        // 回调函数
        if (mUtil.isFunction(callback)) {
            callback(res);
        }
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
    let saveData = function (element, url, needAlert, needValidate, callback) {
        if (needAlert == null) needAlert = true;
        if (needValidate == null) needValidate = true;
        let $form = $(element).parents('.m-form');
        // 如果不需要验证或者表单验证通过
        if (!needValidate || $form.valid()) {
            mUtil.setButtonWait(element);
            if ($form != null && $form.length > 0) {
                if (mUtil.isBlank(url)) {
                    url = $form.attr('data-action');
                    // 检查&获取请求地址
                    url = getUrl(url, 'saveData', null);
                    if (mUtil.isBlank(url)) {
                        mUtil.offButtonWait(element);
                        return;
                    }
                }
                mUtil.ajax({
                    url: url,
                    data: $form.serialize(),
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        mUtil.offButtonWait(element);
                        mUtil.ajaxError(XMLHttpRequest, textStatus, errorThrown);
                    },
                    fail: function (res) {
                        mUtil.offButtonWait(element);
                        // errorTip(mTool.commonTips.fail, res.message);
                    },
                    success: function (res) {
                        mUtil.offButtonWait(element);
                        if (needAlert) {
                            let $id = $form.find('#id');
                            if ($id != null && $id.length > 0) {
                                if (mUtil.isBlank($id.val())) {
                                    successTip(mTool.commonTips.success, mTool.commonTips.save.add);
                                    $id.val(res.data.id);
                                } else {
                                    successTip(mTool.commonTips.success, mTool.commonTips.save.update);
                                }
                            } else {
                                successTip(mTool.commonTips.success, mTool.commonTips.save.default);
                            }
                        }
                        if (mUtil.isFunction(callback)) {
                            callback(res);
                        }
                    }
                });
            } else {
                printWarn('mTool.saveData() -> 缺少表单对象');
            }
        }
    };
    /**
     * 查询数据
     *
     * @param element {object} html 元素对象
     */
    let selectData = function (element) {
        let $dataTable = $(element).parents('.m-form').find('.m_datatable');
        if (typeof $dataTable !== 'undefined' && $dataTable.length > 0) {
            $dataTable.mDatatable().reload();
        }
    };
    /**
     * 初始化DataTable
     *
     * @param options 配置
     * @returns {*|jQuery}
     */
    let initDataTable = function (options) {
        // 检查&获取请求地址
        let url = getUrl(options.url, 'select', null);
        delete options['url'];
        if (mUtil.isBlank(url)) return;

        /**
         * 默认设置
         */
        let _defaultOptions = {
            selector: '.m_datatable',
            // 数据源
            data: {
                type: 'remote',
                source: {
                    autoQuery: true, // 带入表单参数
                    read: {
                        url: url,
                        map: function (res) {
                            if (typeof res !== 'undefined' && mTool.httpCode.SUCCESS === res.code) {
                                if (typeof res.data.records !== 'undefined') { // 带有分页信息
                                    return res.data.records;
                                } else {
                                    return res.data;
                                }
                            }
                        }
                    },
                },
                saveState: {
                    // 使用cookie/webstorage 保存表格状态(分页, 筛选, 排序)
                    cookie: false,
                    webstorage: true,
                },
                pageSize: mTool.dataTable.page.size, // 页大小
                serverPaging: true, // 在服务器进行数据分页
                serverFiltering: true, // 在服务器进行数据过滤
                serverSorting: true, // 在服务器进行数据排序
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
                height: mTool.dataTable.layout.height, // 高度
                footer: false // 显示/隐藏 footer
            },

            // 列滚动
            sortable: true,
            // 分页
            pagination: true
        };
        // 合并配置
        options = $.extend(true, {}, _defaultOptions, options);

        let $form = $(options.selector).parents('form.m-form');
        if (typeof $form !== 'undefined' && $form.length > 0) {
            // 如果有查询按钮,绑定点击重新加载数据事件
            let $searchBtn = $form.find('.btn-search');
            if (typeof $searchBtn !== 'undefined' && $searchBtn.length > 0) {
                $searchBtn.click(function () {
                    selectData(this);
                });
            }
            // 如果有重置按钮,绑定点击重置事件
            let $resetBtn = $form.find('.btn-reset');
            if (typeof $resetBtn !== 'undefined' && $resetBtn.length > 0) {
                $resetBtn.click(function () {
                    $form.resetForm();
                    let $selectPicker = $form.find('.select-picker');
                    if (typeof $selectPicker !== 'undefined' && $selectPicker.length > 0) {
                        $form.find('.select-picker').trigger("change");
                    }
                });
            }
        }

        return $(options.selector).mDatatable(options);
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
     * @returns {string|*}
     */
    let getUrl = function (url, method, suffix) {
        if (mUtil.isBlank(url)) {
            if (checkBaseUrl()) {
                url = baseUrl + mTool.urlSuffix[method] + (mUtil.isNotBlank(suffix) ? suffix : '');
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
    let checkSelectDataIsNotEmpty = function (ids, tip) {
        if (ids == null || ids.length === 0) {
            if (tip) {
                warnTip(mTool.commonTips.fail, mTool.commonTips.noIds);
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
    let getSelectData = function ($dataTable) {
        return $dataTable.mDatatable().getValue();
    };

    /**
     * 检查业务根url是否已设置
     *
     * @returns {boolean}
     */
    let checkBaseUrl = function () {
        if (mUtil.isNotBlank(baseUrl)) {
            return true;
        } else {
            printWarn('请使用mTool.setBaseUrl(\'/auth/sys/dict/\');设置业务url根目录');
            return false;
        }
    };

    /**
     * 获取表单数据
     *
     * @param $form 表单
     * @returns {null|object}
     */
    let queryParams = function ($form) {
        let data = $form.serializeArray();
        if (typeof data !== 'undefined' && data.length > 0) {
            let params = {};
            for (let i = 0; i < data.length; i++) {
                if (mUtil.isNotBlank(data[i].value)) {
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
    let getActionsBtnClass = function (type) {
        if (mUtil.isBlank(type)) {
            type = 'success';
        }
        return 'table-actions m-portlet__nav-link btn m-btn btn-sm m-btn--hover-' + type + ' m-btn--icon m-btn--icon-only m-btn--pill';
    };
    /**
     * 根据路径获取对象
     *
     * @param path {string} 属性路径
     * @param object {object}
     * @param separate {string} 分隔符
     * @returns {*}
     */
    let getObject = function (path, object, separate) {
        if (mUtil.isBlank(separate)) {
            separate = '.';
        }
        return path.split(separate).reduce(function (obj, i) {
            return obj !== null && typeof obj[i] !== 'undefined' ? obj[i] : null;
        }, object);
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
    let getUser = function (cache) {
        let user = null;
        if (typeof cache === 'undefined' || cache) {
            user = cacheGet(defaultOptions.currentUser);
            if (user == null) {
                user = _getUser();
                cacheSet(defaultOptions.currentUser, user);
            } else {
                user = $.parseJSON(user);
            }
        } else {
            user = _getUser();
            cacheSet(defaultOptions.currentUser, user);
        }
        return user;
    };
    /**
     * 获取用户
     *
     * @returns {*}
     */
    let _getUser = function () {
        let data = {};

        /**
         * 将attr:attr数组转为对象
         * @param data
         * @returns {object}
         */
        let arrayToObject = function (data) {
            let obj = {};
            if (mUtil.isArray(data)) {
                $(data).each(function (i, _obj) {
                    let levels = _obj.split(':'), _i = 0;

                    function createLevel(child) {
                        let name = levels[_i++];
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

        mUtil.ajax({
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
    let hasPermissions = function (code) {
        let user = getUser(true);
        return checkPermissions(code, user.permissions);
    };
    /**
     * 用户是否没有指定权限标识
     *
     * @param code 权限标识
     * @return
     */
    let notHasPermissions = function (code) {
        return !hasPermissions(code);
    };
    /**
     * 用户是否属于指定角色标识
     *
     * @param code 角色标识
     * @return {boolean}
     */
    let hasRole = function (code) {
        let user = getUser(true);
        return checkPermissions(code, user.role);
    };
    /**
     * 用户是否不属于指定角色标识
     *
     * @param code 角色标识
     * @return
     */
    let notHasRole = function (code) {
        return !hasRole(code);
    };
    /**
     * 检查权限
     *
     * @param code {string} 权限标识
     * @param permissions {object} 权限对象
     * @return {boolean}
     */
    let checkPermissions = function (code, permissions) {
        if (mUtil.isNotBlank(code) && permissions != null && typeof permissions === 'object') {
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
    let cacheGet = function (key) {
        let obj;
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
    let cacheSet = function (key, value) {
        if (mUtil.isNotBlank(key)) {
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
    let cacheRemove = function (key) {
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
    let saveNode = function (tree, node) {
        tree = getTree(tree);
        let _node = tree.get_node(node.id, false);
        if (_node != null && _node) { // 节点存在, 更新节点名称、图标
            if (mUtil.isString(node.type)) {
                tree.set_type(_node, node.type);
            }
            if (mUtil.isString(node.text)) {
                tree.rename_node(_node, node.text);
            }
            if (mUtil.isString(node.icon)) {
                tree.set_icon(_node, node.icon);
            }
        } else {
            let pNode = tree.get_node(node.pId, false); // 查找父节点
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
    let deleteNode = function (tree, ids) {
        tree = getTree(tree);
        if (mUtil.isNumber(ids)) {
            tree.delete_node(tree.get_node(ids, false));
        } else if (mUtil.isString(ids)) {
            _deleteNode(tree, ids.split(','));
        } else if (mUtil.isArray(ids)) {
            _deleteNode(tree, ids);
        }
    };
    /**
     * 删除jsTree指定节点
     * @param tree {object}
     * @param ids
     */
    let _deleteNode = function (tree, ids) {
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
    let getOperationNodes = function (data) {
        let tree = $.jstree.reference(data.reference);
        let cur_click = tree.get_node(data.reference);
        let selectNodes = tree.get_selected();
        for (let i = 0; i < selectNodes.length; i++) {
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
    let getClickNode = function (data) {
        let tree = $.jstree.reference(data.reference);
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
    let getCheckedNodes = function (tree, attr) {
        tree = getTree(tree);
        let checked = [];
        for (let node in tree._model.data) {
            if (tree.is_undetermined(node) || tree.is_checked(node)) {
                if (typeof tree._model.data[node]['id'] === 'undefined' || tree._model.data[node]['id'] != '#') {
                    checked.push(mUtil.isNotBlank(attr) ? tree._model.data[node][attr] : tree._model.data[node]);
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
    let checkNodes = function (tree, values) {
        tree = getTree(tree);
        // 暂时禁用级联,防止选中父节点后全选子节点
        let cascade = tree.settings.checkbox.cascade;
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
    let checkAll = function (tree) {
        tree = getTree(tree);
        tree.check_all();
    };
    /**
     * jsTree 全不选
     * @param tree {object|string} 选择器或者jsTree对象
     */
    let unCheckAll = function (tree) {
        tree = getTree(tree);
        tree.uncheck_all();
    };
    /**
     * 获取jsTree对象
     * @param tree {object|string} 选择器或者jsTree对象
     * @returns {object}
     */
    let getTree = function (tree) {
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
    let infoTip = function (title, subtitle) {
        if (isAlert()) {
            mUtil.alertInfo(title, subtitle);
        } else {
            toastr.info(subtitle, title);
        }
    };

    /**
     * 成功提示
     * 会根据用户偏好设置中设置的提示方式进行提示
     *
     * @param title {string} 标题
     * @param subtitle {string} 副标题
     */
    let successTip = function (title, subtitle) {
        if (isAlert()) {
            mUtil.alertSuccess(title, subtitle);
        } else {
            toastr.success(subtitle, title);
        }
    };
    /**
     * 警告提示
     * 会根据用户偏好设置中设置的提示方式进行提示
     *
     * @param title {string} 标题
     * @param subtitle {string} 副标题
     */
    let warnTip = function (title, subtitle) {
        if (isAlert()) {
            mUtil.alertWarning(title, subtitle);
        } else {
            toastr.warning(subtitle, title);
        }
    };
    /**
     * 失败提示
     * 会根据用户偏好设置中设置的提示方式进行提示
     *
     * @param title {string} 标题
     * @param subtitle {string} 副标题
     */
    let errorTip = function (title, subtitle) {
        if (isAlert()) {
            mUtil.alertError(title, subtitle);
        } else {
            toastr.error(subtitle, title);
        }
    };
    /**
     * 根据用户偏好设置判断是否使用弹框提示
     *
     * @returns {boolean}
     */
    let isAlert = function () {
        // 暂时默认false
        return false;
    };
    /**
     * 输出警告信息
     *
     * @param str {string} 警告信息
     */
    let printWarn = function (str) {
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
    let getSysDictArrayByDictType = function (dictType) {
        if (typeof sysDict !== 'undefined' && mUtil.isNotBlank(dictType)) {
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
    let getSysDictsObjectByDictType = function (dictType) {
        let dicts = getSysDictArrayByDictType(dictType);
        if (dicts != null && dicts.length > 0) {
            let dictsObject = {};
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
    let getSysDictObjectByQuery = function (dictType, code) {
        let dicts = getSysDictArrayByDictType(dictType);
        if (dicts != null && dicts.length > 0) {
            $(dicts).each(function (index, dict) {
                if (dict.code === code) {
                    return dict;
                }
            })
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
    let getSysDictNameByQuery = function (dictType, code) {
        let dict = getSysDictObjectByQuery(dictType, code);
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
    let getDictElement = function (code, dict) {
        let cur_dict = dict[code];
        if (cur_dict == null) {
            cur_dict = {
                css: 'm-badge m-badge--success m-badge--wide',
                name: code
            }
        }
        return '<span class="' + cur_dict.css + '">' + cur_dict.name + '</span>';
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
         * 保存数据
         *
         * @param el {object} html 元素对象 (必要)
         * @param url {string} 请求地址 (非必要,默认取form的data-action并按约定处理)
         * @param needAlert {boolean} 是否需要弹出处理结果提示 (非必要,默认true)
         * @param needValidate {boolean} 是否需要表单验证 (非必要,默认true)
         * @param callback {function} 回调函数 (非必要)
         */
        saveData: function (el, url, needAlert, needValidate, callback) {
            saveData(el, url, needAlert, needValidate, callback);
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
         * @return
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
         * @return
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
        cacheGet: function (key) {
            return cacheGet(key);
        },
        /**
         * 设置cookies/localStorage中的变量
         *
         * @param key {string} 关键字
         * @param value {object} 值
         */
        cacheSet: function (key, value) {
            cacheSet(key, value);
        },
        /**
         * 根据路径获取对象
         *
         * @param path {string} 属性路径
         * @param object {object}
         * @param separate {string} 分隔符
         * @returns {*}
         */
        getObject: function(path, object){
            return getObject(path, object);
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
        ACTIONS_INFO: getActionsBtnClass('info'),
        ACTIONS_SUCCESS: getActionsBtnClass('success'),
        ACTIONS_ACCENT: getActionsBtnClass('accent'),
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
         * jsTree 全选
         * @param tree {object|string} 选择器或者jsTree对象
         */
        checkAll: function (tree) {
            checkAll(tree);
        },
        /**
         * jsTree 全不选
         * @param tree {object|string} 选择器或者jsTree对象
         */
        unCheckAll: function (tree) {
            unCheckAll(tree);
        },
        /**
         * 获取选中数据
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
        currentUser:defaultOptions.currentUser
    };
}();
/**
 * tab callback
 * @type {{needRefresh: (function(): boolean), needSubmitForm: (function(): boolean)}}
 */
var mTab = {
    /**
     * 激活当前tab是否需要刷新当前页面
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
//== 页面加载完毕初始化mTool
$(document).ready(function () {
    mTool.init({});
});
// 表单向导插件
let mWizard = function(elementId, options) {
    //== Main object
    let the = this;

    //== 获取元素
    let element = mUtil.get(elementId);

    if (!element) {
        return; 
    }

    //== 默认选项
    let defaultOptions = {
        startStep: 1,
        manualStepForward: false
    };

    ////////////////////////////
    // **     私有方法      ** //
    ////////////////////////////

    let Plugin = {
        /**
         * Construct
         */
        construct: function(options) {
            if (mUtil.data(element).has('wizard')) {
                the = mUtil.data(element).get('wizard');
            } else {
                // init
                Plugin.init(options);

                // build
                Plugin.build();

                mUtil.data(element).set('wizard', the);
            }

            return the;
        },

        /**
         * Init wizard
         */
        init: function(options) {
            the.element = element;
            the.events = [];

            // 合并配置
            the.options = mUtil.deepExtend({}, defaultOptions, options);

            //== 元素
            the.steps = mUtil.findAll(element, '.m-wizard__step');
            the.progress = mUtil.find(element, '.m-wizard__progress .progress-bar');
            the.btnSubmit = mUtil.find(element, '[data-wizard-action="submit"]');
            the.btnNext = mUtil.find(element, '[data-wizard-action="next"]');
            the.btnPrev = mUtil.find(element, '[data-wizard-action="prev"]');
            the.btnLast = mUtil.find(element, '[data-wizard-action="last"]');
            the.btnFirst = mUtil.find(element, '[data-wizard-action="first"]');

            //== 变量
            the.events = [];
            the.currentStep = 1;
            the.stopped = false;
            the.totalSteps = the.steps.length;

            //== 设置当前 step
            if (the.options.startStep > 1) {
                Plugin.goTo(the.options.startStep);
            }

            //== 更新ui
            Plugin.updateUI();
        },

        /**
         * Build Form Wizard
         */
        build: function() {
            //== Next button event handler
            mUtil.addEvent(the.btnNext, 'click', function(e) {
                e.preventDefault();
                Plugin.goNext();
            });

            //== Prev button event handler
            mUtil.addEvent(the.btnPrev, 'click', function(e) {
                e.preventDefault();
                Plugin.goPrev();
            });

            //== First button event handler
            mUtil.addEvent(the.btnFirst, 'click', function(e) {
                e.preventDefault();
                Plugin.goFirst();
            });

            //== Last button event handler
            mUtil.addEvent(the.btnLast, 'click', function(e) {
                e.preventDefault();
                Plugin.goLast();
            });

            mUtil.on(element, '.m-wizard__step a.m-wizard__step-number', 'click', function() {
                let step = this.closest('.m-wizard__step');
                let steps = mUtil.parents(this, '.m-wizard__steps')
                let find = mUtil.findAll(steps, '.m-wizard__step');
                let num;

                for (let i = 0, j = find.length; i < j; i++) {
                    if (step === find[i]) {
                        num = (i + 1);
                        break;
                    }
                }

                if (num) {
                    if (the.options.manualStepForward === false) {
                        if (num < the.currentStep) {
                            Plugin.goTo(num);
                        }
                    } else {
                        Plugin.goTo(num);
                    }                    
                }
            });
        },

        /**
         * 跳转到指定步数
         *
         * @param number {number} 步数
         * @return {mWizard|*}
         */
        goTo: function(number) {
            //== 如果指定步数与当前显示步数一致,跳过
            if (number === the.currentStep || number > the.totalSteps || number < 0) {
                return;
            }

            //== 验证传入步数
            if (number) {
                number = parseInt(number);
            } else {
                number = Plugin.getNextStep();
            }

            //== 回调函数
            let callback;

            if (number > the.currentStep) {
                callback = Plugin.eventTrigger('beforeNext');
            } else {
                callback = Plugin.eventTrigger('beforePrev');
            }
            
            //== 如果已停止,跳过
            if (the.stopped === true) {
                the.stopped = false;
                return;
            }

            //== Continue if no exit
            if (callback !== false) {
                //== 触发 Before change 事件
                Plugin.eventTrigger('beforeChange');

                //== 设置当前步数
                the.currentStep = number;

                //== 更新 UI
                Plugin.updateUI();

                //== 触发 change 事件
                Plugin.eventTrigger('change');
            }

            //== 触发 afterNext/afterPrev 事件
            if (number > the.startStep) {
                Plugin.eventTrigger('afterNext');
            } else {
                Plugin.eventTrigger('afterPrev');
            }

            return the;
        },

        /**
         * 设置 step class
         */
        setStepClass: function() {
            if (Plugin.isLastStep()) {
                mUtil.addClass(element, 'm-wizard--step-last');
            } else {
                mUtil.removeClass(element, 'm-wizard--step-last');
            }

            if (Plugin.isFirstStep()) {
                mUtil.addClass(element, 'm-wizard--step-first');
            } else {
                mUtil.removeClass(element, 'm-wizard--step-first');
            }

            if (Plugin.isBetweenStep()) {
                mUtil.addClass(element, 'm-wizard--step-between');
            } else {
                mUtil.removeClass(element, 'm-wizard--step-between');
            }
        },
        /**
         * 更新 ui
         */
        updateUI: function() {
            //== 更新进度
            Plugin.updateProgress();

            //== 显示当前step指定target
            Plugin.handleTarget();

            //== Set classes
            Plugin.setStepClass();

            //== 更新nav class
            for (let i = 0, j = the.steps.length; i < j; i++) {
                mUtil.removeClass(the.steps[i], 'm-wizard__step--current m-wizard__step--done');
            }

            for (let i = 1; i < the.currentStep; i++) {
                mUtil.addClass(the.steps[i - 1], 'm-wizard__step--done');
            }
            
            mUtil.addClass(the.steps[the.currentStep - 1], 'm-wizard__step--current');
        },

        /**
         * 停止
         */
        stop: function() {
            the.stopped = true;
        },

        /**
         * 开始
         */
        start: function() {
            the.stopped = false;
        },

        /**
         * 检查是否是最后一步
         *
         * @return {boolean}
         */
        isLastStep: function() {
            return the.currentStep === the.totalSteps;
        },

        /**
         * 检查是否是第一步
         *
         * @return {boolean}
         */
        isFirstStep: function() {
            return the.currentStep === 1;
        },

        /**
         * 检查是不是前后都有step
         *
         * @return {boolean}
         */
        isBetweenStep: function() {
            return Plugin.isLastStep() === false && Plugin.isFirstStep() === false;
        },

        /**
         * 跳转到下一步
         */
        goNext: function() {
            return Plugin.goTo(Plugin.getNextStep());
        },

        /**
         * 跳转到上一步
         */
        goPrev: function() {
            return Plugin.goTo(Plugin.getPrevStep());
        },

        /**
         * 跳转到最后一步
         */
        goLast: function() {
            return Plugin.goTo(the.totalSteps);
        },

        /**
         * 跳转到第一步
         */
        goFirst: function() {
            return Plugin.goTo(1);
        },

        /**
         * 更新滚动条
         */
        updateProgress: function() {
            if (!the.progress) {
                return;
            }

            //== 更新滚动条
            if (mUtil.hasClass(element, 'm-wizard--1')) {
                let width = 100 * ((the.currentStep) / (the.totalSteps));
                let number = mUtil.find(element, '.m-wizard__step-number');
                let offset = parseInt(mUtil.css(number, 'width'));
                mUtil.css(the.progress, 'width', 'calc(' + width + '% + ' + (offset / 2) + 'px)');
            } else if (mUtil.hasClass(element, 'm-wizard--2')) {
                if (the.currentStep === 1) {
                    //return;
                }

                let progress = (the.currentStep - 1) * (100 * (1 / (the.totalSteps - 1)));

                if (mUtil.isInResponsiveRange('minimal-desktop-and-below')) {
                    mUtil.css(the.progress, 'height', progress + '%');
                } else {
                    mUtil.css(the.progress, 'width', progress + '%');
                }
            } else {
                let width = 100 * ((the.currentStep) / (the.totalSteps));
                mUtil.css(the.progress, 'width', width + '%');
            }
        },

        /**
         * Show/hide target content
         */
        handleTarget: function() {
            let step = the.steps[the.currentStep - 1];
            let target = mUtil.get(mUtil.attr(step, 'm-wizard-target'));
            let current = mUtil.find(element, '.m-wizard__form-step--current');
            
            mUtil.removeClass(current, 'm-wizard__form-step--current');
            mUtil.addClass(target, 'm-wizard__form-step--current');
        },

        /**
         * 获取下一步编号
         *
         * @return {number} 编号
         */
        getNextStep: function() {
            if (the.totalSteps >= (the.currentStep + 1)) {
                return the.currentStep + 1;
            } else {
                return the.totalSteps;
            }
        },

        /**
         * 获取上一步编号
         *
         * @return {number} 编号
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
            for (let i = 0; i < the.events.length; i++) {
                let event = the.events[i];
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
     * 设置默认属option
     *
     * @param options {object} option
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * 跳转到下一步
     */
    the.goNext = function() {
        return Plugin.goNext();
    };

    /**
     * 跳转到上一步
     */
    the.goPrev = function() {
        return Plugin.goPrev();
    };

    /**
     * 跳转到最后一步
     */
    the.goLast = function() {
        return Plugin.goLast();
    };

    /**
     * 停止
     */
    the.stop = function() {
        return Plugin.stop();
    };

    /**
     * 开始
     */
    the.start = function() {
        return Plugin.start();
    };

    /**
     * 跳转到第一步
     */
    the.goFirst = function() {
        return Plugin.goFirst();
    };

    /**
     * 跳转到指定步数
     *
     * @param number {number} 步数
     * @return {*|*}
     */
    the.goTo = function(number) {
        return Plugin.goTo(number);
    };

    /**
     * 获取当前步数
     *
     * @return {number|*} 步数
     */
    the.getStep = function() {
        return the.currentStep;
    };

    /**
     * 是否为最后一步
     *
     * @return {*|boolean}
     */
    the.isLastStep = function() {
        return Plugin.isLastStep();
    };

    /**
     * 是否为第一步
     *
     * @return {*|boolean}
     */
    the.isFirstStep = function() {
        return Plugin.isFirstStep();
    };

    /**
     * 添加事件
     *
     * @param name {string} 事件名称
     * @param handler {function} 回调函数
     * @return {*|mWizard}
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * 添加一次性事件
     *
     * @param name {string} 事件名称
     * @param handler {function} 回调函数
     * @return {*|mWizard}
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    //== 构造插件
    Plugin.construct.apply(the, [options]);

    return the;
};
(function ($) {

    let pluginName = 'mDatatable';
    let pfx = 'm-';
    let util = mUtil;

    if (typeof util === 'undefined') throw new Error('Util class is required and must be included before ' + pluginName);

    $.fn[pluginName] = function (options) {
        if ($(this).length === 0) {
            console.log('No ' + pluginName + ' element exist.');
            return;
        }

        // 全局变量
        let datatable = this;

        // 是否开调试
        // 1) 每次刷新会清除状态
        // 2) 输出一些日志
        datatable.debug = false;

        datatable.API = {
            record: null,
            value: null,
            params: null,
        };

        let Plugin = {
            /********************
             ** 私有方法
             ********************/
            isInit: false,
            offset: 110,
            stateId: 'meta',
            ajaxParams: {},

            init: function (options) {
                let isHtmlTable = false;
                // 数据源选项空是正常表
                if (options.data.source === null) {
                    Plugin.extractTable();
                    isHtmlTable = true;
                }

                Plugin.setupBaseDOM.call();
                Plugin.setupDOM(datatable.table);
                Plugin.spinnerCallback(true);

                // 设置查询条件
                Plugin.setDataSourceQuery(Plugin.getOption('data.source.read.params.query'));

                // 渲染后事件
                $(datatable).on(pfx + 'datatable--on-layout-updated', Plugin.afterRender);

                if (datatable.debug) Plugin.stateRemove(Plugin.stateId);

                // 初始化拓展方法
                $.each(Plugin.getOption('extensions'), function (extName, extOptions) {
                    if (typeof $.fn[pluginName][extName] === 'function')
                        new $.fn[pluginName][extName](datatable, extOptions);
                });

                // 获取数据
                if (options.data.type === 'remote' || options.data.type === 'local') {
                    if (options.data.saveState === false || options.data.saveState.cookie === false && options.data.saveState.webstorage === false) {
                        Plugin.stateRemove(Plugin.stateId);
                    }
                    // 如果数据在本地并且指定source
                    if (options.data.type === 'local' && typeof options.data.source === 'object') {
                        datatable.dataSet = datatable.originalDataSet = Plugin.dataMapCallback(options.data.source);
                    }
                    Plugin.dataRender();
                }

                if (!isHtmlTable) {
                    // 如果不是table元素,设置head
                    Plugin.setHeadTitle();
                    if (Plugin.getOption('layout.footer')) {
                        Plugin.setHeadTitle(datatable.tableFoot);
                    }
                }

                // 删除thead
                if (typeof options.layout.header !== 'undefined' &&
                    options.layout.header === false) {
                    $(datatable.table).find('thead').remove();
                }

                // 删除 footer
                if (typeof options.layout.footer !== 'undefined' &&
                    options.layout.footer === false) {
                    $(datatable.table).find('tfoot').remove();
                }

                // 如果数据在本地,更新布局
                if (options.data.type === null || options.data.type === 'local') {
                    Plugin.setupCellField.call();
                    Plugin.setupTemplateCell.call();

                    // setup nested datatable, if option enabled
                    Plugin.setupSubDatatable.call();

                    // setup extra system column properties
                    Plugin.setupSystemColumn.call();
                    Plugin.redraw();
                }

                $(window).resize(Plugin.fullRender);

                $(datatable).height('');

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
                let columns = [];
                let headers = $(datatable).find('tr:first-child th').get().map(function (cell, i) {
                    let field = $(cell).data('field');
                    if (typeof field === 'undefined') {
                        field = $(cell).text().trim();
                    }
                    let column = {field: field, title: field};
                    for (let ii in options.columns) {
                        if (options.columns[ii].field === field) {
                            column = $.extend(true, {}, options.columns[ii], column);
                        }
                    }
                    columns.push(column);
                    return field;
                });
                // auto create columns config
                options.columns = columns;

                let rowProp = [];
                let source = [];

                $(datatable).find('tr').each(function () {
                    if ($(this).find('td').length) {
                        rowProp.push($(this).prop('attributes'));
                    }
                    let td = {};
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

                // setup cell hover event
                Plugin.setupHover.call();

                if (typeof options.detail === 'undefined'
                    // temporary disable lock column in subtable
                    && Plugin.getDepth() === 1) {
                    // lock columns handler
                    Plugin.lockTable.call();
                }

                Plugin.columnHide.call();

                Plugin.resetScroll();

                if (!Plugin.isInit) {
                    $(datatable).trigger(pfx + 'datatable--on-init', {
                        table: $(datatable.wrap).attr('id'),
                        options: options
                    });
                    Plugin.isInit = true;
                }

                $(datatable).trigger(pfx + 'datatable--on-layout-updated', {table: $(datatable.wrap).attr('id')});
            },

            lockTable: function () {
                // todo; revise lock table responsive
                let lock = {
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
                        let enableLock = function (tablePart) {
                            // 检查是否已经锁定
                            if ($(tablePart).find('.' + pfx + 'datatable__lock').length > 0) {
                                Plugin.log('锁定容器已经存在: ', tablePart);
                                return;
                            }
                            // 检查是否是空表
                            if ($(tablePart).find('.' + pfx + 'datatable__row').length === 0) {
                                Plugin.log('不存在行: ', tablePart);
                                return;
                            }

                            // 锁定div容器
                            let lockLeft = $('<div/>').addClass(pfx + 'datatable__lock ' + pfx + 'datatable__lock--left');
                            let lockScroll = $('<div/>').addClass(pfx + 'datatable__lock ' + pfx + 'datatable__lock--scroll');
                            let lockRight = $('<div/>').addClass(pfx + 'datatable__lock ' + pfx + 'datatable__lock--right');

                            $(tablePart).find('.' + pfx + 'datatable__row').each(function () {
                                let rowLeft = $('<tr/>').addClass(pfx + 'datatable__row').appendTo(lockLeft);
                                let rowScroll = $('<tr/>').addClass(pfx + 'datatable__row').appendTo(lockScroll);
                                let rowRight = $('<tr/>').addClass(pfx + 'datatable__row').appendTo(lockRight);
                                $(this).find('.' + pfx + 'datatable__cell').each(function () {
                                    let locked = $(this).data('locked');
                                    if (typeof locked !== 'undefined') {
                                        if (typeof locked.left !== 'undefined' || locked === true) {
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
                                // 移除旧的
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
                            let tablePart = this;
                            if ($(this).find('.' + pfx + 'datatable__lock').length === 0) {
                                $(this).ready(function () {
                                    enableLock(tablePart);
                                });
                            }
                        });
                    },
                };
                lock.init();
                return lock;
            },

            /**
             * 调整大小后重新渲染
             */
            fullRender: function () {
                if (Plugin.isLocked()) {

                    $(datatable.tableHead).empty();
                    Plugin.setHeadTitle();
                    if (Plugin.getOption('layout.footer')) {
                        $(datatable.tableFoot).empty();
                        Plugin.setHeadTitle(datatable.tableFoot);
                    }

                    // todo; full render datatable for specific condition only
                    Plugin.spinnerCallback(true);
                    $(datatable.wrap).removeClass(pfx + 'datatable--loaded');

                    Plugin.insertData();
                }
            },

            lockEnabledColumns: function () {
                let screen = $(window).width();
                let columns = options.columns;
                let enabled = {left: [], right: []};
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
             * After render event, called by '+pfx+'-datatable--on-layout-updated
             *
             * @param e
             * @param args
             */
            afterRender: function (e, args) {
                if (args.table == $(datatable.wrap).attr('id')) {
                    $(datatable).ready(function () {
                        if (!Plugin.isLocked()) {
                            Plugin.redraw();
                            // work on non locked columns
                            if (Plugin.getOption('rows.autoHide')) {
                                Plugin.autoHide();
                                // reset row
                                $(datatable.table).find('.' + pfx + 'datatable__row').css('height', '');
                            }
                        }

                        Plugin.rowEvenOdd.call();

                        // 重新绘制锁定列表
                        if (Plugin.isLocked()) Plugin.redraw();
                        $(datatable.tableBody).css('visibility', '');
                        $(datatable.wrap).addClass(pfx + 'datatable--loaded');

                        Plugin.sorting.call();
                        Plugin.scrollbar.call();

                        // Plugin.hoverColumn.call();
                        Plugin.spinnerCallback(false);
                    });
                }
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
                    let row = $(this).closest('.' + pfx + 'datatable__row').addClass(pfx + 'datatable__row--hover');
                    let index = $(row).index() + 1;

                    // lock table
                    $(row).closest('.' + pfx + 'datatable__lock').parent().find('.' + pfx + 'datatable__row:nth-child(' + index + ')').addClass(pfx + 'datatable__row--hover');
                }).on('mouseleave', function () {
                    // normal table
                    let row = $(this).closest('.' + pfx + 'datatable__row').removeClass(pfx + 'datatable__row--hover');
                    let index = $(row).index() + 1;

                    // look table
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
                let containerWidth = $(datatable.tableHead).width();
                let lockLeft = $(datatable.tableHead).find('.' + pfx + 'datatable__lock--left').width();
                let lockRight = $(datatable.tableHead).find('.' + pfx + 'datatable__lock--right').width();

                if (typeof lockLeft === 'undefined') lockLeft = 0;
                if (typeof lockRight === 'undefined') lockRight = 0;

                let lockScroll = Math.floor(containerWidth - lockLeft - lockRight);
                $(datatable.table).find('.' + pfx + 'datatable__lock--scroll').css('width', lockScroll);

                return lockScroll;
            },

            /**
             * 拖拽调整大小
             *
             * todo; 暂未使用
             */
            dragResize: function () {
                let pressed = false;
                let start = undefined;
                let startX, startWidth;
                $(datatable.tableHead).find('.' + pfx + 'datatable__cell').mousedown(function (e) {
                    start = $(this);
                    pressed = true;
                    startX = e.pageX;
                    startWidth = $(this).width();
                    $(start).addClass(pfx + 'datatable__cell--resizing');

                }).mousemove(function (e) {
                    if (pressed) {
                        let i = $(start).index();
                        let tableBody = $(datatable.tableBody);
                        let ifLocked = $(start).closest('.' + pfx + 'datatable__lock');

                        if (ifLocked) {
                            let lockedIndex = $(ifLocked).index();
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
                    let theadHeight = $(datatable.tableHead).find('.' + pfx + 'datatable__row').height();
                    let tfootHeight = $(datatable.tableFoot).find('.' + pfx + 'datatable__row').height();
                    let bodyHeight = options.layout.height;
                    if (theadHeight > 0) {
                        bodyHeight -= theadHeight;
                    }
                    if (tfootHeight > 0) {
                        bodyHeight -= tfootHeight;
                    }
                    $(datatable.tableBody).css('max-height', bodyHeight);

                    // set scrollable area fixed height
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

                if (typeof options.layout.footer !== 'undefined' &&
                    options.layout.footer) {
                    // 创建表格tfoot元素
                    datatable.tableFoot = $(datatable.table).find('tfoot');
                    if ($(datatable.tableFoot).length === 0) {
                        datatable.tableFoot = $('<tfoot/>').appendTo(datatable.table);
                    }
                }
            },

            /**
             * 设置列data属性
             *
             * @param tableParts {string} 选择器
             */
            setupCellField: function (tableParts) {
                if (typeof tableParts === 'undefined') tableParts = $(datatable.table).children();
                let columns = options.columns;
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
                let columns = options.columns;
                $(tablePart).find('.' + pfx + 'datatable__row').each(function (tri, tr) {
                    // 获取row上面的data-obj属性
                    let obj = $(tr).data('obj') || {};

                    // 执行template之前的回调函数
                    let beforeTemplate = Plugin.getOption('rows.beforeTemplate');
                    if (typeof beforeTemplate === 'function') {
                        beforeTemplate($(tr), obj, tri);
                    }
                    // 如果 data object 是 undefined, 从表中收集
                    if (typeof obj === 'undefined') {
                        obj = {};
                        $(tr).find('.' + pfx + 'datatable__cell').each(function (tdi, td) {
                            // 根据列名称获取列设置
                            let column = $.grep(columns, function (n, i) {
                                return $(td).data('field') === n.field;
                            })[0];
                            if (typeof column !== 'undefined') {
                                obj[column['field']] = $(td).text();
                            }
                        });
                    }

                    $(tr).find('.' + pfx + 'datatable__cell').each(function (tdi, td) {
                        // 根据列名称获取列设置
                        let column = $.grep(columns, function (n, i) {
                            return $(td).data('field') === n.field;
                        })[0];
                        if (typeof column !== 'undefined') {
                            if (typeof column.dictType !== 'undefined') {
                                column.template = function (row) {
                                    let dicts = null;
                                    if (typeof column.dictType === 'string') {
                                        dicts = mTool.getSysDictsObject(column.dictType);
                                    } else {
                                        dicts = column.dictType;
                                    }
                                    return mTool.getDictElement(row[column.field], dicts);
                                }
                            }
                            // 列模板
                            if (typeof column.template !== 'undefined') {
                                let finalValue = '';
                                // 模板设置
                                if (typeof column.template === 'string') {
                                    finalValue = Plugin.dataPlaceholder(column.template, obj);
                                }
                                // 模板回调函数
                                if (typeof column.template === 'function') {
                                    finalValue = column.template(obj, tri, datatable);
                                }
                                let span = document.createElement('span');
                                span.innerHTML = finalValue;
                                // 用span包起来插入到td中
                                $(td).html(span);

                                // 设置 span overflow
                                if (typeof column.overflow !== 'undefined') {
                                    $(span).css('overflow', column.overflow);
                                    $(span).css('position', 'relative');
                                }
                            }
                        }
                    });

                    // 执行template之后的回调函数
                    let afterTemplate = Plugin.getOption('rows.afterTemplate');
                    if (typeof afterTemplate === 'function') {
                        afterTemplate($(tr), obj, tri);
                    }
                });

                $(tablePart).find('.table-actions').each(function () {
                    mApp.initTooltip($(this));
                });
            },

            /**
             * Setup extra system column properties
             * 设置额外的列
             * Note: selector checkbox, subtable toggle
             * 比如: checkbox
             */
            setupSystemColumn: function () {
                datatable.dataSet = datatable.dataSet || [];
                // no records available
                if (datatable.dataSet.length === 0) return;

                let columns = options.columns;
                $(datatable.tableBody).find('.' + pfx + 'datatable__row').each(function (tri, tr) {
                    $(tr).find('.' + pfx + 'datatable__cell').each(function (tdi, td) {
                        // 根据列名获取列设置
                        let column = $.grep(columns, function (n, i) {
                            return $(td).data('field') === n.field;
                        })[0];
                        if (typeof column !== 'undefined') {
                            let value = $(td).text();

                            // 启用列选择器
                            if (typeof column.selector !== 'undefined' && column.selector !== false) {
                                // 检查checkbox是否已经存在
                                if ($(td).find('.' + pfx + 'checkbox [type="checkbox"]').length > 0 || '#' == value) return;
                                $(td).addClass(pfx + 'datatable__cell--check');
                                // 添加 checkbox
                                let chk = $('<label/>').addClass(pfx + 'checkbox ' + pfx + 'checkbox--single').append($('<input/>').attr('type', 'checkbox').attr('value', value).on('click', function () {
                                    if ($(this).is(':checked')) {
                                        // 添加已勾选class
                                        Plugin.setActive(this);
                                    } else {
                                        // 移除已勾选class
                                        Plugin.setInactive(this);
                                    }
                                })).append($('<span/>'));

                                // 指定class
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
                 *
                 * @param tr {jquery}
                 */
                let initCheckbox = function (tr) {
                    // 获取列设置
                    let column = $.grep(columns, function (n, i) {
                        return typeof n.selector !== 'undefined' && n.selector !== false;
                    })[0];

                    if (typeof column !== 'undefined') {
                        // 启用列checkbox
                        if (typeof column.selector !== 'undefined' && column.selector !== false) {
                            let td = $(tr).find('[data-field="' + column.field + '"]');
                            // 检查checkbox是否已经存在
                            if ($(td).find('.' + pfx + 'checkbox [type="checkbox"]').length > 0) return;
                            $(td).addClass(pfx + 'datatable__cell--check');

                            // 添加 checkbox
                            let chk = $('<label/>').addClass(pfx + 'checkbox ' + pfx + 'checkbox--single ' + pfx + 'checkbox--all').append($('<input/>').attr('type', 'checkbox').on('click', function () {
                                if ($(this).is(':checked')) {
                                    Plugin.setActiveAll(true);
                                } else {
                                    Plugin.setActiveAll(false);
                                }
                            })).append($('<span/>'));

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
                let containerWidth = $(datatable.tableHead).width();

                // 为排序图标保留的偏移量
                let sortOffset = 20;

                // 获取总列数
                let columns = $(datatable.tableHead).find('.' + pfx + 'datatable__row:first-child').find('.' + pfx + 'datatable__cell:visible').length;
                if (columns > 0) {
                    // 删除保留排序图标宽度
                    containerWidth = containerWidth - (sortOffset * columns);
                    let minWidth = Math.floor(containerWidth / columns);

                    // 最小宽度
                    if (minWidth <= Plugin.offset) {
                        minWidth = Plugin.offset;
                    }

                    $(datatable.table).find('.' + pfx + 'datatable__row').find('.' + pfx + 'datatable__cell:visible').each(function (tdi, td) {
                        let width = minWidth;
                        let dataWidth = $(td).data('width');
                        if (typeof dataWidth !== 'undefined') {
                            width = dataWidth;
                        }
                        $(td).children().css('width', parseInt(width));
                    });
                }

                return datatable;
            },

            /**
             * 调整高度以匹配容器大小
             */
            adjustCellsHeight: function () {
                $.each($(datatable.table).children(), function (part, tablePart) {
                    let totalRows = $(tablePart).find('.' + pfx + 'datatable__row').first().parent().find('.' + pfx + 'datatable__row').length;
                    for (let i = 1; i <= totalRows; i++) {
                        let rows = $(tablePart).find('.' + pfx + 'datatable__row:nth-child(' + i + ')');
                        if ($(rows).length > 0) {
                            let maxHeight = Math.max.apply(null, $(rows).map(function () {
                                return $(this).height();
                            }).get());
                            $(rows).css('height', Math.ceil(parseInt(maxHeight)));
                        }
                    }
                });
            },

            /**
             * 设置table DOM class
             */
            setupDOM: function (table) {
                // set table classes
                $(table).find('> thead').addClass(pfx + 'datatable__head');
                $(table).find('> tbody').addClass(pfx + 'datatable__body');
                $(table).find('> tfoot').addClass(pfx + 'datatable__foot');
                $(table).find('tr').addClass(pfx + 'datatable__row');
                $(table).find('tr > th, tr > td').addClass(pfx + 'datatable__cell');
                $(table).find('tr > th, tr > td').each(function (i, td) {
                    if ($(td).find('span').length === 0) {
                        $(td).wrapInner($('<span/>').css('width', Plugin.offset));
                    }
                });
            },

            /**
             * 默认滚动条
             *
             * @returns {{tableLocked: null, init: init, onScrolling: onScrolling}}
             */
            scrollbar: function () {
                let scroll = {
                    scrollable: null,
                    tableLocked: null,
                    mcsOptions: {
                        scrollInertia: 0,
                        autoDraggerLength: true,
                        autoHideScrollbar: true,
                        autoExpandScrollbar: false,
                        alwaysShowScrollbar: 0,
                        mouseWheel: {
                            scrollAmount: 120,
                            preventDefault: false,
                        },
                        advanced: {
                            updateOnContentResize: true,
                            autoExpandHorizontalScroll: true,
                        },
                        theme: 'minimal-dark',
                    },
                    init: function () {
                        let screen = util.getViewPort().width;
                        // 设置滚动条
                        if (options.layout.scroll) {
                            // 设置滚动class
                            $(datatable.wrap).addClass(pfx + 'datatable--scroll');

                            let scrollable = $(datatable.tableBody).find('.' + pfx + 'datatable__lock--scroll');

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
                            } else if ($(datatable.tableBody).find('.' + pfx + 'datatable__row').length > 0) {
                                scroll.scrollHead = $(datatable.tableHead).find('> .' + pfx + 'datatable__row');
                                scroll.scrollFoot = $(datatable.tableFoot).find('> .' + pfx + 'datatable__row');
                                if (Plugin.getOption('layout.customScrollbar') && util.detectIE() != 10 && screen > util.getBreakpoint('lg')) {
                                    scroll.initCustomScrollbar(datatable.tableBody);
                                } else {
                                    scroll.initDefaultScrollbar(datatable.tableBody);
                                }
                            }
                        } else {
                            $(datatable.table).// css('height', 'auto').
                            css('overflow-x', 'auto');
                        }
                    },
                    initDefaultScrollbar: function (scrollable) {
                        $(scrollable).css('overflow', 'auto').off().on('scroll', scroll.onScrolling);
                    },
                    onScrolling: function (e) {
                        let left = $(this).scrollLeft();
                        let top = $(this).scrollTop();
                        $(scroll.scrollHead).css('left', -left);
                        $(scroll.scrollFoot).css('left', -left);
                        $(scroll.tableLocked).each(function (i, table) {
                            $(table).css('top', -top);
                        });
                    },
                    initCustomScrollbar: function (scrollable) {
                        scroll.scrollable = scrollable;
                        Plugin.initScrollbar(scrollable);
                        $(scrollable).off().on('scroll', scroll.onScrolling);
                    },
                };
                scroll.init();
                return scroll;
            },

            /**
             * 初始化自定义滚动条和复位位置
             * @param element
             * @param options
             */
            initScrollbar: function (element, options) {
                $(datatable.tableBody).css('overflow', '');
                if (util.hasClass(element, 'ps')) {
                    $(element).data('ps').update();
                } else {
                    let ps = new PerfectScrollbar(element);
                    $(element).data('ps', ps);
                }
            },

            /**
             * 根据options.columns设置表头标题
             */
            setHeadTitle: function (tablePart) {
                if (typeof tablePart === 'undefined') tablePart = datatable.tableHead;
                tablePart = $(tablePart)[0];
                let columns = options.columns;
                let row = tablePart.getElementsByTagName('tr')[0];
                let ths = tablePart.getElementsByTagName('td');

                if (typeof row === 'undefined') {
                    row = document.createElement('tr');
                    tablePart.appendChild(row);
                }

                $.each(columns, function (i, column) {
                    let th = ths[i];
                    if (typeof th === 'undefined') {
                        th = document.createElement('th');
                        row.appendChild(th);
                    }

                    // 设置列标题
                    if (typeof column['title'] !== 'undefined') {
                        th.innerHTML = column.title;
                        th.setAttribute('data-field', column.field);
                        util.addClass(th, column.class);
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
                        let align = typeof datatable.textAlign[column.textAlign] !== 'undefined' ? datatable.textAlign[column.textAlign] : '';
                        util.addClass(th, align);
                    }
                });
                Plugin.setupDOM(tablePart);
            },

            /**
             * Initiate to get remote or local data via ajax
             * 通过Ajax获取数据或本地数据
             */
            dataRender: function (action) {
                $(datatable.table).siblings('.' + pfx + 'datatable__pager').removeClass(pfx + 'datatable--paging-loaded');

                let buildMeta = function () {
                    datatable.dataSet = datatable.dataSet || [];
                    Plugin.localDataUpdate();
                    // local pagination meta
                    let meta = Plugin.getDataSourceParam('page');
                    if (meta.size === 0) {
                        meta.size = options.data.pageSize || 10;
                    }
                    meta.total = datatable.dataSet.length;
                    let start = Math.max(meta.size * (meta.current - 1), 0);
                    let end = Math.min(start + meta.size, meta.total);
                    datatable.dataSet = $(datatable.dataSet).slice(start, end);
                    return meta;
                };

                let afterGetData = function (result) {
                    if (mTool.httpCode.SUCCESS !== result.code) {
                        mTool.errorTip('查询数据失败', result.message);
                        result.data = [];
                        result.data.current = 0;
                        result.data.site = 15;
                        result.data.total = 0;

                    }
                    let localPagingCallback = function (ctx, meta) {
                        if (!$(ctx.pager).hasClass(pfx + 'datatable--paging-loaded')) {
                            $(ctx.pager).remove();
                            ctx.init(meta);
                        }
                        $(ctx.pager).off().on(pfx + 'datatable--on-goto-page', function (e) {
                            $(ctx.pager).remove();
                            ctx.init(meta);
                        });

                        let start = Math.max(meta.size * (meta.current - 1), 0);
                        let end = Math.min(start + meta.size, meta.total);

                        Plugin.localDataUpdate();
                        datatable.dataSet = $(datatable.dataSet).slice(start, end);

                        // 将数据插入到表格中
                        Plugin.insertData();
                    };
                    $(datatable.wrap).removeClass(pfx + 'datatable--error');
                    // 启用分页
                    if (options.pagination) {
                        if (options.data.serverPaging && options.data.type !== 'local') {
                            // 服务器端分页
                            let serverMeta = result.data;
                            if (serverMeta !== null) {
                                Plugin.paging(serverMeta);
                            } else {
                                Plugin.paging(buildMeta(), localPagingCallback);
                            }
                        } else {
                            Plugin.paging(buildMeta(), localPagingCallback);
                        }
                    } else {
                        // 禁用分页
                        Plugin.localDataUpdate();
                    }
                    // 将数据插入到表格中
                    Plugin.insertData();
                };

                // 数据在本地
                if (options.data.type === 'local'
                    || options.data.serverSorting === false && action === 'sort'
                    || options.data.serverFiltering === false && action === 'search'
                ) {
                    afterGetData();
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
                let params = Plugin.getDataSourceParam();

                // 获取行属性
                let pagination = params.page;
                let start = (Math.max(pagination.page, 1) - 1) * pagination.size;
                let end = Math.min(pagination.page, pagination.pages) * pagination.size;
                let rowProps = {};
                if (typeof options.data.attr.rowProps !== 'undefined' && options.data.attr.rowProps.length) {
                    rowProps = options.data.attr.rowProps.slice(start, end);
                }

                // todo; fix performance
                let tableBody = document.createElement('tbody');
                tableBody.style.visibility = 'hidden';
                let colLength = options.columns.length;

                $.each(datatable.dataSet, function (rowIndex, row) {
                    let tr = document.createElement('tr');
                    tr.setAttribute('data-row', rowIndex);
                    if (typeof row.id !== 'undefined') {
                        tr.setAttribute('data-id', row.id);
                    }
                    // 设置row中的data-obj属性
                    $(tr).data('obj', row);

                    if (typeof rowProps[rowIndex] !== 'undefined') {
                        $.each(rowProps[rowIndex], function () {
                            tr.setAttribute(this.name, this.value);
                        });
                    }

                    let cellIndex = 0;
                    let tds = [];
                    for (let a = 0; a < colLength; a += 1) {
                        let column = options.columns[a];
                        let classes = [];
                        // 添加排序class
                        if (Plugin.getObject('sort.field', params) === column.field) {
                            classes.push(pfx + 'datatable__cell--sorted');
                        }

                        // 设置文本对齐方式
                        if (typeof column.textAlign !== 'undefined') {
                            let align = typeof datatable.textAlign[column.textAlign] !==
                            'undefined' ? datatable.textAlign[column.textAlign] : '';
                            classes.push(align);
                        }

                        // 添加class
                        if (typeof column.class !== 'undefined') {
                            classes.push(column.class);
                        }

                        let td = document.createElement('td');
                        util.addClass(td, classes.join(' '));
                        td.setAttribute('data-field', column.field);
                        td.innerHTML = Plugin.getObject(column.field, row);
                        tr.appendChild(td);
                    }

                    tableBody.appendChild(tr);
                });

                // 显示无记录消息
                if (datatable.dataSet.length === 0) {
                    let errorSpan = document.createElement('span');
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
             * 调用ajax获取json数据
             */
            getData: function () {
                Plugin.spinnerCallback(true);

                let ajaxParams = {
                    contentType: 'application/json',
                    dataType: 'json',
                    method: 'GET',
                    data: {},
                    timeout: Plugin.getOption('data.source.read.timeout') || 30000, // 超时时间,默认30s
                };

                if (options.data.type === 'local') {
                    ajaxParams.url = options.data.source;
                }

                if (options.data.type === 'remote') {
                    ajaxParams.url = Plugin.getOption('data.source.read.url');
                    if (typeof ajaxParams.url !== 'string') ajaxParams.url = Plugin.getOption('data.source.read');
                    if (typeof ajaxParams.url !== 'string') ajaxParams.url = Plugin.getOption('data.source');
                    ajaxParams.headers = Plugin.getOption('data.source.read.headers');
                    ajaxParams.method = Plugin.getOption('data.source.read.method') || 'POST';

                    let data = Plugin.getDataSourceParam();
                    // 如果没有启用服务器分页,删除参数中的分页信息
                    if (!Plugin.getOption('data.serverPaging')) {
                        delete data['page'];
                    }
                    // 将排序信息放到参数中
                    if (typeof data.sort !== 'undefined') {
                        if ('asc' == data.sort.sort) {
                            data.page.ascs = [data.sort.field];
                        } else if ('desc' == data.sort.sort) {
                            data.page.descs = [data.sort.field];
                        }
                        // data.ascs = data.sort.field;
                        // data.page.sort = data.sort.sort;
                    }
                    delete data['sort'];

                    // 表单内参数是否需要带入
                    if (Plugin.getOption('data.source.autoQuery')) {
                        let formParams = mTool.queryParams($(datatable.table).parents('form.m-form').find('.query-modular input,.query-modular select'));
                        ajaxParams.data = $.extend(true, ajaxParams.data, formParams);
                    }
                    ajaxParams.data = $.extend(true, ajaxParams.data, data, Plugin.getOption('data.source.read.params'));
                    ajaxParams.data = JSON.stringify(ajaxParams.data);
                }

                return $.ajax(ajaxParams).done(function (response, textStatus, jqXHR) {
                    datatable.lastResponse = response;
                    datatable.dataSet = datatable.originalDataSet = Plugin.dataMapCallback(response);
                    Plugin.setAutoColumns();
                    $(datatable).trigger(pfx + 'datatable--on-ajax-done', [datatable.dataSet]);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    $(datatable).trigger(pfx + 'datatable--on-ajax-fail', [jqXHR]);
                    $(datatable.tableBody).html($('<span/>').addClass(pfx + 'datatable--error').html(Plugin.getOption('translate.records.noRecords')));
                    $(datatable.wrap).addClass(pfx + 'datatable--error ' + pfx + 'datatable--loaded');
                    Plugin.spinnerCallback(false);
                }).always(function () {
                });
            },

            /**
             * 分页
             *
             * @param meta if null, 本地分页, 否则服务器分页
             * @param callback
             */
            paging: function (meta, callback) {
                let pg = {
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

                        // todo; 如果meta为空会报错
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
                            total: pg.meta.total,
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
                        let icons = Plugin.getOption('layout.icons.pagination');
                        let title = Plugin.getOption('translate.toolbar.pagination.items.default');
                        // 分页根元素
                        pg.pager = $('<div/>').addClass(pfx + 'datatable__pager ' + pfx + 'datatable--paging-loaded clearfix');
                        // 页码链接
                        let pagerNumber = $('<ul/>').addClass(pfx + 'datatable__pager-nav');
                        pg.pagerLayout['pagination'] = pagerNumber;

                        // 第一页/上一页 按钮
                        $('<li/>').append($('<a/>').attr('title', title.first).addClass(pfx + 'datatable__pager-link ' + pfx + 'datatable__pager-link--first').append($('<i/>').addClass(icons.first)).on('click', pg.gotoMorePage).attr('data-page', 1)).appendTo(pagerNumber);
                        $('<li/>').append($('<a/>').attr('title', title.prev).addClass(pfx + 'datatable__pager-link ' + pfx + 'datatable__pager-link--prev').append($('<i/>').addClass(icons.prev)).on('click', pg.gotoMorePage)).appendTo(pagerNumber);

                        $('<li/>').append($('<a/>').attr('title', title.more).addClass(pfx + 'datatable__pager-link ' + pfx + 'datatable__pager-link--more-prev').html($('<i/>').addClass(icons.more)).on('click', pg.gotoMorePage)).appendTo(pagerNumber);

                        $('<li/>').append($('<input/>').attr('type', 'text').addClass(pfx + 'pager-input form-control').attr('title', title.input).on('keyup', function () {
                            //  当 keyup 更新 [data-page]
                            $(this).attr('data-page', Math.abs($(this).val()));
                        }).on('keypress', function (e) {
                            // 按回车按钮
                            if (e.which === 13) pg.gotoMorePage(e);
                        })).appendTo(pagerNumber);

                        let pagesNumber = Plugin.getOption('toolbar.items.pagination.pages.desktop.pagesNumber');
                        let end = Math.ceil(pg.meta.current / pagesNumber) * pagesNumber;
                        let start = end - pagesNumber;
                        if (end > pg.meta.pages) {
                            end = pg.meta.pages;
                        }
                        for (let x = start; x < end; x++) {
                            let pageNumber = x + 1;
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
                        let pageSizeSelect = $('<select/>').addClass('selectpicker ' + pfx + 'datatable__pager-size').attr('title', Plugin.getOption('translate.toolbar.pagination.items.default.select')).attr('data-width', '70px').val(pg.meta.size).on('change', pg.updatePerpage).prependTo(pg.pagerLayout['info']);

                        let pageSizes = Plugin.getOption('toolbar.items.pagination.pageSizeSelect');
                        // 如果未指定页大小设置,使用默认设置
                        if (pageSizes.length == 0) pageSizes = [10, 15, 20, 30, 50, 100];
                        $.each(pageSizes, function (i, size) {
                            let display = size;
                            if (size === -1) display = 'All';
                            $('<option/>').attr('value', size).html(display).appendTo(pageSizeSelect);
                        });

                        // 初始化下拉插件
                        $(datatable).ready(function () {
                            $('.selectpicker').selectpicker().siblings('.dropdown-toggle').attr('title', Plugin.getOption(
                                'translate.toolbar.pagination.items.default.select'));
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
                            }
                        );
                    },
                    gotoMorePage: function (e) {
                        e.preventDefault();

                        if ($(this).attr('disabled') === 'disabled') return false;

                        let page = $(this).attr('data-page');

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
                     * @param page {int} 页码
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

                        // 更新 datasource 参数
                        Plugin.setDataSourceParam('page', {
                            current: pg.meta.current,
                            pages: pg.meta.pages,
                            size: pg.meta.size,
                            total: pg.meta.total,
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
                            let pagerNumber = $(pg.pager).find('.' + pfx + 'datatable__pager-nav');

                            // 设置当前页按钮状态
                            $(pagerNumber).find('.' + pfx + 'datatable__pager-link--active').removeClass(pfx + 'datatable__pager-link--active');
                            $(pagerNumber).find('.' + pfx + 'datatable__pager-link-number[data-page="' + meta.current + '"]').addClass(pfx + 'datatable__pager-link--active');

                            // 设置上一页下一页按钮页码
                            $(pagerNumber).find('.' + pfx + 'datatable__pager-link--prev').attr('data-page', Math.max(meta.current - 1, 1));
                            $(pagerNumber).find('.' + pfx + 'datatable__pager-link--next').attr('data-page', Math.min(meta.current + 1, meta.pages));

                            // 设置当前页页码
                            $(pg.pager).each(function () {
                                $(this).find('.' + pfx + 'pager-input[type="text"]').prop('value', meta.page);
                            });

                            $(pg.pager).find('.' + pfx + 'datatable__pager-nav').show();
                            if (meta.pages <= 1) {
                                // 如果小于2页,隐藏工具条
                                $(pg.pager).find('.' + pfx + 'datatable__pager-nav').hide();
                            }

                            // 更新 datasource 参数
                            Plugin.setDataSourceParam('page', {
                                current: pg.meta.current,
                                pages: pg.meta.pages,
                                size: pg.meta.size,
                                total: pg.meta.total,
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
                    updateInfo: function () {
                        let start = 0, end = 0;
                        if (pg.meta.total != 0) {
                            start = Math.max(pg.meta.size * (pg.meta.current - 1) + 1, 1);
                            end = Math.min(start + pg.meta.size - 1, pg.meta.total);
                        }
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

                        let pagerNumber = $(datatable.table).siblings('.' + pfx + 'datatable__pager').find('.' + pfx + 'datatable__pager-nav');
                        if ($(pagerNumber).length === 0) return;

                        let currentPage = Plugin.getCurrentPage();
                        let pagerInput = $(pagerNumber).find('.' + pfx + 'pager-input').closest('li');

                        // 重置
                        $(pagerNumber).find('li').show();

                        // 更新分页工具条
                        $.each(Plugin.getOption('toolbar.items.pagination.pages'),
                            function (mode, option) {
                                if (util.isInResponsiveRange(mode)) {
                                    switch (mode) {
                                        case 'desktop':
                                        case 'tablet':
                                            let end = Math.ceil(currentPage / option.pagesNumber) * option.pagesNumber;
                                            let start = end - option.pagesNumber;
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
                     *
                     */
                    paginationUpdate: function () {
                        let pager = $(datatable.table).siblings('.' + pfx + 'datatable__pager').find('.' + pfx + 'datatable__pager-nav'),
                            pagerMorePrev = $(pager).find('.' + pfx + 'datatable__pager-link--more-prev'),
                            pagerMoreNext = $(pager).find('.' + pfx + 'datatable__pager-link--more-next'),
                            pagerFirst = $(pager).find('.' + pfx + 'datatable__pager-link--first'),
                            pagerPrev = $(pager).find('.' + pfx + 'datatable__pager-link--prev'),
                            pagerNext = $(pager).find('.' + pfx + 'datatable__pager-link--next'),
                            pagerLast = $(pager).find('.' + pfx + 'datatable__pager-link--last');

                        // 获取可见页码
                        let pagerNumber = $(pager).find('.' + pfx + 'datatable__pager-link-number');
                        // 获取第一个页码的上一页页码
                        let morePrevPage = Math.max($(pagerNumber).first().data('page') - 1, 1);
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
                        let moreNextPage = Math.min($(pagerNumber).last().data('page') + 1, pg.meta.pages);
                        $(pagerMoreNext).each(function (i, prev) {
                            $(pagerMoreNext).attr('data-page', moreNextPage).show();
                        });

                        // 判断是否要显示下一页按钮
                        if (moreNextPage === pg.meta.pages && moreNextPage === $(pagerNumber).last().data('page')) {
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
                        let nav = Plugin.getOption('toolbar.items.pagination.navigation');
                        if (!nav.first) $(pagerFirst).remove();
                        if (!nav.prev) $(pagerPrev).remove();
                        if (!nav.next) $(pagerNext).remove();
                        if (!nav.last) $(pagerLast).remove();
                    },
                };
                pg.init(meta);
                return pg;
            },

            /**
             * 根据屏幕尺寸与设置,隐藏/显示列
             * options[columns][i][responsive][visible/hidden]
             */
            columnHide: function () {
                let screen = util.getViewPort().width;
                // foreach columns setting
                $.each(options.columns, function (i, column) {
                    if (typeof column.responsive !== 'undefined') {
                        let field = column.field;
                        let tds = $.grep($(datatable.table).find('.' + pfx + 'datatable__cell'), function (n, i) {
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
                let subTableCallback = Plugin.getOption('detail.content');
                if (typeof subTableCallback !== 'function') return;

                // subtable already exist
                if ($(datatable.table).find('.' + pfx + 'datatable__subtable').length > 0) return;

                $(datatable.wrap).addClass(pfx + 'datatable--subtable');

                options.columns[0]['subtable'] = true;

                // toggle on open sub table
                let toggleSubTable = function (e) {
                    e.preventDefault();
                    // get parent row of this subtable
                    let parentRow = $(this).closest('.' + pfx + 'datatable__row');

                    // get subtable row for sub table
                    let subTableRow = $(parentRow).next('.' + pfx + 'datatable__row-subtable');
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

                    let subTable = $(subTableRow).find('.' + pfx + 'datatable__subtable');

                    // get id from first column of parent row
                    let primaryKey = $(this).closest('[data-field]:first-child').find('.' + pfx + 'datatable__toggle-subtable').data('value');

                    let icon = $(this).find('i').removeAttr('class');

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

                let columns = options.columns;
                $(datatable.tableBody).find('.' + pfx + 'datatable__row').each(function (tri, tr) {
                    $(tr).find('.' + pfx + 'datatable__cell').each(function (tdi, td) {
                        // get column settings by field
                        let column = $.grep(columns, function (n, i) {
                            return $(td).data('field') === n.field;
                        })[0];
                        if (typeof column !== 'undefined') {
                            let value = $(td).text();
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
             * Datasource mapping callback
             */
            dataMapCallback: function (raw) {
                // static dataset array
                let dataSet = raw;
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
             *
             * @param block {boolean}
             */
            spinnerCallback: function (block) {
                if (block) {
                    if (!Plugin.isSpinning) {
                        // 获取遮罩设置
                        let spinnerOptions = Plugin.getOption('layout.spinner');
                        if (spinnerOptions.message === true) {
                            // 使用默认提示文字
                            spinnerOptions.message = Plugin.getOption('translate.records.processing');
                        }
                        Plugin.isSpinning = true;
                        if (typeof mApp !== 'undefined') {
                            mApp.block(datatable, spinnerOptions);
                        }
                    }
                } else {
                    Plugin.isSpinning = false;
                    if (typeof mApp !== 'undefined') {
                        mApp.unblock(datatable);
                    }
                }
            },

            /**
             * 默认排序回调函数
             *
             * @param data {array} 数据
             * @param sort {string} asc|desc 排序方式
             * @param column {object} 排序的列
             * @returns {*|Array.<T>|{sort, field}|{asc, desc}}
             */
            sortCallback: function (data, sort, column) {
                let type = column['type'] || 'string';
                let format = column['format'] || '';
                let field = column['field'];

                return $(data).sort(function (a, b) {
                    let aField = a[field];
                    let bField = b[field];

                    switch (type) {
                        case 'date':
                            if (typeof moment === 'undefined') {
                                throw new Error('Moment.js 未引入.');
                            }
                            let diff = moment(aField, format).diff(moment(bField, format));
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
             * 滚动时自动隐藏列
             */
            autoHide: function () {
                $(datatable.table).find('.' + pfx + 'datatable__cell').show();
                $(datatable.tableBody).each(function () {
                    while ($(this)[0].offsetWidth < $(this)[0].scrollWidth) {
                        $(datatable.table).find('.' + pfx + 'datatable__row').each(function (i) {
                            let cell = $(this).find('.' + pfx + 'datatable__cell').not(':hidden').last();
                            $(cell).hide();
                        });
                        Plugin.adjustCellsWidth.call();
                    }
                });

                let toggleHiddenColumns = function (e) {
                    e.preventDefault();

                    let row = $(this).closest('.' + pfx + 'datatable__row');
                    let detailRow = $(row).next();

                    if (!$(detailRow).hasClass(pfx + 'datatable__row-detail')) {
                        $(this).find('i').removeClass(Plugin.getOption('layout.icons.rowDetail.collapse')).addClass(Plugin.getOption('layout.icons.rowDetail.expand'));

                        let hidden = $(row).find('.' + pfx + 'datatable__cell:hidden').clone().show();

                        detailRow = $('<tr/>').addClass(pfx + 'datatable__row-detail').insertAfter(row);
                        let detailRowTd = $('<td/>').addClass(pfx + 'datatable__detail').attr('colspan', Plugin.getTotalColumns()).appendTo(detailRow);

                        let detailSubTable = $('<table/>');
                        $(hidden).each(function () {
                            let field = $(this).data('field');
                            let column = $.grep(options.columns, function (n, i) {
                                return field === n.field;
                            })[0];
                            $(detailSubTable).append($('<tr class="' + pfx + 'datatable__row"></tr>').append($('<td class="' + pfx + 'datatable__cell"></td>').append($('<span/>').css('width', Plugin.offset).append(column.title))).append(this));
                        });
                        $(detailRowTd).append(detailSubTable);

                    } else {
                        $(this).find('i').removeClass(Plugin.getOption('layout.icons.rowDetail.expand')).addClass(Plugin.getOption('layout.icons.rowDetail.collapse'));
                        $(detailRow).remove();
                    }
                };

                // 改变列隐藏/显示
                $(datatable.tableBody).find('.' + pfx + 'datatable__row').each(function () {
                    $(this).prepend($('<td/>').addClass(pfx + 'datatable__cell ' + pfx + 'datatable__toggle--detail').append($('<a/>').addClass(pfx + 'datatable__toggle-detail').attr('href', '').on('click', toggleHiddenColumns).append($('<i/>').css('width', '21px').// maintain width for both icons expand and collapse
                    addClass(Plugin.getOption('layout.icons.rowDetail.collapse')))));

                    // 如果存在子表
                    if ($(datatable.tableHead).find('.' + pfx + 'datatable__toggle-detail').length === 0) {
                        $(datatable.tableHead).find('.' + pfx + 'datatable__row').first().prepend('<th class="' + pfx + 'datatable__cell ' + pfx + 'datatable__toggle-detail"><span style="width: 21px"></span></th>');
                        $(datatable.tableFoot).find('.' + pfx + 'datatable__row').first().prepend('<th class="' + pfx + 'datatable__cell ' + pfx + 'datatable__toggle-detail"><span style="width: 21px"></span></th>');
                    } else {
                        $(datatable.tableHead).find('.' + pfx + 'datatable__toggle-detail').find('span').css('width', '21px');
                    }
                });
            },

            /**
             * column hover
             */
            hoverColumn: function () {
                $(datatable.tableBody).on('mouseenter', '.' + pfx + 'datatable__cell', function () {
                    let colIdx = $(Plugin.cell(this).nodes()).index();
                    $(Plugin.cells().nodes()).removeClass(pfx + 'datatable__cell--hover');
                    $(Plugin.column(colIdx).nodes()).addClass(pfx + 'datatable__cell--hover');
                });
            },

            /**
             * 自动将服务器返回数据第一条作为表格标题
             */
            setAutoColumns: function () {
                if (Plugin.getOption('data.autoColumns')) {
                    $.each(datatable.dataSet[0], function (k, v) {
                        let found = $.grep(options.columns, function (n, i) {
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
             *
             * @returns {*|boolean}
             */
            isLocked: function () {
                return util.hasClass(datatable.wrap[0], pfx + 'datatable--lock') || false;
            },

            /**
             * 获取用于宽度计算的元素的额外空间 (包括 padding, margin, border)
             *
             * @param element
             * @returns {number}
             */
            getExtraSpace: function (element) {
                let padding = parseInt($(element).css('paddingRight')) +
                    parseInt($(element).css('paddingLeft'));
                let margin = parseInt($(element).css('marginRight')) +
                    parseInt($(element).css('marginLeft'));
                let border = Math.ceil(
                    $(element).css('border-right-width').replace('px', ''));
                return padding + margin + border;
            },

            /**
             * 将数组的数据插入{{}}模板占位符中
             *
             * @param template {string} 模板
             * @param data {array} 数据
             * @returns {*}
             */
            dataPlaceholder: function (template, data) {
                let result = template;
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
                let id = $(datatable).attr('id');
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
                let depth = 0;
                let table = datatable.table;
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
            stateGet: function (key) {
                key = Plugin.getTablePrefix(key);
                if (Plugin.getOption('data.saveState') === false) return;
                let value = null;
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
                let ori = Plugin.stateGet(key);
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
                let result = $(tablePart).find('.' + pfx + 'datatable__row:not(.' + pfx + 'datatable__row-detail):nth-child(' + row + ')');
                if (tdOnly) {
                    // get list of <td> or <th>
                    result = result.find('.' + pfx + 'datatable__cell');
                }
                return result;
            },

            /**
             * 检查元素是否有垂直滚动条
             *
             * @param element 元素
             * @returns {boolean}
             */
            hasOverflowY: function (element) {
                let children = $(element).find('.' + pfx + 'datatable__row');
                let maxHeight = 0;

                if (children.length > 0) {
                    $(children).each(function (tdi, td) {
                        maxHeight += Math.floor($(td).innerHeight());
                    });

                    return maxHeight > $(element).innerHeight();
                }

                return false;
            },

            /**
             * Sort table row at HTML level by column index.
             *
             * todo; 暂未使用
             * @param header 点击的header
             * @param sort {string} asc|desc. 排序方式  默认 asc
             * @param int {boolean} 是否转成int排序  默认 false
             */
            sortColumn: function (header, sort, int) {
                if (typeof sort === 'undefined') sort = 'asc'; // desc
                if (typeof int === 'undefined') int = false;

                let column = $(header).index();
                let rows = $(datatable.tableBody).find('.' + pfx + 'datatable__row');
                let hIndex = $(header).closest('.' + pfx + 'datatable__lock').index();
                if (hIndex !== -1) {
                    rows = $(datatable.tableBody).find('.' + pfx + 'datatable__lock:nth-child(' + (hIndex + 1) + ')').find('.' + pfx + 'datatable__row');
                }

                let container = $(rows).parent();
                $(rows).sort(function (a, b) {
                    let tda = $(a).find('td:nth-child(' + column + ')').text();
                    let tdb = $(b).find('td:nth-child(' + column + ')').text();

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
                let sortObj = {
                    init: function () {
                        if (options.sortable) {
                            $(datatable.tableHead).find('.' + pfx + 'datatable__cell:not(.' + pfx + 'datatable__cell--check)').addClass(pfx + 'datatable__cell--sort').off('click').on('click', sortObj.sortClick);
                            sortObj.setIcon();
                        }
                    },
                    setIcon: function () {
                        let meta = Plugin.getDataSourceParam('sort');
                        if ($.isEmptyObject(meta)) return;

                        // 获取head中的图标
                        let td = $(datatable.tableHead).find('.' + pfx + 'datatable__cell[data-field="' + meta.field + '"]').attr('data-sort', meta.sort);
                        let sorting = $(td).find('span');
                        let icon = $(sorting).find('i');

                        let icons = Plugin.getOption('layout.icons.sort');
                        // 跟新图标; desc & asc
                        if ($(icon).length > 0) {
                            $(icon).removeAttr('class').addClass(icons[meta.sort]);
                        } else {
                            $(sorting).append($('<i/>').addClass(icons[meta.sort]));
                        }
                    },
                    sortClick: function (e) {
                        let meta = Plugin.getDataSourceParam('sort');
                        let field = $(this).data('field');
                        let column = Plugin.getColumnByField(field);
                        // 如果该列已经禁用排序,移除排序按钮
                        if (typeof column.sortable !== 'undefined' &&
                            column.sortable === false) return;

                        $(datatable.tableHead).find('.' + pfx + 'datatable__cell > span > i').remove();

                        if (options.sortable) {
                            Plugin.spinnerCallback(true);

                            let sort = 'desc';
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
             * Update JSON data list linked with sort, filter and pagination.
             * 更新本地数据的 排序,过滤,分页
             * Call this method, before using dataSet variable.
             * 在使用dataSet变量之前调用该方法
             *
             * @returns {*|null}
             */
            localDataUpdate: function () {
                // todo; fix twice execution
                let params = Plugin.getDataSourceParam();
                if (typeof datatable.originalDataSet === 'undefined') {
                    datatable.originalDataSet = datatable.dataSet;
                }

                let field = Plugin.getObject('sort.field', params);
                let sort = Plugin.getObject('sort.sort', params);
                let column = Plugin.getColumnByField(field);
                if (typeof column !== 'undefined' && Plugin.getOption('data.serverSorting') !== true) {
                    if (typeof column.sortCallback === 'function') {
                        datatable.dataSet = column.sortCallback(datatable.originalDataSet, sort, column);
                    } else {
                        datatable.dataSet = Plugin.sortCallback(datatable.originalDataSet, sort, column);
                    }
                } else {
                    datatable.dataSet = datatable.originalDataSet;
                }

                // if server filter enable, don't pass local filter
                if (typeof params.query === 'object' && !Plugin.getOption('data.serverFiltering')) {
                    params.query = params.query || {};

                    let nestedSearch = function (obj) {
                        for (let field in obj) {
                            if (!obj.hasOwnProperty(field)) continue;
                            if (typeof obj[field] === 'string') {
                                if (obj[field].toLowerCase() == search || obj[field].toLowerCase().indexOf(search) !== -1) {
                                    return true;
                                }
                            } else if (typeof obj[field] === 'number') {
                                if (obj[field] === search) {
                                    return true;
                                }
                            } else if (typeof obj[field] === 'object') {
                                return nestedSearch(obj[field]);
                            }
                        }
                        return false;
                    };

                    let search = $(Plugin.getOption('search.input')).val();
                    if (typeof search !== 'undefined' && search !== '') {
                        search = search.toLowerCase();
                        datatable.dataSet = $.grep(datatable.dataSet, nestedSearch);
                        // remove generalSearch as we don't need this for next columns filter
                        delete params.query[Plugin.getGeneralSearchKey()];
                    }

                    // remove empty element from array
                    $.each(params.query, function (k, v) {
                        if (v === '') {
                            delete params.query[k];
                        }
                    });

                    // filter array by query
                    datatable.dataSet = Plugin.filterArray(datatable.dataSet, params.query);

                    // reset array index
                    datatable.dataSet = datatable.dataSet.filter(function () {
                        return true;
                    });
                }

                return datatable.dataSet;
            },

            /**
             * Utility helper to filter array by object pair of {key:value}
             *
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

                let count = Object.keys(args).length;
                let filtered = [];

                $.each(list, function (key, obj) {
                    let to_match = obj;

                    let matched = 0;
                    $.each(args, function (m_key, m_value) {
                        m_value = m_value instanceof Array ? m_value : [m_value];
                        if (to_match.hasOwnProperty(m_key)) {
                            let lhs = to_match[m_key].toString().toLowerCase();
                            m_value.forEach(function (item, index) {
                                if (item.toString().toLowerCase() == lhs || lhs.indexOf(item.toString().toLowerCase()) !== -1) {
                                    matched++;
                                }
                            });
                        }
                    });

                    if (('AND' == operator && matched == count) ||
                        ('OR' == operator && matched > 0) ||
                        ('NOT' == operator && 0 == matched)) {
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
                let result;
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
                let result;
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
                let props = {
                        position: 'absolute',
                        visibility: 'hidden',
                        display: 'block',
                    },
                    dim = {
                        width: 0,
                        height: 0,
                        innerWidth: 0,
                        innerHeight: 0,
                        outerWidth: 0,
                        outerHeight: 0,
                    },
                    hiddenParents = $(element).parents().addBack().not(':visible');
                includeMargin = (typeof includeMargin === 'boolean')
                    ? includeMargin
                    : false;

                let oldProps = [];
                hiddenParents.each(function () {
                    let old = {};

                    for (let name in props) {
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
                    let old = oldProps[i];
                    for (let name in props) {
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
                let searchInput = $(Plugin.getOption('search.input'));
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


            extendObj: function (obj, path, value) {
                let levels = path.split('.'),
                    i = 0;

                function createLevel(child) {
                    let name = levels[i++];
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
             *
             * @returns {jQuery}
             */
            redraw: function () {
                Plugin.adjustCellsWidth.call();
                if (Plugin.isLocked()) {
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
                let delay = (function () {
                    return function (callback, ms) {
                        clearTimeout(Plugin.timer);
                        Plugin.timer = setTimeout(callback, ms);
                    };
                })();
                delay(function () {
                    // 数据在本地
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
                        let rowNumber = $(cell).closest('.' + pfx + 'datatable__row').index() + 1;
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
                Plugin.setSelectedRecords();
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
                let initialDatatable = $(datatable.initialDatatable).addClass(pfx + 'datatable--destroyed').show();
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
                sort = typeof sort === 'undefined' ? 'asc' : sort;

                Plugin.spinnerCallback(true);

                // 更新排序方式
                let meta = {field: field, sort: sort};
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
                let ids = [];
                let selectedRecords = datatable.getSelectedRecords();
                if (selectedRecords != null && selectedRecords.length > 0) {
                    for (let i = 0; i < selectedRecords.length; i++) {
                        let _id = $(selectedRecords[i]).data('id');
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

                // 还原表格
                let row = $(cell).closest('.' + pfx + 'datatable__row').addClass(pfx + 'datatable__row--active');

                let ids = [];

                $(row).each(function (i, td) {
                    let index = $(this).index() + 1;
                    // 设置active
                    $(row).closest('.' + pfx + 'datatable__lock').parent().find('.' + pfx + 'datatable__row:nth-child(' + index + ')').addClass(pfx + 'datatable__row--active');

                    let id = $(td).find('.' + pfx + 'checkbox--single:not(.' + pfx + 'checkbox--all) > [type="checkbox"]').val();
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

                // 还原表格
                let row = $(cell).closest('.' + pfx + 'datatable__row').removeClass(pfx + 'datatable__row--active');

                let ids = [];
                $(row).each(function (i, td) {
                    let index = $(this).index() + 1;
                    // 锁定的表格
                    $(row).closest('.' + pfx + 'datatable__lock').parent().find('.' + pfx + 'datatable__row:nth-child(' + index + ')').removeClass(pfx + 'datatable__row--active');
                    let id = $(td).find('.' + pfx + 'checkbox--single:not(.' + pfx + 'checkbox--all) > [type="checkbox"]').val();
                    if (typeof id !== 'undefined') {
                        ids.push(id);
                    }
                });

                $(datatable).trigger(pfx + 'datatable--on-uncheck', [ids]);
            },

            /**
             * 设置所有checkbox 选中 或 不选中
             *
             * @param active {boolean}
             */
            setActiveAll: function (active) {
                let checkboxes = $(datatable.table).find('.' + pfx + 'datatable__body .' + pfx + 'datatable__row').find('.' + pfx + 'datatable__cell--check .' + pfx + 'checkbox [type="checkbox"]');
                if (active) {
                    Plugin.setActive(checkboxes);
                } else {
                    Plugin.setInactive(checkboxes);
                }
            },

            /**
             * 设置选中记录
             *
             * @returns {jQuery}
             */
            setSelectedRecords: function () {
                datatable.API.record = $(datatable.tableBody).find('.' + pfx + 'datatable__row--active');
                return datatable;
            },

            /**
             * 获取选中记录
             *
             * @returns {object}
             */
            getSelectedRecords: function () {
                // 为老版本做兼容
                Plugin.setSelectedRecords();
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
                let delay = (function () {
                    return function (callback, ms) {
                        clearTimeout(Plugin.timer);
                        Plugin.timer = setTimeout(callback, ms);
                    };
                })();

                delay(function () {
                    // 获取查询条件
                    let query = Plugin.getDataSourceQuery();

                    // 如果列名为空
                    if (typeof columns === 'undefined' && typeof value !== 'undefined') {
                        let key = Plugin.getGeneralSearchKey();
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
                    page: {current: 1, size: Plugin.getOption('data.pageSize')},
                    sort: Plugin.getDefaultSortColumn(),
                    query: {},
                }, datatable.API.params, Plugin.stateGet(Plugin.stateId));

                datatable.API.params = Plugin.extendObj(datatable.API.params, param, value);

                Plugin.stateKeep(Plugin.stateId, datatable.API.params);
            },

            /**
             * 获取数据源中指定对象
             *
             * @param param {string} 对象名称
             */
            getDataSourceParam: function (param) {
                datatable.API.params = $.extend({}, {
                    page: {current: 1, size: Plugin.getOption('data.pageSize')},
                    sort: Plugin.getDefaultSortColumn(),
                    query: {},
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
                return datatable.API.params.page.total;
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
             * Hide column by column's field name
             * 根据列名隐藏列
             *
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
                let tds = $.grep($(datatable.table).find('.' + pfx + 'datatable__cell'), function (n, i) {
                    return fieldName === $(n).data('field');
                });
                $(tds).hide();
            },

            /**
             * Show column by column's field name
             * 根据列名显示列
             *
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
                let tds = $.grep($(datatable.table).find('.' + pfx + 'datatable__cell'), function (n, i) {
                    return fieldName === $(n).data('field');
                });
                $(tds).show();
            },

            nodeTr: [],
            nodeTd: [],
            nodeCols: [],
            recentNode: [],

            table: function () {
                return datatable.table;
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
                Plugin.nodeTr = Plugin.recentNode = $(datatable.tableBody).find(selector).filter('.' + pfx + 'datatable__row');
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
                let context = datatable.table;
                if (Plugin.nodeTr === Plugin.recentNode) {
                    context = Plugin.nodeTr;
                }
                let columns = $(context).find('.' + pfx + 'datatable__cell[data-field="' + selector + '"]');
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
                let cells = $(datatable.tableBody).find('.' + pfx + 'datatable__cell');
                if (typeof selector !== 'undefined') {
                    cells = $(cells).filter(selector);
                }
                Plugin.nodeTd = Plugin.recentNode = cells;
                return datatable;
            },

            /**
             * 删除选中的行或列
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
             * 删除指定的行或列

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
                    let locked = Plugin.lockEnabledColumns();
                    if (Plugin.recentNode === Plugin.nodeCols) {
                        let index = Plugin.recentNode.index();

                        if (Plugin.isLocked()) {
                            let scrollColumns = $(Plugin.recentNode).closest('.' + pfx + 'datatable__lock--scroll').length;
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
             * 新增一行数据
             */
            addRow: function () {
                let colLength = options.columns.length;
                let tr = document.createElement('tr');
                util.addClass(tr, pfx + 'datatable__row');
                for (let i = 0; i < colLength; i++) {
                    let column = options.columns[i];
                    let element = Plugin.getColumnElement(column);
                    let td = document.createElement('td');
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

                if (datatable.hasClass('m-datatable--error')) {
                    datatable.removeClass('m-datatable--error');
                    datatable.find('span.m-datatable--error').remove();
                }
                $(tr).find('.table-actions').each(function () {
                    mApp.initTooltip($(this));
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
                let element;
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
                                for (let key in column.edit.option) {
                                    let opt = document.createElement('option');
                                    opt.setAttribute('value', key);
                                    if (key == defaultVal) {
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
                            util.addClass(element, mTool.ACTIONS_SUCCESS);
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
                let colLength = options.columns.length;
                let tr = $(element).parents('.' + pfx + 'datatable__row');
                let data = datatable.dataSet[Number(tr.data('row'))];
                for (let i = 0; i < colLength; i++) {
                    let column = options.columns[i];
                    let element = Plugin.getColumnElement(column, data[column.field]);
                    let td = tr.find('td:eq(' + i + ')');
                    if (td.hasClass('m-datatable__cell--check')) {
                        td.find('span').append(element);
                    } else {
                        td.find('span').html(element);
                    }
                }
                tr.find('.table-actions').each(function () {
                    mApp.initTooltip($(this));
                });
            }
        };

        /**
         * 可通过datatable使用公用方法
         */
        $.each(Plugin, function (funcName, func) {
            datatable[funcName] = func;
        });

        // 初始化插件
        if (typeof options !== 'undefined') {
            if (typeof options === 'string') {
                let method = options;
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
                        right: pfx + 'datatable__cell--right',
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
                $.error(pluginName + ' 未初始化');
            }
            options = datatable.options;
        }

        return datatable;
    };

    // 默认设置
    $.fn[pluginName].defaults = {
        // 数据源
        data: {
            type: 'local', // 默认使用本地数据
            source: null,
            pageSize: 10, // 默认页大小
            saveState: {
                // 使用cookie/webstorage 保存表格状态(分页, 筛选, 排序)
                cookie: false,
                webstorage: true,
            },

            serverPaging: false, // 在服务器分页
            serverFiltering: false, // 在服务器进行数据过滤
            serverSorting: false, // 在服务器进行排序

            autoColumns: false, // 自动列
            attr: {
                rowProps: [],
            },
        },

        // 布局
        layout: {
            theme: 'default', // 主题
            class: pfx + 'datatable--brand', // 自定义class
            scroll: false, // 启用禁用垂直/水平滚动条
            height: null, // 高度
            minHeight: 300, // 最小高度
            footer: false, // 显示/隐藏 footer
            header: true, // 显示/隐藏 header
            customScrollbar: true, // 自定义滚动条

            // 等待提示样式
            spinner: {
                overlayColor: '#000000',
                opacity: 0,
                type: 'loader',
                state: 'brand',
                message: true,
            },

            // datatable UI 图标
            icons: {
                sort: {asc: 'la la-arrow-up', desc: 'la la-arrow-down'},
                pagination: {
                    next: 'la la-angle-right',
                    prev: 'la la-angle-left',
                    first: 'la la-angle-double-left',
                    last: 'la la-angle-double-right',
                    more: 'la la-ellipsis-h',
                },
                rowDetail: {expand: 'fa fa-caret-down', collapse: 'fa fa-caret-right'},
            },
        },

        // 列滚动
        sortable: true,

        pagination: true,

        // 列配置
        columns: [],

        search: {
            // 通过keyup事件搜索
            onEnter: false,
            // 搜索框中提示文字
            input: null,
            // 搜索延迟 单位: 毫秒
            delay: 400,
        },

        rows: {
            // 在拼接<tr>内容前调用
            beforeTemplate: function () {
            },
            // 在拼接<tr>内容后调用
            afterTemplate: function () {
            },
            // 如果列溢出,自动隐藏非锁定列
            autoHide: false,
        },

        // 工具条
        toolbar: {
            // 布局
            layout: ['info', 'pagination'],

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
                            pagesNumber: 6,
                        },
                        tablet: {
                            layout: 'default',
                            pagesNumber: 3,
                        },
                        mobile: {
                            layout: 'compact',
                        },
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
                info: true,
            },
        },

        // 自定义插件提示文字
        translate: {
            records: {
                processing: '请稍候...',
                noRecords: '未查找到数据',
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
                        },
                        info: '当前显示 {{start}} - {{end}} 共 {{total}} 条数据',
                    },
                },
            },
        },

        extensions: {},
    };

}(jQuery));
var mLayout = function() {
    var header;
    var horMenu;
    var asideMenu;
    var asideMenuOffcanvas;
    var horMenuOffcanvas;
    var asideLeftToggle;
    var asideLeftHide;
    var scrollTop;
    var quicksearch;
    var mainPortlet;

    //== Header
    var initStickyHeader = function() {
        var tmp;
        var headerEl = mUtil.get('m_header');
        var options = {
            offset: {},
            minimize: {}
        };

        if (mUtil.attr(headerEl, 'm-minimize-mobile') == 'hide') {
            options.minimize.mobile = {};
            options.minimize.mobile.on = 'm-header--hide';
            options.minimize.mobile.off = 'm-header--show';
        } else {
            options.minimize.mobile = false;
        }

        if (mUtil.attr(headerEl, 'm-minimize') == 'hide') {
            options.minimize.desktop = {};
            options.minimize.desktop.on = 'm-header--hide';
            options.minimize.desktop.off = 'm-header--show';
        } else {
            options.minimize.desktop = false;
        }

        if (tmp = mUtil.attr(headerEl, 'm-minimize-offset')) {
            options.offset.desktop = tmp;
        }

        if (tmp = mUtil.attr(headerEl, 'm-minimize-mobile-offset')) {
            options.offset.mobile = tmp;
        }

        header = new mHeader('m_header', options);
    }

    //== Hor menu
    var initHorMenu = function() {
        // init aside left offcanvas
        horMenuOffcanvas = new mOffcanvas('m_header_menu', {
            overlay: true,
            baseClass: 'm-aside-header-menu-mobile',
            closeBy: 'm_aside_header_menu_mobile_close_btn',
            toggleBy: {
                target: 'm_aside_header_menu_mobile_toggle',
                state: 'm-brand__toggler--active'
            }
        });

        horMenu = new mMenu('m_header_menu', {
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
    }

    //== Aside menu
    var initLeftAsideMenu = function() {
        //== Init aside menu
        var menu = mUtil.get('m_ver_menu');
        var menuDesktopMode = (mUtil.attr(menu, 'm-menu-dropdown') === '1' ? 'dropdown' : 'accordion');

        var scroll;
        if (mUtil.attr(menu, 'm-menu-scrollable') === '1') {
            scroll = {
                height: function() {
                    if (mUtil.isInResponsiveRange('desktop')) {
                        return mUtil.getViewPort().height - parseInt(mUtil.css('m_header', 'height'));
                    }                   
                }
            };
        }

        asideMenu = new mMenu('m_ver_menu', {
            // vertical scroll
            scroll: scroll,

            // submenu setup
            submenu: {
                desktop: {
                    // by default the menu mode set to accordion in desktop mode
                    default: menuDesktopMode,
                    // whenever body has this class switch the menu mode to dropdown
                    state: {
                        body: 'm-aside-left--minimize',
                        mode: 'dropdown'
                    }
                },
                tablet: 'accordion', // menu set to accordion in tablet mode
                mobile: 'accordion' // menu set to accordion in mobile mode
            },

            //accordion setup
            accordion: {
                autoScroll: false, // enable auto scrolling(focus) to the clicked menu item
                expandAll: false // allow having multiple expanded accordions in the menu
            }
        });

    }

    //== Aside
    var initLeftAside = function() {
        // init aside left offcanvas
        var body = mUtil.get('body');
        var asideLeft = mUtil.get('m_aside_left');
        var asideOffcanvasClass = mUtil.hasClass(asideLeft, 'm-aside-left--offcanvas-default') ? 'm-aside-left--offcanvas-default' : 'm-aside-left';

        asideMenuOffcanvas = new mOffcanvas('m_aside_left', {
            baseClass: asideOffcanvasClass,
            overlay: true,
            closeBy: 'm_aside_left_close_btn',
            toggleBy: {
                target: 'm_aside_left_offcanvas_toggle',
                state: 'm-brand__toggler--active'
            }
        });

        //== Handle minimzied aside hover
        if (mUtil.hasClass(body, 'm-aside-left--fixed')) {
            var insideTm;
            var outsideTm;

            mUtil.addEvent(asideLeft, 'mouseenter', function() {
                if (outsideTm) {
                    clearTimeout(outsideTm);
                    outsideTm = null;
                }

                insideTm = setTimeout(function() {
                    if (mUtil.hasClass(body, 'm-aside-left--minimize') && mUtil.isInResponsiveRange('desktop')) {
                        mUtil.removeClass(body, 'm-aside-left--minimize');
                        mUtil.addClass(body, 'm-aside-left--minimize-hover');
                        asideMenu.scrollerUpdate();
                        asideMenu.scrollerTop();
                    }
                }, 300);
            });

            mUtil.addEvent(asideLeft, 'mouseleave', function() {
                if (insideTm) {
                    clearTimeout(insideTm);
                    insideTm = null;
                }

                outsideTm = setTimeout(function() {
                    if (mUtil.hasClass(body, 'm-aside-left--minimize-hover') && mUtil.isInResponsiveRange('desktop')) {
                        mUtil.removeClass(body, 'm-aside-left--minimize-hover');
                        mUtil.addClass(body, 'm-aside-left--minimize');
                        asideMenu.scrollerUpdate();
                        asideMenu.scrollerTop();
                    }
                }, 500);
            });
        }
    }

    //== Sidebar toggle
    var initLeftAsideToggle = function() {
        if ($('#m_aside_left_minimize_toggle').length === 0) {
            return;
        }

        asideLeftToggle = new mToggle('m_aside_left_minimize_toggle', {
            target: 'body',
            targetState: 'm-brand--minimize m-aside-left--minimize',
            togglerState: 'm-brand__toggler--active'
        }); 

        asideLeftToggle.on('toggle', function(toggle) {     
            if (mUtil.get('main_portlet')) {
                mainPortlet.updateSticky();      
            } 
            
            horMenu.pauseDropdownHover(800);
            asideMenu.pauseDropdownHover(800);

            //== Remember state in cookie
            Cookies.set('sidebar_toggle_state', toggle.getState());
            // to set default minimized left aside use this cookie value in your 
            // server side code and add "m-brand--minimize m-aside-left--minimize" classes to 
            // the body tag in order to initialize the minimized left aside mode during page loading.
        });

        asideLeftToggle.on('beforeToggle', function(toggle) {   
            var body = mUtil.get('body'); 
            if (mUtil.hasClass(body, 'm-aside-left--minimize') === false && mUtil.hasClass(body, 'm-aside-left--minimize-hover')) {
                mUtil.removeClass(body, 'm-aside-left--minimize-hover');
            }
        });
    }

    //== Sidebar hide
    var initLeftAsideHide = function() {
        if ($('#m_aside_left_hide_toggle').length === 0 ) {
            return;
        }

        initLeftAsideHide = new mToggle('m_aside_left_hide_toggle', {
            target: 'body',
            targetState: 'm-aside-left--hide',
            togglerState: 'm-brand__toggler--active'
        });

        initLeftAsideHide.on('toggle', function(toggle) {
            horMenu.pauseDropdownHover(800);
            asideMenu.pauseDropdownHover(800);

            //== Remember state in cookie
            Cookies.set('sidebar_hide_state', toggle.getState());
            // to set default minimized left aside use this cookie value in your 
            // server side code and add "m-brand--minimize m-aside-left--minimize" classes to 
            // the body tag in order to initialize the minimized left aside mode during page loading.
        });
    }

    //== Topbar
    var initTopbar = function() {
        $('#m_aside_header_topbar_mobile_toggle').click(function() {
            $('body').toggleClass('m-topbar--on');
        });

        // Animated Notification Icon 
        /*
        setInterval(function() {
            $('#m_topbar_notification_icon .m-nav__link-icon').addClass('m-animate-shake');
            $('#m_topbar_notification_icon .m-nav__link-badge').addClass('m-animate-blink');
        }, 3000);

        setInterval(function() {
            $('#m_topbar_notification_icon .m-nav__link-icon').removeClass('m-animate-shake');
            $('#m_topbar_notification_icon .m-nav__link-badge').removeClass('m-animate-blink');
        }, 6000);
        */
    }

    //== Quicksearch
    var initQuicksearch = function() {
        if ($('#m_quicksearch').length === 0) {
            return;
        }

        quicksearch = new mQuicksearch('m_quicksearch', {
            mode: mUtil.attr('m_quicksearch', 'm-quicksearch-mode'), // quick search type
            minLength: 1
        });

        //<div class="m-search-results m-search-results--skin-light"><span class="m-search-result__message">Something went wrong</div></div>

        quicksearch.on('search', function(the) {
            the.showProgress();

            $.ajax({
                url: 'inc/api/quick_search.php',
                data: {
                    query: the.query
                },
                dataType: 'html',
                success: function(res) {
                    the.hideProgress();
                    the.showResult(res);
                },
                error: function(res) {
                    the.hideProgress();
                    the.showError('Connection error. Pleae try again later.');
                }
            });
        });
    }

    //== Scrolltop
    var initScrollTop = function() {
        var scrollTop = new mScrollTop('m_scroll_top', {
            offset: 300,
            speed: 600
        });
    }

    //== Main portlet(sticky portlet)
    var createMainPortlet = function() {
        return new mPortlet('main_portlet', {
            sticky: {
                offset: parseInt(mUtil.css( mUtil.get('m_header'), 'height')),
                zIndex: 90,
                position: {
                    top: function() {
                        return parseInt(mUtil.css( mUtil.get('m_header'), 'height') );
                    },
                    left: function() {
                        var left = parseInt(mUtil.css( mUtil.getByClass('m-content'), 'paddingLeft'));
                        
                        if (mUtil.isInResponsiveRange('desktop')) {
                            //left += parseInt(mUtil.css(mUtil.get('m_aside_left'), 'width') );
                            if (mUtil.hasClass(mUtil.get('body'), 'm-aside-left--minimize')) {
                                left += 78; // need to use hardcoded width of the minimize aside
                            } else {
                                left += 255; // need to use hardcoded width of the aside
                            }
                        } 

                        return left; 
                    },
                    right: function() {
                        return parseInt(mUtil.css( mUtil.getByClass('m-content'), 'paddingRight') );
                    }
                }
            }
        });
    }

    return {
        init: function() {
            this.initHeader();
            this.initAside();
            this.initMainPortlet();
        },

        initMainPortlet: function() {
            if (!mUtil.get('main_portlet')) {
                return;
            }
            
            mainPortlet = createMainPortlet();
            mainPortlet.initSticky();
            
            mUtil.addResizeHandler(function(){
                mainPortlet.updateSticky();
            });
        },

        resetMainPortlet: function() {
            mainPortlet.destroySticky();
            mainPortlet = createMainPortlet();
            mainPortlet.initSticky();
        },

        initHeader: function() {
            initStickyHeader();
            initHorMenu();
            initTopbar();
            initQuicksearch();
            initScrollTop();
        },

        initAside: function() { 
            initLeftAside();
            initLeftAsideMenu();
            initLeftAsideToggle();
            initLeftAsideHide();

            this.onLeftSidebarToggle(function(e) {
                //== Update sticky portlet
                if (mainPortlet) {
                    mainPortlet.updateSticky();
                }

                //== Reload datatable
                var datatables = $('.m-datatable');
                if (datatables) {
                    datatables.each(function() {
                        $(this).mDatatable('redraw');
                    });
                }                
            });
        },

        getAsideMenu: function() {
            return asideMenu;
        },

        onLeftSidebarToggle: function(handler) {
            if (asideLeftToggle) {
                asideLeftToggle.on('toggle', handler);
            }
        },

        closeMobileAsideMenuOffcanvas: function() {
            if (mUtil.isMobileDevice()) {
                asideMenuOffcanvas.hide();
            }
        },

        closeMobileHorMenuOffcanvas: function() {
            if (mUtil.isMobileDevice()) {
                horMenuOffcanvas.hide();
            }
        }
    };
}();

$(document).ready(function() {
    if (mUtil.isAngularVersion() === false) {
        mLayout.init();
    }
});

var mQuickSidebar = function() {
    var topbarAside = $('#m_quick_sidebar');
    var topbarAsideTabs = $('#m_quick_sidebar_tabs');    
    var topbarAsideContent = topbarAside.find('.m-quick-sidebar__content');

    var initMessages = function() {
        var messages = mUtil.find( mUtil.get('m_quick_sidebar_tabs_messenger'),  '.m-messenger__messages'); 
        var form = $('#m_quick_sidebar_tabs_messenger .m-messenger__form');

        mUtil.scrollerInit(messages, {
            disableForMobile: true, 
            resetHeightOnDestroy: false, 
            handleWindowResize: true, 
            height: function() {
                var height = topbarAside.outerHeight(true) - 
                    topbarAsideTabs.outerHeight(true) - 
                    form.outerHeight(true) - 120;

                return height;                    
            }
        });
    }

    var initSettings = function() { 
        var settings = mUtil.find( mUtil.get('m_quick_sidebar_tabs_settings'),  '.m-list-settings'); 

        if (!settings) {
            return;
        }

        mUtil.scrollerInit(settings, {
            disableForMobile: true, 
            resetHeightOnDestroy: false, 
            handleWindowResize: true, 
            height: function() {
                return mUtil.getViewPort().height - topbarAsideTabs.outerHeight(true) - 60;            
            }
        });
    }

    var initLogs = function() {
        var logs = mUtil.find( mUtil.get('m_quick_sidebar_tabs_logs'),  '.m-list-timeline'); 

        if (!logs) {
            return;
        }

        mUtil.scrollerInit(logs, {
            disableForMobile: true, 
            resetHeightOnDestroy: false, 
            handleWindowResize: true, 
            height: function() {
                return mUtil.getViewPort().height - topbarAsideTabs.outerHeight(true) - 60;            
            }
        });
    }

    var initOffcanvasTabs = function() {
        initMessages();
        initSettings();
        initLogs();
    }

    var initOffcanvas = function() {
        var topbarAsideObj = new mOffcanvas('m_quick_sidebar', {
            overlay: true,  
            baseClass: 'm-quick-sidebar',
            closeBy: 'm_quick_sidebar_close',
            toggleBy: 'm_quick_sidebar_toggle'
        });   

        // run once on first time dropdown shown
        topbarAsideObj.one('afterShow', function() {
            mApp.block(topbarAside);

            setTimeout(function() {
                mApp.unblock(topbarAside);
                
                topbarAsideContent.removeClass('m--hide');

                initOffcanvasTabs();
            }, 1000);                         
        });
    }

    return {     
        init: function() {  
            if (topbarAside.length === 0) {
                return;
            }

            initOffcanvas(); 
        }
    };
}();

$(document).ready(function() {
    mQuickSidebar.init();
});