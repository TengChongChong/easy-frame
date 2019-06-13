<p align="center">
    <p align="center">
        Easy Frame基于Springboot2、Druid、Mybatis Plus、Shiro、Beetl、Quartz等开源框架开发，内置权限、部门、参数、字典、定时任务、代码生成等模块。分模块、代码简洁、注释详细。目前处于开发阶段，Mysql已测试其他数据库待功能开发完成后逐步测试
        <br>      
        <br>
        <a href="https://getbootstrap.com">
            <img src="https://img.shields.io/badge/Bootstrap-4-blue.svg" alt="bootstrap">
        </a> 
        <a href="https://spring.io/projects/spring-boot">
            <img src="https://img.shields.io/badge/spring--boot-2.1.1-green.svg" alt="spring-boot">
        </a>
        <a href="https://github.com/alibaba/druid">
            <img src="https://img.shields.io/badge/druid-1.1.10-red.svg" alt="druid">
        </a>
        <a href="http://mp.baomidou.com">
            <img src="https://img.shields.io/badge/mybatis--plus-3.1.0-yellowgreen.svg" alt="mybatis-plus">
        </a>  
        <a href="https://shiro.apache.org">
            <img src="https://img.shields.io/badge/shiro-1.4.0-brightgreen.svg" alt="shiro">
        </a>
        <a href="http://ibeetl.com">
            <img src="https://img.shields.io/badge/beetl-2.8.5-orange.svg" alt="beetl">
        </a>
    </p>
</p>

### 演示地址
>地址:http://47.99.218.99/easy-frame
账号:admin
密码:123

>为方便演示，已开放最大权限，请勿删除/修改已有菜单&角色&部门信息，感谢

>服务器1M带宽，第一次访问速度比较慢。后期会优化js/css资源提高页面加载速度*
---
### 项目结构
```
├─db             数据库
│
├─easy-app       项目入口
│
├─easy-business  业务（空模块）
│
├─easy-core      公共代码
│
├─easy-generator 代码生成
│
├─easy-sample    示例
│
├─easy-scheduler 定时任务
│
├─easy-system    系统
│  
└─pom.xml
```
### 项目特点
1. 权限配置到具体方法
2. Beetl封装常用标签（/easy-app/src/main/webapp/view/common/tags）
3. 集群定时任务
4. 全局异常处理
5. 数据导入验证/在线编辑
6. js提供公用的增删改查以及常用的工具方法
7. 拖拽式生成CRUD后端代码以及前端资源，预设偏好设置自动匹配元素类型、是否会被搜索、一般不显示哪些字段、匹配方式、一般不填写哪些字段等；并根据字段类型匹配元素类型
![输入图片说明](https://images.gitee.com/uploads/images/2019/0529/111723_a8b1e58c_74191.gif "video.gif")
8. 文档待大部分功能开发完成后会逐步完善...

### 安装教程
1. 执行/db/init.sql
2. 修改/easy-app/src/main/resources/application-dev.yml中数据库/redis配置

### 账号
用户名: admin
密  码: 123

### 技术架构
#### 后端
##### 主框架
1. SpringBoot
2. Apache Shiro
##### 持久层
1. Alibaba Druid
2. MyBatis Plus
##### 缓存
1. Redis
##### 工具
1. HuTool
##### 其他
1. Mybatis Plus Generator 
2. Swagger2
3. Spring Boot Actuator
#### 前端
1. BootStrap
2. jQuery
3. jQuery BlockUI
4. jQuery Validation
5. Bootstrap Select
6. ...

### 预览图
![输入图片说明](https://images.gitee.com/uploads/images/2019/0529/110859_5838e3c0_74191.png "huaban (2).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0605/115436_52eeedfb_74191.png "huaban (2).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0529/110942_5221382f_74191.png "huaban (1).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0529/110953_7faa5cef_74191.png "huaban (3).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0611/132304_25b9dfb1_74191.png "huaban (3).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0529/111011_09d9dec2_74191.png "huaban (5).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0529/111019_6719c63d_74191.png "huaban (6).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0529/111027_0ada2520_74191.png "huaban (7).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0529/111034_f6817b23_74191.png "huaban (8).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0529/111043_60eed999_74191.png "huaban (9).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0529/111049_afa66704_74191.png "huaban (10).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0605/115502_f8449930_74191.png "huaban (3).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0605/115526_aaf7ac41_74191.png "huaban (4).png")
### 如有帮助请star

### QQ群
760730508

### 版权声明
您可以随意下载，学习，或商业使用，但禁止二次包装出售。

### 使用说明
待完善

