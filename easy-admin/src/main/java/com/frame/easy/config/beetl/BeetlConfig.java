package com.frame.easy.config.beetl;

import com.frame.easy.config.properties.BeetlProperties;
import com.frame.easy.core.beetl.BeetlConfiguration;
import org.beetl.core.resource.ClasspathResourceLoader;
import org.beetl.ext.spring.BeetlSpringViewResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * beetl的配置
 *
 * @Author tengchong
 * @Date 2018/9/4
 */

@Configuration
public class BeetlConfig {

    @Autowired
    private BeetlProperties beetlProperties;

    @Bean(initMethod = "init")
    public BeetlConfiguration beetlConfiguration() {
        BeetlConfiguration beetlConfiguration = new BeetlConfiguration();
        beetlConfiguration.setResourceLoader(new ClasspathResourceLoader(BeetlConfig.class.getClassLoader(), beetlProperties.getPrefix()));
        beetlConfiguration.setConfigProperties(beetlProperties.getProperties());
        return beetlConfiguration;
    }

    @Bean
    public BeetlSpringViewResolver getBeetlSpringViewResolver(){
        BeetlSpringViewResolver viewResolver = new BeetlSpringViewResolver();
        viewResolver.setSuffix(beetlProperties.getSuffix());
        viewResolver.setContentType("text/html;charset=UTF-8");
        viewResolver.setOrder(0);
        viewResolver.setConfig(beetlConfiguration());
        return viewResolver;
    }

}
