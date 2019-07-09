package com.frame.easy.modular.sys.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.frame.easy.common.constant.SysConst;
import com.frame.easy.modular.sys.service.SysStatusService;
import com.frame.easy.util.SysConfigUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.metrics.MetricsEndpoint;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * 系统状态
 *
 * @author tengchong
 * @date 2018/11/9
 */
@Service
public class SysStatusServiceImpl implements SysStatusService {

    @Autowired
    private MetricsEndpoint metricsEndpoint;


    @Override
    public JSONObject getSysStatus() {
        JSONObject status = new JSONObject();
        JSONObject systemProperties = new JSONObject();
        JSONObject sysConfig = new JSONObject();
        systemProperties.put("javaVmName", System.getProperty("java.vm.name"));
        systemProperties.put("javaVmSpecificationVersion", System.getProperty("java.vm.specification.version"));
        systemProperties.put("javaVmVersion", System.getProperty("java.vm.version"));
        systemProperties.put("javaVmVendor", System.getProperty("java.vm.vendor"));
        systemProperties.put("javaHome", System.getProperty("java.home"));
        systemProperties.put("osName", System.getProperty("os.name"));
        systemProperties.put("osVersion", System.getProperty("os.version"));
        systemProperties.put("osArch", System.getProperty("os.arch"));
        systemProperties.put("userDir", System.getProperty("user.dir"));
        systemProperties.put("userName", System.getProperty("user.name"));

        sysConfig.put("projectName", SysConfigUtil.getProjectName());
        sysConfig.put("projectLoginRemember", SysConst.projectProperties.getLoginRemember());
        sysConfig.put("projectLoginRememberInvalidateTime", SysConst.projectProperties.getLoginRememberInvalidateTime() / 60 / 60 / 24);
        sysConfig.put("projectLoginAttempts", SysConst.projectProperties.getLoginAttempts());
        sysConfig.put("projectLoginLockLength", SysConst.projectProperties.getLoginLockLength() / 60);
        sysConfig.put("projectFileUploadPath", SysConst.projectProperties.getFileUploadPath());
        sysConfig.put("projectSessionInvalidateTime", SysConst.projectProperties.getSessionInvalidateTime() / 60);
        sysConfig.put("projectLoginVerificationCode", SysConst.projectProperties.getLoginVerificationCode());

        status.put("systemProperties", systemProperties);
        status.put("projectProperties", sysConfig);
        return status;
    }

    @Override
    public JSONObject getRealTimeStatus() {
        JSONObject rtStatus = new JSONObject();
        JSONObject jvm = new JSONObject();
        JSONObject cpu = new JSONObject();
//        JSONObject memory = new JSONObject();

        //jvm
        jvm.put("max", getMetricsVal("jvm.memory.max"));
        jvm.put("used", getMetricsVal("jvm.memory.used"));
        jvm.put("committed", getMetricsVal("jvm.memory.committed"));

        // cpu
        cpu.put("count", getMetricsVal("sys.cpu.count"));
        cpu.put("usage", new BigDecimal(Double.parseDouble(getMetricsVal("sys.cpu.usage").toString()) * 100).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue());
        cpu.put("processUsage", new BigDecimal(Double.parseDouble(getMetricsVal("process.cpu.usage").toString()) * 100).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue());

        rtStatus.put("cpu", cpu);
        rtStatus.put("jvm", jvm);

        return rtStatus;
    }

    private Double getMetricsVal(String key) {
        List<MetricsEndpoint.Sample> list = metricsEndpoint.metric(key, null).getMeasurements();
        if (list != null && list.size() > 0) {
            return list.get(0).getValue();
        }
        return null;
    }
}
