package com.frame.easy.generator.constant;

import java.io.File;

/**
 * 默认常量
 *
 * @author tengchong
 * @date 2019-01-08
 */
public class Const {
    private static String BASE_PATH = File.separator + "src" + File.separator + "main" + File.separator;
    private static String WEBAPP_PATH = BASE_PATH + "webapp" + File.separator;
    /**
     * 静态文件路径前缀
     */
    public static String JS_PATH = WEBAPP_PATH + "static" + File.separator + "modular" + File.separator;
    /**
     * 页面路径前缀
     */
    public static String VIEW_PATH = WEBAPP_PATH + "view" + File.separator + "modular" + File.separator;

    /**
     * 模板路径
     */
    public static String TEMPLATE_PATH = "generator" + File.separator + "template" + File.separator;
    /**
     * java路径前缀
     */
    public static String JAVA_PATH = BASE_PATH + "java" + File.separator;
    /**
     * 包前缀
     */
    public static String PACKAGE_PREFIX = "com.frame.easy.modular.";
    /**
     * 包间隔
     */
    public static String PACKAGE_SPLIT = ".";
    /**
     * controller 包路径
     */
    public static String CONTROLLER_PACKAGE = "controller";
    /**
     * dao 包路径
     */
    public static String DAO_PACKAGE = "dao";
    /**
     * mapping 包路径
     */
    public static String MAPPING_PACKAGE = "dao.mapping";
    /**
     * model 包路径
     */
    public static String MODEL_PACKAGE = "model";
    /**
     * service 包路径
     */
    public static String SERVICE_PACKAGE = "service";
    /**
     * service.impl 包路径
     */
    public static String SERVICE_IMPL_PACKAGE = "service.impl";
}
