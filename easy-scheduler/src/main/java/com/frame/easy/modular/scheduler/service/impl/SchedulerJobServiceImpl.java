package com.frame.easy.modular.scheduler.service.impl;

import cn.hutool.core.lang.Validator;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.common.page.Page;
import com.frame.easy.exception.EasyException;
import com.frame.easy.modular.scheduler.common.status.SchedulerStatus;
import com.frame.easy.modular.scheduler.dao.SchedulerJobMapper;
import com.frame.easy.modular.scheduler.model.SchedulerJob;
import com.frame.easy.modular.scheduler.service.QuartzService;
import com.frame.easy.modular.scheduler.service.SchedulerJobService;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.util.ToolUtil;
import org.quartz.SchedulerException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * 定时任务
 *
 * @author TengChong
 * @date 2019-05-11
 */
@Service
public class SchedulerJobServiceImpl extends ServiceImpl<SchedulerJobMapper, SchedulerJob> implements SchedulerJobService {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private QuartzService quartzService;

    /**
     * 列表
     *
     * @param object 查询条件
     * @return 数据集合
     */
    @Override
    public Page select(SchedulerJob object) {
        QueryWrapper<SchedulerJob> queryWrapper = new QueryWrapper<>();
        if (object != null) {
            // 查询条件
            // 名称
            if (Validator.isNotEmpty(object.getName())) {
                queryWrapper.like("name", object.getName());
            }
            // cron表达式
            if (Validator.isNotEmpty(object.getCode())) {
                queryWrapper.like("code", object.getCode());
            }
            // bean
            if (Validator.isNotEmpty(object.getBean())) {
                queryWrapper.eq("bean", object.getBean());
            }
            // 状态
            if (Validator.isNotEmpty(object.getStatus())) {
                queryWrapper.eq("status", object.getStatus());
            }
        }
        return (Page) page(ToolUtil.getPage(object), queryWrapper);
    }

    @Override
    public List<SchedulerJob> selectAll() {
        QueryWrapper<SchedulerJob> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", SchedulerStatus.ENABLE.getCode());
        return getBaseMapper().selectList(queryWrapper);
    }

    /**
     * 详情
     *
     * @param id id
     * @return 详细信息
     */
    @Override
    public SchedulerJob input(Long id) {
        ToolUtil.checkParams(id);
        return getById(id);
    }

    /**
     * 新增
     *
     * @return 默认值
     */
    @Override
    public SchedulerJob add() {
        SchedulerJob object = new SchedulerJob();
        // 默认开启
        object.setStatus(String.valueOf(SchedulerStatus.ENABLE.getCode()));
        // 设置默认值
        return object;
    }

    /**
     * 删除
     *
     * @param ids 数据ids
     * @return 是否成功
     */
    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean delete(String ids) {
        ToolUtil.checkParams(ids);
        List<String> idList = Arrays.asList(ids.split(","));
        QueryWrapper<SchedulerJob> queryWrapper = new QueryWrapper<>();
        queryWrapper.in("id", idList);
        List<SchedulerJob> schedulerJobs = getBaseMapper().selectSchedulerJobCodes(queryWrapper);
        boolean isSuccess = removeByIds(idList);
        if (isSuccess) {
            // 删除成功后删除任务
            for (SchedulerJob schedulerJob : schedulerJobs) {
                quartzService.operateJob(schedulerJob, SchedulerStatus.DELETE);
            }
        }
        return isSuccess;
    }

    /**
     * 保存
     *
     * @param object 表单内容
     * @return 保存后信息
     */
    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public SchedulerJob saveData(SchedulerJob object) {
        ToolUtil.checkParams(object);
        SysUser currentUser = ShiroUtil.getCurrentUser();
        // 更新前的任务名称
        String jobJobCode = null;
        object.setEditDate(new Date());
        object.setEditUser(currentUser.getId());
        if (object.getId() == null) {
            // 新增,设置默认值
            object.setCreateDate(new Date());
            object.setCreateUser(currentUser.getId());
        } else {
            jobJobCode = getBaseMapper().getJobCodeById(object.getId());

        }
        boolean isSuccess = saveOrUpdate(object);
        if (isSuccess) {
            // 如果是新增直接添加任务,如果是修改则删除原任务后重新添加
            if (StrUtil.isNotBlank(jobJobCode)) {
                quartzService.operateJob(new SchedulerJob(jobJobCode), SchedulerStatus.DELETE);
            }
            quartzService.addJob(object);
        }
        return (SchedulerJob) ToolUtil.checkResult(isSuccess, object);
    }

    @Override
    public boolean updateLastRunDate(Long id) {
        if (id != null) {
            UpdateWrapper<SchedulerJob> updateWrapper = new UpdateWrapper<>();
            updateWrapper.set("last_run_date", new Date());
            updateWrapper.eq("id", id);
            return update(updateWrapper);
        }
        return false;
    }

    @Override
    public void start(Long id) {
        ToolUtil.checkParams(id);
        boolean updateSuccess = updateJobStatus(SchedulerStatus.ENABLE.getCode(), String.valueOf(id));
        if (updateSuccess) {
            quartzService.operateJob(getById(id), SchedulerStatus.ENABLE);
        } else {
            throw new EasyException("更新任务状态失败");
        }
    }

    @Override
    public void pause(Long id) {
        ToolUtil.checkParams(id);
        boolean updateSuccess = updateJobStatus(SchedulerStatus.DISABLE.getCode(), String.valueOf(id));
        if (updateSuccess) {
            quartzService.operateJob(getById(id), SchedulerStatus.DISABLE);
        } else {
            throw new EasyException("更新任务状态失败");
        }
    }

    @Override
    public void startAll() {
        try {
            boolean updateSuccess = updateJobStatus(SchedulerStatus.ENABLE.getCode(), null);
            if (updateSuccess) {
                quartzService.startAll();
            } else {
                throw new EasyException("更新任务状态失败");
            }
        } catch (SchedulerException e) {
            logger.error("startAll()", e);
            throw new EasyException("开启任务失败");
        }
    }

    @Override
    public void pauseAll() {
        try {
            boolean updateSuccess = updateJobStatus(SchedulerStatus.DISABLE.getCode(), null);
            if (updateSuccess) {
                quartzService.pauseAll();
            } else {
                throw new EasyException("更新任务状态失败");
            }
        } catch (SchedulerException e) {
            logger.error("pauseAll()", e);
            throw new EasyException("暂停任务失败");
        }
    }


    /**
     * 更改任务状态
     *
     * @param status 状态
     * @param ids    任务ids,如果null则更新全部
     * @return true/false
     */
    private boolean updateJobStatus(int status, String ids) {
        UpdateWrapper<SchedulerJob> updateWrapper = new UpdateWrapper<>();
        updateWrapper.set("status", status);
        if (StrUtil.isNotBlank(ids)) {
            updateWrapper.in("id", ids.split(CommonConst.SPLIT));
        }
        return update(updateWrapper);
    }
}