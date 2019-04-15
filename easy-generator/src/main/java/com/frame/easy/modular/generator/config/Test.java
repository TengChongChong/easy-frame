package com.frame.easy.modular.generator.config;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import com.baomidou.mybatisplus.generator.config.GlobalConfig;
import com.baomidou.mybatisplus.generator.config.StrategyConfig;
import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.frame.easy.modular.generator.config.builder.ConfigBuilder;

import java.util.List;

/**
 * @author tengchong
 * @date 2019-01-15
 */
public class Test {
    private static GlobalConfig globalConfig() {
        GlobalConfig globalConfig = new GlobalConfig();
        globalConfig.setOutputDir("/Users/tengchong/Desktop/test/");
        // 覆盖已有文件
        globalConfig.setFileOverride(true);
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
        return globalConfig;
    }
    private static DataSourceConfig dataSourceConfig() {
        DataSourceConfig dataSourceConfig = new DataSourceConfig();
        dataSourceConfig.setDbType(DbType.MYSQL);
        dataSourceConfig.setDriverName("com.mysql.cj.jdbc.Driver");
        dataSourceConfig.setUsername("root");
        dataSourceConfig.setPassword("123456");
        dataSourceConfig.setUrl("jdbc:mysql://localhost:3306/easy-frame?useUnicode=true&characterEncoding=utf-8&useSSL=false&allowMulQueries=true&allowMultiQueries=true&serverTimezone=Asia/Shanghai");
        return dataSourceConfig;
    }

    private static StrategyConfig strategyConfig() {
        StrategyConfig strategyConfig = new StrategyConfig();
        strategyConfig.setInclude("sys_user");
        strategyConfig.setNaming(NamingStrategy.underline_to_camel);
        return strategyConfig;
    }


    public static void main(String[] args){

//        AutoGenerator autoGenerator = new AutoGenerator();
//        autoGenerator.setGlobalConfig(globalConfig());
//        autoGenerator.setDataSource(dataSourceConfig());
//        autoGenerator.setStrategy(strategyConfig());
////        autoGenerator.setPackageInfo(packageConfig);
//        autoGenerator.setTemplate(null);
//        autoGenerator.execute();

        ConfigBuilder configBuilder = new ConfigBuilder( dataSourceConfig(), strategyConfig());
        List<TableInfo> tableInfoList = configBuilder.getTableInfoList();
        System.out.println(JSON.toJSONString(tableInfoList));

        //获取table信息
//        List<TableInfo> tableInfoList = autoGenerator.getConfig().getTableInfoList();
    }
}
