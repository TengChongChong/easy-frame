package com.frame.easy.common.jstree;


import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.util.SysConfigUtil;

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
    public static String baseId = "0";

    /**
     * 获取根节点
     *
     * @return 根节点 jstree
     */
    public static JsTree getBaseNode(){
        JsTree jsTree = new JsTree();
        // 项目名称
        jsTree.setText(SysConfigUtil.getProjectName());
        jsTree.setId(baseId);
        jsTree.setIcon(CommonConst.DEFAULT_FOLDER_ICON);
        State state = new State();
        state.setOpened(true);
        jsTree.setState(state);
        return jsTree;
    }
}
