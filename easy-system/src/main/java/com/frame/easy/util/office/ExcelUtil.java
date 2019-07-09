package com.frame.easy.util.office;

import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.poi.excel.BigExcelWriter;
import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.util.file.FileUtil;

import java.util.Arrays;
import java.util.List;

/**
 * Excel 工具
 *
 * @Author tengchong
 * @Date 2019-04-09
 */
public class ExcelUtil {
    /**
     * excel 文件后缀 07
     */
    public static final String EXCEL_SUFFIX_XLSX = ".xlsx";
    /**
     * excel 文件后缀 03
     */
    public static final String EXCEL_SUFFIX_XLS = ".xls";

    /**
     * 写excel文件
     *
     * @param body 表格内容
     * @param head 表格标题 示例 标题1,标题2,标题3
     * @return 文件路径
     */
    public static String writFile(List<List<Object>> body, String head) {
        return writFile(body, head.split(CommonConst.SPLIT), null, null, null);
    }

    /**
     * 写excel文件
     *
     * @param body  表格内容
     * @param head  表格标题 示例 标题1,标题2,标题3
     * @param title 标题行
     * @return 文件路径
     */
    public static String writFile(List<List<Object>> body, String head, String title) {
        return writFile(body, head.split(CommonConst.SPLIT), title, null, null);
    }

    /**
     * 写excel文件
     *
     * @param body      表格内容
     * @param head      表格标题 示例 标题1,标题2,标题3
     * @param title     标题行
     * @param sheetName sheet名称,默认为sheet1
     * @return 文件路径
     */
    public static String writFile(List<List<Object>> body, String head, String title, String sheetName) {
        return writFile(body, head.split(CommonConst.SPLIT), title, sheetName, null);
    }

    /**
     * 写excel文件
     *
     * @param body      表格内容
     * @param head      表格标题
     * @param title     标题行
     * @param sheetName sheet名称,默认为sheet1
     * @param path      文件路径
     * @return 文件路径
     */
    public static String writFile(List<List<Object>> body, String[] head, String title, String sheetName, String path) {
        if (StrUtil.isBlank(path)) {
            path = FileUtil.getTemporaryPath() + IdUtil.randomUUID() + EXCEL_SUFFIX_XLSX;
        }
        BigExcelWriter writer = cn.hutool.poi.excel.ExcelUtil.getBigWriter(path, sheetName);
        if (StrUtil.isNotBlank(title)) {
            //合并单元格，使用默认标题样式
            if (head != null && head.length > 0) {
                writer.merge(head.length - 1, title);
            } else {
                writer.merge(1, title);
            }
        }
        // 设置表格标题
        if(head != null){
            writer.writeHeadRow(Arrays.asList(head));
        }
        // 设置内容
        if (body != null) {
            //写出内容
            writer.write(body, false);
        }
        //关闭writer，释放内存
        writer.close();
        return path;
    }
}
