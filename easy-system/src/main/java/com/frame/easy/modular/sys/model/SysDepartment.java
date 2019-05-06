package com.frame.easy.modular.sys.model;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.frame.easy.base.model.IModel;
import com.frame.easy.common.page.Page;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;

/**
 * 机构
 *
 * @author tengchong
 * @date 2018/9/4
 */
@TableName("sys_department")
public class SysDepartment extends Model<SysDepartment> implements IModel {

    private static final long serialVersionUID = 1L;

    @TableId(value="id")
    private Long id;
    /**
     * 父id
     */
    private Long pId;
    /**
     * 父级ids
     */
    private String pIds;
    /**
     * 机构类型编码
     */
    @NotEmpty(message = "机构类型不能为空")
    private String typeCode;
    /**
     * 机构代码
     */
    private String code;
    /**
     * 全称
     */
    @NotEmpty(message = "名称不能为空")
    private String name;
    /**
     * 简称
     */
    private String simpleName;
    /**
     * 状态
     */
    @NotNull(message = "状态不能为空")
    private Integer status;
    /**
     * 备注
     */
    private String tips;
    /**
     * 排序值
     */
    private Integer orderNo;
    /**
     * 乐观锁保留字段
     */
    private Integer version;
    private Long createUser;
    private Date createDate;
    private Long editUser;
    private Date editDate;

    /**
     * 机构类型名称
     */
    @TableField(exist=false)
    private String typeName;
    /**
     * 上级机构名称
     */
    @TableField(exist=false)
    private String pName;
    /**
     * 分页&排序信息
     */
    @TableField(exist=false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Page page;

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

    public Long getpId() {
        return pId;
    }

    public void setpId(Long pId) {
        this.pId = pId;
    }

    public String getpIds() {
        return pIds;
    }

    public void setpIds(String pIds) {
        this.pIds = pIds;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSimpleName() {
        return simpleName;
    }

    public void setSimpleName(String simpleName) {
        this.simpleName = simpleName;
    }

    public String getTips() {
        return tips;
    }

    public void setTips(String tips) {
        this.tips = tips;
    }

    public Integer getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(Integer orderNo) {
        this.orderNo = orderNo;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
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

    public String getTypeCode() {
        return typeCode;
    }

    public void setTypeCode(String typeCode) {
        this.typeCode = typeCode;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
    @Override
    public Page getPage() {
        return page;
    }

    public void setPage(Page page) {
        this.page = page;
    }

    public String getpName() {
        return pName;
    }

    public void setpName(String pName) {
        this.pName = pName;
    }

    @Override
    public String toString() {
        return "SysDepart{" +
                "id=" + id +
                ", pId=" + pId +
                ", pIds='" + pIds + '\'' +
                ", name='" + name + '\'' +
                ", simpleName='" + simpleName + '\'' +
                ", tips='" + tips + '\'' +
                ", orderNo=" + orderNo +
                ", version=" + version +
                ", createUser=" + createUser +
                ", createDate=" + createDate +
                ", editUser=" + editUser +
                ", editDate=" + editDate +
                '}';
    }
}