package com.frame.easy.generator.config;

import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import com.baomidou.mybatisplus.generator.config.GlobalConfig;
import com.baomidou.mybatisplus.generator.config.StrategyConfig;
import com.baomidou.mybatisplus.generator.config.TemplateConfig;
import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import com.frame.easy.generator.engine.CommonTemplateEngine;
import com.frame.easy.generator.engine.base.BaseTemplateEngine;
import com.frame.easy.generator.model.Generator;

import java.util.List;

/**
 * 代码生成的抽象配置
 *
 * @author tengchong
 * @date 2019-01-08
 */
public abstract class AbstractGeneratorConfig {
    /**
     * 全局配置
     */
    GlobalConfig globalConfig = new GlobalConfig();
    /**
     * 数据源配置
     */
    DataSourceConfig dataSourceConfig = new DataSourceConfig();
    /**
     * 数据库表配置，通过该配置，可指定需要生成哪些表或者排除哪些表
     */
    StrategyConfig strategyConfig = new StrategyConfig();
    /**
     * 模板设置
     */
    TemplateConfig templateConfig = new TemplateConfig();
    /**
     * 表信息
     */
    private TableInfo tableInfo = null;
    /**
     * 生成配置
     */
    Generator generator = new Generator();

    /**
     * 配置
     */
    protected abstract void config();

    /**
     * 初始化
     */
    public void init() {
        config();
    }
    public AbstractGeneratorConfig() {

    }

    /**
     * 生成代码
     */
    public void generation(Generator generator) {
        this.generator = generator;
        init();
        AutoGenerator autoGenerator = new AutoGenerator();
        autoGenerator.setGlobalConfig(globalConfig);
        autoGenerator.setDataSource(dataSourceConfig);
        autoGenerator.setStrategy(strategyConfig);
        autoGenerator.setTemplate(templateConfig);
        autoGenerator.execute();

        //获取table信息
        List<TableInfo> tableInfoList = autoGenerator.getConfig().getTableInfoList();
        if (tableInfoList != null && tableInfoList.size() > 0) {
            this.tableInfo = tableInfoList.get(0);
        }

        BaseTemplateEngine myTemplate = new CommonTemplateEngine();
        myTemplate.setGenerator(generator);
        myTemplate.setTableInfo(tableInfo);
        myTemplate.start();
    }

}
