package com.frame.easy.modular.generator.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import com.baomidou.mybatisplus.generator.config.StrategyConfig;
import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.frame.easy.common.select.Select;
import com.frame.easy.config.properties.DataSourceProperties;
import com.frame.easy.generator.config.GeneratorConfig;
import com.frame.easy.generator.config.builder.ConfigBuilder;
import com.frame.easy.modular.generator.dao.GenerationMapper;
import com.frame.easy.generator.model.Generator;
import com.frame.easy.modular.generator.service.GenerationService;
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
    private DataSourceProperties dataSourceProperties;

    @Value("${spring.datasource.druid.db-name}")
    private String dbName;

    @Override
    public boolean generate(Generator object) {
        GeneratorConfig generatorConfig = new GeneratorConfig();
        if (object != null) {
            object.init();
            generatorConfig.generation(object);
            return true;
        }
        throw new RuntimeException("参数获取失败");
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