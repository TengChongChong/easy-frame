package com.frame.easy.modular.sys.model;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.frame.easy.common.page.Page;
import com.frame.easy.base.model.IModel;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;

/**
 * 字典
 *
 * @author tengchong
 * @date 2018/11/4
 */
@TableName("sys_dict")
public class SysDict extends Model<SysDict> implements IModel {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    /**
     * 排序值
     */
    private Integer orderNo;
    /**
     * 父code
     */
    private String pCode;
    /**
     * 编码
     */
    @NotEmpty(message = "编码不能为空")
    private String code;
    /**
     * 名称
     */
    @NotEmpty(message = "名称不能为空")
    private String name;
    /**
     * 图标
     */
    private String icon;
    /**
     * 备注
     */
    private String tips;
    /**
     * 状态
     */
    @NotNull(message = "状态不能为空")
    private Integer status;
    /**
     * 字典类型
     */
    @NotEmpty(message = "类型不能为空")
    private String dictType;
    /**
     * css
     */
    private String css;
    private Date createDate;
    private Long createUser;
    private Long editUser;
    private Date editDate;

    //
    /**
     * 分页&排序信息
     */
    @TableField(exist=false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Page page;
    /**
     * 父字典名称
     */
    @TableField(exist=false)
    private String parentName;

    @Override
    protected Serializable pkVal() {
        return this.id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(Integer orderNo) {
        this.orderNo = orderNo;
    }

    public String getpCode() {
        return pCode;
    }

    public void setpCode(String pCode) {
        this.pCode = pCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTips() {
        return tips;
    }

    public void setTips(String tips) {
        this.tips = tips;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getDictType() {
        return dictType;
    }

    public void setDictType(String dictType) {
        this.dictType = dictType;
    }
    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public Long getEditUser() {
        return editUser;
    }

    public void setEditUser(Long editUser) {
        this.editUser = editUser;
    }

    public Date getEditDate() {
        return editDate;
    }

    public void setEditDate(Date editDate) {
        this.editDate = editDate;
    }

    public String getCss() {
        return css;
    }

    public void setCss(String css) {
        this.css = css;
    }
    @Override
    public Page getPage() {
        return page;
    }

    public void setPage(Page page) {
        this.page = page;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    @Override
    public String toString() {
        return "SysDict{" +
                "id=" + id +
                ", orderNo=" + orderNo +
                ", pCode=" + pCode +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", icon='" + icon + '\'' +
                ", tips='" + tips + '\'' +
                ", status=" + status +
                ", dictType='" + dictType + '\'' +
                ", createDate=" + createDate +
                ", createUser=" + createUser +
                ", editUser=" + editUser +
                ", editDate=" + editDate +
                ", css='" + css + '\'' +
                '}';
    }
}