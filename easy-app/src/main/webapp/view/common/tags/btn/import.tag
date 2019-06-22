@/*
    默认导出按钮

    属性说明:
    role      : 当前登录用户必须属于此角色标识才显示
    permission: 当前登录用户必须拥有此权限标识才显示
    code      : 模板代码
@*/
@if((isEmpty(permission) && isEmpty(role)) || (isNotEmpty(permission) && isEmpty(role) && shiro.hasPermission(permission)) || (isNotEmpty(role) && isEmpty(permission) && shiro.hasRole(role)) || (shiro.hasPermission(permission) && shiro.hasRole(role))){
<button type="button" class="btn btn-success btn-import" onclick="KTTool.importData('${code}')">
    <i class="la la-cloud-upload"></i> 导入
</button>

@}