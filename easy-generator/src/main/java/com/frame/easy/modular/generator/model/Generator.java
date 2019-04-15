package com.frame.easy.modular.generator.model;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.annotation.DbType;
import com.frame.easy.modular.generator.constant.Const;

import java.util.List;

/**
 * 代码生成
 *
 * @author tengchong
 * @date 2019-01-08
 */
public class Generator {
    /**
     * 数据库类型
     */
    private String dbType;
    /**
     * 驱动
     */
    private String driverName;
    /**
     * 用户名
     */
    private String username;
    /**
     * 密码
     */
    private String password;
    /**
     * 连接地址
     */
    private String url;

    /**
     * 项目路径
     */
    private String projectPath;
    /**
     * 替换现有文件
     */
    private boolean replace = false;
    /**
     * 作者
     */
    private String author;
    /**
     * 创建时间
     */
    private String date = DateUtil.today();
    /**
     * 表名
     */
    private String tableName;
    /**
     * 业务名称
     */
    private String businessName;
    /**
     * 菜单名称
     */
    private String menuName;
    /**
     * controller @RequestMapping 注解值
     */
    private String controllerMapping;
    /**
     * 模块名称
     * 默认放到 business 里
     */
    private String module = "business";
    /**
     * 实体类名称
     */
    private String modelName;
    /**
     * 视图路径
     */
    private String viewPath;
    /**
     * 权限前缀
     */
    private String permissionsCode;

    /**
     * js文件路径
     */
    private String jsPath;
    /**
     * controller 包路径
     */
    private String controllerPackage;
    /**
     * dao 包路径
     */
    private String daoPackage;
    /**
     * mapping 包路径
     */
    private String mappingPackage;
    /**
     * model 包路径
     */
    private String modelPackage;
    /**
     * service 包路径
     */
    private String servicePackage;
    /**
     * service.impl 包路径
     */
    private String serviceImplPackage;
    /**
     * controller/service 是否默认添加add方法
     */
    private boolean genAdd = true;
    /**
     * controller/service 是否默认添加select方法
     */
    private boolean genSelect = true;
    /**
     * controller/service 是否默认添加save方法
     */
    private boolean genSave = true;
    /**
     * controller/service 是否默认添加delete方法
     */
    private boolean genDelete = true;

    /**
     * 是否生成 controller
     */
    private boolean controllerSwitch = true;
    /**
     * 是否生成 dao
     */
    private boolean daoSwitch = true;
    /**
     * 是否生成 mapping
     */
    private boolean mappingSwitch = true;
    /**
     * 是否生成 model
     */
    private boolean modelSwitch = true;
    /**
     * 是否生成 service
     */
    private boolean serviceSwitch = true;
    /**
     * 是否生成 service impl
     */
    private boolean serviceImplSwitch = true;
    /**
     * 是否生成 list
     */
    private boolean listSwitch = true;
    /**
     * 是否生成 input
     */
    private boolean inputSwitch = true;
    /**
     * 是否生成 listJs
     */
    private boolean listJsSwitch = true;
    /**
     * 是否生成 inputJs
     */
    private boolean inputJsSwitch = true;
    /**
     * 查询条件的排序
     */
    private String[] searchOrder;
    /**
     * 列表的排序
     */
    private String[] listOrder;
    /**
     * 录入页面的排序
     */
    private String[] inputOrder;
    /**
     * 列配置
     */
    private List<FieldSet> fieldSets;

    private String jquery = "$";

    public void init(){
        this.controllerPackage = Const.PACKAGE_PREFIX + module + Const.PACKAGE_SPLIT + Const.CONTROLLER_PACKAGE;
        this.daoPackage = Const.PACKAGE_PREFIX + module + Const.PACKAGE_SPLIT + Const.DAO_PACKAGE;
        this.mappingPackage = Const.PACKAGE_PREFIX + module + Const.PACKAGE_SPLIT + Const.MAPPING_PACKAGE;
        this.servicePackage = Const.PACKAGE_PREFIX + module + Const.PACKAGE_SPLIT + Const.SERVICE_PACKAGE;
        this.serviceImplPackage = Const.PACKAGE_PREFIX + module + Const.PACKAGE_SPLIT + Const.SERVICE_IMPL_PACKAGE;
        this.modelPackage = Const.PACKAGE_PREFIX + module + Const.PACKAGE_SPLIT + Const.MODEL_PACKAGE;
        this.jsPath = Const.JS_PATH + module + this.viewPath;
    }
    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getControllerMapping() {
        return controllerMapping;
    }

