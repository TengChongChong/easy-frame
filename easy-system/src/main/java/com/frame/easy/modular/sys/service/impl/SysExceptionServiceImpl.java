package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.util.ToolUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

import com.frame.easy.common.page.Page;
import cn.hutool.core.lang.Validator;
import com.frame.easy.modular.sys.model.SysException;
import com.frame.easy.modular.sys.dao.SysExceptionMapper;
import com.frame.easy.modular.sys.service.SysExceptionService;

/**
 * 异常日志
 *
 * @author TengChong
 * @date 2019-04-08
 */
@Service
public class SysExceptionServiceImpl extends ServiceImpl<SysExceptionMapper, SysException> implements SysExceptionService {

    /**
     * 列表
     *
     * @param object 查询条件
     * @return 数据集合
     */
    @Override
    public Page select(SysException object) {
        QueryWrapper<SysException> queryWrapper = new QueryWrapper<>();
        if (object != null) {
            // 查询条件
            // 错误代码
            if (Validator.isNotEmpty(object.getCode())) {
                queryWrapper.eq("code", object.getCode());
            }
            // 异常类型
            if (Validator.isNotEmpty(object.getType())) {
                queryWrapper.eq("type", object.getType());
            }
            // 请求地址
            if (Validator.isNotEmpty(object.getUrl())) {
                queryWrapper.like("url", object.getUrl());
            }
            // 错误信息
            if (Validator.isNotEmpty(object.getMessage())) {
                queryWrapper.eq("message", object.getMessage());
            }
            // 触发用户
            if (Validator.isNotEmpty(object.getNickname())) {
                queryWrapper.like("u.nickname", object.getNickname());
            }
            // 触发时间
            if (Validator.isNotEmpty(object.getTriggerTime())) {
                queryWrapper.eq("trigger_time", object.getTriggerTime());
            }
        }
        Page page = ToolUtil.getPage(object);
        page.setRecords(getBaseMapper().select(page, queryWrapper));
        return page;
    }

    /**
     * 详情
     *
     * @param id id
     * @return 详细信息
     */
    @Override
    public SysException input(Long id) {
        ToolUtil.checkParams(id);
        return getBaseMapper().getById(id);
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
        return ToolUtil.checkResult(removeByIds(idList));
    }

    /**
     * 保存
     *
     * @param object 表单内容
     * @return 保存后信息
     */
    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public SysException saveData(SysException object) {
        ToolUtil.checkParams(object);
        if (object.getId() == null) {
            // 新增,设置默认值
            if (StrUtil.isBlank(object.getMessage()) && StrUtil.isNotBlank(object.getType())) {
                try {
                    object.setMessage(object.getType().substring(object.getType().lastIndexOf(".") + 1));
                } catch (RuntimeException e) {
                    e.printStackTrace();
                }
            }
        }
        return (SysException) ToolUtil.checkResult(saveOrUpdate(object), object);
    }
}