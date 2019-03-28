package com.frame.easy.modular.sys.service;

import com.frame.easy.modular.sys.model.SysMailVerifies;

/**
 * 邮箱验证
 *
 * @author TengChong
 * @date 2019-03-24
 */
public interface SysMailVerifiesService {
    /**
     * 验证
     *
     * @param code 校验码
     * @return true/false
     */
    boolean verifies(String code);

    /**
     * 保存
     *
     * @param userId 用户id
     * @param email 邮箱
     * @param type 类型
     * @return 验证邮件信息
     */
    SysMailVerifies save(Long userId, String email, String type);

    /**
     * 根据用户id查询是否有待验证mail
     *
     * @param userId 用户id
     * @return 邮箱
     */
    String getMailByUserId(Long userId);
}
