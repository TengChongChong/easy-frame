package com.frame.easy.core.beetl.function;

import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.common.constant.SysConst;
import org.beetl.core.Context;
import org.beetl.core.Function;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.FileNotFoundException;

/**
 * 获取插件js资源
 *
 * @author tengchong
 * @date 2019-05-23
 */
public class PluginsFunction implements Function {
    private Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     * 插件根目录
     */
    private static final String ROOT_PATH = "static/vendors/custom";
    /**
     * 生产环境使用min
     */
    private static final String MIN = SysConst.IS_PROD ? ".min" : "";
    /**
     * 文件后缀
     */
    private static final String JS_SUFFIX = ".bundle" + MIN + ".js";
    private static final String CSS_SUFFIX = ".bundle" + MIN + ".css";
    /**
     * 获取资源类型 - 只获取js
     */
    private static final String TYPE_JS = "js";
    /**
     * 获取资源类型 - 只获取css
     */
    private static final String TYPE_CSS = "css";
    /**
     * 获取资源类型 - 获取js&css
     */
    private static final String TYPE_ALL = "all";

    @Override
    public Object call(Object[] objects, Context context) {
        String type = TYPE_ALL;
        if (objects.length > 1) {
            // 如果有2个参数表示用户指定了获取js还是css
            type = (String) objects[1];
        }
        Object obj = objects[0];
        StringBuilder pluginsHtml = new StringBuilder();
        if (obj != null) {
            String[] plugins = ((String) objects[0]).split(CommonConst.SPLIT);
            for (String plugin : plugins) {
                pluginsHtml.append(getPluginHtml(context, type, plugin.trim()));
            }
        }
        return pluginsHtml.toString();
    }

    private String getPluginHtml(Context context, String type, String pluginName) {
        String ctxPath = (String) context.getGlobal("ctxPath");
        File root;
        try {
            root = new File(ResourceUtils.getURL("classpath:").getPath() + ROOT_PATH);
        } catch (FileNotFoundException e) {
            logger.warn("获取资源根目录失败", e);
            return "<span class=\"kt-font-danger kt-font-bold\">获取资源根目录失败</span>";
        }
        String pluginHtml = "";
        if (root.exists()) {
            String version = SysConst.projectProperties.getVersion();
            String pluginRootUrl = ctxPath + "/" + ROOT_PATH + "/" + pluginName + "/";
            String pluginRootPath = root.getPath() + File.separator + pluginName + File.separator;
            if (TYPE_JS.equals(type) || TYPE_ALL.equals(type)) {
                File staticFile = new File(pluginRootPath + pluginName + JS_SUFFIX);
                if (staticFile.exists()) {
                    String url = pluginRootUrl + pluginName + JS_SUFFIX;
                    pluginHtml += "<script src=\"" + url + "?v=" + version + "\"></script>\r\n";
                }
            }
            if (TYPE_CSS.equals(type) || TYPE_ALL.equals(type)) {
                File staticFile = new File(pluginRootPath + pluginName + CSS_SUFFIX);
                if (staticFile.exists()) {
                    String url = pluginRootUrl + pluginName + CSS_SUFFIX;
                    pluginHtml += "<link href=\"" + url + "?v=" + version + "\" rel=\"stylesheet\" type=\"text/css\"/>\r\n";
                }
            }
        }
        return pluginHtml;
    }
}
