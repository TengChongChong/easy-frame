package com.frame.easy.modular.scheduler.config;

import org.quartz.Scheduler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;

/**
 * 定时任务配置
 *
 * @author tengchong
 * @date 2019-05-11
 */
@Configuration
public class QuartzConfig {
    @Bean
    public SchedulerFactoryBean schedulerFactoryBean(){
        SchedulerFactoryBean schedulerFactoryBean = new SchedulerFactoryBean();
        // 覆盖已存在任务
        schedulerFactoryBean.setOverwriteExistingJobs(true);
        // 延时60s启动定时任务，避免系统未完全启动却开始执行定时任务的情况
        schedulerFactoryBean.setStartupDelay(60);
        return schedulerFactoryBean;
    }
    @Bean
    public Scheduler scheduler(){
        return schedulerFactoryBean().getScheduler();
    }
}
