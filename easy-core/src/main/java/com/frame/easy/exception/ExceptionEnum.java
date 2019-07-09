package com.frame.easy.exception;

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
    UNKNOWN_ERROR(500, "未知错误，请联系管理员！");

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

    @Override
    public String getMessage() {
        return message;
    }
}
