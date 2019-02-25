package com.frame.easy.generator.util;

import cn.hutool.core.util.StrUtil;
import com.frame.easy.generator.model.FieldSet;

import java.util.List;

/**
 * 生成html代码帮助类
 *
 * @author tengchong
 * @date 2019-02-22
 */
public class GeneratorHtmlUtil {
    /**
     * 根据属性名称查找配置获取html
     *
     * @param propertyName 属性名称
     * @param list         配置列表
     * @param tab          tab数量
     * @return html
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
     * 根据配置获取html
     *
     * @param fieldSet 配置
     * @param tab      tab数量
     * @return html
     */
    private static String generator(FieldSet fieldSet, int tab) {
        String element;
        switch (fieldSet.getElementType()) {
            case "text":
                element = text(fieldSet);
                break;
            case "textarea":
                element = textarea(fieldSet);
                break;
            case "hidden":
                element = hidden(fieldSet);
                break;
            case "select":
                element = select(fieldSet);
                break;
            case "select_multiple":
                element = selectMultiple(fieldSet);
                break;
            case "radio":
                element = radio(fieldSet, tab);
                break;
            case "checkbox":
                element = checkbox(fieldSet, tab);
                break;
            case "date":
                element = date(fieldSet);
                break;
            case "datetime":
                element = datetime(fieldSet);
                break;
            case "password":
                element = password(fieldSet);
                break;
            case "number":
                element = number(fieldSet);
                break;
            default:
                element = text(fieldSet);
                break;
        }
        if (!"hidden".equals(fieldSet.getElementType())) {
            return "<div class=\"" + getGridClass(fieldSet.getGrid()) + "\">\n" + GeneratorUtil.getTab(tab + 1) + element + "\n" + GeneratorUtil.getTab(tab) + "</div>";
        } else {
            return element;
        }
    }

    /**
     * 获取label的栅格
     *
     * @param fieldSet 配置
     * @return html
     */
    private static String getLabel(FieldSet fieldSet) {
        String labelClass;
        if ("12/2/10".equals(fieldSet.getGrid()) || "12/2/5".equals(fieldSet.getGrid()) || "12/2/8".equals(fieldSet.getGrid())) {
            labelClass = "col-md-2 col-4";
        } else {
            labelClass = "col-4";
        }
        return "<label class=\"" + labelClass + " control-label\"" +
                ((!"radio".equals(fieldSet.getElementType()) && !"checkbox".equals(fieldSet.getElementType())) ? " for=\"" + fieldSet.getPropertyName() + "\"" : "") + ">" + fieldSet.getLabel() + "</label>";
    }

    /**
     * 获取input的栅格
     *
     * @param fieldSet 配置
     * @return class
     */
    private static String getInputGridClass(FieldSet fieldSet) {
        String inputClass;
        if ("12/2/10".equals(fieldSet.getGrid())) {
            inputClass = "col-md-10 col-8";
        } else if ("12/2/5".equals(fieldSet.getGrid())) {
            inputClass = "col-md-5 col-8";
        } else {
            inputClass = "col-8";
        }
        return inputClass;
    }

    /**
     * 获取栅格class
     *
     * @param grid 栅格
     * @return 栅格class
     */
    private static String getGridClass(String grid) {
        String gridClass = null;
        if ("12/2/10".equals(grid) || "12/2/5".equals(grid) || "12/2/8".equals(grid)) {
            gridClass = "col-12";
        } else if ("6/4/8".equals(grid)) {
            gridClass = "col-xl-4 col-lg-6 col-12";
        } else if ("4/4/8".equals(grid)) {
            gridClass = "col-xl-3 col-lg-4 col-md-6 col-12";
        } else if ("3/4/8".equals(grid)) {
            gridClass = "col-lg-3 col-md-4 col-sm-6 col-12";
        }
        return gridClass;
    }

    /**
     * 获取通用的属性
     *
     * @param fieldSet 配置
     * @return 通用属性
     */
    private static String getCommonProperty(FieldSet fieldSet) {
        StringBuilder property = new StringBuilder();
        if (StrUtil.isNotBlank(fieldSet.getPropertyName())) {
            property.append(" id=\"").append(fieldSet.getPropertyName()).append("\"");
        }
        if (StrUtil.isNotBlank(fieldSet.getLabel())) {
            property.append(" name=\"").append(fieldSet.getLabel()).append("\"");
        }
        // 提示文字
        if (StrUtil.isNotBlank(fieldSet.getTips())) {
            property.append(" tips=\"").append(fieldSet.getTips()).append("\"");
        }
        // 必填
        if (fieldSet.getRequired()) {
            property.append(" required=\"").append(fieldSet.getRequired()).append("\"");
        }
        // 表单验证
        if (StrUtil.isNotBlank(fieldSet.getValidate())) {
            property.append(" validate=\"").append(fieldSet.getValidate()).append("\"");
        }
        return property.toString();
    }

