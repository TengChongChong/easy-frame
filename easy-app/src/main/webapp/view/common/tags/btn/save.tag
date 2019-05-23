@/*
    默认保存按钮

    参数的说明:
    role      : 当前登录用户必须属于此角色标识才显示
    permission: 当前登录用户必须拥有此权限标识才显示
@*/
@if((isEmpty(permission) && isEmpty(role)) || (isNotEmpty(permission) && isEmpty(role) && shiro.hasPermission(permission)) || (isNotEmpty(role) && isEmpty(permission) && shiro.hasRole(role)) || (shiro.hasPermission(permission) && shiro.hasRole(role))){
<button type="button" class="btn btn-info btn-save" onclick="KTTool.saveData(this)">
    <span><i class="la la-save"></i> 保存</span>
</button>

@}