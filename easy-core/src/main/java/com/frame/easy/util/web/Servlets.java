package com.frame.easy.util.web;

import com.frame.easy.common.constant.CommonConst;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Objects;

/**
 * Servlets 工具类
 *
 * @author tengchong
 * @date 2018/9/13
 */
public class Servlets {
    private static Logger logger = LoggerFactory.getLogger(Servlets.class);

    /**
     * 判断是否是ajax请求
     *
     * @param request 请求
     * @return boolean
     */
    public static boolean isAjaxRequest(HttpServletRequest request){
        String accept = request.getHeader("accept");
        String xRequestedWith = request.getHeader("X-Requested-With");
        return ((accept != null && accept.contains("application/json") ||
                (xRequestedWith != null && xRequestedWith.contains("XMLHttpRequest"))));
    }

    /**
     * 获取当前请求
     * @return HttpServletRequest
     */
    public static HttpServletRequest getRequest(){
        try{
            return ((ServletRequestAttributes) Objects.requireNonNull(RequestContextHolder.getRequestAttributes())).getRequest();
        }catch (NullPointerException e){
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 判断请求是否为静态文件
     *
     * @param uri 请求地址
     * @return true/false
     */
    public static boolean isStaticRequest(String uri){
        String[] staticFileSuffix = CommonConst.STATIC_FILE_SUFFIX;
        for(String suffix: staticFileSuffix){
            if(uri.endsWith(suffix)){
                return true;
            }
        }
        return false;
    }
}
