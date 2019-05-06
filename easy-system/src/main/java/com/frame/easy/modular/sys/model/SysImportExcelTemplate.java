package com.frame.easy.modular.sys.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.frame.easy.base.model.IModel;
import com.frame.easy.common.page.Page;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

/**
 * 导入模板
 *
 * @author TengChong
 * @date 2019-04-10
 */
 @TableName("sys_import_excel_template")
public class SysImportExcelTemplate extends Model<SysImportExcelTemplate> implements IModel, Serializable{
    private static final long serialVersionUID = 1L;

    @TableId(value = "id")
    private Long id;

    /**
     * 导入模板名称
     */
    @NotEmpty(message = "名称不能为空")
    private String name;

    /**
     * 导入表
     */
    @NotEmpty(message = "导入表不能为空")
    private String importTable;

    /**
     * 起始行
     */
    private Integer startRow;

    /**
     * 回调
     */
    private String callback;

    /**
     * 模板代码
     */
    @NotEmpty(message = "模板代码不能为空")
    private String importCode;

    /**
     * 权限代码
     * 用于检查当前登录用户是否允许使用此模板
     */
    @NotEmpty(message = "权限代码不能为空")
    private String permissionCode;

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
    public String getImportTable() {
        return importTable;
    }

    public void setImportTable(String importTable) {
        this.importTable = importTable;
    }
    public Integer getStartRow() {
        return startRow;
    }

    public void setStartRow(Integer startRow) {
        this.startRow = startRow;
    }
    public String getCallback() {
        return callback;
    }

    public void setCallback(String callback) {
        this.callback = callback;
    }
    public String getImportCode() {
        return importCode;
    }

    public void setImportCode(String importCode) {
        this.importCode = importCode;
    }

    public String getPermissionCode() {
        return permissionCode;
    }

    public void setPermissionCode(String permissionCode) {
        this.permissionCode = permissionCode;
    }

    @Override
    public Page getPage() {
        return page;
    }

    public void setPage(Page page) {
        this.page = page;
    }
}
