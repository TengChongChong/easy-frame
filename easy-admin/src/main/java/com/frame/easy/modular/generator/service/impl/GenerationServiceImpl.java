package com.frame.easy.modular.generator.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import com.baomidou.mybatisplus.generator.config.StrategyConfig;
import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.common.select.Select;
import com.frame.easy.common.status.PermissionsStatus;
import com.frame.easy.common.status.ProfilesActiveStatus;
import com.frame.easy.common.type.PermissionsType;
import com.frame.easy.config.properties.DataSourceProperties;
import com.frame.easy.exception.EasyException;
import com.frame.easy.generator.config.GeneratorConfig;
import com.frame.easy.generator.config.builder.ConfigBuilder;
import com.frame.easy.modular.generator.dao.GenerationMapper;
import com.frame.easy.generator.model.Generator;
import com.frame.easy.modular.generator.service.GenerationService;
import com.frame.easy.modular.sys.model.SysPermissions;
import com.frame.easy.modular.sys.service.SysPermissionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 代码生成
 *
 * @author tengchong
 * @date 2019-01-09
 */
@Service
public class GenerationServiceImpl implements GenerationService {

    @Autowired
    private GenerationMapper mapper;
    @Autowired
    private SysPermissionsService sysPermissionsService;

    @Autowired
    private DataSourceProperties dataSourceProperties;

    @Value("${spring.datasource.druid.db-name}")
    private String dbName;

    @Override
    public boolean generate(Generator object) {
        GeneratorConfig generatorConfig = new GeneratorConfig();
        if (object != null) {
            object.setUrl(dataSourceProperties.getUrl());
            object.setDriverName(dataSourceProperties.getDriverName());
            object.setUsername(dataSourceProperties.getUsername());
            object.setPassword(dataSourceProperties.getPassword());
            object.init();
            if (ProfilesActiveStatus.dev.getProfilesActive().equals(CommonConst.projectProperties.getProfilesActive())) {
                generatorConfig.generation(object);
                // 检查是否需要添加菜单
                if (StrUtil.isNotBlank(object.getMenuName())) {
                    // 菜单名称不为空
                    // 检查菜单名称是否存在
                    if (!sysPermissionsService.checkMenuIsHaving(object.getMenuName())) {
                        // 菜单不存在
                        SysPermissions basePermission = getNewMenu(object.getMenuName(),
                                object.getPermissionsCode() + ":select",
                                "/auth/" + object.getControllerMapping() + "/list",
                                1);
                        basePermission.setpId(0L);
                        basePermission.setType(PermissionsType.ENABLE.getCode());
                        sysPermissionsService.saveData(basePermission);
                        if (StrUtil.isNotBlank(object.getPermissionsCode())) {
                            // 如果权限代码不为空,保存方法权限
                            if (object.getGenSave()) {
                                SysPermissions savePermission = getNewMenu("保存/修改",
                                        object.getPermissionsCode() + ":save",
                                        null,
                                        2);
                                savePermission.setIcon("la la-save");
                                savePermission.setpId(basePermission.getId());
                                sysPermissionsService.saveData(savePermission);
                            }
                            if (object.getGenDelete()) {
                                SysPermissions savePermission = getNewMenu("删除",
                                        object.getPermissionsCode() + ":delete",
                                        null,
                                        2);
                                savePermission.setIcon("la la-trash");
                                savePermission.setpId(basePermission.getId());
                                sysPermissionsService.saveData(savePermission);
                            }
                            if (object.getGenAdd()) {
                                SysPermissions savePermission = getNewMenu("新增",
                                        object.getPermissionsCode() + ":add",
                                        null,
                                        2);
                                savePermission.setIcon("la la-plus");
                                savePermission.setpId(basePermission.getId());
                                sysPermissionsService.saveData(savePermission);
                            }
                        }
                    }
                }
                return true;
            } else {
                throw new EasyException("当前模式[" + CommonConst.projectProperties.getProfilesActive() + "]不允许生成");
            }
        }
        throw new RuntimeException("参数获取失败");
    }

    /**
     * 获取菜单/权限对象
     *
     * @param name 名称
     * @param code 权限代码
     * @param url  访问地址
     * @param lev  级别
     * @return
     */
    private SysPermissions getNewMenu(String name, String code, String url, int lev) {
        SysPermissions sysPermissions = new SysPermissions();
        sysPermissions.setName(name);
        sysPermissions.setCode(code);
        sysPermissions.setUrl(url);
        sysPermissions.setLevels(lev);
        sysPermissions.setType(PermissionsType.DISABLE.getCode());
        sysPermissions.setStatus(PermissionsStatus.ENABLE.getCode());
        return sysPermissions;
    }

    /**
     * 获取数据源配置
     *
     * @return 数据源配置
     */
    private DataSourceConfig getDataSourceConfig() {
        DataSourceConfig dataSourceConfig = new DataSourceConfig();
        dataSourceConfig.setUrl(dataSourceProperties.getUrl());
        dataSourceConfig.setDriverName(dataSourceProperties.getDriverName());
        dataSourceConfig.setUsername(dataSourceProperties.getUsername());
        dataSourceConfig.setPassword(dataSourceProperties.getPassword());
        return dataSourceConfig;
    }

    /**
     * 获取生成策略
     *
     * @param tableName 表名
     * @return 策略
     */
    private StrategyConfig getStrategyConfig(String tableName) {
        StrategyConfig strategyConfig = new StrategyConfig();
        strategyConfig.setInclude(tableName);
        strategyConfig.setNaming(NamingStrategy.underline_to_camel);
        return strategyConfig;
    }

    @Override
    public List<Select> selectTable() {
        return mapper.selectTable(dbName);
    }

    @Override
    public TableInfo selectFields(String tableName) {
        if (StrUtil.isNotBlank(tableName)) {
            ConfigBuilder configBuilder = new ConfigBuilder(getDataSourceConfig(), getStrategyConfig(tableName));
            List<TableInfo> tableInfoList = configBuilder.getTableInfoList();
            return tableInfoList.get(0);
        }
        throw new RuntimeException("请输入表名后重试");
    }
}