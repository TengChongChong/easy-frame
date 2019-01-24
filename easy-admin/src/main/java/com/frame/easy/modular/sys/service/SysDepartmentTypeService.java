package com.frame.easy.modular.sys.service;

import com.frame.easy.common.jstree.JsTree;
import com.frame.easy.common.select.Select;
import com.frame.easy.modular.sys.model.SysDepartmentType;

import java.util.List;

/**
 * 机构类型管理
 *
 * @author tengchong
 * @date 2018/12/3
 */
public interface SysDepartmentTypeService {
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
     * @return SysDepartmentType
     */
    SysDepartmentType input(Long id);

    /**
     * 新增
     *
     * @param pId 上级id
     * @return SysDepartmentType
     */
    SysDepartmentType add(Long pId);

    /**
     * 删除
     *
     * @param id 机构类型id
     * @return true/false
     */
    boolean delete(Long id);

    /**
     * 批量删除
     *
     * @param ids String ids 示例 1,2,3,4
     * @return true/false
     */
    boolean batchDelete(String ids);

    /**
     * 设置状态
     *
     * @param ids    角色id
     * @param status 状态
     * @return true/false
     */
    boolean setStatus(String ids, Integer status);

    /**
     * 保存
     *
     * @param object 表单内容
     * @return SysDepartmentType
     */
    SysDepartmentType saveData(SysDepartmentType object);

    /**
     * 拖动菜单/权限改变目录或顺序
     *
     * @param id          拖动的菜单/权限id
     * @param parent      拖动后的父id
     * @param oldParent   拖动前的id
     * @param position    拖动前的下标
     * @param oldPosition 拖动后的下标
     * @return true/false
     */
    boolean move(Long id, Long parent, Long oldParent, Integer position, Integer oldPosition);

    /**
     * 根据关键字搜索
     *
     * @param title 关键字
     * @return List<JsTree>
     */
    List<JsTree> search(String title);

    /**
     * 根据同级代码获取类型数据
     *
     * @param code 代码
     * @return List<Select>
     */
    List<Select> selectOptionBySameLevel(String code);

    /**
     * 根据父代码获取子类型数据
     *
     * @param parentCode 父代码
     * @return List<Select>
     */
    List<Select> selectOptionByParentCode(String parentCode);
}