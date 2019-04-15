package com.frame.easy.modular.generator.engine.base;

import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import com.frame.easy.modular.generator.engine.config.*;
import com.frame.easy.modular.generator.model.Generator;

/**
 * 配置类
 *
 * @author tengchong
 * @date 2019-01-08
 */
public class AbstractTemplateEngine {
    /**
     * 生成参数
     */
    protected Generator generator;
    /**
     * controller 配置
     */
    ControllerConfig controllerConfig;
    /**
     * dao 配置
     */
    DaoConfig daoConfig;
    /**
     * service 配置
     */
    ServiceConfig serviceConfig;
    /**
     * service impl 配置
     */
    ServiceImplConfig serviceImplConfig;
    /**
     * model 配置
     */
    ModelConfig modelConfig;
    /**
     * mapper 配置
     */
    MappingConfig mappingConfig;
    /**
     * 静态文件 配置
     */
    StaticConfig staticConfig;
    /**
     * 表信息
     */
    TableInfo tableInfo;

    public void initConfig() {
        if (this.generator == null) {
            this.generator = new Generator();
        }
        if (this.controllerConfig == null) {
            this.controllerConfig = new ControllerConfig();
        }
        if (this.daoConfig == null) {
            this.daoConfig = new DaoConfig();
        }
        if (this.serviceConfig == null) {
            this.serviceConfig = new ServiceConfig();
        }
        if (this.serviceImplConfig == null) {
            this.serviceImplConfig = new ServiceImplConfig();
        }
        if (this.staticConfig == null) {
            this.staticConfig = new StaticConfig();
        }
        if (this.modelConfig == null) {
            this.modelConfig = new ModelConfig();
        }
        if (this.mappingConfig == null) {
            this.mappingConfig = new MappingConfig();
        }

        // 初始化 controllerConfig
        this.controllerConfig.setGenerator(generator);
        this.controllerConfig.init();
        // 初始化 daoConfig
        this.daoConfig.setGenerator(generator);
        this.daoConfig.init();
        // 初始化 serviceConfig
        this.serviceConfig.setGenerator(generator);
        this.serviceConfig.init();
        // 初始化 serviceImplConfig
        this.serviceImplConfig.setGenerator(generator);
        this.serviceImplConfig.init();
        // 初始化 modelConfig
        this.modelConfig.setGenerator(generator);
        this.modelConfig.init();
        // 初始化 staticConfig
        this.staticConfig.setGenerator(generator);
        this.staticConfig.init();
        // 初始化 mappingConfig
        this.mappingConfig.setGenerator(generator);
        this.mappingConfig.init();

    }

    public Generator getGenerator() {
        return generator;
    }

    public void setGenerator(Generator generator) {
        this.generator = generator;
    }

    public ControllerConfig getControllerConfig() {
        return controllerConfig;
    }

    public void setControllerConfig(ControllerConfig controllerConfig) {
        this.controllerConfig = controllerConfig;
    }

    public TableInfo getTableInfo() {
        return tableInfo;
    }

    public void setTableInfo(TableInfo tableInfo) {
        this.tableInfo = tableInfo;
    }

    public DaoConfig getDaoConfig() {
        return daoConfig;
    }

    public void setDaoConfig(DaoConfig daoConfig) {
        this.daoConfig = daoConfig;
    }

    public ServiceConfig getServiceConfig() {
        return serviceConfig;
    }

    public void setServiceConfig(ServiceConfig serviceConfig) {
        this.serviceConfig = serviceConfig;
    }

    public ServiceImplConfig getServiceImplConfig() {
        return serviceImplConfig;
    }

    public void setServiceImplConfig(ServiceImplConfig serviceImplConfig) {
        this.serviceImplConfig = serviceImplConfig;
    }

    public StaticConfig getStaticConfig() {
        return staticConfig;
    }

    public void setStaticConfig(StaticConfig staticConfig) {
        this.staticConfig = staticConfig;
    }

    public ModelConfig getModelConfig() {
        return modelConfig;
    }

    public void setModelConfig(ModelConfig modelConfig) {
        this.modelConfig = modelConfig;
    }

    public MappingConfig getMappingConfig() {
        return mappingConfig;
    }

    public void setMappingConfig(MappingConfig mappingConfig) {
        this.mappingConfig = mappingConfig;
    }
}
