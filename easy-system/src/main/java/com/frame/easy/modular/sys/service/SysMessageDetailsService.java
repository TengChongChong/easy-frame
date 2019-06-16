package com.frame.easy.modular.sys.service;

import com.frame.easy.modular.sys.model.SysUser;

import java.util.List;

/**
 * 消息详情 
 *
 * @author TengChong
 * @date 2019-06-06
 */
public interface SysMessageDetailsService {
    /**
     * 根据消息id查询收信人列表
     *
     * @param messageId 消息id
     * @return List<SysUser>
     */
    List<SysUser> selectReceiverUser(String messageId);

    /**
     * 根据消息id删除
     *
     * @param messageIds 消息ids
     * @return 是否成功
     */
    boolean delete(String messageIds);

    /**
     * 根据接收消息id删除
     *
     * @param ids 消息ids
     * @param deleteCompletely true/false 是否彻底删除
     * @return true/false
     */
    boolean deleteByIds(String ids, boolean deleteCompletely);

    /**
     * 根据接收消息id还原
     *
     * @param ids 消息ids
     * @return true/false
     */
    boolean reductionByIds(String ids);

    /**
     * 保存
     *
     * @param messageId 消息id
     * @param receiver 收信人
     * @return true/false
     */
    boolean saveData(String messageId, String receiver);

    /**
     * 设置消息标星/取消标星
     *
     * @param id 消息id
     * @param type true/false 是否标星
     * @return true/false
     */
    boolean setStar(String id, boolean type);

    /**
     * 设置消息已读
     *
     * @param ids 消息ids
     * @return true/false
     */
    boolean setRead(String ids);

}
