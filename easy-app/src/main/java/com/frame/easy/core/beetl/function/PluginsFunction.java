package com.frame.easy.core.beetl.function;

import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.common.constant.SysConst;
import com.frame.easy.common.redis.RedisPrefix;
import com.frame.easy.util.RedisUtil;
import org.beetl.core.Context;
import org.beetl.core.Function;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.InputStream;

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
        String pluginHtml = "";
        // 版本号
        String version = SysConst.projectProperties.getVersion();
        // url
        String pluginRootUrl = ctxPath + "/" + ROOT_PATH + "/" + pluginName + "/";
        // 插件目录
        String pluginRootPath = ROOT_PATH + File.separator + pluginName + File.separator;
        // js
        if (TYPE_JS.equals(type) || TYPE_ALL.equals(type)) {
            if (checkExists(pluginName + JS_SUFFIX, pluginRootPath + pluginName + JS_SUFFIX)) {
                String url = pluginRootUrl + pluginName + JS_SUFFIX;
                pluginHtml += "<script src=\"" + url + "?v=" + version + "\"></script>\r\n";
            }
        }
        // css
        if (TYPE_CSS.equals(type) || TYPE_ALL.equals(type)) {
            if (checkExists(pluginName + CSS_SUFFIX, pluginRootPath + pluginName + CSS_SUFFIX)) {
                String url = pluginRootUrl + pluginName + CSS_SUFFIX;
                pluginHtml += "<link href=\"" + url + "?v=" + version + "\" rel=\"stylesheet\" type=\"text/css\"/>\r\n";
            }
        }
        return pluginHtml;
    }

    /**
     * 检查文件是否存在
     * 为避免频繁调用File.exists()对性能造成损耗, 这里将检查结果放到redis中
     *
     * @param plugin 插件名称 eg: cropper.bundle.min.css
     * @param path   文件路径
     * @return true/false
     */
    private boolean checkExists(String plugin, String path) {
        boolean isExists;
        String key = RedisPrefix.PLUGIN_CHECK + plugin;
        Object temp = RedisUtil.get(key);
        if (temp != null) {
            isExists = (boolean) temp;
        } else {
            // 检查文件是否存在
            InputStream stream = getClass().getClassLoader().getResourceAsStream(path);
            isExists = stream != null;
            logger.debug("检查文件[" + path + "]是否存在[" + isExists + "]");
            // 放到redis里
            RedisUtil.set(key, isExists);
        }
        return isExists;
    }
}
