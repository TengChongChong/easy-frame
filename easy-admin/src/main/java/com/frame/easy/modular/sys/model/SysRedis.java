package com.frame.easy.modular.sys.model;

/**
 * redis
 *
 * @author tengchong
 * @date 2019-01-25
 */
public class SysRedis {
    /**
     * 键
     */
    private String key;

    /**
     * 有效期
     * 单位: 秒
     */
    private long expire;

    /**
     * 值
     */
    private Object value;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public long getExpire() {
        return expire;
    }

    public void setExpire(long expire) {
        this.expire = expire;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }
}
