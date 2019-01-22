package com.frame.easy.core.exception;

/**
 * 自定义业务异常
 *
 * @author tengchong
 * @date 2019-01-20
 */
public enum BusinessException implements EasyServiceException{
    ;
    /**
     * 错误代码
     */
    private Integer code;
    /**
     * 错误信息
     */
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
