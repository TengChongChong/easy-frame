package com.frame.easy.modular.sys.service;

import com.frame.easy.common.jstree.JsTree;
import com.frame.easy.modular.sys.model.SysRole;

import java.util.List;

/**
 * 角色管理
 *
 * @author tengchong
 * @date 2018/11/2
 */
public interface SysRoleService {

    /**
     * 根据父id获取数据
     *
     * @param pId 父id
     * @return List<JsTree>
     */
    List<JsTree> selectData(Long pId);

    /**
     * 获取所有数据
     *
     * @return List<JsTree>
     */
    List<JsTree> selectAll();

    /**
     * 详情
     *
     * @param id id
     * @return SysRole
     */
    SysRole input(Long id);

    /**
     * 新增
     *
     * @param pId 上级id
     * @return SysRole
     */
    SysRole add(Long pId);

    /**
     * 删除
     *
     * @param id
     * @return
     */
    boolean delete(Long id);

    /**
     * 批量删除
     *
     * @param ids String ids 示例 1,2,3,4
     * @return boolean
     */
    boolean batchDelete(String ids);

    /**
     * 设置状态
     *
     * @param ids 角色id
     * @param status 状态
     * @return
     */
    boolean setStatus(String ids, Integer status);

    /**
     * 保存
     *
     * @param object 表单内容
     * @return SysRole
     */
    SysRole saveData(SysRole object);

    /**
     * 拖动菜单/权限改变目录或顺序
     *
     * @param id          拖动的菜单/权限id
     * @param parent      拖动后的父id
     * @param oldParent   拖动前的id
     * @param position    拖动前的下标
     * @param oldPosition 拖动后的下标
     * @return boolean
     */
    boolean move(Long id, Long parent, Long oldParent, Integer position, Integer oldPosition);

    /**
     * 根据关键字搜索角色
     *
     * @param title 关键字
     * @return List<JsTree>
     */
    List<JsTree> search(String title);

}