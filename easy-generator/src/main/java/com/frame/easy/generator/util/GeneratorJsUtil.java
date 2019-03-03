package com.frame.easy.generator.util;

import cn.hutool.core.util.StrUtil;
import com.frame.easy.generator.model.FieldSet;
import com.frame.easy.generator.model.Generator;

import java.util.List;

/**
 * 生成js代码帮助类
 *
 * @author tengchong
 * @date 2019-02-22
 */
public class GeneratorJsUtil {
    private static final String ID = "id";

    /**
     * 获取list.js中表格列对象
     *
     * @param propertyName 属性名
     * @param list         配置列表
     * @param tab          tab数量
     * @return 查询条件
     */
    public static String generator(String propertyName, List<FieldSet> list, int tab) {
        for (FieldSet fieldSet : list) {
            if (propertyName.equals(fieldSet.getPropertyName())) {
                return generator(fieldSet, tab);
            }
        }
        return null;
    }

    /**
     * 获取list.js中表格列对象
     *
     * @param fieldSet 配置
     * @param tab      tab数量
     * @return 查询条件
     */
    private static String generator(FieldSet fieldSet, int tab) {
        if (ID.equals(fieldSet.getPropertyName())) {
            return "{\n" +
                    GeneratorUtil.getTab(tab) + "    field: 'id',\n" +
                    GeneratorUtil.getTab(tab) + "    title: '#',\n" +
                    GeneratorUtil.getTab(tab) + "    sortable: false, // 禁用此列排序\n" +
                    GeneratorUtil.getTab(tab) + "    width: 40,\n" +
                    GeneratorUtil.getTab(tab) + "    selector: {class: 'm-checkbox--solid m-checkbox--brand'}\n" +
                    GeneratorUtil.getTab(tab) + "}";
        }
        if (StrUtil.isNotBlank(fieldSet.getDictType())) {
            return "{\n" +
                    GeneratorUtil.getTab(tab) + "    field: '" + fieldSet.getPropertyName() + "',\n" +
                    GeneratorUtil.getTab(tab) + "    title: '" + fieldSet.getLabel() + "',\n" +
                    GeneratorUtil.getTab(tab) + "    dictType: '" + fieldSet.getDictType() + "'\n" +
                    GeneratorUtil.getTab(tab) + "},";
        }

        return "{\n" +
                GeneratorUtil.getTab(tab) + "    field: '" + fieldSet.getPropertyName() + "',\n" +
                GeneratorUtil.getTab(tab) + "    title: '" + fieldSet.getLabel() + "'\n" +
                GeneratorUtil.getTab(tab) + "},";
    }

    /**
     * 获取表格操作列
     *
     * @param generator 配置
     * @param tab tab数量
     * @return js
     */
    public static String getActions(Generator generator, int tab) {
        // 要生成删除或修改方法,在表格后面添加操作列
        String js = "";
        if (generator.getGenDelete() || generator.getGenSave()) {
            js += "{\n" +
                    GeneratorUtil.getTab(tab) + "    field: 'Actions',\n" +
                    GeneratorUtil.getTab(tab) + "    width: 110,\n" +
                    GeneratorUtil.getTab(tab) + "    title: '操作',\n" +
                    GeneratorUtil.getTab(tab) + "    sortable: false,\n" +
                    GeneratorUtil.getTab(tab) + "    overflow: 'visible',\n" +
                    GeneratorUtil.getTab(tab) + "    locked: {\n" +
                    GeneratorUtil.getTab(tab) + "        right: 'md'\n" +
                    GeneratorUtil.getTab(tab) + "    },\n" +
                    GeneratorUtil.getTab(tab) + "    template: function (row, index, datatable) {\n" +
                    GeneratorUtil.getTab(tab) + "        var _btn = '';\n";
            if (generator.getGenSave()) {
                if (StrUtil.isNotBlank(generator.getPermissionsCode())) {
                    js += GeneratorUtil.getTab(tab + 2) + "if (mTool.hasPermissions('" + generator.getPermissionsCode() + ":save')) {\n";
                }
                js += GeneratorUtil.getTab(tab + 3) + "_btn += '<a href=\"#\" onclick=\"mTool.editById(this, \\\'' + row.id + '\\\')\" class=\"' + mTool.ACTIONS_DANGER + '\" title=\"编辑\">\\\n" +
                        GeneratorUtil.getTab(tab + 3) + "    <i class=\"la la-edit\"></i>\\\n" +
                        GeneratorUtil.getTab(tab + 3) + "</a>';\n";
                if (StrUtil.isNotBlank(generator.getPermissionsCode())) {
                    js += GeneratorUtil.getTab(tab + 2) + "}\n";
                }
            }
            if (generator.getGenDelete()) {
                if (StrUtil.isNotBlank(generator.getPermissionsCode())) {
                    js += GeneratorUtil.getTab(tab + 2) + "if (mTool.hasPermissions('" + generator.getPermissionsCode() + ":delete')) {\n";
                }
                js += GeneratorUtil.getTab(tab + 3) + "_btn += '<a href=\"#\" onclick=\"mTool.deleteById(this, \\\'' + row.id + '\\\')\" class=\"' + mTool.ACTIONS_DANGER + '\" title=\"删除\">\\\n" +
                        GeneratorUtil.getTab(tab + 3) + "    <i class=\"la la-trash\"></i>\\\n" +
                        GeneratorUtil.getTab(tab + 3) + "</a>';\n";
                if (StrUtil.isNotBlank(generator.getPermissionsCode())) {
                    js += GeneratorUtil.getTab(tab + 2) + "}\n";
                }
            }
            js += GeneratorUtil.getTab(tab + 2) + "return _btn;\n";
            js += GeneratorUtil.getTab(tab) + "    }\n";
            js += GeneratorUtil.getTab(tab) + "}\n";
        }
        return js;
    }
}
