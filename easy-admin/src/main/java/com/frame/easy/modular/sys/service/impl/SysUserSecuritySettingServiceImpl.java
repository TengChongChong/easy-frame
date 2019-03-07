package com.frame.easy.modular.sys.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.util.ToolUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Arrays;
import java.util.List;
import com.frame.easy.common.page.Page;
import cn.hutool.core.lang.Validator;
import com.frame.easy.modular.sys.model.SysUserSecuritySetting;
import com.frame.easy.modular.sys.dao.SysUserSecuritySettingMapper;
import com.frame.easy.modular.sys.service.SysUserSecuritySettingService;

/**
 * 用户安全设置
 *
 * @author TengChong
 * @date 2019-03-04 22:34:58
 */
@Service
public class SysUserSecuritySettingServiceImpl extends ServiceImpl<SysUserSecuritySettingMapper, SysUserSecuritySetting> implements SysUserSecuritySettingService {

    @Autowired
    private SysUserSecuritySettingMapper mapper;

    /**
     * 保存
     *
     * @param object 表单内容
     * @return 保存后信息
     */
    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public SysUserSecuritySetting saveData(SysUserSecuritySetting object) {
        ToolUtil.checkParams(object);
        if (object.getId() == null) {
            // 新增,设置默认值
        }
        return (SysUserSecuritySetting) ToolUtil.checkResult(saveOrUpdate(object), object);
    }
}