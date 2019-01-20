package com.frame.easy.core.util;

import com.frame.easy.core.exception.ExceptionEnum;

/**
 * 工具类
 *
 * @Author tengchong
 * @Date 2018/9/4
 */
public class ToolUtil {
    public static String getTmpDir() {
        return System.getProperty("java.io.tmpdir");
    }

    public static boolean checkParams(Object object) throws RuntimeException {
        if (object != null) {
            return true;
        } else {
            throw new RuntimeException(ExceptionEnum.FAILED_TO_GET_DATA.getMessage());
        }
    }

    public static boolean checkResult(boolean isSuccess) throws RuntimeException {
        if((Boolean) checkResult(isSuccess, true)){
            return true;
        }else{
            return false;
        }
    }
    public static Object checkResult(boolean isSuccess, Object object) throws RuntimeException {
        if (isSuccess) {
            return object;
        } else {
            throw new RuntimeException(ExceptionEnum.UNKNOWN_ERROR.getMessage());
        }
    }
}
