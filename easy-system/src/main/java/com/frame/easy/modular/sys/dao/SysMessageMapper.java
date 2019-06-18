package com.frame.easy.modular.sys.dao;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.frame.easy.common.page.Page;
import com.frame.easy.modular.sys.model.SysMessage;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 消息
 *
 * @author TengChong
 * @date 2019-06-02
 */
public interface SysMessageMapper extends BaseMapper<SysMessage> {
    /**
     * 查询发送消息
     *
     * @param page 分页
     * @param queryWrapper 查询条件
     * @return List<SysMessage>
     */
    List<SysMessage> selectSend(Page page, @Param("ew") QueryWrapper<SysMessage> queryWrapper);

    /**
     * 查询接收消息
     *
     * @param page 分页
     * @param queryWrapper 查询条件
     * @return List<SysMessage>
     */
    List<SysMessage> selectReceive(Page page, @Param("ew") QueryWrapper<SysMessage> queryWrapper);

    /**
     * 查询未读消息数量
     *
     * @param queryWrapper 查询条件
     * @return 未读消息数量
     */
    int selectUnreadCount(@Param("ew") QueryWrapper<SysMessage> queryWrapper);

}