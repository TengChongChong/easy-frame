package com.frame.easy.config.web;

import com.frame.easy.common.constant.status.ProfilesActiveStatus;
import com.frame.easy.config.properties.ProjectProperties;
import com.frame.easy.core.base.result.Tips;
import com.frame.easy.core.web.Servlets;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 通用异常处理(应用级异常)
 *
 * @Author tengchong
 * @Date 2018/10/22
 */
@RestControllerAdvice
public class ExceptionControllerAdvice {

    @Autowired
    private ProjectProperties projectProperties;

    /**
     * 通用异常
     * 如果是ajax返回json,如果是普通请求返回错误页面
     *
     * @param request
     * @param e
     * @return
     */
    @ExceptionHandler(Exception.class)
    public Object handleException(HttpServletRequest request, HttpServletResponse response, Exception e) {
        Tips tips = new Tips();
        if (e instanceof UnauthorizedException) {
            tips.setCode(HttpStatus.UNAUTHORIZED.value());
            tips.setMessage("您无权限访问此资源");
        } else {
            tips.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            tips.setMessage(e.getMessage());
        }
        tips.setData(e.getMessage());
        if (Servlets.isAjaxRequest(request)) {
            return tips;
        } else {
            ModelAndView modelAndView = new ModelAndView();
            modelAndView.addObject("code", tips.getCode());
            modelAndView.addObject("message", e.getMessage());
            modelAndView.addObject("url", request.getRequestURL());
            modelAndView.addObject("stackTrace", e.getStackTrace());
            // 当前模式是否为开发模式
            modelAndView.addObject("isDev", projectProperties.getProfilesActive().equals(ProfilesActiveStatus.dev.getProfilesActive()));
            modelAndView.addObject("projectPackage", projectProperties.getProjectPackage());
            modelAndView.setViewName("global/500");
            return modelAndView;
        }
    }

}
