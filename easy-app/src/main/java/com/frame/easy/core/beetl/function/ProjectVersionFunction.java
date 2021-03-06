package com.frame.easy.core.beetl.function;

import com.frame.easy.common.constant.SysConst;
import org.beetl.core.Context;
import org.beetl.core.Function;

/**
 * 获取项目版本号
 *
 * @author tengchong
 * @date 2019-03-04
 */
public class ProjectVersionFunction implements Function {

    @Override
    public Object call(Object[] objects, Context context) {
        return SysConst.projectProperties.getVersion();
    }
}
