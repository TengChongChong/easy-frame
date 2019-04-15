package com.frame.easy.file.service;

import com.frame.easy.file.model.File;

/**
 * 图片剪裁
 *
 * @author tengchong
 * @date 2019-03-08
 */
public interface CropperService {
    /**
     * 图片裁剪
     *
     * @param data 字节
     * @return File
     */
    File cropper(byte[] data);
}
