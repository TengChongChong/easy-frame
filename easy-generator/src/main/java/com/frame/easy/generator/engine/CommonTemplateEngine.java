package com.frame.easy.generator.engine;

import com.frame.easy.generator.constant.Const;
import com.frame.easy.generator.engine.base.BaseTemplateEngine;

import java.io.File;

/**
 * 通用模板生成引擎
 *
 * @author tengchong
 * @date 2019-01-08
 */
public class CommonTemplateEngine extends BaseTemplateEngine {

    @Override
    protected void generateController() {
        generateFile( Const.TEMPLATE_PATH + "classes" + File.separator + "Controller.java.btl",
                super.generator.getProjectPath() + super.getControllerConfig().getPath());
        System.out.println("生成Controller成功!");
    }

    @Override
    protected void generateModel() {
        generateFile( Const.TEMPLATE_PATH + "classes" + File.separator + "Model.java.btl",
                super.generator.getProjectPath() + super.getModelConfig().getPath());
        System.out.println("生成Model成功!");
    }

    @Override
    protected void generateDao() {
        generateFile( Const.TEMPLATE_PATH + "classes" + File.separator + "Dao.java.btl",
                super.generator.getProjectPath() + super.getDaoConfig().getPath());
        System.out.println("生成Dao成功!");
    }

    @Override
    protected void generateMapping() {
        generateFile( Const.TEMPLATE_PATH + "xml" + File.separator + "Mapper.xml.btl",
                super.generator.getProjectPath() + super.getMappingConfig().getPath());
        System.out.println("生成Mapping成功!");
    }

    @Override
    protected void generateService() {
        generateFile( Const.TEMPLATE_PATH + "classes" + File.separator + "Service.java.btl",
                super.generator.getProjectPath() + super.getServiceConfig().getPath());
        System.out.println("生成Service成功!");
    }

    @Override
    protected void generateServiceImpl() {
        generateFile( Const.TEMPLATE_PATH + "classes" + File.separator + "ServiceImpl.java.btl",
                super.generator.getProjectPath() + super.getServiceImplConfig().getPath());
        System.out.println("生成ServiceImpl成功!");
    }

    @Override
    protected void generateListPage() {
        generateFile( Const.TEMPLATE_PATH + "view" + File.separator + "list.html.btl",
                super.generator.getProjectPath() + super.getStaticConfig().getListPagePath());
        System.out.println("生成list.html成功!");
    }

    @Override
    protected void generateListJs() {
        generateFile( Const.TEMPLATE_PATH + "js" + File.separator + "list.js.btl",
                super.generator.getProjectPath() + super.getStaticConfig().getListJsPath());
        System.out.println("生成list.js成功!");
    }

    @Override
    protected void generateInputPage() {
        generateFile( Const.TEMPLATE_PATH + "view" + File.separator + "input.html.btl",
                super.generator.getProjectPath() + super.getStaticConfig().getInputPagePath());
        System.out.println("生成input.html成功!");
    }

    @Override
    protected void generateInputJs() {
        generateFile( Const.TEMPLATE_PATH + "js" + File.separator + "input.js.btl",
                super.generator.getProjectPath() + super.getStaticConfig().getInputJsPath());
        System.out.println("生成input.js成功!");
    }
}
