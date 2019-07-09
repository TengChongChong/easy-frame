package com.frame.easy.result;

import com.frame.easy.common.status.ResultStatus;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * 封装返回数据
 * 注: 1. 状态码仅表示请求是否成功,请将业务处理结果放到data中
 *     2. 请规范使用状态码,按照 cn.hutool.http.HttpStatus 或 com.frame.easy.common.status.ResultStatus
 *
 * @author tengchong
 * @date 2018/10/22
 */
public class Tips {
    /**
     * 状态码
     */
    private int code;
    /**
     * 提示文字
     * 注: 如处理失败,务必返回原因
     */
    private String message;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    /**
     * 返回数据
     */
    private Object data;

    public static Tips getSuccessTips(Object data) {
        Tips success = new Tips();
        success.setCode(ResultStatus.SUCCESS.getCode());
        success.setMessage("请求成功");
        success.setData(data);
        return success;
    }

    /**
     * 成功默认返回数据
     * @return Tips
     */
    public static Tips getSuccessTips() {
        return getSuccessTips("请求成功", null);
    }

    /**
     * 成功返回数据
     *
     * @param message 提醒文字
     * @return Tips
     */
    public static Tips getSuccessTips(String message){
        return getSuccessTips(message, null);
    }

    /**
     * 成功返回数据
     *
     * @param message 提醒文字
     * @param data 返回数据
     * @return Tips
     */
    public static Tips getSuccessTips(String message, Object data) {
        return new Tips(ResultStatus.SUCCESS.getCode(), message, data);
    }

    /**
     * 失败默认返回数据 [失败必须返回具体原因]
     *
     * @return Tips
     */
//    public static Tips getErrorTips() {
//        return getErrorTips("操作失败", null);
//    }

    /**
     * 失败默认返回数据
     *
     * @param message 提醒文字
     * @return Tips
     */
    public static Tips getErrorTips(String message){
        return getErrorTips(message, null);
    }

    /**
     * 失败默认返回数据
     *
     * @param message 提醒文字
     * @param data 返回数据
     * @return Tips
     */
    public static Tips getErrorTips(String message, Object data) {
        return new Tips(ResultStatus.INTERNAL_SERVER_ERROR.getCode(), message, data);
    }

    public Tips() {
    }

    public Tips(int code, String message, Object data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
