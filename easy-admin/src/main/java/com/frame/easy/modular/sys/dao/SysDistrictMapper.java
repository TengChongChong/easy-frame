package com.frame.easy.modular.sys.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.frame.easy.common.jstree.JsTree;
import com.frame.easy.common.select.Select;
import com.frame.easy.modular.sys.model.SysDistrict;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 行政区划
 *
 * @Author tengchong
 * @Date 2018/12/18
 */
public interface SysDistrictMapper extends BaseMapper<SysDistrict> {

    /**
     * 根据父id查询数据
     *
     * @param pId 父id
     * @return List<JsTree>
     */
    List<JsTree> selectData(@Param("pId") Long pId);

    /**
     * 获取所有数据
     *
     * @return List<JsTree>
     */
    List<JsTree> selectAll();

    /**
     * 获取详情信息
     *
     * @param id 权限id
     * @return
     */
    SysDistrict selectInfo(@Param("id") Long id);

    /**
     * 查询指定数据
     *
     * @param pId 父id
     * @param str    开始位置
     * @param length 长度
     * @return List<T>
     */
    List<SysDistrict> selectOrderInfo(@Param("pId") Long pId, @Param("str") Integer str, @Param("length") Integer length);

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
     * @param pId 父Id
     * @return
     */
    Integer getMaxOrderNo(@Param("pId") Long pId);

    /**
     * 根据父id获取数据
     * @param pId 父id
     * @return List<Select>
     */
    List<Select> selectByPId(@Param("pId") Long pId);
}