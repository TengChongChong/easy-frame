package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.lang.Validator;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.CommonConst;
import com.frame.easy.common.constant.SessionConst;
import com.frame.easy.common.redis.RedisPrefix;
import com.frame.easy.common.status.CommonStatus;
import com.frame.easy.common.jstree.JsTree;
import com.frame.easy.common.jstree.JsTreeUtil;
import com.frame.easy.common.jstree.State;
import com.frame.easy.exception.BusinessException;
import com.frame.easy.exception.ExceptionEnum;
import com.frame.easy.util.RedisUtil;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.util.ToolUtil;
import com.frame.easy.modular.sys.dao.SysRoleMapper;
import com.frame.easy.modular.sys.model.SysRole;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.service.SysDepartmentTypeRoleService;
import com.frame.easy.modular.sys.service.SysRolePermissionsService;
import com.frame.easy.modular.sys.service.SysRoleService;
import com.frame.easy.modular.sys.service.SysUserRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * 角色管理
 *
 * @author tengchong
 * @date 2018/11/2
 */
@Service
public class SysRoleServiceImpl extends ServiceImpl<SysRoleMapper, SysRole> implements SysRoleService {

    @Resource
    private SysRoleMapper mapper;

    @Autowired
    private SysRolePermissionsService sysRolePermissionsService;

    @Autowired
    private SysUserRoleService sysUserRoleService;

    @Autowired
    private SysDepartmentTypeRoleService sysDepartmentTypeRoleService;

    @Override
    public List<JsTree> selectData(Long pId) {
        List<JsTree> jsTrees;
        // 第一次请求,返回项目名称 + 一级角色 数据
        if (pId == null || pId.equals(JsTreeUtil.baseId)) {
            jsTrees = new ArrayList<>();
            // 根节点
            JsTree jsTree = JsTreeUtil.getBaseNode();
            jsTree.setChildren(mapper.selectData(JsTreeUtil.baseId));
            jsTrees.add(jsTree);
        } else {
            jsTrees = mapper.selectData(pId);
        }
        return jsTrees;
    }

    @Override
    public List<JsTree> selectAll() {
        List<JsTree> jsTrees = mapper.selectAll(CommonStatus.ENABLE.getCode());
        JsTree jsTree = new JsTree();
        State state = new State();
        jsTree.setId(JsTreeUtil.baseId);
        jsTree.setParent("#");
        jsTree.setIcon(CommonConst.DEFAULT_FOLDER_ICON);
        jsTree.setText(CommonConst.projectProperties.getName());
        state.setOpened(true);
        jsTree.setState(state);
        jsTrees.add(jsTree);
        return jsTrees;
    }

    @Override
    public SysRole input(Long id) {
        SysRole sysRole;
        // 表示点击的是根目录
        if (id == null || id.equals(JsTreeUtil.baseId)) {
            sysRole = new SysRole();
            sysRole.setId(JsTreeUtil.baseId);
            sysRole.setName(CommonConst.projectProperties.getName());
        } else {
            sysRole = mapper.selectInfo(id);
            if (sysRole != null && sysRole.getpId().equals(JsTreeUtil.baseId)) {
                sysRole.setpName(CommonConst.projectProperties.getName());
            }
        }
        return sysRole;
    }

    @Override
    public SysRole add(Long pId) {
        if (pId != null) {
            SysRole sysRole = new SysRole();
            sysRole.setpId(pId);
            sysRole.setStatus(CommonStatus.ENABLE.getCode());
            if (JsTreeUtil.baseId.equals(pId)) {
                sysRole.setpName(CommonConst.projectProperties.getName());
            } else {
                SysRole parentSysRole = mapper.selectInfo(pId);
                if (parentSysRole != null) {
                    sysRole.setpName(parentSysRole.getName());
                } else {
                    throw new RuntimeException("获取父角色信息失败，请重试！");
                }
            }
            return sysRole;
        } else {
            throw new RuntimeException("获取父角色信息失败，请重试！");
        }
    }

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean delete(Long id) {
        ToolUtil.checkParams(id);
        // 检查是否有子节点
        QueryWrapper<SysRole> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("p_id", id);
        int count = mapper.selectCount(queryWrapper);
        if(count > 0){
            throw new RuntimeException(BusinessException.EXIST_CHILD.getMessage());
        }
        boolean isSuccess = removeById(id);
        if(isSuccess){
            // 删除已经分配给用户的角色
            sysUserRoleService.deleteUserRole(String.valueOf(id));
            // 删除部门类型可分配的角色
            sysDepartmentTypeRoleService.deleteDepartTypeRole(String.valueOf(id));
        }
        return ToolUtil.checkResult(isSuccess);
    }

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean batchDelete(String ids) {
        ToolUtil.checkParams(ids);
        // 检查是否有子节点
        QueryWrapper<SysRole> queryWrapper = new QueryWrapper<>();
        queryWrapper.in("p_id", ids.split(CommonConst.SPLIT));
        int count = count(queryWrapper);
        if(count > 0){
            throw new RuntimeException(BusinessException.EXIST_CHILD.getMessage());
        }
        List<String> idList = Arrays.asList(ids.split(CommonConst.SPLIT));
        boolean isSuccess = removeByIds(idList);
        if(isSuccess){
            // 删除已经分配给用户的角色
            sysUserRoleService.deleteUserRole(ids);
            // 删除部门类型可分配的角色
            sysDepartmentTypeRoleService.deleteDepartTypeRole(ids);
        }
        return ToolUtil.checkResult(isSuccess);
    }

