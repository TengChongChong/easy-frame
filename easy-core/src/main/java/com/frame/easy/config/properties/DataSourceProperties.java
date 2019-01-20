package com.frame.easy.config.properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * 数据源配置
 *
 * @Author tengchong
 * @Date 2019-01-15
 */
@Configuration
public class DataSourceProperties {
    /**
     * 驱动
     */
    @Value("${spring.datasource.druid.driver-class-name}")
    private String driverName;
    /**
     * 用户名
     */
    @Value("${spring.datasource.druid.username}")
    private String username;
    /**
     * 密码
     */
    @Value("${spring.datasource.druid.password}")
    private String password;
    /**
     * 连接地址
     */
    @Value("${spring.datasource.druid.url}")
    private String url;

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
