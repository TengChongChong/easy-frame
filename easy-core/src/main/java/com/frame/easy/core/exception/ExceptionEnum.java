package com.frame.easy.core.exception;

/**
 * 常用异常
 *
 * @Author tengchong
 * @Date 2018/10/31
 **/
public enum ExceptionEnum {
    // 获取数据失败
    FAILED_TO_GET_DATA(500, "获取数据失败，请重试！"),
    // 未知错误
    UNKNOWN_ERROR(500, "未知错误，请联系管理员！"),
    // 要删除的信息包含子节点
    EXIST_CHILD(500, "要删除的信息包含子节点，请移除子节点后重试！");

    ExceptionEnum(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    private Integer code;
    private String message;

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
