<p align="center">
    <p align="center">
        Easy Frame基于Springboot2、Druid、Mybatis Plus、Shiro、Beetl、Quartz等开源框架开发，内置权限、部门、参数、字典、定时任务、代码生成等模块。分模块、代码简洁、注释详细。Mysql已测试其他数据库待功能开发完成后逐步测试
        <br>      
        <br>
        <a href="https://getbootstrap.com">
            <img src="https://img.shields.io/badge/Bootstrap-4-blue.svg" alt="bootstrap">
        </a> 
        <a href="https://spring.io/projects/spring-boot">
            <img src="https://img.shields.io/badge/SpringBoot-2.1.1-green.svg" alt="spring-boot">
        </a>
        <a href="https://github.com/alibaba/druid">
            <img src="https://img.shields.io/badge/Druid-1.1.10-red.svg" alt="druid">
        </a>
        <a href="http://mp.baomidou.com">
            <img src="https://img.shields.io/badge/MybatisPlus-3.1.0-yellowgreen.svg" alt="mybatis-plus">
        </a>  
        <a href="https://shiro.apache.org">
            <img src="https://img.shields.io/badge/Shiro-1.4.0-brightgreen.svg" alt="shiro">
        </a>
        <a href="http://ibeetl.com">
            <img src="https://img.shields.io/badge/beetl-2.9.10-orange.svg" alt="beetl">
        </a>
    </p>
</p>

### 演示地址
>地址:http://www.easy-frame.top/easy-frame
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
├─easy-core      公共模块
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
8. 文档待大部分功能开发完成后会逐步完善...

### 安装教程
#### 数据库
1. 新建数据库
2. 导入数据库脚本 执行 `/easy-frame/db/easy-frame.sql`、`/easy-frame/db/quartz.sql`
3. 修改 `/easy-frame/easy-app/src/main/resources/application-dev.yml` 中以下配置
```yml
spring:
  datasource:
      dynamic:
          datasource:
              master:
                  # 驱动类
                  driver-class-name: com.mysql.cj.jdbc.Driver
                  # url
                  url: jdbc:mysql://localhost:3306/easy-frame?useUnicode=true&characterEncoding=utf-8&useSSL=false&allowMulQueries=true&allowMultiQueries=true&serverTimezone=Asia/Shanghai
                  # 用户名
                  username: root
                  # 密码
                  password: 123456
```
::: tip
集成了多数据源，所以数据源配置中有 `dynamic.datasource.master`
:::
#### Redis
1. 安装Redis
3. 修改 `/easy-frame/easy-app/src/main/resources/application-dev.yml` 中以下配置
```yml
spring:
    redis:
        # Redis数据库索引（默认为0）
        database: 0
        # Redis服务器地址
        host: 127.0.0.1
        # Redis服务器连接端口MybatisPlusConfig
        port: 6379
        # Redis服务器连接密码（默认为空）
        password:
```
#### 文件上传目录
```yml
project:
    # 文件上传路径(不要写以~开头的路径会导致无法访问)
    file-upload-path: /Users/tengchong/Development/upload/easy-frame
```
#### 启动
1. 执行 `com.frame.easy.Application`
2. 启动成功后访问[http://127.0.0.1:9080](http://127.0.0.1:9080 "访问地址") 默认账号/密码 `admin/123`

### 技术架构
#### 后端
##### 主框架
1. SpringBoot
2. Apache Shiro
##### 持久层
1. Alibaba Druid
2. MyBatis Plus
##### 模板引擎
1. Beetl
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
![输入图片说明](https://images.gitee.com/uploads/images/2019/0620/231235_9f16bd53_74191.png "huaban (9).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0625/221353_d4769024_74191.png "huaban (10).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0620/231304_d7705be0_74191.png "huaban (8).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0620/231317_1555f7f6_74191.png "huaban (7).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0620/231325_57b5fcd7_74191.png "huaban (6).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0605/115436_52eeedfb_74191.png "huaban (2).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0529/110942_5221382f_74191.png "huaban (1).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0529/110953_7faa5cef_74191.png "huaban (3).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0611/132304_25b9dfb1_74191.png "huaban (3).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0529/111011_09d9dec2_74191.png "huaban (5).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0529/111019_6719c63d_74191.png "huaban (6).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0529/111027_0ada2520_74191.png "huaban (7).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0529/111034_f6817b23_74191.png "huaban (8).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0529/111043_60eed999_74191.png "huaban (9).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0605/115502_f8449930_74191.png "huaban (3).png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0605/115526_aaf7ac41_74191.png "huaban (4).png")
### 如有帮助请star

### QQ群
760730508

### 版权声明
您可以随意下载，学习，或商业使用，但禁止二次包装出售。