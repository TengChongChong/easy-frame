package com.frame.easy.modular.sys.service;

import com.frame.easy.common.page.Page;
import com.frame.easy.common.select.Select;
import com.frame.easy.modular.sys.model.SysDict;

import java.util.List;

/**
 * 字典
 *
 * @author tengchong
 * @date 2018/11/4
 */
public interface SysDictService {
    /**
     * 列表
     *
     * @param sysDict 查询条件
     * @return Page
     */
    Page select(SysDict sysDict);

    /**
     * 根据字典类型获取字典
     *
     * @param dictType 字典类型
     * @return List<Select>
     */
    List<Select> dictTypeDicts(String dictType);
    /**
     * 根据字典类型获取字典
     *
     * @param dictTypes 字典类型
     * @return List<SysDict>
     */
    List<SysDict> selectDictType(List<String> dictTypes);

    /**
     * 详情
     *
     * @param id 字典id
     * @return SysDict
     */
    SysDict input(String id);

    /**
     * 根据编码查询字典信息
     *
     * @param type 类型
     * @param code 编码
     * @return SysDict
     */
    SysDict getDictByCode(String type, String code);

    /**
     * 新增
     *
     * @param pId      上级id
     * @param dictType 字典类型
     * @return SysDict
     */
    SysDict add(String pId, String dictType);

    /**
     * 删除
     *
     * @param ids 字典ids
     * @return true/false
     */
    boolean delete(String ids);

    /**
     * 保存
     *
     * @param object 表单内容
     * @return SysDict
     */
    SysDict saveData(SysDict object);

    /**
     * 获取字典类型
     *
     * @return List<Select>
     */
    List<Select> getDictType();

    /**
     * 将数据库中字典数据生成成js文件
     *
     * @return true/false
     */
    boolean generateDictData();

}
