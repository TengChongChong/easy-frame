package com.frame.easy.file.controller;

import com.frame.easy.file.service.CropperService;
import com.frame.easy.result.Tips;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 图片剪裁
 *
 * @author tengchong
 * @date 2019-03-08
 */
@RestController
public class CropperController {

    @Autowired
    private CropperService service;

    /**
     * 图片裁剪
     *
     * @param data 字节
     * @return Tips
     */
    @RequestMapping("/auth/cropper")
    public Tips cropper(@RequestBody byte[] data) {
        return Tips.getSuccessTips(service.cropper(data));
    }
}
