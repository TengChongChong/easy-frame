package com.frame.easy.core.start;

import com.frame.easy.common.redis.RedisPrefix;
import com.frame.easy.modular.sys.service.SysConfigService;
import com.frame.easy.util.RedisUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * 刷新缓存中的配置
 *
 * @Author tengchong
 * @Date 2019-04-07
 */
@Component
public class RefreshCache implements CommandLineRunner {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private SysConfigService sysConfigService;

    @Override
    public void run(String... args) throws Exception {
        logger.info("刷新缓存中的配置...");
        sysConfigService.refreshCache();
        logger.info("清空插件验证结果...");
        cleanPluginsCheckResult();
    }

    /**
     * 清空插件验证结果
     */
    private void cleanPluginsCheckResult(){
        RedisUtil.delByPrefix(RedisPrefix.PLUGIN_CHECK);
    }
}
