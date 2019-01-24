package com.frame.easy.modular.sys.service;

import com.alibaba.fastjson.JSONObject;

/**
 * 系统状态
 *
 * @author tengchong
 * @date 2018/11/9
 */
public interface SysStatusService {

    /**
     * 获取系统状态
     *
     * @return 配置信息
     */
    JSONObject getSysStatus();

    /**
     * 获取cpu/内存/jvm实时数据
     *
     * @return 实时数据
     */
    JSONObject getRealTimeStatus();

}
