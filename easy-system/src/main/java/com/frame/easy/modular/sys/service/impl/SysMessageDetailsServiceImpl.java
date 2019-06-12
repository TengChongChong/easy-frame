package com.frame.easy.modular.sys.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.common.constant.MessageConst;
import com.frame.easy.modular.sys.dao.SysMessageDetailsMapper;
import com.frame.easy.modular.sys.model.SysMessageDetails;
import com.frame.easy.modular.sys.service.SysMessageDetailsService;
import com.frame.easy.util.ToolUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 消息详情 
 *
 * @author TengChong
 * @date 2019-06-06
 */
@Service
public class SysMessageDetailsServiceImpl extends ServiceImpl<SysMessageDetailsMapper, SysMessageDetails> implements SysMessageDetailsService {

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
    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean saveData(String messageId, String receiver) {
        List<SysMessageDetails> detailsList = new ArrayList<>();
        String[] receivers = receiver.split(CommonConst.SPLIT);
        for(String receiverUser: receivers){
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
}