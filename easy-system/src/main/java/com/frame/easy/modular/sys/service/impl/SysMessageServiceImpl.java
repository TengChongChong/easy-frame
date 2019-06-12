package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.lang.Validator;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.constant.MessageConst;
import com.frame.easy.common.page.Page;
import com.frame.easy.modular.sys.dao.SysMessageMapper;
import com.frame.easy.modular.sys.model.SysMessage;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.service.SysMessageDetailsService;
import com.frame.easy.modular.sys.service.SysMessageService;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.util.ToolUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * 消息
 *
 * @author TengChong
 * @date 2019-06-02
 */
@Service
public class SysMessageServiceImpl extends ServiceImpl<SysMessageMapper, SysMessage> implements SysMessageService {

    @Autowired
    private SysMessageDetailsService sysMessageDetailsService;

    /**
     * 列表
     *
     * @param object 查询条件
     * @return 数据集合
     */
    @Override
    public Page select(SysMessage object) {
        QueryWrapper<SysMessage> queryWrapper = commonQuery(object);
        if (object != null) {
            // 查询条件
            // 状态
            if (Validator.isNotEmpty(object.getStatus())) {
                queryWrapper.eq("m.status", object.getStatus());
            }
        }
        Page page = ToolUtil.getPage(object);
        page.setRecords(getBaseMapper().selectSend(page, queryWrapper));
        return page;
    }

    @Override
    public Page selectReceive(SysMessage object) {
        SysUser currentUser = ShiroUtil.getCurrentUser();
        // 查询条件
        QueryWrapper<SysMessage> queryWrapper = commonQuery(object);
        // 只查询接收人为自己的
        queryWrapper.eq("d.receiver_user", currentUser.getId());
        // 已发送
        queryWrapper.eq("m.status", MessageConst.STATUS_HAS_BEEN_SENT);
        if (object != null) {
            if (object.getStar() != null) {
                queryWrapper.eq("d.star", object.getStar());
            }
            if(StrUtil.isNotBlank(object.getDetailsStatus())){
                queryWrapper.eq("d.status", object.getDetailsStatus());
            }
        }
        Page page = ToolUtil.getPage(object);
        page.setRecords(getBaseMapper().selectReceive(page, queryWrapper));
        return page;
    }

    private QueryWrapper<SysMessage> commonQuery(SysMessage object) {
        QueryWrapper<SysMessage> queryWrapper = new QueryWrapper<>();
        if (object != null) {
            // 标题
            if (Validator.isNotEmpty(object.getTitle())) {
                queryWrapper.eq("m.title", object.getTitle());
            }
            // 类型
            if (Validator.isNotEmpty(object.getType())) {
                queryWrapper.eq("m.type", object.getType());
            }
        }
        return queryWrapper;
    }

    /**
     * 详情
     *
     * @param id id
     * @return 详细信息
     */
    @Override
    public SysMessage input(String id) {
        ToolUtil.checkParams(id);
        return getById(id);
    }

    /**
     * 新增
     *
     * @return 默认值
     */
    @Override
    public SysMessage add() {
        SysMessage object = new SysMessage();
        // 设置默认值
        object.setType(MessageConst.TYPE_NOTICE);
        // 非重要
        object.setImportant(MessageConst.IMPORTANT_NO);
        // 草稿
        object.setStatus(MessageConst.STATUS_DRAFT);
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
        return removeByIds(idList);
    }

    /**
     * 保存
     *
     * @param object 表单内容
     * @return 保存后信息
     */
    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public SysMessage saveData(SysMessage object) {
        ToolUtil.checkParams(object);
        boolean isAdd = StrUtil.isBlank(object.getId());
        if(MessageConst.STATUS_HAS_BEEN_SENT == object.getStatus()){
            object.setSendDate(new Date());
        }
        boolean isSuccess = saveOrUpdate(object);
        if(isSuccess){
            if(!isAdd){
                // 清空上次设置的收信人
                sysMessageDetailsService.delete(String.valueOf(object.getId()));
            }
            // 保存收信人
            sysMessageDetailsService.saveData(object.getId(), object.getReceiver());
        }
        return object;
    }
}