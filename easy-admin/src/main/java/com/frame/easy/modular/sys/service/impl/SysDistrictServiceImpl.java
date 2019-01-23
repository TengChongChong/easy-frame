package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.lang.Validator;
import cn.hutool.core.util.PinyinUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.CommonConst;
import com.frame.easy.common.jstree.JsTree;
import com.frame.easy.common.jstree.JsTreeUtil;
import com.frame.easy.common.jstree.State;
import com.frame.easy.common.select.Select;
import com.frame.easy.exception.BusinessException;
import com.frame.easy.exception.ExceptionEnum;
import com.frame.easy.util.ToolUtil;
import com.frame.easy.modular.sys.dao.SysDistrictMapper;
import com.frame.easy.modular.sys.model.SysDistrict;
import com.frame.easy.modular.sys.service.SysDistrictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 行政区划
 *
 * @author tengchong
 * @date 2018/12/18
 */
@Service
public class SysDistrictServiceImpl extends ServiceImpl<SysDistrictMapper, SysDistrict> implements SysDistrictService {

    @Autowired
    private SysDistrictMapper mapper;

    @Override
    public List<JsTree> selectData(Long pId) {
        List<JsTree> jsTrees;
        // 第一次请求,返回行政区划 + 一级 数据
        if (pId == null || pId.equals(JsTreeUtil.baseId)) {
            jsTrees = new ArrayList<>();
            // 根节点
            JsTree jsTree = JsTreeUtil.getBaseNode();
            // 项目名称
            jsTree.setText("行政区划");
            jsTree.setChildren(mapper.selectData(JsTreeUtil.baseId));
            jsTrees.add(jsTree);
        } else {
            jsTrees = mapper.selectData(pId);
        }
        return jsTrees;
    }

    @Override
    public List<JsTree> selectAll() {
        List<JsTree> jsTrees = mapper.selectAll();
        JsTree jsTree = new JsTree();
        State state = new State();
        jsTree.setId(JsTreeUtil.baseId);
        jsTree.setParent("#");
        jsTree.setIcon(CommonConst.DEFAULT_FOLDER_ICON);
        jsTree.setText("行政区划");
        state.setOpened(true);
        jsTree.setState(state);
        jsTrees.add(jsTree);
        return jsTrees;
    }

    @Override
    public SysDistrict input(Long id) {
        SysDistrict sysDistrict;
        // 表示点击的是根目录
        if (id == null || id.equals(JsTreeUtil.baseId)) {
            sysDistrict = new SysDistrict();
            sysDistrict.setId(JsTreeUtil.baseId);
            sysDistrict.setName("行政区划");
        } else {
            sysDistrict = mapper.selectInfo(id);
        }
        return sysDistrict;
    }

