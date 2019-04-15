package com.frame.easy.modular.sys.model;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.extension.activerecord.Model;

import java.io.Serializable;
import java.util.Date;

/**
 * 登录日志
 *
 * @author tengchong
 * @date 2018/9/7
 */
@TableName("sys_login_log")
public class SysLoginLog extends Model<SysLoginLog> {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    /**
     * 日志名称
     */
    private String logName;
    /**
     * 用户名
     */
    private String username;
    /**
     * 登录时间
     */
    private Date loginDate;
    /**
     * 是否成功
     */
    private String isSuccess;
    /**
     * 消息
     */
    private String message;
    /**
     * ip
     */
    private String ip;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLogName() {
        return logName;
    }

    public void setLogName(String logName) {
        this.logName = logName;
    }

    public String getUsername() {
        return username;
    }

    public void setUserName(String username) {
        this.username = username;
    }

    public Date getLoginDate() {
        return loginDate;
    }

    public void setLoginDate(Date loginDate) {
        this.loginDate = loginDate;
    }

    public String getIsSuccess() {
        return isSuccess;
    }

    public void setIsSuccess(String isSuccess) {
        this.isSuccess = isSuccess;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    @Override
    protected Serializable pkVal() {
        return null;
    }

    @Override
    public String toString() {
        return "SysLoginLog{" +
                "id=" + id +
                ", logName='" + logName + '\'' +
                ", username='" + username + '\'' +
                ", loginDate=" + loginDate +
                ", isSuccess='" + isSuccess + '\'' +
                ", message='" + message + '\'' +
                ", ip='" + ip + '\'' +
                '}';
    }
}