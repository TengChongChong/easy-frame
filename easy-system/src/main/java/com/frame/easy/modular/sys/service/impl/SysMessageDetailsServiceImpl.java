package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.common.constant.MessageConst;
import com.frame.easy.modular.sys.dao.SysMessageDetailsMapper;
import com.frame.easy.modular.sys.model.SysMessageDetails;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.service.SysMessageDetailsService;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.util.ToolUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * 消息详情
 *
 * @author TengChong
 * @date 2019-06-06
 */
@Service
public class SysMessageDetailsServiceImpl extends ServiceImpl<SysMessageDetailsMapper, SysMessageDetails> implements SysMessageDetailsService {
    @Override
    public List<SysUser> selectReceiverUser(String messageId) {
        return getBaseMapper().selectReceiverUser(messageId);
    }

    /**
     * 删除
     *
     * @param messageIds 消息ids
     * @return 是否成功
     */
    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean delete(String messageIds) {
        ToolUtil.checkParams(messageIds);
        List<String> idList = Arrays.asList(messageIds.split(","));
        QueryWrapper<SysMessageDetails> delete = new QueryWrapper<>();
        delete.in("message_id", idList);
        return remove(delete);
    }

    @Override
    public boolean deleteByIds(String ids, boolean deleteCompletely) {
        ToolUtil.checkParams(ids);
        List<String> idList = Arrays.asList(ids.split(","));
        if (deleteCompletely) {
            QueryWrapper<SysMessageDetails> delete = new QueryWrapper<>();
            delete.in("id", idList);
            delete.eq("receiver_user", ShiroUtil.getCurrentUser().getId());
            return remove(delete);
        } else {
            UpdateWrapper<SysMessageDetails> updateWrapper = new UpdateWrapper<>();
            updateWrapper.in("id", idList);
            updateWrapper.eq("receiver_user", ShiroUtil.getCurrentUser().getId());
            // 回收站
            updateWrapper.set("status", MessageConst.RECEIVE_STATUS_DELETED);
            return update(updateWrapper);
        }
    }

    @Override
    public boolean reductionByIds(String ids) {
        ToolUtil.checkParams(ids);
        List<String> idList = Arrays.asList(ids.split(","));
        UpdateWrapper<SysMessageDetails> updateWrapper = new UpdateWrapper<>();
        updateWrapper.in("id", idList);
        updateWrapper.eq("receiver_user", ShiroUtil.getCurrentUser().getId());
        // 状态设置为已读
        updateWrapper.set("status", MessageConst.RECEIVE_STATUS_ALREADY_READ);
        return update(updateWrapper);
    }

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean saveData(String messageId, String receiver) {
        List<SysMessageDetails> detailsList = new ArrayList<>();
        String[] receivers = receiver.split(CommonConst.SPLIT);
        for (String receiverUser : receivers) {
            SysMessageDetails details = new SysMessageDetails();
            details.setMessageId(messageId);
            // 收信人
            details.setReceiverUser(receiverUser);
            // 未标星
            details.setStar(MessageConst.STAR_NO);
            // 未读
            details.setStatus(MessageConst.RECEIVE_STATUS_UNREAD);
            detailsList.add(details);
        }
        return saveBatch(detailsList);
    }


    @Override
    public boolean setStar(String id, boolean type) {
        if (StrUtil.isNotBlank(id)) {
            UpdateWrapper<SysMessageDetails> updateStar = new UpdateWrapper<>();
            updateStar.eq("id", id);
            // 接收人必须是当前登录用户
            updateStar.eq("receiver_user", ShiroUtil.getCurrentUser().getId());
            updateStar.set("star", type ? MessageConst.STAR_YES : MessageConst.STAR_NO);
            return update(updateStar);
        }
        return false;
    }

    @Override
    public boolean setRead(String ids) {
        UpdateWrapper<SysMessageDetails> updateRead = new UpdateWrapper<>();
        if (StrUtil.isNotBlank(ids)) {
            List<String> idList = Arrays.asList(ids.split(","));
            updateRead.in("id", idList);
        }
        // 接收人必须是当前登录用户
        updateRead.eq("receiver_user", ShiroUtil.getCurrentUser().getId());
        // 非回收站信息
        updateRead.ne("status", MessageConst.RECEIVE_STATUS_DELETED);
        // 阅读时间
        updateRead.set("read_date", new Date());
        // 已读
        updateRead.set("status", MessageConst.RECEIVE_STATUS_ALREADY_READ);
        return update(updateRead);
    }
}