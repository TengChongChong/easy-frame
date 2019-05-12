package com.frame.easy.modular.generator.util;

import cn.hutool.core.util.StrUtil;
import com.frame.easy.modular.generator.model.FieldSet;

import java.util.List;

/**
 * 生成java代码帮助类
 *
 * @author tengchong
 * @date 2019-02-22
 */
public class GeneratorJavaUtil {

    /**
     * 字符串
     */
    private static final String STRING = "String";

    /**
     * 生成验证注解
     *
     * @param propertyName 属性名
     * @param list         配置列表
     * @return 验证注解
     */
    public static String generatorVerification(String propertyName, List<FieldSet> list) {
        for (FieldSet fieldSet : list) {
            if (propertyName.equals(fieldSet.getPropertyName())) {
                return generatorVerification(fieldSet);
            }
        }
        return null;
    }

    private static String generatorVerification(FieldSet fieldSet) {
        if(fieldSet.getRequired()){
            if (STRING.equals(fieldSet.getPropertyType())) {
                return addTab("@NotBlank(message = \"" + fieldSet.getLabel() + "不能为空\")");
            }
            return addTab("@NotNull(message = \"" + fieldSet.getLabel() + "不能为空\")");
        }
        return null;
    }

    /**
     * 添加换行以及缩进
     *
     * @param code 代码
     * @return 代码
     */
    private static String addTab(String code){
        return code + "\r\n    ";
    }

    /**
     * 获取查询条件
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
     * 获取查询条件
     *
     * @param fieldSet 配置
     * @param tab      tab数量
     * @return 查询条件
     */
    private static String generator(FieldSet fieldSet, int tab) {
        StringBuilder query = new StringBuilder();
        query.append("// ").append(fieldSet.getLabel()).append("\n")
                .append(GeneratorUtil.getTab(tab)).append("if (Validator.isNotEmpty(object.get")
                .append(StrUtil.upperFirst(fieldSet.getPropertyName())).append("())) {\n")
                .append(GeneratorUtil.getTab(tab + 1))
                .append("queryWrapper.");
        switch (fieldSet.getMatchingMode()) {
            case "gte":
                query.append("ge");
                break;
            case "lte":
                query.append("le");
                break;
            case "left_like":
                query.append("likeLeft");
                break;
            case "right_like":
                query.append("likeRight");
                break;
            default:
                query.append(fieldSet.getMatchingMode());
                break;
        }
        query.append("(\"").append(fieldSet.getColumnName()).append("\", ")
                .append("object.get").append(StrUtil.upperFirst(fieldSet.getPropertyName()))
                .append("());\n").append(GeneratorUtil.getTab(tab)).append("}");
        return query.toString();
    }
}
