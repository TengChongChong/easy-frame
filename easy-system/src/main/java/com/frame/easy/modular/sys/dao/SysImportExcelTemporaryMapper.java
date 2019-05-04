package com.frame.easy.modular.sys.dao;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.frame.easy.common.page.Page;
import com.frame.easy.modular.sys.model.SysImportExcelTemporary;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 导入临时表
 *
 * @author TengChong
 * @date 2019-04-10
 */
public interface SysImportExcelTemporaryMapper extends BaseMapper<SysImportExcelTemporary> {
    /**
     * 获取导入汇总信息
     *
     * @param templateId 模板id
     * @param userId     用户id
     * @return 导入汇总
     */
    List<SysImportExcelTemporary> selectImportSummary(@Param("templateId") Long templateId, @Param("userId") Long userId);

    /**
     * 查询临时表数据
     *
     * @param page 分页
     * @param selectFields  查询列
     * @param leftJoinTable 链接表
     * @param queryWrapper 查询条件
     * @return 数据
     */
    List<SysImportExcelTemporary> select(Page page,
                                         @Param("selectFields") String selectFields,
                                         @Param("leftJoinTable") String leftJoinTable,
                                         @Param("ew") QueryWrapper<SysImportExcelTemporary> queryWrapper);
}