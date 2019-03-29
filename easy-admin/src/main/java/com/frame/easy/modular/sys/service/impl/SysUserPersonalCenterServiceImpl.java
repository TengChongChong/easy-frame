package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.util.StrUtil;
import cn.hutool.extra.mail.MailUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.common.constant.MailConst;
import com.frame.easy.core.mail.MailTemplate;
import com.frame.easy.exception.EasyException;
import com.frame.easy.exception.ExceptionEnum;
import com.frame.easy.modular.sys.dao.SysUserMapper;
import com.frame.easy.modular.sys.model.SysMailVerifies;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.model.SysUserSetting;
import com.frame.easy.modular.sys.service.SysMailVerifiesService;
import com.frame.easy.modular.sys.service.SysUserPersonalCenterService;
import com.frame.easy.modular.sys.service.SysUserService;
import com.frame.easy.util.SysConfigUtil;
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

    @Autowired
    private SysUserMapper sysUserMapper;

    @Autowired
    private SysMailVerifiesService sysMailVerifiesService;

    @Override
    public SysUser getCurrentUser() {
        SysUser sysUser = ShiroUtil.getCurrentUser();
        if (sysUser != null) {
            // 由于密保邮箱&手机可能会发生变动,这里重新从数据库查询
            QueryWrapper<SysUser> queryWrapper = new QueryWrapper<>();
            queryWrapper.select("email", "phone");
            queryWrapper.eq("id", sysUser.getId());
            SysUser queryResult = sysUserMapper.selectOne(queryWrapper);
            if (queryResult != null) {
                sysUser.setPhone(queryResult.getPhone());
                sysUser.setEmail(queryResult.getEmail());
            }
            // 如果数据库中email也为空,查询是否有待验证url
            String mail = sysMailVerifiesService.getMailByUserId(sysUser.getId());
            if (StrUtil.isNotBlank(mail)) {
                sysUser.setEmail(mail);
                sysUser.setMailIsVerifies(false);
            }
        }
        return sysUser;
    }

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
                    if (StrUtil.isNotBlank(oldAvatar)) {
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
                    return url;
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
    public boolean applicationBindingMail(String mail) {
        if (StrUtil.isNotBlank(mail)) {
            SysUser currentUser = ShiroUtil.getCurrentUser();
            SysMailVerifies sysMailVerifies = sysMailVerifiesService.save(String.valueOf(currentUser.getId()), mail, MailConst.MAIL_BINDING_MAIL);
            if (sysMailVerifies != null) {
                String url = CommonConst.projectProperties.getProjectUrl() + "/sys/mail/verifies/" + sysMailVerifies.getCode();
                String hideUsername = StrUtil.hide(currentUser.getUsername(), 1, currentUser.getUsername().length() - 1);
                String content = "<b>尊敬的" + hideUsername + "您好：</b>\n" +
                        "<br><br>\n" +
                        "感谢您使用\n" +
                        "<a href=\"" + CommonConst.projectProperties.getProjectUrl() + "\" target=\"_blank\" rel=\"noopener\">\n" +
                        "    " + SysConfigUtil.getProjectName() + "\n" +
                        "</a>\n" +
                        "<br><br>\n" +
                        "我们已经收到了您的密保邮箱申请，请于24小时内点击下方链接进行邮箱验证\n" +
                        "<a href=\"" + url + "\" target=\"_blank\" rel=\"noopener\">\n" + url + "</a>\n";
                MailUtil.sendHtml(mail, "账号" + hideUsername + "密保邮箱验证", MailTemplate.applicationBindingMail(content));
                return true;
            }
        } else {
            throw new EasyException("获取邮箱信息失败");
        }
        return false;
    }

    @Override
    public boolean saveUserSetting(SysUserSetting setting) {
        return false;
    }
}
