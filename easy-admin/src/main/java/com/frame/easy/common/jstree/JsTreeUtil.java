package com.frame.easy.common.jstree;


import com.frame.easy.common.constant.CommonConst;

/**
 * jstree 工具
 *
 * @author tengchong
 * @date 2019-01-22
 */
public class JsTreeUtil {
    /**
     * 根节点id
     */
    public static Long baseId = 0L;

    /**
     * 获取根节点
     *
     * @return 根节点 jstree
     */
    public static JsTree getBaseNode(){
        JsTree jsTree = new JsTree();
        // 项目名称
        jsTree.setText(CommonConst.projectProperties.getName());
        jsTree.setId(baseId);
        jsTree.setIcon(CommonConst.DEFAULT_FOLDER_ICON);
        State state = new State();
        state.setOpened(true);
        jsTree.setState(state);
        return jsTree;
    }
}
