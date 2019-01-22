package com.frame.easy.common.constant.type;

/**
 * 权限类型
 *
 * @author tengchong
 * @date 2018/10/31
 **/
public enum PermissionsType {
    // 菜单
    ENABLE(1, "菜单"),
    // 权限
    DISABLE(2, "权限");

    int code;
    String message;

    PermissionsType(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

}
