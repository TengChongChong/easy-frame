package com.frame.easy.generator.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.frame.easy.generator.constant.Const;

/**
 * 配置生成参数
 * 用于main方法直接调用生成
 *
 * @author tengchong
 * @date 2019-01-09
 */
public class GeneratorConfig extends AbstractGeneratorConfig {
    private void globalConfig() {
        globalConfig.setOutputDir(generator.getProjectPath() + Const.JAVA_PATH);
        // 覆盖已有文件
        globalConfig.setFileOverride(generator.getReplace());
        // 是否在xml中添加二级缓存配置
        globalConfig.setEnableCache(false);
        // 开启 BaseResultMap
        globalConfig.setBaseResultMap(true);
        // 开启 baseColumnList
        globalConfig.setBaseColumnList(true);
        // 是否打开输出目录
        globalConfig.setOpen(false);
        // 作者
        globalConfig.setAuthor("tengchong");
    }

    private void dataSourceConfig() {
        dataSourceConfig.setDbType(DbType.MYSQL);
        dataSourceConfig.setDriverName(generator.getDriverName());
        dataSourceConfig.setUsername(generator.getUsername());
        dataSourceConfig.setPassword(generator.getPassword());
        dataSourceConfig.setUrl(generator.getUrl());
    }

    private void strategyConfig() {
        strategyConfig.setInclude(generator.getTableName());
        /**
         * 命名规则
         * 下换线转驼峰
         */
        strategyConfig.setNaming(NamingStrategy.underline_to_camel);
    }

    private void templateConfig() {
        templateConfig.setXml(null);
        templateConfig.setController(null);
        templateConfig.setEntity(null);
        templateConfig.setService(null);
        templateConfig.setServiceImpl(null);
        templateConfig.setMapper(null);
    }

    @Override
    protected void config() {
        globalConfig();
        dataSourceConfig();
        strategyConfig();
        templateConfig();
    }
}
