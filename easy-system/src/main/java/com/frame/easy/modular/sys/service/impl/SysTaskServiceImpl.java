package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.lang.Validator;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.constant.TaskConst;
import com.frame.easy.common.page.Page;
import com.frame.easy.modular.sys.dao.SysTaskMapper;
import com.frame.easy.modular.sys.model.SysTask;
import com.frame.easy.modular.sys.service.SysTaskService;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.util.ToolUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

/**
 * 任务
 *
 * @author TengChong
 * @date 2019-06-19
 */
@Service
public class SysTaskServiceImpl extends ServiceImpl<SysTaskMapper, SysTask> implements SysTaskService {

    /**
     * 列表
     *
     * @param object 查询条件
     * @return 数据集合
     */
    @Override
    public Page select(SysTask object) {
        QueryWrapper<SysTask> queryWrapper = new QueryWrapper<>();
        if (object != null) {
            // 查询条件
            // 标题
            if (Validator.isNotEmpty(object.getTitle())) {
                queryWrapper.eq("title", object.getTitle());
            }
            // 发布时间
            if (Validator.isNotEmpty(object.getReleaseDate())) {
                queryWrapper.eq("release_date", object.getReleaseDate());
            }
        }
        // 接收人必须是自己
        queryWrapper.eq("receiver", ShiroUtil.getCurrentUser().getId());
        // 已发布
        queryWrapper.eq("status", TaskConst.HAS_BEEN_SENT);
        Page page = object.getPage();
        return (Page) page(page, queryWrapper);
    }

    /**
     * 详情
     *
     * @param id id
     * @return 详细信息
     */
    @Override
    public SysTask input(String id) {
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
    public SysTask saveData(SysTask object) {
        if (object != null) {
            if (object.getStatus() == null) {
                // 默认为已发送
                object.setStatus(TaskConst.HAS_BEEN_SENT);
            }
            if (object.getReleaseDate() == null) {
                // 默认发送时间为当前时间
                object.setReleaseDate(new Date());
            }
            return (SysTask) ToolUtil.checkResult(saveOrUpdate(object), object);
        } else {
            return null;
        }
    }

    @Override
    public boolean setCompleted(String id) {
        UpdateWrapper<SysTask> setCompleted = new UpdateWrapper<>();
        setCompleted.eq("id", id);
        // 只能修改自己的任务
        setCompleted.eq("receiver", ShiroUtil.getCurrentUser().getId());
        setCompleted.set("status", TaskConst.COMPLETED);
        return update(setCompleted);
    }
}