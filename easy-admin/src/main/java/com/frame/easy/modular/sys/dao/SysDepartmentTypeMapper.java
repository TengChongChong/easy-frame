package com.frame.easy.modular.sys.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.frame.easy.common.jstree.JsTree;
import com.frame.easy.common.select.Select;
import com.frame.easy.modular.sys.model.SysDepartmentType;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 机构类型管理
 *
 * @Author tengchong
 * @Date 2018/12/3
 */
public interface SysDepartmentTypeMapper extends BaseMapper<SysDepartmentType> {
    /**
     * 根据父id查询数据
     *
     * @param pId 父id
     * @return List<JsTree>
     */
    List<JsTree> selectData(@Param("pId") Long pId);

    /**
     * 获取所有数据
     * @param status 状态
     * @return List<JsTree>
     */
    List<JsTree> selectAll(@Param("status") Integer status);

    /**
     * 获取详情信息
     *
     * @param id 权限id
     * @return SysDepartmentType
     */
    SysDepartmentType selectInfo(@Param("id") Long id);

    /**
     * 查询指定数据
     *
     * @param pId 父id
     * @param str    开始位置
     * @param length 长度
     * @return List<T>
     */
    List<SysDepartmentType> selectOrderInfo(@Param("pId") Long pId, @Param("str") Integer str, @Param("length") Integer length);

    /**
     * 根据关键字搜索数据
     *
     * @param title 关键字
     * @return List<JsTree>
     */
    List<JsTree> search(@Param("title") String title);

    /**
     * 获取最大排序值
     *
     * @param id 父Id
     * @return
     */
    Integer getMaxOrderNo(@Param("pId") Long id);

    /**
     * 根据同级代码获取类型数据
     *
     * @param code 代码
     * @return option
     */
    List<Select> selectOptionBySameLevel(@Param("code") String code);

    /**
     * 根据父代码获取子类型数据
     *
     * @param parentCode 父代码
     * @return option
     */
    List<Select> selectOptionByParentCode(@Param("parentCode") String parentCode);
}