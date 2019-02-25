package com.frame.easy.generator.engine.config;

import com.frame.easy.generator.constant.Const;
import com.frame.easy.generator.model.Generator;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * service impl 模板生成的配置
 *
 * @author tengchong
 * @date 2019-01-09
 */
public class ServiceImplConfig {

    private Generator generator;
    /**
     * service 路径
     */
    private String path;
    /**
     * 需要导入的包
     */
    private List<String> imports;

    public void init() {
        ArrayList<String> imports = new ArrayList<>();
        imports.add("com.baomidou.mybatisplus.core.conditions.query.QueryWrapper");
        imports.add("com.baomidou.mybatisplus.extension.service.impl.ServiceImpl");
        imports.add("com.frame.easy.core.util.ToolUtil");
        imports.add("org.springframework.beans.factory.annotation.Autowired");
        imports.add("org.springframework.stereotype.Service");
        imports.add("org.springframework.transaction.annotation.Transactional");
        imports.add("java.util.Arrays");
        imports.add("java.util.List");
        imports.add("com.frame.easy.common.page.Page");
        imports.add(generator.getModelPackage() + Const.PACKAGE_SPLIT + generator.getModelName());
        imports.add(generator.getDaoPackage() + Const.PACKAGE_SPLIT + generator.getModelName() + "Mapper");
        imports.add(generator.getServicePackage() + Const.PACKAGE_SPLIT + generator.getModelName() + "Service");
        this.imports = imports;
        this.path = Const.JAVA_PATH +
                generator.getServiceImplPackage().replace(".", File.separator) + File.separator +
                generator.getModelName() + "ServiceImpl.java";
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
