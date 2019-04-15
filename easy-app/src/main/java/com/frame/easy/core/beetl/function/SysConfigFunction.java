package com.frame.easy.core.beetl.function;

import com.frame.easy.util.SysConfigUtil;
import org.beetl.core.Context;
import org.beetl.core.Function;

/**
 * 读取系统参数
 *
 * @author tengchong
 * @date 2019-03-04
 */
public class SysConfigFunction implements Function {

    @Override
    public Object call(Object[] objects, Context context) {
        if(objects != null && objects.length > 0){
            return SysConfigUtil.get((String)objects[0]);
        }
        return null;
    }
}
