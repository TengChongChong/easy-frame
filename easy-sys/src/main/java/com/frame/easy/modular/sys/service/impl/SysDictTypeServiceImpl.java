package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.lang.Validator;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.frame.easy.common.page.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.exception.EasyException;
import com.frame.easy.util.ToolUtil;
import com.frame.easy.modular.sys.dao.SysDictTypeMapper;
import com.frame.easy.modular.sys.model.SysDictType;
import com.frame.easy.modular.sys.service.SysDictTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

/**
 * 字典类型
 *
 * @author tengchong
 * @date 2018/11/4
 */
@Service
public class SysDictTypeServiceImpl extends ServiceImpl<SysDictTypeMapper, SysDictType> implements SysDictTypeService {

    @Autowired
    private SysDictTypeMapper mapper;

    @Override
    public Page select(SysDictType sysDictType) {
        QueryWrapper<SysDictType> queryWrapper = new QueryWrapper<>();
        if (sysDictType != null) {
            if (Validator.isNotEmpty(sysDictType.getName())) {
                queryWrapper.like("name", sysDictType.getName());
            }
            if (Validator.isNotEmpty(sysDictType.getType())) {
                queryWrapper.like("type", sysDictType.getType());
            }
            if (Validator.isNotEmpty(sysDictType.getStatus())) {
                queryWrapper.eq("status", sysDictType.getStatus());
            }
        }
        return (Page)page(ToolUtil.getPage(sysDictType), queryWrapper);
    }

    @Override
    public List<SysDictType> selectAll() {
        return mapper.selectList(null);
    }

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean delete(String ids) {
        ToolUtil.checkParams(ids);
        List<String> idList = Arrays.asList(ids.split(CommonConst.SPLIT));
        QueryWrapper<SysDictType> queryWrapper = new QueryWrapper<>();
        queryWrapper.in("dt.id", idList);
        if (mapper.countDict(queryWrapper) > 0) {
            throw new EasyException("所选字典类型中包含字典，请删除字典后重试");
        }
        return ToolUtil.checkResult(removeByIds(idList));
    }

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public SysDictType saveData(SysDictType object) {
        ToolUtil.checkParams(object);
        if (Validator.isEmpty(object.getName())) {
            throw new EasyException("字典类型不能为空");
        }
        if (Validator.isEmpty(object.getType())) {
            throw new EasyException("字典类型名称不能为空");
        }
        QueryWrapper<SysDictType> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("type", object.getType());
        if (Validator.isNotEmpty(object.getId())) {
            queryWrapper.ne("id", object.getId());
        }
        int count = mapper.selectCount(queryWrapper);
        if (count > 0) {
            throw new EasyException("字典类别代码 " + object.getType() + " 已存在");
        }
        return (SysDictType) ToolUtil.checkResult(saveOrUpdate(object), object);
    }
}
