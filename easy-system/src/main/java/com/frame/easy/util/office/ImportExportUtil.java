package com.frame.easy.util.office;

import cn.hutool.core.date.DateException;
import cn.hutool.core.date.DateUtil;
import com.frame.easy.common.constant.ImportConst;
import com.frame.easy.exception.EasyException;
import com.frame.easy.modular.sys.model.SysImportExcelTemplateDetails;
import com.frame.easy.modular.sys.model.SysImportExcelTemporary;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

/**
 * 导入&导出工具类
 *
 * @author tengchong
 * @date 2019-04-30
 */
public class ImportExportUtil {
    /**
     * 将临时表数据转为生成excel所需的数据
     *
     * @param temporaries                临时表数据集合
     * @param configs                    导入规则 注: 导入规则用户设置单元格格式以及列数量
     * @param containVerificationResults 包含验证结果
     * @return 数组
     */
    public static List<List<Object>> toExportData(List<SysImportExcelTemporary> temporaries,
                                                  List<SysImportExcelTemplateDetails> configs,
                                                  boolean containVerificationResults) {
        List<List<Object>> rows = new ArrayList<>();
        if (temporaries != null && temporaries.size() > 0 &&
                configs != null && configs.size() > 0) {
            Class temporaryClass = getTemporaryClass();
            for (SysImportExcelTemporary temporary : temporaries) {
                rows.add(callingGetMethodToArray(temporary, configs, temporaryClass, containVerificationResults));
            }
        }
        return rows;
    }

    /**
     * 将临时表数据转为生成excel所需的数据
     * 注: 此方法不需要传入导入规则,但是导出的excel所有单元格都会被设置为文本
     *
     * @param temporaries  临时表数据集合,用于设置单元格格式
     * @param columnNumber 列数量
     * @return 数组
     */
    public static List<List<Object>> toExportData(List<SysImportExcelTemporary> temporaries,
                                                  int columnNumber,
                                                  boolean containVerificationResults) {
        List<List<Object>> rows = new ArrayList<>();
        if (temporaries != null && temporaries.size() > 0 &&
                columnNumber > 0) {
            Class temporaryClass = getTemporaryClass();
            for (SysImportExcelTemporary temporary : temporaries) {
                rows.add(callingGetMethodToArray(temporary, columnNumber, temporaryClass, containVerificationResults));
            }
        }
        return rows;
    }

    /**
     * 获取临时表实体类
     *
     * @return class
     */
    public static Class getTemporaryClass() {
        Class temporaryClass;
        try {
            temporaryClass = Class.forName(ImportConst.TEMPORARY_CLASS);
        } catch (ClassNotFoundException e) {
            throw new EasyException(ImportConst.TEMPORARY_CLASS + "未找到");
        }
        return temporaryClass;
    }

    /**
     * 根据导入规则获取表头
     *
     * @param configs                    导入规则
     * @param containVerificationResults 是否包含验证结果列
     * @return 标题集合
     */
    public static List<String> getTitles(List<SysImportExcelTemplateDetails> configs, boolean containVerificationResults) {
        List<String> titles = new ArrayList<>();
        for (SysImportExcelTemplateDetails detail : configs) {
            titles.add(detail.getTitle());
        }
        if (containVerificationResults) {
            titles.add("验证结果");
        }
        return titles;
    }

    /**
     * 根据导入规则获取表头
     *
     * @param configs 导入规则
     * @return 标题数组
     */
    public static String[] getTitles(List<SysImportExcelTemplateDetails> configs) {
        return getTitles(configs, false).toArray(new String[]{});
    }

    /**
     * 调用get方法获取数据
     *
     * @param temporary                  临时表数据
     * @param configs                    导入规则
     * @param temporaryClass             临时表映射class
     * @param containVerificationResults 包含验证结果
     */
    private static List<Object> callingGetMethodToArray(SysImportExcelTemporary temporary,
                                                        List<SysImportExcelTemplateDetails> configs,
                                                        Class temporaryClass, boolean containVerificationResults) {
        List<Object> row = new ArrayList<>();
        Method method = null;
        try {
            for (int i = 0; i < configs.size(); i++) {
                method = temporaryClass.getMethod("getField" + (i + 1));
                // 获取数据并转换格式
                row.add(transformationData((String) method.invoke(temporary), configs.get(i)));
            }
            if (containVerificationResults) {
                method = temporaryClass.getMethod("getVerificationResults");
                // 获取数据并转换格式
                row.add(method.invoke(temporary));
            }
        } catch (NoSuchMethodException e) {
            throw new EasyException(ImportConst.TEMPORARY_CLASS + "." + method.getName() + "未定义的方法");
        } catch (IllegalAccessException | InvocationTargetException e) {
            throw new EasyException(ImportConst.TEMPORARY_CLASS + "." + method.getName() + "调用失败");
        }
        return row;
    }

