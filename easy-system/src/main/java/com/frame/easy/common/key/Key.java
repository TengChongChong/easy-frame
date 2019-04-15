package com.frame.easy.common.key;

/**
 * 密钥
 *
 * @author tengchong
 * @date 2019-01-31
 */
public class Key {
    /**
     * cookie加密的密钥
     * 建议每个项目都不一样 默认AES算法 密钥长度(128 256 512 位)
     */
    public static final String REMEMBER_ME = "1QWLxg+NYmxraMoxAXu/Iw==";

    /**
     * 安全密码 作为盐值用于用户密码的加密
     * 注: 修改后会导致所有密码失效
     */
    public static final String PASSWORD = "e89aadbe-b052-11e8-96f8-529269fb1459";
}
