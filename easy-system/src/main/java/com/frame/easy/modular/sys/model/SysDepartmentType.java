package com.frame.easy.modular.sys.model;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.extension.activerecord.Model;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;

/**
 * 机构类型
 *
 * @author tengchong
 * @date 2018/9/4
 */
@TableName("sys_department_type")
public class SysDepartmentType extends Model<SysDepartmentType> {

    @TableId(value = "id")
    private Long id;
    /**
     * 父id
     */
    private Long pId;
    /**
     * 代码
     */
    @NotEmpty(message = "代码不能为空")
    private String code;
    /**
     * 名称
     */
    @NotEmpty(message = "名称不能为空")
    private String name;
    /**
     * 备注
     */
    private String tips;
    /**
     * 排序值 升序
     */
    private Integer orderNo;
    /**
     * 状态
     */
    @NotNull(message = "状态不能为空")
    private Integer status;
    private Long createUser;
    private Date createDate;
    private Long editUser;
    private Date editDate;

    //
    /**
     * 上级机构类型名称
     */
    @TableField(exist = false)
    private String pName;
    /**
     * 该机构类型可以选择的角色列表 1,2,3
     */
    @TableField(exist = false)
    private String roles;

    private static final long serialVersionUID = 1L;

    public SysDepartmentType() {
    }

    public SysDepartmentType(Long id, Integer orderNo) {
        this.id = id;
        this.orderNo = orderNo;
    }

    public SysDepartmentType(Long id, Long pId, Integer orderNo) {
        this.id = id;
        this.pId = pId;
        this.orderNo = orderNo;
    }

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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTips() {
        return tips;
    }

    public void setTips(String tips) {
        this.tips = tips;
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

    public Integer getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(Integer orderNo) {
        this.orderNo = orderNo;
    }

    public Date getEditDate() {
        return editDate;
    }

    public void setEditDate(Date editDate) {
        this.editDate = editDate;
    }

    public String getpName() {
        return pName;
    }

    public void setpName(String pName) {
        this.pName = pName;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }

    @Override
    public String toString() {
        return "SysDepartmentType{" +
                "id=" + id +
                ", pId=" + pId +
                ", code='" + code + '\'' +
                ", name='" + name + '\'' +
                ", tips='" + tips + '\'' +
                ", createUser=" + createUser +
                ", createDate=" + createDate +
                ", editUser=" + editUser +
                ", editDate=" + editDate +
                '}';
    }
}