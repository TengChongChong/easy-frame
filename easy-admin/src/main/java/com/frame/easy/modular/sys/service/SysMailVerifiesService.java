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
     * @return 验证邮件信息
     */
    SysMailVerifies save(Long userId, String email);
}
