package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.util.StrUtil;
import cn.hutool.extra.mail.MailUtil;
import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.common.constant.MailConst;
import com.frame.easy.core.mail.MailTemplate;
import com.frame.easy.exception.EasyException;
import com.frame.easy.modular.sys.model.SysMailVerifies;
import com.frame.easy.modular.sys.service.SysMailVerifiesService;
import com.frame.easy.modular.sys.service.SysUserRetrievePasswordService;
import com.frame.easy.modular.sys.service.SysUserService;
import com.frame.easy.util.SysConfigUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 找回密码
 *
 * @author tengchong
 * @date 2019-03-28
 */
@Service
public class SysUserRetrievePasswordServiceImpl implements SysUserRetrievePasswordService {

    @Autowired
    private SysUserService sysUserService;

    @Autowired
    private SysMailVerifiesService sysMailVerifiesService;

    @Override
    public boolean sendMail(String username, String mail) {
        if (StrUtil.isNotBlank(username)) {
            String userMail = sysUserService.getSysUserMailByUserName(username);
            if (StrUtil.isNotBlank(userMail) && userMail.equals(mail)) {
                SysMailVerifies sysMailVerifies = sysMailVerifiesService.save(username, mail, MailConst.MAIL_BINDING_MAIL);
                if (sysMailVerifies != null) {
                    String url = CommonConst.projectProperties.getProjectUrl() + "/sys/mail/verifies/" + sysMailVerifies.getCode();
                    String hideUsername = StrUtil.hide(username, 1, username.length() - 1);
                    String content = "<b>尊敬的" + hideUsername + "您好：</b>\n" +
                            "<br><br>\n" +
                            "感谢您使用\n" +
                            "<a href=\"" + CommonConst.projectProperties.getProjectUrl() + "\" target=\"_blank\" rel=\"noopener\">\n" +
                            "    " + SysConfigUtil.getProjectName() + "\n" +
                            "</a>\n" +
                            "<br><br>\n" +
                            "我们已经收到了您的重置密码申请，请于24小时内点击下方链接进行重置密码\n" +
                            "<a href=\"" + url + "\" target=\"_blank\" rel=\"noopener\">\n" + url + "</a>\n";
                    MailUtil.sendHtml(mail, "账号" + hideUsername + "密码重置", MailTemplate.applicationBindingMail(content));
                    return true;
                }
                throw new EasyException("获取重置信息失败，请稍后重试");
            }
            throw new EasyException("用户名与邮箱不匹配");
        } else {
            throw new EasyException("获取用户名失败");
        }
    }

    @Override
    public boolean verifiesCode(String username, String code) {
        if (StrUtil.isNotBlank(username) && StrUtil.isNotBlank(code)) {
            return sysMailVerifiesService.verifiesData(username, code);
        }
        throw new EasyException("获取用户名或校验码失败");
    }

    @Override
    public boolean resetPassword(String username, String code, String password) {
        if (StrUtil.isNotBlank(username) && StrUtil.isNotBlank(code)) {
            if (sysMailVerifiesService.verifiesData(username, code)) {
                boolean isSuccess = sysUserService.resetPassword(username, password);
                if (isSuccess) {
                    sysMailVerifiesService.remove(code);
                    return true;
                } else {
                    throw new EasyException("更新密码失败，请稍后重试");
                }
            }
        }
        throw new EasyException("获取用户名或校验码失败");
    }

}
