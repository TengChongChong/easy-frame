package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.modular.sys.dao.SysUserSettingMapper;
import com.frame.easy.modular.sys.model.SysUserSetting;
import com.frame.easy.modular.sys.service.SysUserSettingService;
import com.frame.easy.util.ToolUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户偏好设置
 *
 * @author TengChong
 * @date 2019-03-04 23:41:03
 */
@Service
public class SysUserSettingServiceImpl extends ServiceImpl<SysUserSettingMapper, SysUserSetting> implements SysUserSettingService {

    /**
     * 保存
     *
     * @param object 表单内容
     * @return 保存后信息
     */
    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public SysUserSetting saveData(SysUserSetting object) {
        ToolUtil.checkParams(object);
        if (StrUtil.isBlank(object.getId())) {
            // 新增,设置默认值
        }
        return (SysUserSetting) ToolUtil.checkResult(saveOrUpdate(object), object);
    }
}