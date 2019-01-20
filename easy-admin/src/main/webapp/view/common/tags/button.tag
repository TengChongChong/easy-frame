@/*
    按钮标签

    参数的说明:
    btnType   : 按钮的类型(secondary-白色,primary-蓝色,success-绿色,info-淡蓝色,warning-黄色,danger-红色)
    btnClass  : 自定义class
    click     : 点击按钮所执行的方法
    icon      : 按钮上的图标
    name      : 按钮名称
    role      : 当前登录用户必须属于此角色标识才显示
    permission: 当前登录用户必须拥有此权限标识才显示
@*/

@if(isEmpty(btnType)){
    @btnType = "info";
@}
@if((isEmpty(permission) && isEmpty(role)) || (isNotEmpty(permission) && isEmpty(role) && shiro.hasPermission(permission)) || (isNotEmpty(role) && isEmpty(permission) && shiro.hasRole(role)) || (shiro.hasPermission(permission) && shiro.hasRole(role))){
    <button type="button" class="btn btn-${btnType} ${btnClass!}" onclick="${click!}" id="${id!}">
        @if(isNotEmpty(icon)){
            <i class="${icon}"></i>&nbsp;
        @}
        ${name}
    </button>
@}
