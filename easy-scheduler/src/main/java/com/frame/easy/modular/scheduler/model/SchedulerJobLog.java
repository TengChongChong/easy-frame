package com.frame.easy.modular.scheduler.model;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.frame.easy.base.model.IModel;
import com.frame.easy.common.page.Page;

import java.io.Serializable;
import java.util.Date;

/**
 * 定时任务执行日志
 *
 * @author TengChong
 * @date 2019-05-11
 */
 @TableName("scheduler_job_log")
public class SchedulerJobLog extends Model<SchedulerJobLog> implements IModel, Serializable{
    private static final long serialVersionUID = 1L;

    /**
     * id
     */
    @TableId(value = "id")
    private Long id;

    /**
     * 任务id
     */
    private Long jobId;

    /**
     * 执行时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date runDate;

    /**
     * 耗时
     */
    private Long timeConsuming;

    //
    /**
     * 分页&排序信息
     */
    @TableField(exist=false)
    private Page page;

    public SchedulerJobLog() {
    }

    public SchedulerJobLog(Long jobId, Date runDate, Long timeConsuming) {
        this.jobId = jobId;
        this.runDate = runDate;
        this.timeConsuming = timeConsuming;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }
    public Date getRunDate() {
        return runDate;
    }

    public void setRunDate(Date runDate) {
        this.runDate = runDate;
    }
    public Long getTimeConsuming() {
        return timeConsuming;
    }

    public void setTimeConsuming(Long timeConsuming) {
        this.timeConsuming = timeConsuming;
    }
    @Override
    public Page getPage() {
        return page;
    }

    public void setPage(Page page) {
        this.page = page;
    }
}
