package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.lang.Validator;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.common.constant.status.PermissionsStatus;
import com.frame.easy.common.constant.type.PermissionsType;
import com.frame.easy.common.jstree.JsTree;
import com.frame.easy.common.jstree.State;
import com.frame.easy.config.properties.ProjectProperties;
import com.frame.easy.core.exception.ExceptionEnum;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.core.util.ToolUtil;
import com.frame.easy.modular.sys.dao.SysPermissionsMapper;
import com.frame.easy.modular.sys.model.SysPermissions;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.service.SysPermissionsService;
import com.frame.easy.modular.sys.service.SysRolePermissionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * 权限/菜单
 *
 * @author tengchong
 * @date 2018/10/31
 */
@Service
public class SysPermissionsServiceImpl extends ServiceImpl<SysPermissionsMapper, SysPermissions> implements SysPermissionsService {

    @Autowired
    private SysPermissionsMapper mapper;

    @Autowired
    private SysRolePermissionsService sysRolePermissionsService;

    @Autowired
    private ProjectProperties projectProperties;

    /**
     * 根节点id
     */
    private Long baseId = 0L;

    @Override
    public List<JsTree> selectData(Long pId) {
        List<JsTree> jsTrees;
        // 第一次请求,返回项目名称 + 一级菜单 数据
        if (pId == null || pId.equals(baseId)) {
            jsTrees = new ArrayList<>();
            JsTree jsTree = new JsTree();
            // 项目名称
            jsTree.setText(projectProperties.getName());
            jsTree.setId(baseId);
            jsTree.setIcon(CommonConst.DEFAULT_FOLDER_ICON);;
            jsTree.setChildren(mapper.selectData(baseId));
            State state = new State();
            state.setOpened(true);
            jsTree.setState(state);
            jsTrees.add(jsTree);
        } else {
            jsTrees = mapper.selectData(pId);
        }
        return jsTrees;
    }

    @Override
    public List<JsTree> selectAll() {
        List<JsTree> jsTrees = mapper.selectAll(PermissionsStatus.ENABLE.getCode());
        JsTree jsTree = new JsTree();
        State state = new State();
        jsTree.setId(baseId);
        jsTree.setParent("#");
        jsTree.setIcon(CommonConst.DEFAULT_FOLDER_ICON);;
        jsTree.setText(projectProperties.getName());
        state.setOpened(true);
        jsTree.setState(state);
        jsTrees.add(jsTree);
        return jsTrees;
    }

    @Override
    public SysPermissions input(Long id) {
        SysPermissions sysPermissions;
        // 表示点击的是根目录
        if (id == null || id.equals(baseId)) {
            sysPermissions = new SysPermissions();
            sysPermissions.setId(baseId);
            sysPermissions.setLevels(1);
            sysPermissions.setName(projectProperties.getName());
        } else {
            sysPermissions = mapper.selectInfo(id);
            if (sysPermissions != null && sysPermissions.getpId().equals(baseId)) {
                sysPermissions.setpName(projectProperties.getName());
            }
        }
        if (Validator.isEmpty(sysPermissions.getIcon())) {
            sysPermissions.setIcon(JsTree.DEFAULT_ICON);
        }
        return sysPermissions;
    }

    @Override
    public SysPermissions add(Long pId) {
        if (pId != null) {
            SysPermissions sysPermissions = new SysPermissions();
            sysPermissions.setpId(pId);
            sysPermissions.setStatus(PermissionsStatus.ENABLE.getCode());
            sysPermissions.setType(PermissionsType.ENABLE.getCode());
            if (baseId.equals(pId)) {
                sysPermissions.setLevels(1);
                sysPermissions.setpName(projectProperties.getName());
            } else {
                SysPermissions parentSysPermissions = mapper.selectInfo(pId);
                if (parentSysPermissions != null && parentSysPermissions.getLevels() != null) {
                    sysPermissions.setLevels(parentSysPermissions.getLevels() + 1);
                    sysPermissions.setpName(parentSysPermissions.getName());
                    // 父权限标识
                    sysPermissions.setpCode(parentSysPermissions.getCode());
                } else {
                    throw new RuntimeException("获取父权限等级失败，请重试！");
                }
            }
            sysPermissions.setIcon(JsTree.DEFAULT_ICON);
            return sysPermissions;
        } else {
            throw new RuntimeException("获取父权限信息失败，请重试！");
        }
    }

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean delete(Long id) {
        ToolUtil.checkParams(id);
        // 检查是否有子权限
        QueryWrapper<SysPermissions> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("p_id", id);
        int count = count(queryWrapper);
        if(count > 0){
            throw new RuntimeException(ExceptionEnum.EXIST_CHILD.getMessage());
        }
        boolean isSuccess = removeById(id);
        if(isSuccess){
            // 同时删除已分配的权限
            sysRolePermissionsService.deleteRolePermissions(String.valueOf(id));
        }

        return ToolUtil.checkResult(isSuccess);
    }

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean batchDelete(String ids) {
        ToolUtil.checkParams(ids);
        // 检查是否有子权限
        QueryWrapper<SysPermissions> queryWrapper = new QueryWrapper<>();
        queryWrapper.in("p_id", ids.split(CommonConst.SPLIT));
        int count = count(queryWrapper);
        if(count > 0){
            throw new RuntimeException(ExceptionEnum.EXIST_CHILD.getMessage());
        }
        List<String> idList = Arrays.asList(ids.split(CommonConst.SPLIT));
        boolean isSuccess = removeByIds(idList);
        if(isSuccess){
            // 同时删除已分配的权限
            sysRolePermissionsService.deleteRolePermissions(ids);
        }
        return ToolUtil.checkResult(isSuccess);
    }

