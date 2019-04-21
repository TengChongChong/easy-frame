package com.frame.easy.modular.sys.service;

import com.frame.easy.common.page.Page;
import com.frame.easy.modular.sys.model.SysImportExcelTemplate;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;

import javax.servlet.http.HttpServletRequest;

/**
 * 导入模板
 *
 * @author TengChong
 * @date 2019-04-10
 */
public interface SysImportExcelTemplateService {
    /**
     * 列表
     * @param object 查询条件
     * @return 数据集合
     */
    Page select(SysImportExcelTemplate object);

    /**
     * 详情
     *
     * @param id id
     * @return 详细信息
     */
    SysImportExcelTemplate input(Long id);

    /**
     * 根据模板代码获取导入信息
     *
     * @param importCode 模板代码
     * @return 详细信息
     */
    SysImportExcelTemplate getByImportCode(String importCode);

    /**
     * 新增
     *
     * @return 默认值
     */
    SysImportExcelTemplate add();
    /**
     * 删除
     *
     * @param ids 数据ids
     * @return 是否成功
     */
    boolean delete(String ids);
    /**
     * 保存
     *
     * @param object 表单内容
     * @return 保存后信息
     */
    SysImportExcelTemplate saveData(SysImportExcelTemplate object);

    /**
     * 下载导入模板
     *
     * @param importCode 模板代码
     * @return ResponseEntity
     */
    ResponseEntity<FileSystemResource> downloadTemplate(String importCode, HttpServletRequest request);
}