    public void setControllerMapping(String controllerMapping) {
        this.controllerMapping = controllerMapping;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public boolean getControllerSwitch() {
        return controllerSwitch;
    }

    public void setControllerSwitch(boolean controllerSwitch) {
        this.controllerSwitch = controllerSwitch;
    }

    public boolean getDaoSwitch() {
        return daoSwitch;
    }

    public void setDaoSwitch(boolean daoSwitch) {
        this.daoSwitch = daoSwitch;
    }

    public boolean getMappingSwitch() {
        return mappingSwitch;
    }

    public void setMappingSwitch(boolean mappingSwitch) {
        this.mappingSwitch = mappingSwitch;
    }

    public boolean getModelSwitch() {
        return modelSwitch;
    }

    public void setModelSwitch(boolean modelSwitch) {
        this.modelSwitch = modelSwitch;
    }

    public boolean getServiceSwitch() {
        return serviceSwitch;
    }

    public void setServiceSwitch(boolean serviceSwitch) {
        this.serviceSwitch = serviceSwitch;
    }

    public boolean getListSwitch() {
        return listSwitch;
    }

    public void setListSwitch(boolean listSwitch) {
        this.listSwitch = listSwitch;
    }

    public boolean getInputSwitch() {
        return inputSwitch;
    }

    public void setInputSwitch(boolean inputSwitch) {
        this.inputSwitch = inputSwitch;
    }

    public boolean getListJsSwitch() {
        return listJsSwitch;
    }

    public void setListJsSwitch(boolean listJsSwitch) {
        this.listJsSwitch = listJsSwitch;
    }

    public boolean getInputJsSwitch() {
        return inputJsSwitch;
    }

    public void setInputJsSwitch(boolean inputJsSwitch) {
        this.inputJsSwitch = inputJsSwitch;
    }

    public String getControllerPackage() {
        return controllerPackage;
    }

    public void setControllerPackage(String controllerPackage) {
        this.controllerPackage = controllerPackage;
    }

    public String getDaoPackage() {
        return daoPackage;
    }

    public void setDaoPackage(String daoPackage) {
        this.daoPackage = daoPackage;
    }

    public String getMappingPackage() {
        return mappingPackage;
    }

    public void setMappingPackage(String mappingPackage) {
        this.mappingPackage = mappingPackage;
    }

    public String getModelPackage() {
        return modelPackage;
    }

    public void setModelPackage(String modelPackage) {
        this.modelPackage = modelPackage;
    }

    public String getServicePackage() {
        return servicePackage;
    }

    public void setServicePackage(String servicePackage) {
        this.servicePackage = servicePackage;
    }

    public String getServiceImplPackage() {
        return serviceImplPackage;
    }

    public void setServiceImplPackage(String serviceImplPackage) {
        this.serviceImplPackage = serviceImplPackage;
    }

    public String getViewPath() {
        return viewPath;
    }

    public void setViewPath(String viewPath) {
        this.viewPath = viewPath;
    }

    public String getJsPath() {
        return jsPath;
    }

    public void setJsPath(String jsPath) {
        this.jsPath = jsPath;
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public boolean getServiceImplSwitch() {
        return serviceImplSwitch;
    }

    public void setServiceImplSwitch(boolean serviceImplSwitch) {
        this.serviceImplSwitch = serviceImplSwitch;
    }

    public String getProjectPath() {
        return projectPath;
    }

    public void setProjectPath(String projectPath) {
        this.projectPath = projectPath;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getPermissionsCode() {
        return permissionsCode;
    }

    public void setPermissionsCode(String permissionsCode) {
        this.permissionsCode = permissionsCode;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getDbType() {
        return dbType;
    }

    public void setDbType(String dbType) {
        this.dbType = dbType;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
        if(StrUtil.isNotBlank(url)){
            if(url.contains(DbType.MYSQL.getDb())){
                this.dbType = DbType.MYSQL.getDb();
            }
            if(url.contains(DbType.ORACLE.getDb())){
                this.dbType = DbType.ORACLE.getDb();
            }
        }
    }

    public boolean getReplace() {
        return replace;
    }

    public void setReplace(boolean replace) {
        this.replace = replace;
    }

    public String getMenuName() {
        return menuName;
    }

    public void setMenuName(String menuName) {
        this.menuName = menuName;
    }

    public boolean getGenAdd() {
        return genAdd;
    }

    public void setGenAdd(boolean genAdd) {
        this.genAdd = genAdd;
    }

    public boolean getGenSelect() {
        return genSelect;
    }

    public void setGenSelect(boolean genSelect) {
        this.genSelect = genSelect;
    }

    public boolean getGenSave() {
        return genSave;
    }

    public void setGenSave(boolean genSave) {
        this.genSave = genSave;
    }

    public boolean getGenDelete() {
        return genDelete;
    }

    public void setGenDelete(boolean genDelete) {
        this.genDelete = genDelete;
    }

    public List<FieldSet> getFieldSets() {
        return fieldSets;
    }

    public void setFieldSets(List<FieldSet> fieldSets) {
        this.fieldSets = fieldSets;
    }

    public String[] getSearchOrder() {
        return searchOrder;
    }

    public void setSearchOrder(String[] searchOrder) {
        this.searchOrder = searchOrder;
    }

    public String[] getListOrder() {
        return listOrder;
    }

    public void setListOrder(String[] listOrder) {
        this.listOrder = listOrder;
    }

    public String[] getInputOrder() {
        return inputOrder;
    }

    public void setInputOrder(String[] inputOrder) {
        this.inputOrder = inputOrder;
    }

    public String getJquery() {
        return jquery;
    }

    public void setJquery(String jquery) {
        this.jquery = jquery;
    }
}
