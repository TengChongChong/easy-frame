package com.frame.easy.modular.sys.service;

import com.frame.easy.common.page.Page;
import com.frame.easy.modular.sys.model.SysDictType;

import java.util.List;

/**
 * 字典类型
 *
 * @author tengchong
 * @date 2018/11/4
 */
public interface SysDictTypeService {
    /**
     * 列表
     *
     * @param sysDict 查询条件
     * @return Page
     */
    Page select(SysDictType sysDict);

    /**
     * 查询所有
     *
     * @return List<SysDictType>
     */
    List<SysDictType> selectAll();

    /**
     * 删除
     *
     * @param id 字典类型ids
     * @return true/false
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
