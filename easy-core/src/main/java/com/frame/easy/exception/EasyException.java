package com.frame.easy.exception;

/**
 * 自定义Exception
 *
 * @author tengchong
 * @date 2019-01-20
 */
public class EasyException extends RuntimeException {
    /**
     * 错误代码
     */
    private Integer code;
    /**
     * 错误信息
     */
    private String message;

    public EasyException(String message) {
        this.code = 500;
        this.message = message;
    }

    public EasyException(EasyServiceException easyServiceException) {
        this.code = easyServiceException.getCode();
        this.message = easyServiceException.getMessage();
    }

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
