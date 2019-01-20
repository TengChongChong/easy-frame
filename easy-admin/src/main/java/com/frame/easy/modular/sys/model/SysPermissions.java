package com.frame.easy.modular.sys.model;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;

import java.io.Serializable;
import java.util.Date;

/**
 * 权限
 *
 * @Author tengchong
 * @Date 2018/9/4
 */

@TableName("sys_permissions")
public class SysPermissions extends Model<SysPermissions> {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    /**
     * 父id
     */
    private Long pId;
    /**
     * 权限标识
     */
    private String code;
    /**
     * 父权限标识
     */
    private String pCode;
    /**
     * 当前权限所有父权限标识
     */
    private String pCodes;
    /**
     * 权限名称
     */
    private String name;
    /**
     * 图标
     */
    private String icon;
    /**
     * 权限地址
     */
    private String url;
    /**
     * 排序值
     */
    private Integer orderNo;
    /**
     * 级别
     */
    private Integer levels;
    /**
     * 类型
     */
    private Integer type;
    /**
     * 状态
     */
    private Integer status;
    /**
     * 是否默认打开
     */
    private Integer isOpen;
    /**
     * 备注
     */
    private String tips;
    /**
     * 乐观锁保留字段
     */
    private Integer version;
    /**
     * 字体颜色
     */
    private String color;
    private Long createUser;
    private Date createDate;
    private Long editUser;
    private Date editDate;

    //
    /**
     * 父菜单名称
     */
    @TableField(exist=false)
    private String pName;

    public SysPermissions() {
    }

    public SysPermissions(Long id) {
        this.id = id;
    }

    public SysPermissions(Long id, Integer orderNo) {
        this.id = id;
        this.orderNo = orderNo;
    }

    public SysPermissions(Long id, Long pId, Integer orderNo) {
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

    public String getpCode() {
        return pCode;
    }

    public void setpCode(String pCode) {
        this.pCode = pCode;
    }

    public String getpCodes() {
        return pCodes;
    }

    public void setpCodes(String pCodes) {
        this.pCodes = pCodes;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Integer getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(Integer orderNo) {
        this.orderNo = orderNo;
    }

    public Integer getLevels() {
        return levels;
    }

    public void setLevels(Integer levels) {
        this.levels = levels;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getIsOpen() {
        return isOpen;
    }

    public void setIsOpen(Integer isOpen) {
        this.isOpen = isOpen;
    }

    public String getTips() {
        return tips;
    }

    public void setTips(String tips) {
        this.tips = tips;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
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

    public String getpName() {
        return pName;
    }

    public void setpName(String pName) {
        this.pName = pName;
    }

    @Override
    public String toString() {
        return "SysPermissions{" +
                "id=" + id +
                ", pId=" + pId +
                ", code='" + code + '\'' +
                ", pCode='" + pCode + '\'' +
                ", pCodes='" + pCodes + '\'' +
                ", name='" + name + '\'' +
                ", icon='" + icon + '\'' +
                ", url='" + url + '\'' +
                ", orderNo=" + orderNo +
                ", levels=" + levels +
                ", type='" + type + '\'' +
                ", status='" + status + '\'' +
                ", isOpen='" + isOpen + '\'' +
                ", tips='" + tips + '\'' +
                ", version=" + version +
                ", color='" + color + '\'' +
                ", createUser=" + createUser +
                ", createDate=" + createDate +
                ", editUser=" + editUser +
                ", editDate=" + editDate +
                '}';
    }
}