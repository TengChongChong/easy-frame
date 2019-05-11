package com.frame.easy.modular.scheduler.quartz;

import cn.hutool.core.util.StrUtil;
import com.frame.easy.modular.scheduler.common.constant.SchedulerConst;
import com.frame.easy.modular.scheduler.model.SchedulerJob;
import com.frame.easy.util.SpringContextHolder;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/**
 * 任务调度工厂
 *
 * @author tengchong
 * @date 2019-05-11
 */
public class QuartzFactory implements Job {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        // 获取定时任务
        SchedulerJob schedulerJob = (SchedulerJob) context.getMergedJobDataMap().get(SchedulerConst.SCHEDULER_JOB_KEY);
        if (StrUtil.isNotBlank(schedulerJob.getBean())) {
            Object object = SpringContextHolder.getBean(schedulerJob.getBean());
            if (object != null) {
                try {
                    // 获取方法
                    Method method = object.getClass().getMethod(schedulerJob.getMethod());
                    try {
                        // 执行
                        method.invoke(object);
                    } catch (IllegalAccessException | InvocationTargetException e) {
                        logger.warn("调用定时任务[" + schedulerJob.getName() + "] method[" + schedulerJob.getMethod() + "]失败", e);
                    }
                } catch (NoSuchMethodException e) {
                    logger.warn("定时任务[" + schedulerJob.getName() + "]获取method[" + schedulerJob.getMethod() + "]失败");
                }
            } else {
                logger.warn("定时任务[" + schedulerJob.getName() + "]bean不存在");
            }
        } else {
            logger.warn("定时任务[" + schedulerJob.getName() + "]缺少bean");
        }
    }
}
