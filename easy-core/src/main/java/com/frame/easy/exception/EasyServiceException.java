package com.frame.easy.exception;

/**
 * 接口
 *
 * @Author tengchong
 * @date 2019-01-20
 */
public interface EasyServiceException {
    /**
     * 错误代码
     * @return
     */
    Integer getCode();

    /**
     * 错误提示
     * @return
     */
    String getMessage();
}
