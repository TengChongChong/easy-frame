package com.frame.easy.modular.sys.dao;

import com.frame.easy.modular.sys.model.SysMailVerifies;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

/**
 * 邮箱验证
 *
 * @author TengChong
 * @date 2019-03-24
 */
public interface SysMailVerifiesMapper extends BaseMapper<SysMailVerifies> {
    public String getMailByUserId(@Param("userId") Long userId);
}