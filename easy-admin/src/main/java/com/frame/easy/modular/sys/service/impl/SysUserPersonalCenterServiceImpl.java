package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.util.StrUtil;
import com.frame.easy.exception.EasyException;
import com.frame.easy.exception.ExceptionEnum;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.model.SysUserSetting;
import com.frame.easy.modular.sys.service.SysUserPersonalCenterService;
import com.frame.easy.modular.sys.service.SysUserService;
import com.frame.easy.util.file.FileUtil;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.util.file.ImageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;

/**
 * 个人中心
 *
 * @author tengchong
 * @date 2019-03-04
 */
@Service
public class SysUserPersonalCenterServiceImpl implements SysUserPersonalCenterService {

    @Autowired
    private SysUserService sysUserService;

    @Override
    public String saveUserAvatar(String path) {
        if (StrUtil.isNotBlank(path)) {
            java.io.File file = new java.io.File(path);
            if (file.exists()) {
                SysUser sysUser = ShiroUtil.getCurrentUser();
                // 以前设置了头像
                String oldAvatar = null;
                if (StrUtil.isNotBlank(sysUser.getAvatar())) {
                    oldAvatar = sysUser.getAvatar();
                }
                // 将新头像移动到正式目录
                path = FileUtil.moveToFormal(path);
                // 更新数据库
                String url = FileUtil.getUrl(path);
                boolean isSuccess = sysUserService.updateAvatar(url);
                if (isSuccess) {
                    if(StrUtil.isNotBlank(oldAvatar)){
                        // 删除原头像以及缩略图
                        ImageUtil.delThumbnail(new File(FileUtil.getPath(oldAvatar)));
                        FileUtil.del(oldAvatar);
                    }
                    // 生成缩略图
                    ImageUtil.generateThumbnail(new java.io.File(path));
                    // 更新redis中用户信息
                    sysUser.setAvatar(url);
                    sysUser.setAvatarLg(ImageUtil.getThumbnailUrlByUrl(url, ImageUtil.IMAGE_SIZE_LG));
                    sysUser.setAvatarMd(ImageUtil.getThumbnailUrlByUrl(url, ImageUtil.IMAGE_SIZE_MD));
                    sysUser.setAvatarSm(ImageUtil.getThumbnailUrlByUrl(url, ImageUtil.IMAGE_SIZE_SM));
                    sysUser.setAvatarXs(ImageUtil.getThumbnailUrlByUrl(url, ImageUtil.IMAGE_SIZE_XS));
                    ShiroUtil.setCurrentUser(sysUser);
                    return ImageUtil.getThumbnailUrlByUrl(url, ImageUtil.IMAGE_SIZE_SM);
                } else {
                    // 更新失败了,把移动到正式目录的图片删掉
                    cn.hutool.core.io.FileUtil.del(new java.io.File(path));
                }
            } else {
                throw new EasyException("头像文件不存在");
            }
        }
        throw new EasyException("获取头像路径失败");
    }

    @Override
    public boolean saveUserInfo(SysUser sysUser) {
        if (sysUser != null) {
            SysUser currentUser = ShiroUtil.getCurrentUser();
            sysUser.setId(currentUser.getId());
            sysUser = sysUserService.saveData(sysUser, false);
            // 保存成功后更新redis中的用户信息
            currentUser.setNickname(sysUser.getNickname());
            currentUser.setSex(sysUser.getSex());
            currentUser.setEmail(sysUser.getEmail());
            currentUser.setPhone(sysUser.getPhone());
            currentUser.setBirthday(sysUser.getBirthday());
            ShiroUtil.setCurrentUser(currentUser);
            return true;
        } else {
            throw new EasyException(ExceptionEnum.FAILED_TO_GET_DATA);
        }
    }

    @Override
    public boolean saveUserSetting(SysUserSetting setting) {
        return false;
    }
}
