package com.frame.easy.util.file;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.lang.UUID;
import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.exception.EasyException;

import java.io.File;

/**
 * 文件工具
 *
 * @author tengchong
 * @date 2019-03-08
 */
public class FileUtil {
    /**
     * 临时
     */
    private static final String TEMPORARY = "temporary";
    /**
     * 正式
     */
    private static final String FORMAL = "formal";
    /**
     * 临时文件存放路径
     * 每天0点会清空前天的临时文件
     */
    private static final String TEMPORARY_PATH = CommonConst.projectProperties.getFileUploadPath() + TEMPORARY + File.separator;

    /**
     * 正式文件存放路径
     */
    private static final String FORMAL_PATH = CommonConst.projectProperties.getFileUploadPath() + FORMAL + File.separator;

    /**
     * 获取临时文件存放路径
     *
     * @return 临时路径/yyyy/mm/dd/
     */
    public static String getTemporaryPath() {
        File file = new File(TEMPORARY_PATH + DateUtil.today().replaceAll("-", File.separator));
        if (!file.exists()) {
            file.mkdirs();
        }
        return file.getPath() + File.separator;
    }

    /**
     * 将临时目录下的文件移动到正式目录
     *
     * @param path 文件路径
     * @return 新路径
     */
    public static String moveToFormal(String path) {
        File src = new File(path);
        if (src.exists()) {
            File file = new File(FORMAL_PATH + DateUtil.today().replaceAll("-", File.separator));
            if (!file.exists()) {
                file.mkdirs();
            }
            File dest = new File(file.getPath() + File.separator + src.getName());
            cn.hutool.core.io.FileUtil.move(src, dest, true);
            return dest.getPath();
        } else {
            throw new EasyException("移动到正式目录失败[源文件 - " + path + " 不存在]");
        }
    }

    /**
     * 根据path获取访问url
     *
     * @param path 文件路径
     * @return url
     */
    public static String getUrl(String path) {
        if (path.contains(FORMAL)) {
            return "/static" + path.substring(path.indexOf(FORMAL) - 1);
        } else if (path.contains(TEMPORARY)) {
            return "/static" + path.substring(path.indexOf(TEMPORARY) - 1);
        } else {
            return path;
        }
    }

    /**
     * 根据访问url获取path
     *
     * @param url url
     * @return path
     */
    public static String getPath(String url) {
        if (url.contains("static")) {
            return CommonConst.projectProperties.getFileUploadPath() + url.replace("/static/", "");
        }
        return url;
    }

    /**
     * 根据正式路径下的文件访问url删除
     *
     * @param url url
     * @return true/false
     */
    public static boolean del(String url) {
        return delByPath(CommonConst.projectProperties.getFileUploadPath() + url.replaceAll("/static/", ""));
    }
    /**
     * 根据文件路径删除
     *
     * @param path 路径
     * @return true/false
     */
    public static boolean delByPath(String path) {
        return cn.hutool.core.io.FileUtil.del(path);
    }

}
