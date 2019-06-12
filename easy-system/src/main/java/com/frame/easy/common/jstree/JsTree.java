package com.frame.easy.common.jstree;

import com.frame.easy.common.constant.CommonConst;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * JsTree 插件数据
 *
 * @author tengchong
 * @date 2018/10/31
 */
public class JsTree {

    /**
     * 默认图标
     */
    public static String DEFAULT_ICON = "la la-bars";

    /**
     * 节点文字
     */
    private String text;
    /**
     * 子节点
     * 1.当为JSON数据时,该属性为List<JsTree>类型
     * 2.当为AJAX异步加载时,该属性为boolean类型
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Object children;
    /**
     * 这个ID会在对应的‘LI’ 节点上设置html标签的ID属性.
     * 请确保ID的唯一性，每个节点的ID都应该不一样，否则会有出现一些莫名其妙的问题.
     */
    private String id;

    /**
     * 父节点id
     * 根节点需要设置为 '#'
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String parent;
    /**
     * 节点图标，可以设置表示路径、一个或者多个CSS类名、字体图标的字符串.
     */
    private String icon;
    /**
     * 任何数据，设置这个属性没有任何UI上的效果，任何时候都可以读写这个数据.
     */
    private String data;
    /**
     * 对象类型，一个节点的状态有一下几种:
     * selected/opened/disabled/checked/undetermined
     */
    private State state;
    /**
     * 用于types插件 - 用来定义节点类型，默认为 "default" 类型.
     */
    private String type = "default";

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Object getChildren() {
        return children;
    }

    public void setChildren(Object children) {
        if (children instanceof String) {
            if (CommonConst.FALSE.equals(children)) {
                this.children = false;
            } else {
                this.children = true;
            }
        } else {
            this.children = children;
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIcon() {
//        if (Validator.isNotEmpty(icon)) {
            return icon;
//        } else {
//            return DEFAULT_ICON;
//        }
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getParent() {
        return parent;
    }

    public void setParent(String parent) {
        this.parent = parent;
    }
}
