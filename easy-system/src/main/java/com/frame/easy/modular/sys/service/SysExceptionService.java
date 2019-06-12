package com.frame.easy.modular.sys.service;

import com.frame.easy.modular.sys.model.SysException;
import com.frame.easy.common.page.Page;

/**
 * 异常日志
 *
 * @author TengChong
 * @date 2019-04-08
 */
public interface SysExceptionService {
    /**
     * 列表
     * @param object 查询条件
     * @return 数据集合
     */
    Page select(SysException object);

    /**
     * 详情
     *
     * @param id id
     * @return 详细信息
     */
    SysException input(String id);
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
    SysException saveData(SysException object);
}
