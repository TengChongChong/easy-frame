package com.frame.easy.modular.scheduler.service;

import com.frame.easy.modular.scheduler.common.status.SchedulerStatus;
import com.frame.easy.modular.scheduler.model.SchedulerJob;
import org.quartz.SchedulerException;

/**
 * 定时任务处理
 *
 * @author tengchong
 * @date 2019-05-11
 */
public interface QuartzService {
    /**
     * 加载定时任务
     */
    void timingTask();

    /**
     * 添加任务
     *
     * @param schedulerJob 任务详情
     */
    void addJob(SchedulerJob schedulerJob);

    /**
     * 操作任务
     *
     * @param jobCode         任务代码
     * @param schedulerStatus 任务状态
     */
    void operateJob(String jobCode, SchedulerStatus schedulerStatus);

    /**
     * 全部开始
     *
     * @throws SchedulerException 异常
     */
    void startAll() throws SchedulerException;

    /**
     * 全部暂停
     *
     * @throws SchedulerException 异常
     */
    void pauseAll() throws SchedulerException;
}
