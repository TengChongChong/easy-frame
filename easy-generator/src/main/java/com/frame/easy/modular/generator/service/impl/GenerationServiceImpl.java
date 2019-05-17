package com.frame.easy.modular.generator.service.impl;

import cn.hutool.core.util.StrUtil;
import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.pool.DruidPooledConnection;
import com.baomidou.dynamic.datasource.DynamicRoutingDataSource;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import com.baomidou.mybatisplus.generator.config.StrategyConfig;
import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.frame.easy.common.datasource.DataSourceEnum;
import com.frame.easy.common.select.Select;
import com.frame.easy.common.status.PermissionsStatus;
import com.frame.easy.common.status.ProfilesActiveStatus;
import com.frame.easy.common.type.PermissionsType;
import com.frame.easy.config.properties.ProjectProperties;
import com.frame.easy.exception.EasyException;
import com.frame.easy.modular.generator.config.GeneratorConfig;
import com.frame.easy.modular.generator.config.builder.ConfigBuilder;
import com.frame.easy.modular.generator.constant.Const;
import com.frame.easy.modular.generator.model.Generator;
import com.frame.easy.modular.generator.service.GenerationService;
import com.frame.easy.modular.sys.model.SysDict;
import com.frame.easy.modular.sys.model.SysPermissions;
import com.frame.easy.modular.sys.service.SysDictService;
import com.frame.easy.modular.sys.service.SysPermissionsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * 代码生成
 *
 * @author tengchong
 * @date 2019-01-09
 */
@Service
public class GenerationServiceImpl implements GenerationService {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private SysPermissionsService sysPermissionsService;

    @Autowired
    private ProjectProperties projectProperties;

    @Autowired
    private SysDictService sysDictService;

    @Autowired
    private DynamicRoutingDataSource dynamicRoutingDataSource;

    @Override
    public boolean generate(Generator object) {
        GeneratorConfig generatorConfig = new GeneratorConfig();
        if (object != null) {
            // 获取指定数据源
            DruidDataSource dataSource = (DruidDataSource) dynamicRoutingDataSource.getDataSource(object.getDataSource());
            object.setUrl(dataSource.getUrl());
            object.setDriverName(dataSource.getDriverClassName());
            object.setUsername(dataSource.getUsername());
            object.setPassword(dataSource.getPassword());
            object.init();
            if (ProfilesActiveStatus.dev.getProfilesActive().equals(projectProperties.getProfilesActive())) {
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
                throw new EasyException("当前模式[" + projectProperties.getProfilesActive() + "]不允许生成");
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
     * @return SysPermissions
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
     * @param dataSourceCode 数据源
     * @return 数据源配置
     */
    private DataSourceConfig getDataSourceConfig(String dataSourceCode) {
        DataSourceConfig dataSourceConfig = new DataSourceConfig();
        DruidDataSource dataSource = (DruidDataSource) dynamicRoutingDataSource.getDataSource(dataSourceCode);
        dataSourceConfig.setUrl(dataSource.getUrl());
        dataSourceConfig.setDriverName(dataSource.getDriverClassName());
        dataSourceConfig.setUsername(dataSource.getUsername());
        dataSourceConfig.setPassword(dataSource.getPassword());
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
    public List<Select> selectTable(String dataSourceCode) {
        DruidDataSource dataSource = (DruidDataSource) dynamicRoutingDataSource.getDataSource(dataSourceCode);
        DatabaseMetaData databaseMetaData;
        List<Select> tables = new ArrayList<>();
        try {
            DruidPooledConnection connection = dataSource.getConnection();
            databaseMetaData = connection.getMetaData();
            if (StrUtil.isBlank(dataSourceCode)) {
                dataSourceCode = DataSourceEnum.MASTER.getCode();
            }
            SysDict sysDict = sysDictService.getDictByCode("dataSource", dataSourceCode);
            if (sysDict == null || StrUtil.isBlank(sysDict.getTips())) {
                throw new EasyException("请在字典中配置数据源[" + dataSourceCode + "]对应的信息");
            }
            // 获取表
            ResultSet rs = databaseMetaData.getTables(sysDict.getTips(), null, null, new String[]{"TABLE"});
            while (rs.next()) {
                String tableName = rs.getString("TABLE_NAME");
                String remarks = rs.getString("REMARKS");
                if(!inExclude(tableName)){
                    tables.add(new Select(tableName, remarks));
                }
            }
            rs.close();
            connection.close();
        } catch (SQLException e) {
            logger.warn("查询表信息失败", e);
            throw new EasyException("查询表信息失败" + e.getMessage());
        }
        return tables;
    }

    /**
     * 是否属于被排除的表
     * 比如: 定时任务(qrtz_)
     *
     * @param tableName 表名
     * @return true/false
     */
    private boolean inExclude(String tableName){
        for(String tablePrefix: Const.EXCLUDE_TABLE_PREFIX){
            if(tableName.startsWith(tablePrefix)){
                return true;
            }
        }
        return false;
    }

    @Override
    public TableInfo selectFields(String dataSourceCode, String tableName) {
        if (StrUtil.isNotBlank(tableName)) {
            ConfigBuilder configBuilder = new ConfigBuilder(getDataSourceConfig(dataSourceCode), getStrategyConfig(tableName));
            List<TableInfo> tableInfoList = configBuilder.getTableInfoList();
            return tableInfoList.get(0);
        }
        throw new RuntimeException("请输入表名后重试");
    }
}