    @Override
    public SysDistrict add(Long pId) {
        if (pId != null) {
            SysDistrict sysDistrict = new SysDistrict();
            sysDistrict.setpId(pId);
            return sysDistrict;
        } else {
            throw new RuntimeException("获取父权限信息失败，请重试！");
        }
    }

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean delete(Long id) {
        ToolUtil.checkParams(id);
        // 检查是否有子行政区划
        QueryWrapper<SysDistrict> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("p_id", id);
        int count = count(queryWrapper);
        if (count > 0) {
            throw new RuntimeException(BusinessException.EXIST_CHILD.getMessage());
        }
        return ToolUtil.checkResult(removeById(id));
    }

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean batchDelete(String ids) {
        ToolUtil.checkParams(ids);
        // 检查是否有子行政区划
        QueryWrapper<SysDistrict> queryWrapper = new QueryWrapper<>();
        queryWrapper.in("p_id", ids.split(CommonConst.SPLIT));
        int count = count(queryWrapper);
        if (count > 0) {
            throw new RuntimeException(BusinessException.EXIST_CHILD.getMessage());
        }
        List<String> idList = Arrays.asList(ids.split(CommonConst.SPLIT));
        return ToolUtil.checkResult(removeByIds(idList));
    }

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public SysDistrict saveData(SysDistrict object) {
        ToolUtil.checkParams(object);
        if (object.getOrderNo() == null) {
            object.setOrderNo(mapper.getMaxOrderNo(object.getpId()) + 1);
        }
        if (StrUtil.isNotBlank(object.getName())) {
            if (StrUtil.isNotBlank(object.getPinyin())) {
                object.setPinyin(PinyinUtil.getPinYin(object.getName()));
            }
            if (StrUtil.isNotBlank(object.getInitials())) {
                object.setInitials(PinyinUtil.getAllFirstLetter(object.getName()));
            }
            if (StrUtil.isNotBlank(object.getInitial())) {
                object.setInitial(String.valueOf(PinyinUtil.getFirstLetter(object.getName().toCharArray()[0])));
            }
            return (SysDistrict) ToolUtil.checkResult(saveOrUpdate(object), object);
        } else {
            throw new RuntimeException("请输入行政区划名称后重试");
        }
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
                List<SysDistrict> oldSysDistrict = mapper.selectOrderInfo(parent, str, length);
                List<SysDistrict> newSysDistrict = new ArrayList<>();
                // 是否需要偏移
                boolean needDeviation = false;
                // 偏移量
                int deviation;
                if (position > oldPosition) {
                    deviation = -1;
                } else {
                    deviation = 1;
                }
                for (int i = 0; i < oldSysDistrict.size(); i++) {
                    if ((i + str) == position) {
                        newSysDistrict.add(new SysDistrict(id, oldSysDistrict.get(i).getOrderNo()));
                        newSysDistrict.add(new SysDistrict(oldSysDistrict.get(i).getId(), oldSysDistrict.get(i + deviation).getOrderNo()));
                        needDeviation = true;
                    } else {
                        if ((i + str) == oldPosition) {
                            needDeviation = true;
                        }
                        if (!id.equals(oldSysDistrict.get(i).getId())) {
                            newSysDistrict.add(new SysDistrict(oldSysDistrict.get(i).getId(), oldSysDistrict.get(i + (needDeviation ? deviation : 0)).getOrderNo()));
                        }
                    }
                }
                isSuccess = updateBatchById(newSysDistrict);
            } else {
                List<SysDistrict> oldSysDistrict = mapper.selectOrderInfo(parent, null, null);
                List<SysDistrict> newSysDistrict = new ArrayList<>();
                // 是否需要偏移
                boolean needDeviation = false;
                // 偏移量
                int deviation = 1;
                // 放到了最后一个
                if (position == oldSysDistrict.size()) {
                    if (oldSysDistrict.size() == 0) {
                        newSysDistrict.add(new SysDistrict(id, parent, 1));
                    } else {
                        newSysDistrict.add(new SysDistrict(id, parent, oldSysDistrict.get(oldSysDistrict.size() - 1).getOrderNo() + 1));
                    }
                } else {
                    for (int i = 0; i < oldSysDistrict.size(); i++) {
                        if (i == position) {
                            newSysDistrict.add(new SysDistrict(id, parent, oldSysDistrict.get(i).getOrderNo()));
                            newSysDistrict.add(new SysDistrict(oldSysDistrict.get(i).getId(), oldSysDistrict.get(i).getOrderNo() + 1));
                            needDeviation = true;
                        } else {
                            newSysDistrict.add(new SysDistrict(oldSysDistrict.get(i).getId(), oldSysDistrict.get(i).getOrderNo() + (needDeviation ? deviation : 0)));
                        }
                    }
                }
                isSuccess = updateBatchById(newSysDistrict);
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

    @Override
    public List<Select> selectByPId(Long pId) {
        // 父id不是最顶级
        if (pId != 0L) {
            SysDistrict district = getById(pId);
            if(district != null){
                return mapper.selectByPId(district.getpId());
            }
        }
        return null;
    }

    public static void main(String[] args) {
//        System.out.println(PinyinUtil.getPinYin("锡林郭勒盟"));
//        System.out.println(PinyinUtil.getAllFirstLetter("锡林郭勒盟"));
//        System.out.println(PinyinUtil.getFirstLetter('锡'));
//        System.out.println(StrUtil.toUnderlineCase("t.sysUser"));

    }
}
