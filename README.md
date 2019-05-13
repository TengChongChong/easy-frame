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

### 项目特点
1. 权限配置到具体方法
2. Beetl封装常用标签（/easy-app/src/main/webapp/view/common/tags）
3. 集群定时任务
4. 全局异常处理
5. 数据导入验证/在线编辑
6. 拖拽式生成CRUD后端代码以及前端资源
![代码生成](https://images.gitee.com/uploads/images/2019/0513/124457_07fcef0f_74191.gif "video.gif")

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
![登录](https://images.gitee.com/uploads/images/2019/0513/124414_16a2efc1_74191.png "登录页面.png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0513/125601_09cd39e3_74191.png "菜单管理.png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0513/125611_5dd2c572_74191.png "系统参数.png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0513/125621_c7841a83_74191.png "机构管理.png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0513/125629_e15523c0_74191.png "机构管理-详情.png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0513/125638_51cf77f5_74191.png "缓存监控.png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0513/125646_ce9d7000_74191.png "异常日志.png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0513/125654_2ee87db6_74191.png "异常详情.png")
### 如有帮助请star

### QQ群
760730508

### 版权声明
您可以随意下载，学习，或商业使用，但禁止二次包装出售。

### 使用说明
待完善

