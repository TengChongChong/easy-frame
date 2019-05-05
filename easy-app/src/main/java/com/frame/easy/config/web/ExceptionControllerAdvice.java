package com.frame.easy.config.web;

import cn.hutool.core.util.StrUtil;
import com.frame.easy.common.status.ProfilesActiveStatus;
import com.frame.easy.config.properties.ProjectProperties;
import com.frame.easy.exception.EasyException;
import com.frame.easy.modular.sys.model.SysException;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.service.SysExceptionService;
import com.frame.easy.result.Tips;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.web.Servlets;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authz.UnauthenticatedException;
import org.apache.shiro.authz.UnauthorizedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;

/**
 * 通用异常处理(应用级异常)
 *
 * @author tengchong
 * @date 2018/10/22
 */
@ControllerAdvice
public class ExceptionControllerAdvice {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private SysExceptionService sysExceptionService;

    @Autowired
    private ProjectProperties projectProperties;

    /**
     * 拦截业务异常
     */
    @ExceptionHandler(EasyException.class)
    public Object easyException(HttpServletRequest request, EasyException e) {
        logger.debug("业务异常", e);
        if (Servlets.isAjaxRequest(request)) {
            return Tips.getErrorTips(e.getMessage());
        } else {
            return errorModelAndView(request.getRequestURI(), e.getCode(), e.getMessage(), e);
        }
    }

    /**
     * 拦截未经认证异常
     */
    @ExceptionHandler(UnauthenticatedException.class)
    public ModelAndView unauthenticatedException(UnauthenticatedException e) {
        return new ModelAndView("/login");
    }

    /**
     * 登录异常
     */
    @ExceptionHandler(AuthenticationException.class)
    public Object authenticationException(HttpServletRequest request, AuthenticationException e) {
        logger.debug("登录异常", e);
        if (Servlets.isAjaxRequest(request)) {
            if (e.getCause() != null) {
                logger.error("登录异常:", e.getCause().getMessage());
                return Tips.getErrorTips(e.getCause().getMessage());
            } else {
                logger.error("登录异常:", e.getMessage());
                return Tips.getErrorTips(e.getMessage());
            }
        } else {
            return errorModelAndView(request.getRequestURI(), HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), e);
        }
    }


    /**
     * 权限异常
     */
    @ExceptionHandler({UnauthorizedException.class})
    public Object unauthorizedException(HttpServletRequest request, UnauthorizedException e) {
        logger.debug("权限异常", e);
        if (Servlets.isAjaxRequest(request)) {
            return new Tips(HttpStatus.UNAUTHORIZED.value(), "您无权限访问此资源", null);
        } else {
            return errorModelAndView(request.getRequestURI(), HttpStatus.UNAUTHORIZED.value(), "您无权限访问此资源", e);
        }
    }

    /**
     * 未知异常
     */
    @ExceptionHandler(RuntimeException.class)
    public Object handleException(HttpServletRequest request, RuntimeException e) {
        logger.debug("未知异常", e);
        // 将异常记录到表中
        SysException sysException = new SysException();
        sysException.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        sysException.setMessage(e.getMessage());
        sysException.setUrl(request.getRequestURI());
        sysException.setTriggerTime(new Date());
        sysException.setType(e.getClass().getName());
        sysException.setTrace(StrUtil.join("\n\t", e.getStackTrace()));
        SysUser currentUser = ShiroUtil.getCurrentUser();
        if(currentUser != null){
            sysException.setUserId(currentUser.getId());
        }
        sysExceptionService.saveData(sysException);

        if (Servlets.isAjaxRequest(request)) {
            return Tips.getErrorTips(e.getMessage());
        } else {
            return errorModelAndView(request.getRequestURI(), HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), e);
        }
    }

    /**
     * 获取错误提示页面信息
     *
     * @param url     请求地址
     * @param code    错误代码
     * @param message 错误信息
     * @param e       异常信息
     * @return ModelAndView
     */
    private ModelAndView errorModelAndView(String url, int code, String message, RuntimeException e) {
        ModelAndView modelAndView = new ModelAndView("global/" + code);
        modelAndView.addObject("code", code);
        modelAndView.addObject("message", message);
        modelAndView.addObject("path", url);
        // 当前模式是否为开发模式
        boolean isDev = projectProperties.getProfilesActive().equals(ProfilesActiveStatus.dev.getProfilesActive());
        modelAndView.addObject("isDev", isDev);
        if (isDev) {
            modelAndView.addObject("trace", StrUtil.join("\n\t", e.getStackTrace()));
        }
        return modelAndView;
    }

}
