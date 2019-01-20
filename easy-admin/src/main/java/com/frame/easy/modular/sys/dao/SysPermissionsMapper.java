package com.frame.easy.modular.sys.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.frame.easy.common.jstree.JsTree;
import com.frame.easy.modular.sys.model.SysPermissions;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 菜单/权限
 * @author tengchong
 */
public interface SysPermissionsMapper extends BaseMapper<SysPermissions> {
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
     * @return SysPermissions
     */
    SysPermissions selectInfo(@Param("id") Long id);

    /**
     * 查询指定数据
     *
     * @param pId 父id
     * @param str    开始位置
     * @param length 长度
     * @return List<T>
     */
    List<SysPermissions> selectOrderInfo(@Param("pId") Long pId, @Param("str") Integer str, @Param("length") Integer length);

    /**
     * 更改数据等级
     *
     * @param levels 等级
     * @param id 数据id
     */
    void updateLevels(@Param("levels") int levels, @Param("id") Long id);

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
     * @return Integer
     */
    Integer getMaxOrderNo(@Param("pId") Long id);
}