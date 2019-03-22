package com.frame.easy.config.web;

import cn.hutool.core.util.StrUtil;
import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.common.status.ProfilesActiveStatus;
import com.frame.easy.result.Tips;
import com.frame.easy.exception.EasyException;
import com.frame.easy.core.web.Servlets;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authz.UnauthorizedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

/**
 * 通用异常处理(应用级异常)
 *
 * @author tengchong
 * @date 2018/10/22
 */
@RestControllerAdvice
public class ExceptionControllerAdvice {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     * 通用异常
     * 如果是ajax返回json,如果是普通请求返回错误页面
     *
     * @param request 请求
     * @param e       异常
     * @return Tips/ModelAndView
     */
    @ExceptionHandler(RuntimeException.class)
    public Object handleException(HttpServletRequest request, RuntimeException e) {
        e.printStackTrace();
        Tips tips = new Tips();
        if (e instanceof UnauthorizedException) {
            tips.setCode(HttpStatus.UNAUTHORIZED.value());
            tips.setMessage("您无权限访问此资源");
        } else if (e instanceof EasyException) {
            logger.error("业务异常:", e);
            tips.setCode(((EasyException) e).getCode());
            tips.setMessage(e.getMessage());
        } else if (e instanceof AuthenticationException) {
            tips.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            if (e.getCause() != null) {
                logger.error("登录异常:", e.getCause().getMessage());
                tips.setMessage(e.getCause().getMessage());
            } else {
                logger.error("登录异常:", e.getMessage());
                tips.setMessage(e.getMessage());
            }
        } else {
            tips.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            tips.setMessage(e.getMessage());
        }
        if (Servlets.isAjaxRequest(request)) {
            return tips;
        } else {
            ModelAndView modelAndView = new ModelAndView();
            modelAndView.addObject("code", tips.getCode());
            modelAndView.addObject("message", e.getMessage());
            modelAndView.addObject("path", request.getRequestURL());
            modelAndView.addObject("trace", StrUtil.join("\n\t", e.getStackTrace()));
            // 当前模式是否为开发模式
            modelAndView.addObject("isDev", CommonConst.projectProperties.getProfilesActive().equals(ProfilesActiveStatus.dev.getProfilesActive()));
            modelAndView.setViewName("global/" + tips.getCode());
            return modelAndView;
        }
    }

}
