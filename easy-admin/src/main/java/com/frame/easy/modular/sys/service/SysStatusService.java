package com.frame.easy.modular.sys.service;

/**
 * 系统状态
 *
 * @Author tengchong
 * @Date 2018/11/9
 */
public interface SysStatusService {

    /**
     * 获取系统状态
     *
     * @return
     */
    Object getSysStatus();

    /**
     * 获取cpu/内存/jvm实时数据
     *
     * @return
     */
    Object getRealTimeStatus();

}
