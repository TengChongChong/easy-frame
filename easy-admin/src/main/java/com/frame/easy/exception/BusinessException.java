package com.frame.easy.exception;

import cn.hutool.http.HttpStatus;

/**
 * 自定义业务异常
 *
 * @author tengchong
 * @date 2019-01-20
 */
public enum BusinessException implements EasyServiceException{
    /**
     * 机构
     */
    // 机构机构编码不能重复
    DEPT_CODE_REGISTERED(500, "机构机构编码不能重复"),
    // 机构下存在账户，无法删除
    DEPT_HAS_USER(500, "机构下存在账户，无法删除"),
    // 部门不存在
    DEPT_NON_EXISTENT(500, "部门被删除或禁用"),
    // 部门被禁用
    DEPT_DISABLED(500, "部门被删除或禁用"),

    /**
     * 用户
     */
    // 用户名已注册
    USER_REGISTERED(500, "用户名已注册"),
    // 手机号已注册
    MOBILE_PHONE_REGISTERED(500, "手机号已注册"),
    // 用户禁用
    USER_DISABLED(500, "用户已被禁用"),
    // 密码强度低
    LOW_PASSWORD_STRENGTH(500, "密码强度过低"),
    // 用户不存在
    USER_NON_EXISTENT(500, "用户名或密码错误"),
    // 无效的用户名或密码
    INVALID_USERNAME_OR_PASSWORD(500, "用户名或密码错误"),

    /**
     * 超级管理员
     */
    // 不能删除超级管理员
    CANNOT_DELETE_SUPER_ADMIN(500, "不能删除超级管理员"),
    // 不能禁用超级管理员
    CANNOT_DISABLED_SUPER_ADMIN(500, "不能禁用超级管理员"),
    // 不能更改超级管理员角色
    CANNOT_CHANGE_SUPER_ADMIN(500, "不能更改超级管理员角色"),

    /**
     * 字典
     */
    // 字典编码已存在
    DICT_CODE_ALREADY_EXIST(500, "字典编码已存在"),

    /**
     * 行政区划
     */
    // 行政代码已存在
    district_code_already_exist(500, "行政代码已存在"),

    /**
     * 公用
     */
    // 要删除的信息包含子节点
    EXIST_CHILD(500, "要删除的信息包含子节点，请移除子节点后重试！"),
    // 无效的日期格式
    INVALID_DATE_FORMAT(HttpStatus.HTTP_INTERNAL_ERROR, "无效的日期格式");
    /**
     * 错误代码
     */
    private Integer code;
    /**
     * 错误信息
     */
    private String message;

    BusinessException(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    @Override
    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
