package com.frame.easy.modular.sys.model;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.frame.easy.base.model.IModel;
import com.frame.easy.common.page.Page;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * 字典类型
 *
 * @author tengchong
 * @date 2018/11/4
 */
@TableName("sys_dict_type")
public class SysDictType extends Model<SysDictType> implements IModel {
    private static final long serialVersionUID = 1L;

    @TableId(value = "id")
    private String id;
    /**
     * 类别名称
     */
    @NotBlank(message = "名称不能为空")
    private String name;
    /**
     * 字典类别
     */
    @NotBlank(message = "类型不能为空")
    private String type;
    /**
     * 状态
     */
    @NotNull(message = "状态不能为空")
    private Integer status;

    //
    /**
     * 分页&排序信息
     */
    @TableField(exist=false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Page page;

    public String getId() {
        return id;
    }

    public void setId(String id) {
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
    @Override
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