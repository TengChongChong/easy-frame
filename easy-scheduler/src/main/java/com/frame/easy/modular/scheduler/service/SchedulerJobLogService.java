package com.frame.easy.modular.scheduler.service;

import com.frame.easy.modular.scheduler.model.SchedulerJobLog;
import com.frame.easy.common.page.Page;

/**
 * 定时任务执行日志
 *
 * @author TengChong
 * @date 2019-05-11
 */
public interface SchedulerJobLogService {
    /**
     * 列表
     * @param object 查询条件
     * @return 数据集合
     */
    Page select(SchedulerJobLog object);

    /**
     * 详情
     *
     * @param id id
     * @return 详细信息
     */
    SchedulerJobLog input(String id);

    /**
     * 保存
     *
     * @param object 表单内容
     * @return 保存后信息
     */
    SchedulerJobLog saveData(SchedulerJobLog object);
}
