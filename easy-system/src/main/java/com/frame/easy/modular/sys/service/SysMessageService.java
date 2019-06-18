package com.frame.easy.modular.sys.service;

import com.frame.easy.modular.sys.model.SysMessage;
import com.frame.easy.common.page.Page;

/**
 * 消息
 *
 * @author TengChong
 * @date 2019-06-02
 */
public interface SysMessageService {
    /**
     * 列表
     * @param object 查询条件
     * @return 数据集合
     */
    Page select(SysMessage object);

    /**
     * 收信列表
     * @param object 查询条件
     * @return 数据集合
     */
    Page selectReceive(SysMessage object);

    /**
     * 详情
     *
     * @param id id
     * @return 详细信息
     */
    SysMessage input(String id);

    /**
     * 新增
     *
     * @return 默认值
     */
    SysMessage add();

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
    SysMessage saveData(SysMessage object);

    /**
     * 发送
     *
     * @param ids 消息ids
     * @return true/false
     */
    boolean send(String ids);

    /**
     * 获取当前登录用户查询未读消息数量
     *
     * @return 未读消息数量
     */
    int selectUnreadCount();

}
