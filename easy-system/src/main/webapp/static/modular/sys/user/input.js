//== 用户管理-列表页
var mUserInput = function () {
    /**
     * 保存数据
     *
     * @param el {object} html 元素
     */
    var save = function (el) {
        var checked = KTTool.getCheckedNodes('#roles-tree', 'id');
        $('#roles').val(checked.join(','));
        KTTool.saveData(el, null, null, null, function (res) {
            // 如果改的是自己的账户,刷新缓存用户数据
            if(res.data.id == KTTool.getUser().id){
                KTTool.cacheRemove(KTTool.currentUser);
            }
        });
    };
    /**
     * 初始化权限tree
     */
    var initRolesTree = function () {
        KTUtil.ajax({
            url: basePath + '/auth/sys/depart/type/role/select/role/' + $('#deptId').val(),
            success: function (res) {
                // 处理数据, 将parent不存在的节点parent全设置为#
                if(res.data != null && res.data.length > 0){
                    $(res.data).each(function (i, obj) {
                        if(!selectDataById(res.data, res.data[i].parent)){
                            res.data[i].parent = '#';
                        }
                    });
                }
                $('#roles-tree').jstree({
                    types: {
                        default: {
                            icon: 'la la-group'
                        }
                    },
                    plugins: ['checkbox', 'types'],
                    core: {
                        data: res.data
                    },
                    checkbox: {
                        three_state: false, // 阻止上下级关联
                        tie_selection: false,
                        keep_selected_style: false
                    }
                }).on('loaded.jstree', function (e, data) {
                    KTTool.checkNodes('#roles-tree', $('#roles').val());
                });
            }
        });
    };
    /**
     * 根据id查询数据
     *
     * @param data {array} 数据集合
     * @param id {number|string} id
     * @returns {*}
     */
    var selectDataById = function (data, id) {
        var _data = null;
        $(data).each(function (i, obj) {
            if(obj.id == id){
                _data = obj;
                return ;
            }
        });
        return _data;
    };
    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/user/');
            initRolesTree();
        },
        /**
         * 保存
         *
         * @param el {object}
         */
        save: function (el) {
            save(el);
        }
    };
}();
//== 初始化
$(document).ready(function () {
    mUserInput.init();
});