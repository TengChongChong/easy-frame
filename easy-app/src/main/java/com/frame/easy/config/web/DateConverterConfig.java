package com.frame.easy.config.web;

import cn.hutool.core.date.DateException;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.lang.Validator;
import com.frame.easy.exception.EasyException;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * 全局日期格式转换
 *
 * @author tengchong
 * @date 2018/12/7
 */
@Component
public class DateConverterConfig implements Converter<String, Date> {

    @Override
    public Date convert(String str) {
        if (str != null) {
            str = str.trim();
            if (Validator.isNotEmpty(str)) {
                try {
                    /**
                     * 会自动匹配以下格式
                     * 其他格式会抛出DateException
                     *
                     * yyyyMMddHHmmss
                     * yyyyMMddHHmmssSSS
                     * yyyy-MM-dd HH:mm:ss.SSS
                     * yyyy-MM-dd HH:mm:ss
                     * yyyy-MM-dd HH:mm
                     * yyyy-MM-dd HH:mm
                     * yyyy-MM-dd
                     * yyyyMMdd
                     * HH:mm:ss
                     * HHmmss
                     */
                    return DateUtil.parse(str).toJdkDate();
                } catch (DateException e) {
                    throw new EasyException("无效的日期格式[" + str + "]");
                }
            }
        }
        return null;
    }
}
