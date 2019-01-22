package com.frame.easy.generator.engine.config;

import com.frame.easy.generator.constant.Const;
import com.frame.easy.generator.model.Generator;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * controller 模板生成的配置
 *
 * @author tengchong
 * @date 2019-01-08
 */
public class ControllerConfig {

    private Generator generator;
    /**
     * controller 路径
     */
    private String path;
    /**
     * 需要导入的包
     */
    private List<String> imports;

    public void init() {
        ArrayList<String> imports = new ArrayList<>();
        imports.add("com.frame.easy.core.base.controller.BaseController");
        imports.add("com.frame.easy.core.base.result.Tips");
        imports.add("org.apache.shiro.authz.annotation.RequiresPermissions");
        imports.add("org.springframework.beans.factory.annotation.Autowired");
        imports.add("org.springframework.stereotype.Controller");
        imports.add("org.springframework.ui.Model");
        imports.add("org.springframework.web.bind.annotation.*");
        imports.add(generator.getModelPackage() + Const.PACKAGE_SPLIT + generator.getModelName());
        imports.add(generator.getServicePackage() + Const.PACKAGE_SPLIT + generator.getModelName() + "Service");
        this.imports = imports;
        this.path = Const.JAVA_PATH +
                generator.getControllerPackage().replace(".", File.separator) + File.separator +
                generator.getModelName() + "Controller.java";
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
