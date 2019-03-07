package com.frame.easy.modular.sys.service;

import com.frame.easy.modular.sys.model.SysUserSecuritySetting;
import com.frame.easy.common.page.Page;

/**
 * 用户安全设置
 *
 * @author TengChong
 * @date 2019-03-04 22:34:58
 */
public interface SysUserSecuritySettingService {
    /**
     * 保存
     *
     * @param object 表单内容
     * @return 保存后信息
     */
    SysUserSecuritySetting saveData(SysUserSecuritySetting object);
}
