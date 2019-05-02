package com.frame.easy.modular.sys.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.frame.easy.base.model.IModel;
import com.frame.easy.common.page.Page;

import java.io.Serializable;

/**
 * 导入模板详情
 *
 * @author TengChong
 * @date 2019-04-10
 */
 @TableName("sys_import_excel_template_details")
public class SysImportExcelTemplateDetails extends Model<SysImportExcelTemplateDetails> implements IModel, Serializable{
    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 模板id
     */
    private Long templateId;

    /**
     * 数据库字段名
     */
    private String fieldName;

    /**
     * 标题
     */
    private String title;

    /**
     * 字段长度
     */
    private String fieldLength;

    /**
     * 字段类型
     */
    private String fieldType;

    /**
     * 替换表
     */
    private String replaceTable;

    /**
     * 替换表-名称
     */
    private String replaceTableFieldName;

    /**
     * 替换表-值
     */
    private String replaceTableFieldValue;

    /**
     * 替换表-字典类型
     */
    private String replaceTableDictType;

    /**
     * 排序值
     */
    private Integer orderNo;

    /**
     * 是否必填
     */
    private Integer required;

    /**
     * 是否唯一
     */
    private Integer isOnly;

    /**
     * 是否需要导入
     */
    @TableField(exist=false)
    private boolean needImport;
    //
    /**
     * 分页&排序信息
     */
    @TableField(exist=false)
    private Page page;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Long getTemplateId() {
        return templateId;
    }

    public void setTemplateId(Long templateId) {
        this.templateId = templateId;
    }
    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
    public String getFieldLength() {
        return fieldLength;
    }

    public void setFieldLength(String fieldLength) {
        this.fieldLength = fieldLength;
    }
    public String getFieldType() {
        return fieldType;
    }

    public void setFieldType(String fieldType) {
        this.fieldType = fieldType;
    }
    public String getReplaceTable() {
        return replaceTable;
    }

    public void setReplaceTable(String replaceTable) {
        this.replaceTable = replaceTable;
    }
    public String getReplaceTableFieldName() {
        return replaceTableFieldName;
    }

    public void setReplaceTableFieldName(String replaceTableFieldName) {
        this.replaceTableFieldName = replaceTableFieldName;
    }
    public String getReplaceTableFieldValue() {
        return replaceTableFieldValue;
    }

    public void setReplaceTableFieldValue(String replaceTableFieldValue) {
        this.replaceTableFieldValue = replaceTableFieldValue;
    }

    public String getReplaceTableDictType() {
        return replaceTableDictType;
    }

    public void setReplaceTableDictType(String replaceTableDictType) {
        this.replaceTableDictType = replaceTableDictType;
    }

    public Integer getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(Integer orderNo) {
        this.orderNo = orderNo;
    }
    public Integer getRequired() {
        return required;
    }

    public void setRequired(Integer required) {
        this.required = required;
    }
    public Integer getIsOnly() {
        return isOnly;
    }

    public void setIsOnly(Integer isOnly) {
        this.isOnly = isOnly;
    }
    @Override
    public Page getPage() {
        return page;
    }

    public void setPage(Page page) {
        this.page = page;
    }

    public boolean isNeedImport() {
        return needImport;
    }

    public void setNeedImport(boolean needImport) {
        this.needImport = needImport;
    }
}
