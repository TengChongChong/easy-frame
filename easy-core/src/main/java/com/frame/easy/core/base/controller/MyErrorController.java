package com.frame.easy.core.base.controller;

import org.springframework.boot.autoconfigure.web.ErrorProperties;
import org.springframework.boot.autoconfigure.web.servlet.error.BasicErrorController;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.Map;

/**
 * 自定义容器级错误响应内容
 *
 * @Author tengchong
 * @Date 2018/10/22
 */
@Controller
public class MyErrorController extends BasicErrorController {

    public MyErrorController() {
        super(new DefaultErrorAttributes(), new ErrorProperties());
    }

    /**
     * 自定义ajax响应内容
     */
    @Override
    public ResponseEntity<Map<String, Object>> error(HttpServletRequest request) {
        HttpStatus status = getStatus(request);
        // 响应数据
        Map<String, Object> map = getErrorAttributes(request, false);
        map.put("code", map.get("status"));
        map.remove("status");
        map.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity(map, status);
    }

    /**
     * 自定义页面响应
     */
    @Override
    public ModelAndView errorHtml(HttpServletRequest request, HttpServletResponse response) {
        HttpStatus status = getStatus(request);
        response.setStatus(status.value());

        Map<String, Object> model = getErrorAttributes(request, isIncludeStackTrace(request, MediaType.TEXT_HTML));
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("code", status.value());
        modelAndView.addObject("error", model.get("error"));
        modelAndView.addObject("path", model.get("path"));
        modelAndView.addObject("message", model.get("message"));
        modelAndView.setViewName("global/error");
        //指定自定义的视图
        return modelAndView;
    }
}
