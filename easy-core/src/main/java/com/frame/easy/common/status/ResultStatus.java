package com.frame.easy.common.status;

/**
 * 响应状态码
 *
 * @author tengchong
 * @date 2018/10/22
 **/
public enum ResultStatus {
    // 成功
    SUCCESS(200),
    // 失败
    FAIL(400),
    // 接口不存在
    NOT_FOUND(404),
    // 服务器内部错误
    INTERNAL_SERVER_ERROR(500);
    private int code;

    ResultStatus(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }
}
