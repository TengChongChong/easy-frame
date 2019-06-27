package com.frame.easy.modular.sys.service;

import com.frame.easy.modular.sys.model.SysLog;
import com.frame.easy.common.page.Page;

/**
 * 日志 
 *
 * @author TengChong
 * @date 2019-06-27
 */
public interface SysLogService {
    /**
     * 列表
     * @param object 查询条件
     * @return 数据集合
     */
    Page select(SysLog object);

    /**
     * 详情
     *
     * @param id id
     * @return 详细信息
     */
    SysLog input(String id);

    /**
     * 保存
     *
     * @param object 表单内容
     * @return 保存后信息
     */
    SysLog saveData(SysLog object);

    /**
     * 清理异常日志表里的数据
     * @return true/false
     */
    boolean clean();
}
