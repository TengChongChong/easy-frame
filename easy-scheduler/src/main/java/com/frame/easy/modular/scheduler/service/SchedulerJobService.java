package com.frame.easy.modular.scheduler.service;

import com.frame.easy.common.page.Page;
import com.frame.easy.modular.scheduler.model.SchedulerJob;

import java.util.List;

/**
 * 定时任务
 *
 * @author TengChong
 * @date 2019-05-11
 */
public interface SchedulerJobService {
    /**
     * 列表
     *
     * @param object 查询条件
     * @return 数据集合
     */
    Page select(SchedulerJob object);

    /**
     * 查询所有定时任务
     *
     * @return 数据集合
     */
    List<SchedulerJob> selectAll();

    /**
     * 详情
     *
     * @param id id
     * @return 详细信息
     */
    SchedulerJob input(String id);

    /**
     * 新增
     *
     * @return 默认值
     */
    SchedulerJob add();

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
    SchedulerJob saveData(SchedulerJob object);

    /**
     * 更新最后执行时间
     *
     * @param id 数据id
     * @return true/false
     */
    boolean updateLastRunDate(String id);

    /**
     * 开始指定任务
     *
     * @param id 任务id
     */
    void start(String id);

    /**
     * 暂停指定任务
     *
     * @param id 任务id
     */
    void pause(String id);

    /**
     * 开始全部任务
     */
    void startAll();

    /**
     * 暂停全部任务
     */
    void pauseAll();

}
