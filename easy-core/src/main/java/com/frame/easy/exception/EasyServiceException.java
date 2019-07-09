package com.frame.easy.exception;

/**
 * 封装异常接口
 *
 * @Author tengchong
 * @date 2019-01-20
 */
public interface EasyServiceException {
    /**
     * 错误代码
     *
     * @return 错误代码
     */
    Integer getCode();

    /**
     * 错误提示
     *
     * @return 错误提示
     */
    String getMessage();
}
