/**
 * 图片截取工具
 */
var Crop = {
    CropAvatar: function ($element, fun) {
        this.callback = fun;
        this.$container = $element;
        // 页面图片
        this.$cropper = this.$container.find('img');
        // 模态框
        this.$cropperModal = $('#cropper-modal');
        // 上传图片
        this.$cropperInput = this.$cropperModal.find('.cropper-input');
        // 保存
        this.$cropperSave = this.$cropperModal.find('.cropper-save');
        // 截取区域
        this.$cropperWrapper = this.$cropperModal.find('.cropper-wrapper');
        // 预览图
        this.$cropperPreview = this.$cropperModal.find('.cropper-preview');
        this.init();
    }
};
Crop.CropAvatar.prototype = {
    /**
     * 初始化
     */
    init: function () {
        try {
            this.initModal();
            this.addListener();
        } catch (e) {
            alert('图片截取仅支持在Chrome、Firefox、Safari、Opera、IE10+、或国产浏览器极速模式下使用,如需使用,请更换其他浏览器.');
        }
    },
    /**
     * 绑定事件
     */
    addListener: function () {
        this.$container.on('click', $.proxy(this.click, this));
        this.$cropperInput.on('change', $.proxy(this.change, this));
        this.$cropperSave.on('click', $.proxy(this.submit, this));
        this.bindToolEvent();
    },
    /**
     * 绑定工具条事件
     */
    bindToolEvent: function(){
        var _cropper = this;
        $('.cropper-tool').on('click', '[data-method]', function () {
            var $this = $(this);
            // 获取操作信息
            var data = $this.data();
            var cropper = _cropper.$img.data('cropper');
            var cropped;

            if (cropper && data.method) {
                cropped = cropper.cropped;
                _cropper.$img.cropper(data.method, data.option, data.secondOption);
                switch (data.method) {
                    case 'rotate':
                        if (cropped && options.viewMode > 0) {
                            _cropper.$img.cropper('crop');
                        }
                        break;
                    case 'scaleX':
                    case 'scaleY':
                        $(this).data('option', -data.option);
                        break;
                }
            }
        });
    },
    /**
     * 初始化模态框
     */
    initModal: function () {
        this.$cropperModal.modal({
            backdrop: 'static',
            keyboard: false,
            show: false
        });
    },
    /**
     * 初始化预览图
     */
    initPreview: function () {
        var url = this.$cropper.attr('src');
        this.$cropperPreview.html('<img alt="预览" src="' + url + '">');
    },
    /**
     * 点击图片打开模态框
     */
    click: function () {
        var _cropper = this;
        this.$cropperModal.modal('show').on('shown.bs.modal', function () {
            var _src = _cropper.$cropper.attr('src');
            if (_src.indexOf('?') > -1) {
                _cropper.url = _cropper.$cropper.attr('src') + '&date=' + new Date().getTime();
            } else {
                _cropper.url = _cropper.$cropper.attr('src') + '?date=' + new Date().getTime();
            }
            _cropper.startCropper();
            Crop.$cropper = _cropper.$img;
        });
        this.initPreview();
    },
    /**
     * 更改图片
     */
    change: function () {
        var files;
        var file;
        files = this.$cropperInput.prop('files');
        if (files.length > 0) {
            file = files[0];
            if (this.isImageFile(file)) {
                if (this.url) {
                    URL.revokeObjectURL(this.url);
                }
                this.url = URL.createObjectURL(file);
                this.startCropper();
            }
        }
    },
    /**
     * 提交
     */
    submit: function () {
        this.ajaxUpload();
    },
    /**
     * 判断文件是否是图片
     *
     * @param file
     * @return {boolean} true/false
     */
    isImageFile: function (file) {
        if (file.type) {
            return /^image\/\w+$/.test(file.type);
        } else {
            return /\.(jpg|jpeg|png|gif)$/.test(file);
        }
    },
    /**
     * 开始截取
     */
    startCropper: function () {
        if (this.active) {
            this.$img.cropper('replace', this.url);
        } else {
            this.$img = $('<img alt="" src="' + this.url + '">');
            this.$cropperWrapper.empty().html(this.$img);
            var aspectRatio = this.$container.data('aspect-ratio');
            this.$img.cropper({
                aspectRatio: aspectRatio,
                preview: this.$cropperPreview
            });
            this.active = true;
        }
        var _cropper = this;
        this.$cropperModal.one('hidden.bs.modal', function () {
            _cropper.$cropperPreview.empty();
            _cropper.stopCropper();
        });
    },
    /**
     * 结束截取
     */
    stopCropper: function () {
        if (this.active) {
            this.$img.cropper('destroy');
            this.$img.remove();
            this.active = false;
            this.$cropperInput.val('');
        }
    },
    /**
     * ajax上传
     */
    ajaxUpload: function () {
        var pic = this.$img.cropper("getCroppedCanvas");
        pic = pic.toDataURL("image/jpeg", 1);
        pic = pic.replace(/^data:image\/(jpeg);base64,/, '');
        var cropper = this;
        $.ajax({
            url: basePath + '/auth/cropper',
            data: pic,
            type: 'post',
            processData: false,
            success: function (res) {
                cropper.submitDone(res.data);
            }
        });
    },
    /**
     * 上传完毕
     *
     * @param data {object} 文件对象
     */
    submitDone: function (data) {
        this.url = basePath + data.url;
        this.callback(data);
        this.cropDone();
        this.$cropperInput.val('');
    },
    /**
     * 剪裁完毕，更新页面图片并关闭模态框
     */
    cropDone: function () {
        this.$cropper.attr('src', this.url);
        this.stopCropper();
        this.$cropperModal.modal('hide');
    },
    /**
     * 错误提示
     *
     * @param msg {string} 提示内容
     */
    alert: function (msg) {
        mTool.warnTip('操作失败', msg);
    }
};