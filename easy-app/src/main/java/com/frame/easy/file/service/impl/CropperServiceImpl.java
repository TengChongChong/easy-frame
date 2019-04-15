package com.frame.easy.file.service.impl;

import cn.hutool.core.lang.UUID;
import com.frame.easy.exception.EasyException;
import com.frame.easy.file.model.File;
import com.frame.easy.file.service.CropperService;
import com.frame.easy.util.file.FileUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import sun.misc.BASE64Decoder;

import java.io.*;
import java.nio.charset.StandardCharsets;

/**
 * 图片剪裁
 *
 * @author tengchong
 * @date 2019-03-08
 */
@Service
public class CropperServiceImpl implements CropperService {
    private Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     * 文件后缀
     */
    private static final String SUFFIX = ".jpg";

    @Override
    public File cropper(byte[] imageByte) {
        if(imageByte.length > 0){
            String imageData = new String(imageByte, StandardCharsets.UTF_8);
            String name = UUID.randomUUID() + SUFFIX;
            String path = FileUtil.getTemporaryPath() + name;
            File res = new File();
            res.setUrl(FileUtil.getUrl(path));
            res.setSuffix(SUFFIX);
            res.setPath(path);
            res.setName(name);
            try {
                BASE64Decoder decoder = new BASE64Decoder();
                imageByte = decoder.decodeBuffer(imageData.replaceAll("%2F", "/"));
                res.setLength(imageByte.length);
                OutputStream out = new FileOutputStream(path);
                out.write(imageByte);
                out.flush();
                out.close();
            } catch (IOException e) {
                throw new EasyException("读取图片数据失败[错误代码02]");
            }
            return res;
        }
        throw new EasyException("读取图片数据失败[错误代码01]");
    }
}
