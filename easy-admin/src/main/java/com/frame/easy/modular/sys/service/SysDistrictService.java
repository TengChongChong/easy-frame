package com.frame.easy.modular.sys.service;

import com.frame.easy.common.jstree.JsTree;
import com.frame.easy.common.select.Select;
import com.frame.easy.modular.sys.model.SysDistrict;

import java.util.List;

/**
 * 行政区划
 *
 * @Author tengchong
 * @Date 2018/12/18
 */
public interface SysDistrictService {

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
     * @return SysDistrict
     */
    SysDistrict input(Long id);

    /**
     * 新增
     *
     * @param pId 上级id
     * @return SysDistrict
     */
    SysDistrict add(Long pId);

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
     * 保存
     *
     * @param object 表单内容
     * @return SysDistrict
     */
    SysDistrict saveData(SysDistrict object);

    /**
     * 拖动行政区划改变目录或顺序
     *
     * @param id          拖动的行政区划id
     * @param parent      拖动后的父id
     * @param oldParent   拖动前的id
     * @param position    拖动前的下标
     * @param oldPosition 拖动后的下标
     * @return boolean
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
     * 根据父id获取数据
     * @param pId 父id
     * @return List<Select>
     */
    List<Select> selectByPId(Long pId);
}
