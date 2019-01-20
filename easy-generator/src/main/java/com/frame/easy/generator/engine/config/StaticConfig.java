package com.frame.easy.generator.engine.config;

import com.frame.easy.generator.constant.Const;
import com.frame.easy.generator.model.Generator;

import java.io.File;

/**
 * 静态文件 模板生成的配置
 *
 * @Author tengchong
 * @Date 2019-01-09
 */
public class StaticConfig {

    private Generator generator;
    /**
     * dao 路径
     */
    private String listPagePath;
    private String listJsPath;
    private String inputPagePath;
    private String inputJsPath;

    public void init() {
        this.listPagePath = Const.VIEW_PATH + generator.getViewPath() + File.separator + "list.html";
        this.inputPagePath = Const.VIEW_PATH + generator.getViewPath() + File.separator + "input.html";
        this.listJsPath = Const.JS_PATH + generator.getViewPath() + File.separator + "list.js";
        this.inputJsPath = Const.JS_PATH + generator.getViewPath() + File.separator + "input.js";
    }

    public Generator getGenerator() {
        return generator;
    }

    public void setGenerator(Generator generator) {
        this.generator = generator;
    }

    public String getListPagePath() {
        return listPagePath;
    }

    public void setListPagePath(String listPagePath) {
        this.listPagePath = listPagePath;
    }

    public String getListJsPath() {
        return listJsPath;
    }

    public void setListJsPath(String listJsPath) {
        this.listJsPath = listJsPath;
    }

    public String getInputPagePath() {
        return inputPagePath;
    }

    public void setInputPagePath(String inputPagePath) {
        this.inputPagePath = inputPagePath;
    }

    public String getInputJsPath() {
        return inputJsPath;
    }

    public void setInputJsPath(String inputJsPath) {
        this.inputJsPath = inputJsPath;
    }
}
