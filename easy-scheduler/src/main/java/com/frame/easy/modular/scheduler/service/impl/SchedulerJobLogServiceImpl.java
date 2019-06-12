package com.frame.easy.modular.scheduler.service.impl;

import cn.hutool.core.lang.Validator;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.page.Page;
import com.frame.easy.modular.scheduler.dao.SchedulerJobLogMapper;
import com.frame.easy.modular.scheduler.model.SchedulerJobLog;
import com.frame.easy.modular.scheduler.service.SchedulerJobLogService;
import com.frame.easy.util.ToolUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 定时任务执行日志
 *
 * @author TengChong
 * @date 2019-05-11
 */
@Service
public class SchedulerJobLogServiceImpl extends ServiceImpl<SchedulerJobLogMapper, SchedulerJobLog> implements SchedulerJobLogService {

    /**
     * 列表
     * @param object 查询条件
     * @return 数据集合
     */
    @Override
    public Page select(SchedulerJobLog object) {
        QueryWrapper<SchedulerJobLog> queryWrapper = new QueryWrapper<>();
        if(object != null){
            // 查询条件
            // 任务id
            if (Validator.isNotEmpty(object.getJobId())) {
                queryWrapper.eq("job_id", object.getJobId());
            }
            // 执行时间
            if (Validator.isNotEmpty(object.getRunDate())) {
                queryWrapper.eq("run_date", object.getRunDate());
            }
        }
        return (Page)page(ToolUtil.getPage(object), queryWrapper);
    }

    /**
     * 详情
     *
     * @param id id
     * @return 详细信息
     */
    @Override
    public SchedulerJobLog input(String id) {
        ToolUtil.checkParams(id);
        return getById(id);
    }

    /**
     * 保存
     *
     * @param object 表单内容
     * @return 保存后信息
     */
    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public SchedulerJobLog saveData(SchedulerJobLog object) {
        ToolUtil.checkParams(object);
        if (StrUtil.isBlank(object.getId())) {
            // 新增,设置默认值
        }
        return (SchedulerJobLog) ToolUtil.checkResult(saveOrUpdate(object), object);
    }
}