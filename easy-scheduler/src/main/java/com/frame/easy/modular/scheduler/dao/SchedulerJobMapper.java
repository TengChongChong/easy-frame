package com.frame.easy.modular.scheduler.dao;

import com.frame.easy.modular.scheduler.model.SchedulerJob;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

/**
 * 定时任务 
 *
 * @author TengChong
 * @date 2019-05-11
 */
public interface SchedulerJobMapper extends BaseMapper<SchedulerJob> {
    /**
     * 根据任务id获取任务
     *
     * @param id 任务id
     * @return 任务名称
     */
    String getJobNameById(@Param("id") Long id);
}