package com.frame.easy.core.exception;

import cn.hutool.http.HttpStatus;

/**
 * 常用异常
 *
 * @author tengchong
 * @date 2018/10/31
 **/
public enum ExceptionEnum implements EasyServiceException {
    // 获取数据失败
    FAILED_TO_GET_DATA(500, "获取数据失败，请重试！"),
    // 未知错误
    UNKNOWN_ERROR(500, "未知错误，请联系管理员！"),
    // 要删除的信息包含子节点
    EXIST_CHILD(500, "要删除的信息包含子节点，请移除子节点后重试！"),
    /**
     * 无效的日期格式
     */
    INVALID_DATE_FORMAT(HttpStatus.HTTP_INTERNAL_ERROR, "无效的日期格式");

    ExceptionEnum(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    private Integer code;
    private String message;

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
