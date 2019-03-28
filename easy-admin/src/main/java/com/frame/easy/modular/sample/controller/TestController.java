package com.frame.easy.modular.sample.controller;

import cn.hutool.extra.mail.MailUtil;
import com.frame.easy.result.Tips;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 测试类
 * @author tengchong
 */
@Controller
public class TestController {

//    @Autowired
//    private TestService service;

    @RequestMapping(value="/test")
    @ResponseBody
//    @RequiresPermissions("permission:test")
    public Object testException(){
//        throw new EasyException("测试出错");
        String content = "<table width=\"650\" bgcolor=\"#ffffff\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
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
                "                                            <img src=\"http://47.99.218.99/easy-frame/static/app/media/img/logos/logo-dark.png\"\n" +
                "                                                 style=\"width: 50px;height: auto;border: 0;\">\n" +
                "                                        </a>\n" +
                "                                    </td>\n" +
                "                                    <td bgcolor=\"#FFFFFF\" align=\"left\" valign=\"middle\">\n" +
                "                                        <h3 style=\"color: #888\">EasyFrame</h3>\n" +
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
                "</table>\n" +
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
                "                        <b>尊敬的*冲您好：</b>\n" +
                "                        <br><br>\n" +
                "                        感谢您使用\n" +
                "                        <a href=\"http://47.99.218.99/easy-frame\" target=\"_blank\" rel=\"noopener\">\n" +
                "                            EasyFrame\n" +
                "                        </a>\n" +
                "                        <br><br>\n" +
                "                        我们已经收到了您的密保邮箱申请，请点击下方链接进行邮箱验证\n" +
                "                        <a href=\"http://47.99.218.99/easy-frame/sys/mail/verifiesdqzfhctyfqvfhkjjdenlkqnkijjzujzoftmefchtgcinldpbiywkexrrwutatvwwyqnsbiklcwiihpfjehkbuwyjcomdkglnobjnfqtdladhxsdtievthkjkexsmfkfabmujerifuozbitnkhxebxlhdfoninwoyercjvnyeyzthcdattwywrzttquwwxxlaeaqxaisskdpkfvixcaivrcvwyctqfexbceahbjawzrdnhgeimigirgexvuslnjw\" target=\"_blank\" rel=\"noopener\">\n" +
                "                            http://47.99.218.99/easy-frame/sys/mail/verifies/dqzfhctyfqvfhkjjdenlkqnkijjzujzoftmefchtgcinldpbiywkexrrwutatvwwyqnsbiklcwiihpfjehkbuwyjcomdkglnobjnfqtdladhxsdtievthkjkexsmfkfabmujerifuozbitnkhxebxlhdfoninwoyercjvnyeyzthcdattwywrzttquwwxxlaeaqxaisskdpkfvixcaivrcvwyctqfexbceahbjawzrdnhgeimigirgexvuslnjw" +
                "                        </a>\n" +
                "                    </td>\n" +
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
                "<table width=\"650\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
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
                "                            <img src=\"http://47.99.218.99/easy-frame/static/app/media/img/icon/icon-warning.png\" width=\"12\"> \n" +
                "                            重要提醒：如果您未申请密保邮箱，请忽略此邮件！</font>\n" +
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
        MailUtil.sendHtml("26172583@qq.com", "密保邮箱申请", content);
        return Tips.getSuccessTips();
    }

}
