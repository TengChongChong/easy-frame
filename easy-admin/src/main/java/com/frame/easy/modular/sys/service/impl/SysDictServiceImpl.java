package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.lang.Validator;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.frame.easy.common.page.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.common.constant.status.CommonStatus;
import com.frame.easy.common.select.Select;
import com.frame.easy.config.properties.ProjectProperties;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.core.util.ToolUtil;
import com.frame.easy.modular.sys.dao.SysDictMapper;
import com.frame.easy.modular.sys.dao.SysDictTypeMapper;
import com.frame.easy.modular.sys.model.SysDict;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.service.SysDictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * 字典管理
 *
 * @author tengchong
 * @date 2018/11/4
 */
@Service
public class SysDictServiceImpl extends ServiceImpl<SysDictMapper, SysDict> implements SysDictService {

    @Autowired
    private SysDictMapper mapper;

    @Autowired
    private SysDictTypeMapper dictTypeMapper;

    @Autowired
    private ProjectProperties projectProperties;

    @Override
    public Object select(SysDict sysDict) {
        Page page = sysDict.getPage();
        QueryWrapper<SysDict> queryWrapper = new QueryWrapper<>();
        if(sysDict != null){
            if (Validator.isNotEmpty(sysDict.getName())) {
                queryWrapper.like("t.name", sysDict.getName());
            }
            if (Validator.isNotEmpty(sysDict.getDictType())) {
                queryWrapper.eq("t.dict_type", sysDict.getDictType());
            }
            if (Validator.isNotEmpty(sysDict.getStatus())) {
                queryWrapper.eq("t.status", sysDict.getStatus());
            }
            if (Validator.isNotEmpty(sysDict.getCode())) {
                queryWrapper.eq("t.code", sysDict.getCode());
            }
        }
        page.setRecords(mapper.select(page, queryWrapper));
        return page;
    }

    @Override
    public List<SysDict> dictTypeDicts(String dictType) {
        ToolUtil.checkParams(dictType);
        return mapper.dictTypeDicts(dictType, CommonStatus.ENABLE.getCode());
    }

    @Override
    public SysDict input(Long id) {
        ToolUtil.checkParams(id);
        return mapper.selectById(id);
    }

    @Override
    public SysDict add(Long pId, String dictType) {
        SysDict object = new SysDict();
        object.setStatus(CommonStatus.ENABLE.getCode());
        object.setDictType(dictType);
        if (pId != null) {
            SysDict parentDict = mapper.selectById(pId);
            object.setpCode(parentDict.getCode());
            // 如果点击的是新增下级字典,字典类别默认为父字典的字典类型
            object.setDictType(parentDict.getDictType());
        }
        if (Validator.isNotEmpty(object.getDictType())) {
            // 有字典类型,自动设置排序值
            object.setOrderNo(mapper.getMaxOrderNo(object.getDictType()) + 1);
        }
        return object;
    }
    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean delete(String ids) {
        ToolUtil.checkParams(ids);
        List<String> idList = Arrays.asList(ids.split(CommonConst.SPLIT));
        return ToolUtil.checkResult(removeByIds(idList));
    }

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public SysDict saveData(SysDict object) {
        ToolUtil.checkParams(object);
        // 同一类型下字典编码不能重复
        QueryWrapper<SysDict> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("dict_type", object.getDictType());
        queryWrapper.eq("code", object.getCode());
        if (object.getId() != null) {
            queryWrapper.ne("id", object.getId());
        }
        int count = mapper.selectCount(queryWrapper);
        if (count > 0) {
            throw new RuntimeException("字典类型[" + object.getDictType() + "]中已存在编码为[" + object.getCode() + "]的字典，请修改后重试！");
        }
        SysUser sysUser = ShiroUtil.getCurrentUser();
        object.setEditDate(new Date());
        object.setEditUser(sysUser.getId());
        if (object.getId() == null) {
            object.setCreateUser(sysUser.getId());
            object.setCreateDate(new Date());
        }
        if (object.getOrderNo() == null) {
            object.setOrderNo(mapper.getMaxOrderNo(object.getDictType()) + 1);
        }

        return (SysDict) ToolUtil.checkResult(saveOrUpdate(object), object);
    }

    @Override
    public List<Select> getDictType() {
        return dictTypeMapper.selectType(CommonStatus.ENABLE.getCode());
    }

    @Override
    public boolean generateDictData() {
        List<SysDict> sysDicts = mapper.generateDictData(CommonStatus.ENABLE.getCode());
        if (Validator.isNotEmpty(sysDicts)) {
            JSONObject sysDictData = new JSONObject();
            String oldDictType = null;
            JSONArray temp = null;
            for (SysDict sysDict : sysDicts) {
                if (!sysDict.getDictType().equals(oldDictType)) {
                    if (temp != null) {
                        sysDictData.put(oldDictType, temp);
                    }
                    temp = new JSONArray();
                    oldDictType = sysDict.getDictType();
                }
                temp.add(sysDict);
            }
            sysDictData.put(oldDictType, temp);
            String dir = projectProperties.getFileUploadPath() + CommonConst.STATIC_DATA_PATH + File.separator + "js";
            FileUtil.writeString("var sysDict = " + sysDictData.toJSONString(), dir + File.separator + "sys-dict.js", "utf-8");
        }
        return true;
    }

}
