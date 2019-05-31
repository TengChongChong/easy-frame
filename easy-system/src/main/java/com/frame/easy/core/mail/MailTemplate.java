package com.frame.easy.core.mail;

import com.frame.easy.common.constant.SysConst;
import com.frame.easy.config.properties.ProjectProperties;
import com.frame.easy.util.SysConfigUtil;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 邮件模板
 *
 * @author tengchong
 * @date 2019-03-26
 */
public class MailTemplate {

    /**
     * 申请密保邮箱
     *
     * @param content 内容
     * @return html
     */
    public static String applicationBindingMail(String content) {
        return header() +
                "<table class=\"font\" width=\"650\" align=\"center\" bgcolor=\"#ffffff\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"\n" +
                "       style=\"font-family: Arial, sans-serif;border-collapse: collapse;\">\n" +
                "    <tbody>\n" +
                "    <tr>\n" +
                "        <td width=\"30\"></td>\n" +
                "        <td>\n" +
                "            <table width=\"590\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "                <tbody>\n" +
                "                <tr>\n" +
                "                    <td height=\"10\"></td>\n" +
                "                </tr>\n" +
                "                <tr>\n" +
                "                    <td width=\"590\" style=\"border-collapse: collapse;font-size:13px;line-height: 18px;word-break: break-word;\">\n" +
                "                    " + content + "</td>\n" +
                "                </tr>\n" +
                "                <tr>\n" +
                "                    <td height=\"15\"></td>\n" +
                "                </tr>\n" +
                "                </tbody>\n" +
                "            </table>\n" +
                "        </td>\n" +
                "        <td width=\"30\"></td>\n" +
                "    </tr>\n" +
                "    </tbody>\n" +
                "</table>\n" +
                footer("如果您未申请密保邮箱");
    }
    /**
     * 发送重置密码验证码
     *
     * @param content 内容
     * @return html
     */
    public static String sendResetPasswordMail(String content) {
        return header() +
                "<table class=\"font\" width=\"650\" align=\"center\" bgcolor=\"#ffffff\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"\n" +
                "       style=\"font-family: Arial, sans-serif;border-collapse: collapse;\">\n" +
                "    <tbody>\n" +
                "    <tr>\n" +
                "        <td width=\"30\"></td>\n" +
                "        <td>\n" +
                "            <table width=\"590\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "                <tbody>\n" +
                "                <tr>\n" +
                "                    <td height=\"10\"></td>\n" +
                "                </tr>\n" +
                "                <tr>\n" +
                "                    <td width=\"590\" style=\"border-collapse: collapse;font-size:13px;line-height: 18px;word-break: break-word;\">\n" +
                "                    " + content + "</td>\n" +
                "                </tr>\n" +
                "                <tr>\n" +
                "                    <td height=\"15\"></td>\n" +
                "                </tr>\n" +
                "                </tbody>\n" +
                "            </table>\n" +
                "        </td>\n" +
                "        <td width=\"30\"></td>\n" +
                "    </tr>\n" +
                "    </tbody>\n" +
                "</table>\n" +
                footer("如果您未申请重置密码");
    }

    /**
     * 获取邮件公用头部
     *
     * @return html
     */
    public static String header() {
        return "<table width=\"650\" bgcolor=\"#fff\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "    <tbody>\n" +
                "    <tr>\n" +
                "        <td width=\"30\"></td>\n" +
                "        <td width=\"590\">\n" +
                "            <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "                <tbody>\n" +
                "                <tr>\n" +
                "                    <td>\n" +
                "                        <div style=\"border-bottom: 1px solid #f3f3f3;padding-bottom: 7px;\">\n" +
                "                            <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "                                <tbody>\n" +
                "                                <tr>\n" +
                "                                    <td width=\"60\" align=\"left\" valign=\"middle\" class=\"img-wrapper\">\n" +
                "                                        <a href=\"\" rel=\"noopener\" target=\"_blank\">\n" +
                "                                            <img src=\"" + SysConst.projectProperties.getProjectUrl() + "/static/media/logos/logo-dark.png\"\n" +
                "                                                 style=\"width: 50px;height: auto;border: 0;\">\n" +
                "                                        </a>\n" +
                "                                    </td>\n" +
                "                                    <td bgcolor=\"#fff\" align=\"left\" valign=\"middle\">\n" +
                "                                        <h3 style=\"color: #888\">" + SysConfigUtil.getProjectName() + "</h3>\n" +
                "                                    </td>\n" +
                "                                </tr>\n" +
                "                                </tbody>\n" +
                "                            </table>\n" +
                "                        </div>\n" +
                "                    </td>\n" +
                "                </tr>\n" +
                "                <tr>\n" +
                "                    <td height=\"8\"></td>\n" +
                "                </tr>\n" +
                "                <tr>\n" +
                "                    <td height=\"20\"></td>\n" +
                "                </tr>\n" +
                "                </tbody>\n" +
                "            </table>\n" +
                "        </td>\n" +
                "        <td width=\"30\"></td>\n" +
                "    </tr>\n" +
                "    </tbody>\n" +
                "</table>\n";
    }

    /**
     * 获取邮件底部头
     *
     * @param tip 提示文字
     * @return html
     */
    public static String footer(String tip) {
        return "<table width=\"650\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "    <tbody>\n" +
                "    <tr>\n" +
                "        <td width=\"30\"></td>\n" +
                "        <td width=\"590\">\n" +
                "            <table align=\"center\" width=\"590\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n" +
                "                <tbody>\n" +
                "                <tr>\n" +
                "                    <td height=\"20\"></td>\n" +
                "                </tr>\n" +
                "                <tr>\n" +
                "                    <td align=\"left\" style=\"padding-top:6px;padding-button:2px;\">\n" +
                "                        <font style=\"font-size:12px; line-height:22px\" color=\"#5b5b5b\">\n" +
                "                            <img src=\"" + SysConst.projectProperties.getProjectUrl() + "/static/media/error/icon-warning.png\" width=\"12\">&nbsp;\n" +
                "                            重要提醒：" + tip + "，请忽略此邮件！</font>\n" +
                "                    </td>\n" +
                "                </tr>\n" +
                "                <tr>\n" +
                "                    <td height=\"20\"></td>\n" +
                "                </tr>\n" +
                "                </tbody>\n" +
                "            </table>\n" +
                "        </td>\n" +
                "        <td width=\"30\"></td>\n" +
                "    </tr>\n" +
                "    </tbody>\n" +
                "</table>";
    }

    @Autowired
    public void setProjectProperties(ProjectProperties projectProperties) {
        projectProperties = projectProperties;
    }
}