    /**
     * 获取text所需要的html
     *
     * @param fieldSet 配置
     * @return html
     */
    private static String text(FieldSet fieldSet) {
        return "<#form:input" + getCommonProperty(fieldSet) + " />";
    }

    /**
     * 获取hidden所需要的html
     *
     * @param fieldSet 配置
     * @return html
     */
    private static String hidden(FieldSet fieldSet) {
        return "<input type=\"hidden\" id=\"" + fieldSet.getPropertyName() + "\" name=\"" + fieldSet.getPropertyName() + "\" " +
                "value=\"${object." + fieldSet.getPropertyName() + "}\"/>";
    }

    /**
     * 获取select所需要的html
     *
     * @param fieldSet 配置
     * @return html
     */
    private static String select(FieldSet fieldSet) {
        return "<#form:select class=\"select-picker\"" +
                (StrUtil.isNotBlank(fieldSet.getDictType()) ? "data-dict-type=\"" + fieldSet.getDictType() + "\"" : "") +
                getCommonProperty(fieldSet) + " />";
    }

    /**
     * 获取多选select所需要的html
     *
     * @param fieldSet 配置
     * @return html
     */
    private static String selectMultiple(FieldSet fieldSet) {
        return "<#form:select class=\"select-picker\"" +
                (StrUtil.isNotBlank(fieldSet.getDictType()) ? "data-dict-type=\"" + fieldSet.getDictType() + "\"" : "") +
                getCommonProperty(fieldSet) + " other=\"multiple\"/>";
    }

    /**
     * 获取textarea所需要的html
     *
     * @param fieldSet 配置
     * @return html
     */
    private static String textarea(FieldSet fieldSet) {
        return "<#form:textarea" + getCommonProperty(fieldSet) + " />";
    }

    /**
     * 获取radio所需要的html
     *
     * @param fieldSet 配置
     * @return html
     */
    private static String radio(FieldSet fieldSet, int tab) {
        StringBuilder html = new StringBuilder();
        if (StrUtil.isNotBlank(fieldSet.getDictType())) {
            html.append("<div class=\"m-radio-inline radio-dict\" data-dict-type=\"").append(fieldSet.getDictType()).append("\"></div>");
        } else {
            html.append("<div class=\"m-radio-inline\"></div>");
        }
        return wrap(fieldSet, html, tab);
    }

    /**
     * 获取checkbox所需要的html
     *
     * @param fieldSet 配置
     * @return html
     */
    private static String checkbox(FieldSet fieldSet, int tab) {
        StringBuilder html = new StringBuilder();
        if (StrUtil.isNotBlank(fieldSet.getDictType())) {
            html.append("<div class=\"m-checkbox-inline checkbox-dict\" data-dict-type=\"").append(fieldSet.getDictType()).append("\"></div>");
        } else {
            html.append("<div class=\"m-checkbox-inline\"></div>");
        }
        return wrap(fieldSet, html, tab);
    }

    /**
     * 将内容用栅格div包起来
     *
     * @param fieldSet 配置
     * @param content  内容
     * @return html
     */
    private static String wrap(FieldSet fieldSet, StringBuilder content, int tab) {
        return getLabel(fieldSet) + "\n" +
                GeneratorUtil.getTab(tab + 1) + "<div class=\"" + getInputGridClass(fieldSet) + "\">\n" +
                GeneratorUtil.getTab(tab + 2) + content + "\n" +
                GeneratorUtil.getTab(tab + 1) + "</div>";
    }

    /**
     * 获取日期插件所需要的html
     *
     * @param fieldSet 配置
     * @return html
     */
    private static String date(FieldSet fieldSet) {
        return "<#form:input class=\"date-picker\" data-format=\"YYYY-MM-DD\" " + getCommonProperty(fieldSet) + " />";
    }

    /**
     * 获取日期插件所需要的html
     *
     * @param fieldSet 配置
     * @return html
     */
    private static String datetime(FieldSet fieldSet) {
        return "<#form:input class=\"date-picker\" data-format=\"YYYY-MM-DD HH:mm:ss\"" + getCommonProperty(fieldSet) + " />";
    }

    /**
     * 获取password所需要的html
     *
     * @param fieldSet 配置
     * @return html
     */
    private static String password(FieldSet fieldSet) {
        return "<#form:input type=\"password\" " + getCommonProperty(fieldSet) + " />";
    }

    /**
     * 获取number所需要的html
     *
     * @param fieldSet 配置
     * @return html
     */
    private static String number(FieldSet fieldSet) {
        return "<#form:input type=\"number\" " + getCommonProperty(fieldSet) + " />";

    }
}
