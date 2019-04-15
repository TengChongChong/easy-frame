package com.frame.easy.modular.sys.service.impl;

import com.frame.easy.modular.sys.model.SysRedis;
import com.frame.easy.modular.sys.service.SysRedisService;
import com.frame.easy.util.RedisUtil;
import org.springframework.stereotype.Service;

import java.util.Set;

/**
 * redis 管理
 *
 * @author tengchong
 * @date 2019-01-25
 */
@Service
public class SysRedisServiceImpl implements SysRedisService {

    @Override
    public Set<String> selectByPrefix(String prefix) {
        return RedisUtil.selectKeysByPrefix(prefix);
    }

    @Override
    public SysRedis get(String key) {
        SysRedis sysRedis = new SysRedis();
        sysRedis.setKey(key);
        sysRedis.setValue(RedisUtil.get(key));
        sysRedis.setExpire(RedisUtil.getExpire(key));
        return sysRedis;
    }

    @Override
    public boolean delete(String key) {
        RedisUtil.del(key);
        return true;
    }

    @Override
    public boolean save(SysRedis sysRedis) {
        RedisUtil.set(sysRedis.getKey(), sysRedis.getValue());
        return true;
    }
}