    @Override
    public boolean setStatus(String ids, Integer status) {
        ToolUtil.checkParams(ids);
        ToolUtil.checkParams(status);
        List<SysPermissions> permissionsList = new ArrayList<>();
        SysPermissions sysPermissions;
        for (String id : ids.split(CommonConst.SPLIT)) {
            sysPermissions = new SysPermissions();
            sysPermissions.setId(Long.parseLong(id));
            sysPermissions.setStatus(status);
            permissionsList.add(sysPermissions);
        }
        return ToolUtil.checkResult(updateBatchById(permissionsList));
    }

    @Override
    public List<SysPermissions> copyNode(String nodeIds, Long targetId) {
        ToolUtil.checkParams(nodeIds);
        ToolUtil.checkParams(targetId);
        // 查询复制的节点
        List<SysPermissions> copyPermissions = mapper.selectBatchIds(Arrays.asList(nodeIds.split(CommonConst.SPLIT)));
        if (copyPermissions != null && copyPermissions.size() > 0) {
            SysPermissions parentPermission = getById(targetId);
            // 目标节点存在
            if (parentPermission != null) {
                int maxOrderNo = mapper.getMaxOrderNo(targetId);
                List<SysPermissions> sysPermissionsList = new ArrayList<>();
                SysPermissions sysPermissions;
                for (SysPermissions permission : copyPermissions) {
                    sysPermissions = new SysPermissions();
                    maxOrderNo++;
                    sysPermissions.setOrderNo(maxOrderNo);
                    sysPermissions.setIcon(permission.getIcon());
                    sysPermissions.setType(permission.getType());
                    sysPermissions.setTips(permission.getTips());
                    sysPermissions.setName(permission.getName());
                    sysPermissions.setStatus(permission.getStatus());
                    sysPermissions.setColor(permission.getColor());
                    sysPermissions.setUrl(permission.getUrl());
                    sysPermissions.setLevels(parentPermission.getLevels() + 1);
                    sysPermissions.setpId(parentPermission.getId());
                    if(Validator.isNotEmpty(permission.getCode())){
                        try {
                            // code默认为 父code + 最后一个:后面的字符
                            String pCode = parentPermission.getCode();
                            if(pCode.endsWith(":list")){
                                pCode = pCode.substring(0, pCode.indexOf(":list"));
                            }
                            if(pCode.endsWith(":view")){
                                pCode = pCode.substring(0, pCode.indexOf(":view"));
                            }
                            sysPermissions.setCode(pCode +
                                    permission.getCode().substring(permission.getCode().lastIndexOf(":")));
                        } catch (Exception e) {
                            sysPermissions.setCode(permission.getCode());
                        }
                    }
                    SysUser sysUser = ShiroUtil.getCurrentUser();
                    sysPermissions.setCreateUser(sysUser.getId());
                    sysPermissions.setEditUser(sysUser.getId());
                    sysPermissions.setCreateDate(new Date());
                    sysPermissions.setEditDate(new Date());
                    sysPermissionsList.add(sysPermissions);
                }
                saveBatch(sysPermissionsList);
                return sysPermissionsList;
            }
        }
        return null;
    }

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public SysPermissions saveData(SysPermissions object) {
        ToolUtil.checkParams(object);
        SysUser sysUser = ShiroUtil.getCurrentUser();
        if (object.getId() == null) {
            object.setCreateDate(new Date());
            object.setCreateUser(sysUser.getId());
        }
        object.setEditDate(new Date());
        object.setEditUser(sysUser.getId());
        if (Validator.isEmpty(object.getIcon())) {
            object.setIcon(JsTree.DEFAULT_ICON);
        }
        if (object.getOrderNo() == null) {
            object.setOrderNo(mapper.getMaxOrderNo(object.getpId()) + 1);
        }

        return (SysPermissions) ToolUtil.checkResult(saveOrUpdate(object), object);
    }

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean move(Long id, Long parent, Long oldParent, Integer position, Integer oldPosition) {
        if (Validator.isNotEmpty(id) && Validator.isNotEmpty(parent) && Validator.isNotEmpty(oldParent) &&
                Validator.isNotEmpty(position) && Validator.isNotEmpty(oldPosition)) {
            boolean isSuccess;
            // 没有改变所属节点,内部排序
            if (parent.equals(oldParent)) {
                // 拖动影响节点顺序的开始序号
                int str = Math.min(position, oldPosition);
                // 拖动影响顺序节点数量
                int length = Math.abs(position - oldPosition) + 1;
                List<SysPermissions> oldSysPermissions = mapper.selectOrderInfo(parent, str, length);
                List<SysPermissions> newSysPermissions = new ArrayList<>();
                // 是否需要偏移
                boolean needDeviation = false;
                // 偏移量
                int deviation;
                if (position > oldPosition) {
                    deviation = -1;
                } else {
                    deviation = 1;
                }
                for (int i = 0; i < oldSysPermissions.size(); i++) {
                    if ((i + str) == position) {
                        newSysPermissions.add(new SysPermissions(id, oldSysPermissions.get(i).getOrderNo()));
                        newSysPermissions.add(new SysPermissions(oldSysPermissions.get(i).getId(), oldSysPermissions.get(i + deviation).getOrderNo()));
                        needDeviation = true;
                    } else {
                        if ((i + str) == oldPosition) {
                            needDeviation = true;
                        }
                        if (!id.equals(oldSysPermissions.get(i).getId())) {
                            newSysPermissions.add(new SysPermissions(oldSysPermissions.get(i).getId(), oldSysPermissions.get(i + (needDeviation ? deviation : 0)).getOrderNo()));
                        }
                    }
                }
                isSuccess = updateBatchById(newSysPermissions);
            } else {
                List<SysPermissions> oldSysPermissions = mapper.selectOrderInfo(parent, null, null);
                List<SysPermissions> newSysPermissions = new ArrayList<>();
                // 是否需要偏移
                boolean needDeviation = false;
                // 偏移量
                int deviation = 1;
                // 放到了最后一个
                if (position == oldSysPermissions.size()) {
                    if (oldSysPermissions.size() == 0) {
                        newSysPermissions.add(new SysPermissions(id, parent, 1));
                    } else {
                        newSysPermissions.add(new SysPermissions(id, parent, oldSysPermissions.get(oldSysPermissions.size() - 1).getOrderNo() + 1));
                    }
                } else {
                    for (int i = 0; i < oldSysPermissions.size(); i++) {
                        if (i == position) {
                            newSysPermissions.add(new SysPermissions(id, parent, oldSysPermissions.get(i).getOrderNo()));
                            newSysPermissions.add(new SysPermissions(oldSysPermissions.get(i).getId(), oldSysPermissions.get(i).getOrderNo() + 1));
                            needDeviation = true;
                        } else {
                            newSysPermissions.add(new SysPermissions(oldSysPermissions.get(i).getId(), oldSysPermissions.get(i).getOrderNo() + (needDeviation ? deviation : 0)));
                        }
                    }
                }
                isSuccess = updateBatchById(newSysPermissions);
                if (isSuccess) {
                    // 更改菜单等级
                    updateMenuLevels(parent, id);
                }
            }
            return isSuccess;
        } else {
            throw new RuntimeException(ExceptionEnum.FAILED_TO_GET_DATA.getMessage());
        }
    }

    /**
     * 更改菜单等级
     * @param parent
     * @param id
     */
    private void updateMenuLevels(Long parent, Long id){
        int parentLev;
        if (parent == 1) {
            parentLev = 0;
        } else {
            parentLev = mapper.selectById(parent).getLevels();
        }
        SysPermissions movePermission = mapper.selectById(id);
        if (parentLev != movePermission.getLevels() - 1) {
            mapper.updateLevels(parentLev + 1, id);
        }
    }

    @Override
    public List<JsTree> search(String title) {
        if (Validator.isNotEmpty(title)) {
            return mapper.search("%" + title + "%");
        } else {
            throw new RuntimeException("请输入关键字后重试！");
        }
    }
}
