package com.frame.easy.common.page;

import cn.hutool.core.lang.Validator;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.CollectionUtils;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.frame.easy.common.constant.PageConst;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

/**
 * 自定义分页
 *
 * @author tengchong
 * @date 2019-01-14
 */
@Component
public class Page<T> implements IPage<T> {
    /**
     * 查询数据列表
     */
    private List<T> records = Collections.emptyList();
    /**
     * 总数
     */
    private long total = 0;
    /**
     * 每页显示条数，默认 10
     */
    private long size = 10;
    /**
     * 当前页
     */
    private long current = 1;
    /**
     * Sql 排序 ASC
     */
    private String[] ascs;
    /**
     * Sql 排序 DESC
     */
    private String[] descs;

    /**
     * 是否进行 count 查询
     */
    @JsonIgnore
    private boolean isSearchCount = true;

    /**
     * Sql默认 Asc 排序
     */
    private String[] defaultAscs;
    /**
     * Sql默认 Desc 排序
     */
    private String[] defaultDescs;


    public Page() {
        // to do nothing
    }

    /**
     * 分页构造函数
     *
     * @param current 当前页
     * @param size    每页显示条数
     */
    public Page(long current, long size) {
        this(current, size, 0);
    }

    public Page(long current, long size, long total) {
        this(current, size, total, true);
    }

    public Page(long current, long size, boolean isSearchCount) {
        this(current, size, 0, isSearchCount);
    }

    public Page(long current, long size, long total, boolean isSearchCount) {
        if (current > 1) {
            this.current = current;
        }
        this.size = size;
        this.total = total;
        this.isSearchCount = isSearchCount;
    }

    @Override
    public List<T> getRecords() {
        return this.records;
    }

    @Override
    public IPage<T> setRecords(List<T> records) {
        this.records = records;
        return this;
    }

    @Override
    public long getTotal() {
        return this.total;
    }

    @Override
    public IPage<T> setTotal(long total) {
        this.total = total;
        return this;
    }

    @Override
    public long getSize() {
        return this.size;
    }

    @Override
    public IPage<T> setSize(long size) {
        if (size == 0L) {
            this.size = 15;
        } else {
            this.size = size;
        }
        return this;
    }

    @Override
    public long getCurrent() {
        return this.current;
    }

    @Override
    public IPage<T> setCurrent(long current) {
        this.current = current;
        return this;
    }

    /**
     * 根据 mybatis-plus.configuration.map-underscore-to-camel-case 配置
     * 处理字段驼峰/下划线
     *
     * @param columns [column1,column2,column3] 排序字段
     * @return [column1, column2, column3]
     */
    private String[] initOrderColumn(String[] columns, String type) {
        if (Validator.isEmpty(this.ascs) && Validator.isEmpty(this.descs)) {
            String[] defaultFields;
            if (PageConst.ORDER_ASC.equals(type)) {
                defaultFields = this.defaultAscs;
            } else {
                defaultFields = this.defaultDescs;
            }
            return toUnderlineCase(defaultFields);
        } else {
            return toUnderlineCase(columns);
        }
    }

    /**
     * 字段名转为驼峰
     *
     * @param columns [column1,column2,column3] 排序字段
     * @return [column1, column2, column3]
     */
    private String[] toUnderlineCase(String[] columns) {
        if (columns != null) {
            for (int i = 0; i < columns.length; i++) {
                columns[i] = StrUtil.toUnderlineCase(columns[i]);
            }
            return columns;
        }
        return columns;
    }

    /**
     * 获取降序排序字段
     *
     * @return [column1, column2, column3]
     */
    @Override
    public String[] descs() {
        return initOrderColumn(this.descs, PageConst.ORDER_DESC);
    }

    /**
     * 获取升序排序字段
     *
     * @return [column1, column2, column3]
     */
    @Override
    public String[] ascs() {
        return initOrderColumn(this.ascs, PageConst.ORDER_ASC);
    }

    /**
     * 升序
     *
     * @param ascs 多个升序字段
     * @return Page
     */
    public Page<T> setAsc(String... ascs) {
        this.ascs = ascs;
        return this;
    }

    /**
     * 升序
     *
     * @param ascs 多个升序字段
     * @return Page
     */
    public Page<T> setAscs(List<String> ascs) {
        if (CollectionUtils.isNotEmpty(ascs)) {
            this.ascs = ascs.toArray(new String[0]);
        }
        return this;
    }

    /**
     * 降序
     *
     * @param descs 多个降序字段
     */
    public Page<T> setDesc(String... descs) {
        this.descs = descs;
        return this;
    }

    /**
     * 降序
     *
     * @param descs 多个降序字段
     * @return Page
     */
    public Page<T> setDescs(List<String> descs) {
        if (CollectionUtils.isNotEmpty(descs)) {
            this.descs = descs.toArray(new String[0]);
        }
        return this;
    }

    public Page<T> setSearchCount(boolean isSearchCount) {
        this.isSearchCount = isSearchCount;
        return this;
    }

    /**
     * 获取开始记录
     *
     * @return long
     */
    public long getPageStart() {
        return (this.current - 1) * this.size;
    }

    /**
     * 获取结束记录
     *
     * @return long
     */
    public long getPageEnd() {
        return this.current * this.size;
    }

    public void setDefaultAscs(String[] defaultAscs) {
        this.defaultAscs = defaultAscs;
    }

    public void setDefaultDescs(String[] defaultDescs) {
        this.defaultDescs = defaultDescs;
    }

    public void setDefaultAsc(String defaultAscs) {
        this.defaultAscs = new String[]{defaultAscs};
    }

    public void setDefaultDesc(String defaultDescs) {
        this.defaultDescs = new String[]{defaultDescs};
    }



}
