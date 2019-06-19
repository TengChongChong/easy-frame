package com.frame.easy;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;


/**
 * web 容器下启动类
 * war 方式部署情况下使用
 *
 * @author tengchong
 * @date 2018/11/22
 */
public class WebStartApplication extends SpringBootServletInitializer {
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(Application.class);
    }
}
