package com.frame.easy.core.beetl.function;

import com.frame.easy.util.SysConfigUtil;
import org.beetl.core.Context;
import org.beetl.core.Function;

/**
 * 获取项目名称
 *
 * @author tengchong
 * @date 2019-03-04
 */
public class ProjectNameFunction implements Function {

    @Override
    public Object call(Object[] objects, Context context) {
        return SysConfigUtil.getProjectName();
    }
}
