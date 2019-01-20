package com.frame.easy.modular.sys.service;

import com.frame.easy.modular.sys.model.SysDictType;

import java.util.List;

/**
 * 字典类型
 *
 * @Author tengchong
 * @Date 2018/11/4
 */
public interface SysDictTypeService {
    /**
     * 列表
     * @param sysDict 查询条件
     * @return Page
     */
    Object select(SysDictType sysDict);

    /**
     * 列表 (无分页)
     * @return List<SysDictType>
     */
    List<SysDictType> selectAll();

    /**
     * 删除
     *
     * @param id 数据id
     * @return boolean
     */
    boolean delete(String id);

    /**
     * 保存
     *
     * @param object 表单内容
     * @return SysDictType
     */
    SysDictType saveData(SysDictType object);

}
