package com.frame.easy.core.util;

import com.frame.easy.config.properties.RedisProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * redis 工具类
 *
 * @author tengchong
 * @date 2018/9/11
 */

@Component
public class RedisUtil {

    private static RedisTemplate<String, Object> redisTemplate;

    private static RedisProperties redisProperties;

    private RedisUtil() {

    }

    /**
     * 保存到redis
     * 默认过期时间 30 分钟
     *
     * @param key 键
     * @param val 值
     */
    public static void set(String key, Object val) {
        set(key, val, redisProperties.getExpire());
    }

    /**
     * 保存到redis
     *
     * @param key    键
     * @param val    值
     * @param expire 过期时间 单位: 秒
     */
    public static void set(String key, Object val, long expire) {
        redisTemplate.opsForValue().set(key, val, expire, TimeUnit.SECONDS);
    }

    /**
     * 根据key从redis获取值
     *
     * @param key 键
     * @return Object
     */
    public static Object get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    /**
     * 根据key从redis删除值
     *
     * @param key 键
     */
    public static void del(String key) {
        redisTemplate.delete(key);
    }

    /**
     * 根据前缀删除redis中的内容
     *
     * @param keyPrefix 前缀
     */
    public static void delByPrefix(String keyPrefix) {
        keyPrefix = keyPrefix + "*";
        Set<String> keyArraySet = redisTemplate.keys(keyPrefix);
        for (String key : keyArraySet) {
            redisTemplate.delete(key);
        }
    }

    /**
     * 根据前缀获取key列表
     * @param keyPrefix key前缀
     * @return Set<String>
     */
    public static Set<String> getKeysByPrefix(String keyPrefix){
        keyPrefix = keyPrefix + "*";
        return redisTemplate.keys(keyPrefix);
    }

    /**
     * 根据key设置缓存过期时间
     *
     * @param key 键
     * @param expire 过期时间 单位: 秒
     */
    public static void setExpire(String key, long expire){
        redisTemplate.expire(key, expire, TimeUnit.SECONDS);
    }

    /**
     * 递增
     * @param key
     * @param increment 递增数
     */
    public static void increment(String key, int increment){
        redisTemplate.opsForValue().increment(key, increment);
    }

    /**
     * redis中是否有指定key
     * @param key
     * @return true/false
     */
    public static boolean hasKey(String key){
        return redisTemplate.hasKey(key);
    }

    /**
     * 获取指定key有效期剩余时间
     * @param key
     * @return
     */
    public static long getExpire(String key){
        return redisTemplate.getExpire(key);
    }

    @Autowired
    public void setRedisTemplate(RedisTemplate<String, Object> redisTemplate) {
        RedisUtil.redisTemplate = redisTemplate;
    }

    @Autowired
    public void setRedisProperties(RedisProperties redisProperties) {
        RedisUtil.redisProperties = redisProperties;
    }
}
