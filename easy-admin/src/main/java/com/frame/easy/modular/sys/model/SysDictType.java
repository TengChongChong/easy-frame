package com.frame.easy.modular.sys.model;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.frame.easy.common.page.Page;

import java.io.Serializable;

/**
 * 字典类型
 *
 * @author tengchong
 * @date 2018/11/4
 */
@TableName("sys_dict_type")
public class SysDictType extends Model<SysDictType>{
    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    /**
     * 类别名称
     */
    private String name;
    /**
     * 字典类别
     */
    private String type;
    /**
     * 状态
     */
    private Integer status;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Page getPage() {
        return page;
    }

    public void setPage(Page page) {
        this.page = page;
    }

    @Override
    protected Serializable pkVal() {
        return this.id;
    }
}