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
     * @param schedulerJob
     */
    void addJob(SchedulerJob schedulerJob);

    /**
     * 操作任务
     * @param jobName 任务名称
     * @param schedulerStatus 任务状态
     */
    void operateJob(String jobName, SchedulerStatus schedulerStatus);

    /**
     * 全部开始
     */
    void startAll() throws SchedulerException;

    /**
     * 全部暂停
     */
    void pauseAll() throws SchedulerException;
}
