package com.frame.easy.base.service;

/**
 * 导入回调
 *
 * @author tengchong
 * @date 2019-04-26
 */
public interface ImportService {
    /**
     * 导入前回调
     * 插入正式表之前会调用此方法
     * 注: 返回false会触发异常回滚
     *
     * @param templateId 模板id
     * @param userId 用户id
     * @return true/false
     */
    boolean beforeImport(String templateId, String userId);

    /**
     * 导入后回调
     * 插入正式表后会调用此方法
     * 注: 返回false会触发异常回滚
     *
     * @return true/false
     */
    boolean afterImport();
}
