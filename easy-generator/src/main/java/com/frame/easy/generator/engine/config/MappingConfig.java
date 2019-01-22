package com.frame.easy.generator.engine.config;

import com.frame.easy.generator.constant.Const;
import com.frame.easy.generator.model.Generator;

import java.io.File;

/**
 * mapping 模板生成的配置
 *
 * @author tengchong
 * @date 2019-01-08
 */
public class MappingConfig {

    private Generator generator;
    /**
     * mapping 路径
     */
    private String path;

    public void init() {
        this.path = Const.JAVA_PATH +
                generator.getMappingPackage().replace(".", File.separator) + File.separator +
                generator.getModelName() + "Mapper.xml";
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

}
