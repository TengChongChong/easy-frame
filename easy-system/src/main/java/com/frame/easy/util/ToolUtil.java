package com.frame.easy.util;

import com.frame.easy.base.model.IModel;
import com.frame.easy.common.page.Page;
import com.frame.easy.exception.EasyException;
import com.frame.easy.exception.ExceptionEnum;

/**
 * 工具类
 * 封装框架里常用的方法
 *
 * @author tengchong
 * @date 2018/9/4
 */
public class ToolUtil {
    public static String getTmpDir() {
        return System.getProperty("java.io.tmpdir");
    }

    /**
     * 获取分页信息
     *
     * @param model 实体类
     * @return page
     */
    public static Page getPage(IModel model){
        Page page = null;
        if(model != null){
            page = model.getPage();
        }
        if(page == null){
            page = new Page();
        }
        return page;
    }

    /**
     * 检查参数是否为空
     * @param object 参数
     * @return true/false
     * @throws EasyException
     */
    public static boolean checkParams(Object object) throws EasyException {
        if (object != null) {
            return true;
        } else {
            throw new EasyException(ExceptionEnum.FAILED_TO_GET_DATA.getMessage());
        }
    }

    /**
     * 检查结果
     *
     * @param isSuccess 是否成功
     * @return true/false
     * @throws EasyException
     */
    public static boolean checkResult(boolean isSuccess) throws EasyException {
        return (Boolean) checkResult(isSuccess, true);
    }

    /**
     * 检查结果
     *
     * @param isSuccess 是否成功
     * @param object 返回数据
     * @return object
     * @throws EasyException
     */
    public static Object checkResult(boolean isSuccess, Object object) throws EasyException {
        if (isSuccess) {
            return object;
        } else {
            throw new EasyException(ExceptionEnum.UNKNOWN_ERROR.getMessage());
        }
    }

}
