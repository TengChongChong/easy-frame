package com.frame.easy.modular.sys.model;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.extension.activerecord.Model;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;


/**
 * 行政区划
 * @author tengchong
 */
@TableName("sys_district")
public class SysDistrict extends Model<SysDictType> {
    private static final long serialVersionUID = 1L;

    @TableId(value = "id")
    private Long id;
    /**
     * 名称
     */
    @NotEmpty(message = "名称不能为空")
    private String name;
    /**
     * 父 ID
     */
    private Long pId;
    /**
     * 拼音首字母
     */
    private String initial;
    /**
     * 拼音首字母集合
     */
    private String initials;
    /**
     * 拼音
     */
    private String pinyin;
    /**
     * 附加说明
     */
    private String extra;
    /**
     * 行政级别
     */
    private String suffix;
    /**
     * 行政代码
     */
    @NotEmpty(message = "代码不能为空")
    private String code;
    /**
     * 区号
     */
    private String areaCode;
    /**
     * 排序 升序
     */
    private Integer orderNo;

    public SysDistrict() {
    }

    public SysDistrict(Long id) {
        this.id = id;
    }

    public SysDistrict(Long id, Integer orderNo) {
        this.id = id;
        this.orderNo = orderNo;
    }

    public SysDistrict(Long id, Long pId, Integer orderNo) {
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getpId() {
        return pId;
    }

    public void setpId(Long pId) {
        this.pId = pId;
    }

    public String getInitial() {
        return initial;
    }

    public void setInitial(String initial) {
        this.initial = initial;
    }

    public String getInitials() {
        return initials;
    }

    public void setInitials(String initials) {
        this.initials = initials;
    }

    public String getPinyin() {
        return pinyin;
    }

    public void setPinyin(String pinyin) {
        this.pinyin = pinyin;
    }

    public String getExtra() {
        return extra;
    }

    public void setExtra(String extra) {
        this.extra = extra;
    }

    public String getSuffix() {
        return suffix;
    }

    public void setSuffix(String suffix) {
        this.suffix = suffix;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getAreaCode() {
        return areaCode;
    }

    public void setAreaCode(String areaCode) {
        this.areaCode = areaCode;
    }

    public Integer getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(Integer orderNo) {
        this.orderNo = orderNo;
    }

    @Override
    public String toString() {
        return "SysDistrict{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", pId=" + pId +
                ", initial='" + initial + '\'' +
                ", initials='" + initials + '\'' +
                ", pinyin='" + pinyin + '\'' +
                ", extra='" + extra + '\'' +
                ", suffix='" + suffix + '\'' +
                ", code='" + code + '\'' +
                ", areaCode='" + areaCode + '\'' +
                ", orderNo=" + orderNo +
                '}';
    }
}