    /**
     * 调用get方法获取数据
     *
     * @param temporary                  临时表数据
     * @param columnNumber               列数量
     * @param temporaryClass             临时表映射class
     * @param containVerificationResults 包含验证结果
     */
    private static List<Object> callingGetMethodToArray(SysImportExcelTemporary temporary,
                                                        int columnNumber,
                                                        Class temporaryClass,
                                                        boolean containVerificationResults) {
        List<Object> row = new ArrayList<>();
        Method method = null;
        try {
            for (int i = 0; i < columnNumber; i++) {
                method = temporaryClass.getMethod("getField" + (i + 1));
                // 获取数据并转换格式
                row.add(method.invoke(temporary));
            }
            if (containVerificationResults) {
                method = temporaryClass.getMethod("getVerificationResults");
                // 获取数据并转换格式
                row.add(method.invoke(temporary));
            }
        } catch (NoSuchMethodException e) {
            throw new EasyException(ImportConst.TEMPORARY_CLASS + "." + method.getName() + "未定义的方法");
        } catch (IllegalAccessException | InvocationTargetException e) {
            throw new EasyException(ImportConst.TEMPORARY_CLASS + "." + method.getName() + "调用失败");
        }
        return row;
    }

    /**
     * 根据导入规则将数据转为指定类型
     *
     * @param data   数据
     * @param config 导入规则
     * @return 转换后的类型, 如果转换失败则用string类型
     */
    public static Object transformationData(String data, SysImportExcelTemplateDetails config) {
        Object obj = null;
        try {
            if (ImportExportUtil.isDate(config.getFieldType())) {
                obj = DateUtil.parse(data);
            }
        } catch (DateException ignored) {
        }
        try {
            if (ImportExportUtil.isInteger(config.getFieldType())) {
                obj = Integer.parseInt(data);
            } else if (ImportExportUtil.isLong(config.getFieldType())) {
                obj = Long.parseLong(data);
            } else if (ImportExportUtil.isDouble(config.getFieldType())) {
                obj = Double.parseDouble(data);
            }
        } catch (NumberFormatException ignored) {
        }
        if (obj == null) {
            obj = data;
        }
        return obj;
    }


    /**
     * 是否date类型
     *
     * @param filedType 数据类型
     * @return true/false
     */
    public static boolean isDate(String filedType) {
        return filedType.contains(ImportConst.FIELD_TYPE_DATE) || filedType.contains(ImportConst.FIELD_TYPE_TIMESTAMP);
    }

    /**
     * 是否int类型
     *
     * @param filedType 数据类型
     * @return true/false
     */
    public static boolean isInteger(String filedType) {
        if (filedType.contains(ImportConst.FIELD_TYPE_NUMBER)) {
            return filedType.matches("number\\(+\\d\\)");
        } else {
            return filedType.contains(ImportConst.FIELD_TYPE_INT);
        }
    }

    /**
     * 是否long类型
     *
     * @param filedType 数据类型
     * @return true/false
     */
    public static boolean isLong(String filedType) {
        if (filedType.contains(ImportConst.FIELD_TYPE_NUMBER)) {
            return filedType.matches("number\\(+\\d{2}+\\)");
        } else {
            return filedType.contains(ImportConst.FIELD_TYPE_BIGINT);
        }
    }

    /**
     * 是否double类型
     *
     * @param filedType 数据类型
     * @return true/false
     */
    public static boolean isDouble(String filedType) {
        if (filedType.contains(ImportConst.FIELD_TYPE_NUMBER)) {
            return !filedType.matches("number\\(+\\d{2}+\\)") && !filedType.matches("number\\(+\\d\\)");
        } else {
            return filedType.contains(ImportConst.FIELD_TYPE_DOUBLE) || filedType.contains(ImportConst.FIELD_TYPE_DECIMAL);
        }
    }

}
