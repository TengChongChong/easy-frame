package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.redis.RedisPrefix;
import com.frame.easy.exception.EasyException;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.util.RedisUtil;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.util.ToolUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import com.frame.easy.common.page.Page;
import cn.hutool.core.lang.Validator;
import com.frame.easy.modular.sys.model.SysConfig;
import com.frame.easy.modular.sys.dao.SysConfigMapper;
import com.frame.easy.modular.sys.service.SysConfigService;

/**
 * 系统参数
 *
 * @author admin
 * @date 2019-03-03 15:52:44
 */
@Service
public class SysConfigServiceImpl extends ServiceImpl<SysConfigMapper, SysConfig> implements SysConfigService {

    /**
     * 列表
     *
     * @param object 查询条件
     * @return 数据集合
     */
    @Override
    public Page select(SysConfig object) {
        QueryWrapper<SysConfig> queryWrapper = new QueryWrapper<>();
        if (object != null) {
            // 查询条件
            // key
            if (Validator.isNotEmpty(object.getSysKey())) {
                queryWrapper.eq("sys_key", object.getSysKey());
            }
            // value
            if (Validator.isNotEmpty(object.getValue())) {
                queryWrapper.eq("value", object.getValue());
            }
            // 类型
            if (Validator.isNotEmpty(object.getType())) {
                queryWrapper.eq("type", object.getType());
            }
            // 编辑时间
            if (Validator.isNotEmpty(object.getEditDate())) {
                queryWrapper.eq("edit_date", object.getEditDate());
            }
            // 编辑人
            if (Validator.isNotEmpty(object.getEditUser())) {
                queryWrapper.eq("edit_user", object.getEditUser());
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
    public SysConfig input(Long id) {
        ToolUtil.checkParams(id);
        return getById(id);
    }

    /**
     * 新增
     *
     * @return 默认值
     */
    @Override
    public SysConfig add() {
        SysConfig object = new SysConfig();
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
        boolean isSuccess = removeByIds(idList);
        if(isSuccess){
            refreshCache();
        }
        return isSuccess;
    }

    /**
     * 保存
     *
     * @param object 表单内容
     * @return 保存后信息
     */
    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public SysConfig saveData(SysConfig object) {
        ToolUtil.checkParams(object);
        QueryWrapper<SysConfig> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("sys_key", object.getSysKey());
        if (object.getId() != null) {
            queryWrapper.ne("id", object.getId());
        }
        if (count(queryWrapper) > 0) {
            throw new EasyException("key[" + object.getSysKey() + "]已存在");
        }
        updateCache(object);
        return (SysConfig) ToolUtil.checkResult(saveOrUpdate(object), object);
    }

    @Override
    public SysConfig getByKey(String key) {
        if (StrUtil.isNotBlank(key)) {
            SysConfig config = (SysConfig) RedisUtil.get(getRedisKey(key));
            if (config == null) {
                QueryWrapper<SysConfig> queryWrapper = new QueryWrapper<>();
                queryWrapper.select("sys_key,value,type");
                queryWrapper.eq("sys_key", key);
                config = getOne(queryWrapper);
                updateCache(config);
            }
            return config;
        }
        return null;
    }

    @Override
    public boolean refreshCache() {
        // 清空redis中sys config缓存
        RedisUtil.delByPrefix(RedisPrefix.SYS_CONFIG);
        // 从数据库查询config存入redis
        QueryWrapper<SysConfig> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("sys_key,value,type");
        List<SysConfig> configs = list(queryWrapper);
        if (configs != null && configs.size() > 0) {
            for (SysConfig config : configs) {
                updateCache(config);
            }
        }
        return true;
    }

    /**
     * 向缓存中添加/修改系统参数
     *
     * @param config 系统参数
     */
    private void updateCache(SysConfig config) {
        if (config != null) {
            RedisUtil.set(getRedisKey(config.getSysKey()), config, 30 * 24 * 60 * 60);
        }
    }

    /**
     * 获取系统参数在redis中的key
     *
     * @param key key
     * @return key
     */
    private String getRedisKey(String key) {
        return RedisPrefix.SYS_CONFIG + key;
    }
}