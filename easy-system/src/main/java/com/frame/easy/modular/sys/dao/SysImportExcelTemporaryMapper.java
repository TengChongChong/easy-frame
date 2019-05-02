package com.frame.easy.modular.sys.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
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
     * @param userId 用户id
     * @return 导入汇总
     */
    List<SysImportExcelTemporary> selectImportSummary(@Param("templateId") Long templateId, @Param("userId") Long userId);
}