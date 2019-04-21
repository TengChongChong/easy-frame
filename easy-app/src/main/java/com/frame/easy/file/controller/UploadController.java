package com.frame.easy.file.controller;

import com.frame.easy.file.service.UploadService;
import com.frame.easy.result.Tips;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * 文件上传
 *
 * @author tengchong
 * @date 2019-03-08
 */
@RestController
public class UploadController {

    @Autowired
    private UploadService service;

    /**
     * 文件上传
     *
     * @param file 文件
     * @return Tips
     */
    @RequestMapping("/auth/upload")
    public Tips upload(@RequestParam("file") MultipartFile file) {
        return Tips.getSuccessTips(service.upload(file));
    }
}
