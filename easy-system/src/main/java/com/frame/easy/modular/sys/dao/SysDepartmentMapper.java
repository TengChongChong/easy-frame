package com.frame.easy.modular.sys.dao;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.frame.easy.common.page.Page;
import com.frame.easy.common.jstree.JsTree;
import com.frame.easy.common.select.Select;
import com.frame.easy.modular.sys.model.SysDepartment;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 机构管理
 *
 * @author tengchong
 * @date 2018/12/3
 */
public interface SysDepartmentMapper extends BaseMapper<SysDepartment> {

    /**
     * 根据关键字搜索数据
     *
     * @param title 关键字
     * @return List<JsTree>
     */
    List<JsTree> search(@Param("title") String title);

    /**
     * 根据父id查询数据
     *
     * @param pId 父id
     * @return List<JsTree>
     */
    List<JsTree> selectData(@Param("pId") String pId);

    /**
     * 获取列表数据
     *
     * @param page 分页
     * @param queryWrapper 查询条件
     * @return 数据列表
     */
    List<SysDepartment> select(Page page, @Param("ew") QueryWrapper<SysDepartment> queryWrapper);

    /**
     * 获取指定机构类型最大排序值
     *
     * @param type 类型
     * @return int
     */
    int getMaxOrderNo(@Param("type") String type);

    /**
     * 根据机构类型id获取机构数量
     *
     * @param queryWrapper 条件构建器
     * @return int
     */
    int selectCountByTypeIds(@Param("ew") QueryWrapper<SysDepartment> queryWrapper);

    /**
     * 根据机构代码获取机构数据
     *
     * @param typeCode 机构代码
     * @return List<Select>
     */
    List<Select> selectOptionByTypeCode(@Param("typeCode") String typeCode);

    /**
     * 根据机父构代码获取机构数据
     *
     * @param typeCode 机构代码
     * @return List<Select>
     */
    List<Select> selectOptionByPTypeCode(@Param("code") String typeCode);

}