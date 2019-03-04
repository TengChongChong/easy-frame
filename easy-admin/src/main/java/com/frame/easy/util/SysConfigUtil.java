package com.frame.easy.util;

import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.common.constant.DataTypeConst;
import com.frame.easy.common.constant.SysConfigConst;
import com.frame.easy.modular.sys.model.SysConfig;
import com.frame.easy.modular.sys.service.ShiroService;
import com.frame.easy.modular.sys.service.SysConfigService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 系统参数
 *
 * @author tengchong
 * @date 2019-03-03
 */
@Component
public class SysConfigUtil {
    private static Logger logger = LoggerFactory.getLogger(ShiroService.class);

    private static SysConfigService sysConfigService;

    /**
     * 根据key获取系统参数的value
     *
     * @param key key
     * @return value
     */
    public static Object get(String key) {
        return transferType(sysConfigService.getByKey(key));
    }

    /**
     * 转换为config指定类型
     *
     * @param config 系统参数
     * @return value
     */
    private static Object transferType(SysConfig config) {
        if (DataTypeConst.STRING.equals(config.getType())) {
            return config.getValue();
        } else if (DataTypeConst.INTEGER.equals(config.getType())) {
            return Integer.parseInt(config.getValue());
        } else if (DataTypeConst.BOOLEAN.equals(config.getType())) {
            return CommonConst.TRUE.equals(config.getValue());
        } else {
            return config.getValue();
        }
    }

    @Autowired
    public void setSysConfigService(SysConfigService sysConfigService) {
        SysConfigUtil.sysConfigService = sysConfigService;
    }
}
