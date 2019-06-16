package com.frame.easy.modular.sys.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.frame.easy.modular.sys.model.SysMessageDetails;
import com.frame.easy.modular.sys.model.SysUser;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 消息详情 
 *
 * @author TengChong
 * @date 2019-06-06
 */
public interface SysMessageDetailsMapper extends BaseMapper<SysMessageDetails> {

    /**
     * 根据消息id查询收信人列表
     *
     * @param messageId 消息id
     * @return List<SysUser>
     */
    List<SysUser> selectReceiverUser(@Param("messageId") String messageId);
}