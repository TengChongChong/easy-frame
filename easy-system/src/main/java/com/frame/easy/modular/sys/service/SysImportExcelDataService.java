package com.frame.easy.modular.sys.service;

/**
 * 数据导入
 *
 * @author tengchong
 * @date 2019-04-17
 */
public interface SysImportExcelDataService {

    /**
     * 检查上次导入数据
     *
     * @param importCode 导入代码
     * @return true/false
     */
    boolean checkLastData(String importCode);

    /**
     * 验证并解析文件
     *
     * @param importCode 导入代码
     * @param path excel文件路径
     * @return true/false
     */
    boolean analysis(String importCode, String path);

    /**
     * 插入数据
     *
     * @param importCode 导入代码
     * @return true/false
     */
    boolean insertData(String importCode);
}
