package com.frame.easy.modular.sample.service.impl;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.lang.Validator;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.exception.EasyException;
import com.frame.easy.modular.sample.dao.SampleGeneralMapper;
import com.frame.easy.modular.sample.model.SampleGeneral;
import com.frame.easy.modular.sample.service.SampleExportDataService;
import com.frame.easy.util.http.HttpUtil;
import com.frame.easy.util.office.ExcelUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * 导出数据示例
 *
 * @author TengChong
 * @date 2019-04-16
 */
@Service
public class SampleExportDataServiceImpl extends ServiceImpl<SampleGeneralMapper, SampleGeneral> implements SampleExportDataService {

    @Autowired
    private SampleGeneralMapper mapper;

    @Override
    public ResponseEntity<FileSystemResource> exportData(SampleGeneral object, HttpServletRequest request) {
        QueryWrapper<SampleGeneral> queryWrapper = new QueryWrapper<>();
        if (object != null) {
            // 姓名
            if (Validator.isNotEmpty(object.getName())) {
                queryWrapper.like("name", object.getName());
            }
            // 年龄
            if (Validator.isNotEmpty(object.getAge())) {
                queryWrapper.eq("age", object.getAge());
            }
            // 手机号码
            if (Validator.isNotEmpty(object.getPhone())) {
                queryWrapper.eq("phone", object.getPhone());
            }
            // 状态
            if (Validator.isNotEmpty(object.getStatus())) {
                queryWrapper.eq("status", object.getStatus());
            }
        }
        List<SampleGeneral> list = mapper.selectList(queryWrapper);
        List<List<Object>> rows = CollUtil.newArrayList();
        for (SampleGeneral general : list) {
            rows.add(Arrays.asList(general.getName(), general.getSex(), general.getAge(), general.getPhone(), general.getAddress(), new Date()));
        }
        String path = ExcelUtil.writFile(rows, "姓名,性别,年龄,手机号码,地址,生日", "导出数据示例", "测试数据");
        try {
            return HttpUtil.getResponseEntity(new File(path), "导出数据示例-" + DateUtil.today() + ExcelUtil.EXCEL_SUFFIX_XLSX, request);
        } catch (UnsupportedEncodingException e) {
            throw new EasyException("导出文件失败");
        }
    }
}