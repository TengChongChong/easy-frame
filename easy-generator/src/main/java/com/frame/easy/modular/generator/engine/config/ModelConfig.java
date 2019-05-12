package com.frame.easy.modular.generator.engine.config;

import com.frame.easy.modular.generator.constant.Const;
import com.frame.easy.modular.generator.model.Generator;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * model 模板生成的配置
 *
 * @author tengchong
 * @date 2019-01-08
 */
public class ModelConfig {

    private Generator generator;
    /**
     * model 路径
     */
    private String path;

    /**
     * 需要导入的包
     */
    private List<String> imports;

    public void init() {
        ArrayList<String> imports = new ArrayList<>();
        // mybatis 相关
        imports.add("com.baomidou.mybatisplus.extension.activerecord.Model");
        imports.add("com.baomidou.mybatisplus.annotation.TableName");
        imports.add("com.baomidou.mybatisplus.annotation.IdType");
        imports.add("com.baomidou.mybatisplus.annotation.TableId");
        if(generator.getGenSelect()){
            imports.add("com.baomidou.mybatisplus.annotation.TableField");
            // 自定义分页
            imports.add("com.frame.easy.common.page.Page");
            // 自定义接口
            imports.add("com.frame.easy.base.model.IModel");
        }
        if(generator.getGenSave()){
            imports.add("javax.validation.constraints.NotBlank");
            imports.add("javax.validation.constraints.NotNull");
        }
        this.imports = imports;
        this.path = Const.JAVA_PATH +
                generator.getModelPackage().replace(".", File.separator) + File.separator +
                generator.getModelName() + ".java";
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