    @Override
    public boolean setStatus(String ids, Integer status) {
        ToolUtil.checkParams(ids);
        ToolUtil.checkParams(status);
        List<SysRole> roleList = new ArrayList<>();
        SysRole sysRole;
        for(String id: ids.split(CommonConst.SPLIT)){
            sysRole = new SysRole();
            sysRole.setId(Long.parseLong(id));
            sysRole.setStatus(status);
            roleList.add(sysRole);
        }
        return ToolUtil.checkResult(updateBatchById(roleList));
    }


    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public SysRole saveData(SysRole object) {
        ToolUtil.checkParams(object);
        SysUser sysUser = ShiroUtil.getCurrentUser();
        if (object.getId() == null) {
            object.setCreateDate(new Date());
            object.setCreateUser(sysUser.getId());
        }
        object.setEditDate(new Date());
        object.setEditUser(sysUser.getId());
        if (object.getOrderNo() == null) {
            object.setOrderNo(mapper.getMaxOrderNo(object.getpId()) + 1);
        }
        boolean isSuccess = saveOrUpdate(object);
        if(isSuccess){
            // 删除授权信息,下次请求资源重新授权
            RedisUtil.delByPrefix(RedisPrefix.SHIRO_AUTHORIZATION);
            sysRolePermissionsService.saveRolePermissions(object.getId(), object.getPermissions());
        }
        return (SysRole)ToolUtil.checkResult(isSuccess, object);
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
                List<SysRole> oldSysRole = mapper.selectOrderInfo(parent, str, length);
                List<SysRole> newSysRole = new ArrayList<>();
                // 是否需要偏移
                boolean needDeviation = false;
                // 偏移量
                int deviation;
                if (position > oldPosition) {
                    deviation = -1;
                } else {
                    deviation = 1;
                }
                for (int i = 0; i < oldSysRole.size(); i++) {
                    if ((i + str) == position) {
                        newSysRole.add(new SysRole(id, oldSysRole.get(i).getOrderNo()));
                        newSysRole.add(new SysRole(oldSysRole.get(i).getId(), oldSysRole.get(i + deviation).getOrderNo()));
                        needDeviation = true;
                    } else {
                        if ((i + str) == oldPosition) {
                            needDeviation = true;
                        }
                        if (!id.equals(oldSysRole.get(i).getId())) {
                            newSysRole.add(new SysRole(oldSysRole.get(i).getId(), oldSysRole.get(i + (needDeviation ? deviation : 0)).getOrderNo()));
                        }
                    }
                }
                isSuccess = updateBatchById(newSysRole);
            } else {
                List<SysRole> oldSysRole = mapper.selectOrderInfo(parent, null, null);
                List<SysRole> newSysRole = new ArrayList<>();
                // 是否需要偏移
                boolean needDeviation = false;
                // 偏移量
                int deviation = 1;
                // 放到了最后一个
                if (position == oldSysRole.size()) {
                    if (oldSysRole.size() == 0) {
                        newSysRole.add(new SysRole(id, parent, 1));
                    } else {
                        newSysRole.add(new SysRole(id, parent, oldSysRole.get(oldSysRole.size() - 1).getOrderNo() + 1));
                    }
                } else {
                    for (int i = 0; i < oldSysRole.size(); i++) {
                        if (i == position) {
                            newSysRole.add(new SysRole(id, parent, oldSysRole.get(i).getOrderNo()));
                            newSysRole.add(new SysRole(oldSysRole.get(i).getId(), oldSysRole.get(i).getOrderNo() + 1));
                            needDeviation = true;
                        } else {
                            newSysRole.add(new SysRole(oldSysRole.get(i).getId(), oldSysRole.get(i).getOrderNo() + (needDeviation ? deviation : 0)));
                        }
                    }
                }
                isSuccess = updateBatchById(newSysRole);
            }
            return isSuccess;
        } else {
            throw new RuntimeException(ExceptionEnum.FAILED_TO_GET_DATA.getMessage());
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
