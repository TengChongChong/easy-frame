package com.frame.easy.modular.generator;


import cn.hutool.core.date.DateUtil;
import com.frame.easy.modular.generator.config.GeneratorConfig;
import com.frame.easy.modular.generator.model.Generator;

/**
 * 代码生成器
 *
 * @author tengchong
 * @date 2019-01-08
 */
public class CodeGenerator {

    public static void main(String[] args) {
        GeneratorConfig generatorConfig = new GeneratorConfig();
        Generator generator = new Generator();
        // 数据库参数
        generator.setDriverName("com.mysql.cj.jdbc.Driver");
        generator.setUsername("root");
        generator.setPassword("123456");
        generator.setUrl("jdbc:mysql://localhost:3306/easy-frame?useUnicode=true&characterEncoding=utf-8&useSSL=false&allowMulQueries=true&allowMultiQueries=true&serverTimezone=Asia/Shanghai");
        // 生成参数
        generator.setProjectPath("/Users/tengchong/Desktop/test/");
        generator.setAuthor("tengchong");
        generator.setDate(DateUtil.today());
        generator.setBusinessName("字典管理");
        generator.setModule("sys");
        generator.setTableName("sys_dict");
        generator.setModelName("SysDict");
        generator.setControllerMapping("/auth/" + generator.getModule() + "/dict");
        generator.setViewPath("sys/dict");
        generator.setPermissionsCode("sys:dict");
        generator.init();

        generatorConfig.generation(generator);
    }
}