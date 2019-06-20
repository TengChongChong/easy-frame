package com.frame.easy.modular.sys.service;

import com.frame.easy.modular.sys.model.SysTask;
import com.frame.easy.common.page.Page;

/**
 * 任务 
 *
 * @author TengChong
 * @date 2019-06-19
 */
public interface SysTaskService {
    /**
     * 列表
     * @param object 查询条件
     * @return 数据集合
     */
    Page select(SysTask object);

    /**
     * 详情
     *
     * @param id id
     * @return 详细信息
     */
    SysTask input(String id);

    /**
     * 保存
     * 注: 此处为后端自动调用,不提供给用户界面操作
     *
     * @param object 内容
     * @return 保存后信息
     */
    SysTask saveData(SysTask object);

    /**
     * 设置任务已完成
     *
     * @param id id
     * @return true/false
     */
    boolean setCompleted(String id);
}
