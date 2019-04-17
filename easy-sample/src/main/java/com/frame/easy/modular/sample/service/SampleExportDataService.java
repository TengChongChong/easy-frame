package com.frame.easy.modular.sample.service;

import com.frame.easy.modular.sample.model.SampleGeneral;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;

import javax.servlet.http.HttpServletRequest;

/**
 * 导出数据示例
 *
 * @author tengchong
 * @date 2019-04-16
 */
public interface SampleExportDataService {
    /**
     * 导出查询结果
     *
     * @param object  查询条件
     * @param request request
     * @return 文件
     */
    ResponseEntity<FileSystemResource> exportData(SampleGeneral object, HttpServletRequest request);
}
