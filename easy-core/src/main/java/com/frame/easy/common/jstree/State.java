package com.frame.easy.common.jstree;

/**
 * 对象类型，一个节点的状态有一下几种:
 *
 * @Author tengchong
 * @Date 2018/10/31
 */
public class State {
    /**
     * 节点处于被选中状态
     */
    private Boolean selected;
    /**
     * 节点处于打开状态
     */
    private Boolean opened;
    /**
     * 节点不可选
     */
    private Boolean disabled;
    /**
     * 用于checkbox插件 - 勾选该checkbox(只有当 tie_selection 处于 false时有效)
     */
    private Boolean checked;
    /**
     * 用于checkbox插件 - 状态待定 (只有启用懒加载并且节点没有被加载时生效).
     */
    private Boolean undetermined;
    /**
     * 节点是否显示
     */
    private Boolean hidden;

    public Boolean getSelected() {
        return selected;
    }

    public void setSelected(Boolean selected) {
        this.selected = selected;
    }

    public Boolean getOpened() {
        return opened;
    }

    public void setOpened(Boolean opened) {
        this.opened = opened;
    }

    public Boolean getDisabled() {
        return disabled;
    }

    public void setDisabled(Boolean disabled) {
        this.disabled = disabled;
    }

    public Boolean getChecked() {
        return checked;
    }

    public void setChecked(Boolean checked) {
        this.checked = checked;
    }

    public Boolean getUndetermined() {
        return undetermined;
    }

    public void setUndetermined(Boolean undetermined) {
        this.undetermined = undetermined;
    }

    public Boolean getHidden() {
        return hidden;
    }

    public void setHidden(Boolean hidden) {
        this.hidden = hidden;
    }

    @Override
    public String toString() {
        return "State{" +
                "selected=" + selected +
                ", opened=" + opened +
                ", disabled=" + disabled +
                ", checked=" + checked +
                ", undetermined=" + undetermined +
                '}';
    }
}
