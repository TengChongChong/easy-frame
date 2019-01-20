package com.frame.easy.generator.engine.base;

import com.alibaba.fastjson.JSONObject;
import org.beetl.core.Configuration;
import org.beetl.core.GroupTemplate;
import org.beetl.core.Template;
import org.beetl.core.resource.ClasspathResourceLoader;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * 模板引擎
 *
 * @Author tengchong
 * @Date 2019-01-08
 */
public abstract class BaseTemplateEngine extends AbstractTemplateEngine{
    private GroupTemplate groupTemplate;

    public BaseTemplateEngine() {
        initBeetlEngine();
    }

    /**
     * 使用beetl解析
     */
    private void initBeetlEngine() {
        Properties properties = new Properties();
        properties.put("RESOURCE.root", "");
        properties.put("DELIMITER_STATEMENT_START", "<%");
        properties.put("DELIMITER_STATEMENT_END", "%>");
        properties.put("HTML_TAG_FLAG", "##");
        Configuration configuration = null;
        try {
            configuration = new Configuration(properties);
        } catch (IOException e) {
            e.printStackTrace();
        }
        ClasspathResourceLoader resourceLoader = new ClasspathResourceLoader();
        groupTemplate = new GroupTemplate(resourceLoader, configuration);

    }

    /**
     * 通用注释
     *
     * @return JSONObject
     */
    private JSONObject commonComment(){
        JSONObject commonComment = new JSONObject(4);
        commonComment.put("createUser", "创建人id");
        commonComment.put("createDate", "创建时间");
        commonComment.put("editUser", "编辑人id");
        commonComment.put("editDate", "编辑时间");
        return commonComment;
    }

    private void configTemplate(Template template) {
        template.binding("config", super.generator);
        template.binding("controller", super.controllerConfig);
        template.binding("dao", super.daoConfig);
        template.binding("service", super.serviceConfig);
        template.binding("serviceImpl", super.serviceImplConfig);
        template.binding("model", super.modelConfig);
        template.binding("mapping", super.mappingConfig);
        template.binding("tableInfo", super.tableInfo);
        template.binding("commonComment", commonComment());
    }

    protected void generateFile(String template, String filePath) {
        Template pageTemplate = groupTemplate.getTemplate(template);
        configTemplate(pageTemplate);
        File file = new File(filePath);
        File parentFile = file.getParentFile();
        if (!parentFile.exists()) {
            parentFile.mkdirs();
        }
        FileOutputStream fileOutputStream = null;
        try {
            fileOutputStream = new FileOutputStream(file);
            pageTemplate.renderTo(fileOutputStream);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } finally {
            try {
                fileOutputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public void start() {
        //配置之间的相互依赖
        super.initConfig();

        //生成模板
        if (super.generator.getControllerSwitch()) {
            generateController();
        }
        if (super.generator.getModelSwitch()) {
            generateModel();
        }
        if (super.generator.getDaoSwitch()) {
            generateDao();
        }
        if (super.generator.getMappingSwitch()) {
            generateMapping();
        }
        if (super.generator.getServiceSwitch()) {
            generateService();
        }
        if (super.generator.getServiceImplSwitch()) {
            generateServiceImpl();
        }
        if (super.generator.getListSwitch()) {
            generateListPage();
        }
        if (super.generator.getListJsSwitch()) {
            generateListJs();
        }
        if (super.generator.getInputSwitch()) {
            generateInputPage();
        }
        if (super.generator.getInputJsSwitch()) {
            generateInputJs();
        }
    }

    /**
     * 生成 controller
     */
    protected abstract void generateController();
    /**
     * 生成 model
     */
    protected abstract void generateModel();
    /**
     * 生成 dao
     */
    protected abstract void generateDao();
    /**
     * 生成 mapping
     */
    protected abstract void generateMapping();
    /**
     * 生成 service
     */
    protected abstract void generateService();
    /**
     * 生成 service impl
     */
    protected abstract void generateServiceImpl();
    /**
     * 生成 list.html
     */
    protected abstract void generateListPage();
    /**
     * 生成 list.js
     */
    protected abstract void generateListJs();
    /**
     * 生成 input.html
     */
    protected abstract void generateInputPage();
    /**
     * 生成 input.js
     */
    protected abstract void generateInputJs();
}
