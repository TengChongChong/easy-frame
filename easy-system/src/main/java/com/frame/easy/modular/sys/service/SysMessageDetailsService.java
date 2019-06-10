package com.frame.easy.modular.sys.service;

/**
 * 消息详情 
 *
 * @author TengChong
 * @date 2019-06-06
 */
public interface SysMessageDetailsService {

    /**
     * 删除
     *
     * @param messageIds 消息ids
     * @return 是否成功
     */
    boolean delete(String messageIds);

    /**
     * 保存
     *
     * @param messageId 消息id
     * @param receiver 收信人
     * @return true/false
     */
    boolean saveData(Long messageId, String receiver);
}
