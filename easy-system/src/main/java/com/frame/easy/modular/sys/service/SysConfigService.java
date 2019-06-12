package com.frame.easy.modular.sys.service;

import com.frame.easy.modular.sys.model.SysConfig;
import com.frame.easy.common.page.Page;

/**
 * 系统参数
 *
 * @author admin
 * @date 2019-03-03 15:52:44
 */
public interface SysConfigService {
    /**
     * 列表
     * @param object 查询条件
     * @return 数据集合
     */
    Page select(SysConfig object);

    /**
     * 详情
     *
     * @param id id
     * @return 详细信息
     */
    SysConfig input(String id);
    /**
     * 新增
     *
     * @return 默认值
     */
    SysConfig add();
    /**
     * 删除
     *
     * @param ids 数据ids
     * @return 是否成功
     */
    boolean delete(String ids);
    /**
     * 保存
     *
     * @param object 表单内容
     * @return 保存后信息
     */
    SysConfig saveData(SysConfig object);

    /**
     * 根据key获取系统参数value
     * 如果key存在会同时更新缓存中内容
     *
     * @param key key
     * @return config
     */
    SysConfig getByKey(String key);

    /**
     * 刷新缓存中的系统参数
     *
     * @return true/false
     */
    boolean refreshCache();
}
