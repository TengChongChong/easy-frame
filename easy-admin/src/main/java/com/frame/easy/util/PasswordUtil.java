package com.frame.easy.util;

import cn.hutool.crypto.SecureUtil;
import com.frame.easy.common.key.Key;

/**
 * 密码工具
 *
 * @author tengchong
 * @date 2018/9/4
 */
public class PasswordUtil {

    /**
     * 加密密码 用于登录
     *
     * @param password 密码(经过一次md5)
     * @param salt     盐
     * @return 加密后密码
     */
    public static String encryptedPasswords(String password, String salt) {
        return SecureUtil.md5((SecureUtil.md5(salt + Key.PASSWORD) + password));
    }

    /**
     * 生成密码 用于用户注册/新增用户
     *
     * @param password 密码 未加密
     * @param salt     盐
     * @return 加密后密码
     */
    public static String generatingPasswords(String password, String salt) {
        return SecureUtil.md5((SecureUtil.md5(salt + Key.PASSWORD) + SecureUtil.md5(password)));
    }

    public static void main(String[] arges) {
//        byte[] key = SecureUtil.generateKey(SymmetricAlgorithm.AES.getValue()).getEncoded();

    }
}
