package com.frame.easy.modular.sys.model;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.frame.easy.base.model.IModel;
import com.frame.easy.common.page.Page;

import java.io.Serializable;
import java.util.Date;

/**
 * 任务 
 *
 * @author TengChong
 * @date 2019-06-19
 */
@TableName("sys_task")
public class SysTask extends Model<SysTask> implements IModel, Serializable{
    private static final long serialVersionUID = 1L;

    /**
     * id
     */
    @TableId(value = "id")
    private String id;

    /**
     * 任务代码
     */
    private String code;

    /**
     * 标题
     */
    private String title;

    /**
     * 内容
     */
    private String content;

    /**
     * 开始时间
     */
    private Date strDate;

    /**
     * 结束时间
     */
    private Date endDate;

    /**
     * 任务url
     */
    private String url;

    /**
     * 接收人
     */
    private String receiver;

    /**
     * 状态
     */
    private Integer status;

    /**
     * 发布时间
     */
    private Date releaseDate;

    /**
     * 乐观锁
     */
    private Integer version;

    /**
     * 创建人
     */
    @TableField(fill = FieldFill.INSERT)
    private String createUser;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private Date createDate;

    /**
     * 更新人
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private String editUser;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date editDate;

    //
    /**
     * 分页&排序信息
     */
    @TableField(exist=false)
    private Page page;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
    public String getContent() {
        return content;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setContent(String content) {
        this.content = content;
    }
    public Date getStrDate() {
        return strDate;
    }

    public void setStrDate(Date strDate) {
        this.strDate = strDate;
    }
    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }
    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
    public Date getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(Date releaseDate) {
        this.releaseDate = releaseDate;
    }
    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }
    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }
    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }
    public String getEditUser() {
        return editUser;
    }

    public void setEditUser(String editUser) {
        this.editUser = editUser;
    }
    public Date getEditDate() {
        return editDate;
    }

    public void setEditDate(Date editDate) {
        this.editDate = editDate;
    }
    @Override
    public Page getPage() {
        return page;
    }

    public void setPage(Page page) {
        this.page = page;
    }
}
