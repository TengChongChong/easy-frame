package com.frame.easy.modular.sample.service.impl;

import cn.hutool.core.lang.Validator;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.page.Page;
import com.frame.easy.modular.sample.dao.SampleGeneralMapper;
import com.frame.easy.modular.sample.model.SampleGeneral;
import com.frame.easy.modular.sample.service.SampleGeneralService;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.util.ToolUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * 代码生成示例
 *
 * @author TengChong
 * @date 2019-04-09
 */
@Service
public class SampleGeneralServiceImpl extends ServiceImpl<SampleGeneralMapper, SampleGeneral> implements SampleGeneralService {

    @Autowired
    private SampleGeneralMapper mapper;

    /**
     * 列表
     *
     * @param object 查询条件
     * @return 数据集合
     */
    @Override
    public Page select(SampleGeneral object) {
        QueryWrapper<SampleGeneral> queryWrapper = new QueryWrapper<>();
        if (object != null) {
            // 查询条件
            // 姓名
            if (Validator.isNotEmpty(object.getName())) {
                queryWrapper.like("name", object.getName());
            }
            // 年龄
            if (Validator.isNotEmpty(object.getAge())) {
                queryWrapper.eq("age", object.getAge());
            }
            // 手机号码
            if (Validator.isNotEmpty(object.getPhone())) {
                queryWrapper.eq("phone", object.getPhone());
            }
            // 状态
            if (Validator.isNotEmpty(object.getStatus())) {
                queryWrapper.eq("status", object.getStatus());
            }
        }
        return (Page) page(ToolUtil.getPage(object), queryWrapper);
    }

    /**
     * 详情
     *
     * @param id id
     * @return 详细信息
     */
    @Override
    public SampleGeneral input(Long id) {
        ToolUtil.checkParams(id);
        return getById(id);
    }

    /**
     * 新增
     *
     * @return 默认值
     */
    @Override
    public SampleGeneral add() {
        SampleGeneral object = new SampleGeneral();
        // 设置默认值
        return object;
    }

    /**
     * 删除
     *
     * @param ids 数据ids
     * @return 是否成功
     */
    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean delete(String ids) {
        ToolUtil.checkParams(ids);
        List<String> idList = Arrays.asList(ids.split(","));
        return removeByIds(idList);
    }

    /**
     * 保存
     *
     * @param object 表单内容
     * @return 保存后信息
     */
    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public SampleGeneral saveData(SampleGeneral object) {
        ToolUtil.checkParams(object);
        SysUser sysUser = ShiroUtil.getCurrentUser();
        object.setEditUser(sysUser.getId());
        object.setEditDate(new Date());
        if (object.getId() == null) {
            // 新增,设置默认值
            object.setStatus("1");
            object.setCreateDate(new Date());
            object.setCreateUser(sysUser.getId());
        }
        return (SampleGeneral) ToolUtil.checkResult(saveOrUpdate(object), object);
    }
}