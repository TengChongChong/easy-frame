package com.frame.easy.modular.generator.engine.config;

import com.frame.easy.modular.generator.constant.Const;
import com.frame.easy.modular.generator.model.Generator;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * dao 模板生成的配置
 *
 * @author tengchong
 * @date 2019-01-09
 */
public class DaoConfig {

    private Generator generator;
    /**
     * dao 路径
     */
    private String path;
    /**
     * 需要导入的包
     */
    private List<String> imports;

    public void init() {
        ArrayList<String> imports = new ArrayList<>();
        imports.add(generator.getModelPackage() + Const.PACKAGE_SPLIT + generator.getModelName());
        imports.add("com.baomidou.mybatisplus.core.conditions.query.QueryWrapper");
        imports.add("com.baomidou.mybatisplus.core.mapper.BaseMapper");
        imports.add("com.frame.easy.common.page.Page");
        imports.add("org.apache.ibatis.annotations.Param");
        imports.add(generator.getModelPackage() + Const.PACKAGE_SPLIT + generator.getModelName());
        imports.add("java.util.List");

        this.imports = imports;
        this.path = Const.JAVA_PATH +
                generator.getDaoPackage().replace(".", File.separator) + File.separator +
                generator.getModelName() + "Mapper.java";
    }

    public Generator getGenerator() {
        return generator;
    }

    public void setGenerator(Generator generator) {
        this.generator = generator;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public List<String> getImports() {
        return imports;
    }

    public void setImports(List<String> imports) {
        this.imports = imports;
    }
}
