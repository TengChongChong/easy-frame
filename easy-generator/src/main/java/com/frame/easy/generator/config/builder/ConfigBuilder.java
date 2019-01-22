package com.frame.easy.generator.config.builder;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.core.toolkit.StringPool;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import com.baomidou.mybatisplus.generator.config.GlobalConfig;
import com.baomidou.mybatisplus.generator.config.IDbQuery;
import com.baomidou.mybatisplus.generator.config.StrategyConfig;
import com.baomidou.mybatisplus.generator.config.po.TableField;
import com.baomidou.mybatisplus.generator.config.po.TableFill;
import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

/**
 * 用于读取表信息并在前台显示
 *
 * @author mybatis plus 部分代码
 * @since 2019-01-15
 */
public class ConfigBuilder {
    private static final String PK_QUERY_SQL = "select * from INFORMATION_SCHEMA.INDEXES WHERE TABLE_NAME = '%s'";

    /**
     * 数据库配置
     */
    private final DataSourceConfig dataSourceConfig;
    /**
     * SQL连接
     */
    private Connection connection;
    /**
     * SQL语句类型
     */
    private IDbQuery dbQuery;
    /**
     * 数据库表信息
     */
    private List<TableInfo> tableInfoList;
    /**
     * 策略配置
     */
    private StrategyConfig strategyConfig;
    /**
     * 全局配置信息
     */
    private GlobalConfig globalConfig;

    /**
     * 在构造器中处理配置
     *
     * @param dataSourceConfig 数据源配置
     * @param strategyConfig   表配置
     */
    public ConfigBuilder(DataSourceConfig dataSourceConfig, StrategyConfig strategyConfig) {
        // 全局配置
        this.globalConfig = new GlobalConfig();
        this.dataSourceConfig = dataSourceConfig;
        handlerDataSource(dataSourceConfig);
        // 策略配置
        if (null == strategyConfig) {
            this.strategyConfig = new StrategyConfig();
        } else {
            this.strategyConfig = strategyConfig;
        }
        handlerStrategy(this.strategyConfig);
    }



    // ************************ 曝露方法 BEGIN*****************************
    /**
     * 表信息
     *
     * @return 所有表信息
     */
    public List<TableInfo> getTableInfoList() {
        return tableInfoList;
    }

    // ****************************** 曝露方法 END**********************************
    /**
     * 处理数据源配置
     *
     * @param config DataSourceConfig
     */
    private void handlerDataSource(DataSourceConfig config) {
        connection = config.getConn();
        dbQuery = config.getDbQuery();
    }

    /**
     * 处理数据库表 加载数据库表、列、注释相关数据集
     *
     * @param config StrategyConfig
     */
    private void handlerStrategy(StrategyConfig config) {
        tableInfoList = getTablesInfo(config);
    }

    /**
     * 处理表对应的类名称
     *
     * @param tableList 表名称
     * @param strategy  命名策略
     * @param config    策略配置项
     * @return 补充完整信息后的表
     */
    private List<TableInfo> processTable(List<TableInfo> tableList, NamingStrategy strategy, StrategyConfig config) {
        String[] tablePrefix = config.getTablePrefix();
        for (TableInfo tableInfo : tableList) {
            String entityName = NamingStrategy.capitalFirst(processName(tableInfo.getName(), strategy, tablePrefix));
            tableInfo.setEntityName(strategyConfig, entityName);
        }
        return tableList;
    }

    /**
     * 获取所有的数据库表信息
     */
    private List<TableInfo> getTablesInfo(StrategyConfig config) {
        boolean isInclude = (null != config.getInclude() && config.getInclude().length > 0);
        boolean isExclude = (null != config.getExclude() && config.getExclude().length > 0);
        if (isInclude && isExclude) {
            throw new RuntimeException("<strategy> 标签中 <include> 与 <exclude> 只能配置一项！");
        }
        //所有的表信息
        List<TableInfo> tableList = new ArrayList<>();

        //需要反向生成或排除的表信息
        List<TableInfo> includeTableList = new ArrayList<>();
        List<TableInfo> excludeTableList = new ArrayList<>();

        //不存在的表名
        Set<String> notExistTables = new HashSet<>();
        PreparedStatement preparedStatement = null;
        try {
            String tablesSql = dbQuery.tablesSql();
            if (DbType.POSTGRE_SQL == dbQuery.dbType()) {
                String schema = dataSourceConfig.getSchemaName();
                if (schema == null) {
                    //pg默认schema=public
                    schema = "public";
                    dataSourceConfig.setSchemaName(schema);
                }
                tablesSql = String.format(tablesSql, schema);
            }
            //oracle数据库表太多，出现最大游标错误
            else if (DbType.ORACLE == dbQuery.dbType()) {
                String schema = dataSourceConfig.getSchemaName();
                //oracle默认用户的schema=username
                if (schema == null) {
                    schema = dataSourceConfig.getUsername().toUpperCase();
                    dataSourceConfig.setSchemaName(schema);
                }
                tablesSql = String.format(tablesSql, schema);
                if (isInclude) {
                    StringBuilder sb = new StringBuilder(tablesSql);
                    sb.append(" AND ").append(dbQuery.tableName()).append(" IN (");
                    Arrays.stream(config.getInclude()).forEach(tbname -> sb.append(StringPool.SINGLE_QUOTE).append(tbname.toUpperCase()).append("',"));
                    sb.replace(sb.length() - 1, sb.length(), StringPool.RIGHT_BRACKET);
                    tablesSql = sb.toString();
                } else if (isExclude) {
                    StringBuilder sb = new StringBuilder(tablesSql);
                    sb.append(" AND ").append(dbQuery.tableName()).append(" NOT IN (");
                    Arrays.stream(config.getExclude()).forEach(tbname -> sb.append(StringPool.SINGLE_QUOTE).append(tbname.toUpperCase()).append("',"));
                    sb.replace(sb.length() - 1, sb.length(), StringPool.RIGHT_BRACKET);
                    tablesSql = sb.toString();
                }
            }
            preparedStatement = connection.prepareStatement(tablesSql);
            ResultSet results = preparedStatement.executeQuery();
            TableInfo tableInfo;
            while (results.next()) {
                String tableName = results.getString(dbQuery.tableName());
                if (StringUtils.isNotEmpty(tableName)) {
                    String tableComment = results.getString(dbQuery.tableComment());
                    if (config.isSkipView() && "VIEW".equals(tableComment)) {
                        // 跳过视图
                        continue;
                    }
                    tableInfo = new TableInfo();
                    tableInfo.setName(tableName);
                    tableInfo.setComment(tableComment);
                    if (isInclude) {
                        for (String includeTable : config.getInclude()) {
                            // 忽略大小写等于 或 正则 true
                            if (tableNameMatches(includeTable, tableName)) {
                                includeTableList.add(tableInfo);
                            } else {
                                notExistTables.add(includeTable);
                            }
                        }
                    } else if (isExclude) {
                        for (String excludeTable : config.getExclude()) {
                            // 忽略大小写等于 或 正则 true
                            if (tableNameMatches(excludeTable, tableName)) {
                                excludeTableList.add(tableInfo);
                            } else {
                                notExistTables.add(excludeTable);
                            }
                        }
                    }
                    tableList.add(tableInfo);
                } else {
                    System.err.println("当前数据库为空！！！");
                }
            }

            // 将已经存在的表移除，获取配置中数据库不存在的表
            for (TableInfo tabInfo : tableList) {
                notExistTables.remove(tabInfo.getName());
            }
            if (notExistTables.size() > 0) {
                System.err.println("表 " + notExistTables + " 在数据库中不存在！！！");
            }

            // 需要反向生成的表信息
            if (isExclude) {
                tableList.removeAll(excludeTableList);
                includeTableList = tableList;
            }
            if (!isInclude && !isExclude) {
                includeTableList = tableList;
            }
            // 性能优化，只处理需执行表字段
            includeTableList.forEach(ti -> convertTableFields(ti, config.getColumnNaming()));
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            // 释放资源
            try {
                if (preparedStatement != null) {
                    preparedStatement.close();
                }
                if (connection != null) {
                    connection.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return processTable(includeTableList, config.getNaming(), config);
    }


    /**
     * 表名匹配
     *
     * @param setTableName 设置表名
     * @param dbTableName  数据库表单
     * @return true/false
     */
    private boolean tableNameMatches(String setTableName, String dbTableName) {
        return setTableName.equals(dbTableName)
                || StringUtils.matches(setTableName, dbTableName);
    }

    /**
     * 将字段信息与表信息关联
     *
     * @param tableInfo 表信息
     * @param strategy  命名策略
     * @return 表信息
     */
    private TableInfo convertTableFields(TableInfo tableInfo, NamingStrategy strategy) {
        boolean haveId = false;
        List<TableField> fieldList = new ArrayList<>();
        List<TableField> commonFieldList = new ArrayList<>();
        DbType dbType = dbQuery.dbType();
        String tableName = tableInfo.getName();
        try {
            String tableFieldsSql = dbQuery.tableFieldsSql();
            Set<String> h2PkColumns = new HashSet<>();
            if (DbType.POSTGRE_SQL == dbType) {
                tableFieldsSql = String.format(tableFieldsSql, dataSourceConfig.getSchemaName(), tableName);
            } else if (DbType.ORACLE == dbType) {
                tableName = tableName.toUpperCase();
                tableFieldsSql = String.format(tableFieldsSql.replace("#schema", dataSourceConfig.getSchemaName()), tableName);
            } else if (DbType.H2 == dbType) {
                tableName = tableName.toUpperCase();
                PreparedStatement pkQueryStmt = connection.prepareStatement(String.format(PK_QUERY_SQL, tableName));
                ResultSet pkResults = pkQueryStmt.executeQuery();
                while (pkResults.next()) {
                    String primaryKey = pkResults.getString(dbQuery.fieldKey());
                    if ("TRUE".equalsIgnoreCase(primaryKey)) {
                        h2PkColumns.add(pkResults.getString(dbQuery.fieldName()));
                    }
                }
                pkResults.close();
                pkQueryStmt.close();
                tableFieldsSql = String.format(tableFieldsSql, tableName);
            } else {
                tableFieldsSql = String.format(tableFieldsSql, tableName);
            }
            PreparedStatement preparedStatement = connection.prepareStatement(tableFieldsSql);
            ResultSet results = preparedStatement.executeQuery();
            while (results.next()) {
                TableField field = new TableField();
                String columnName = results.getString(dbQuery.fieldName());
                // 避免多重主键设置，目前只取第一个找到ID，并放到list中的索引为0的位置
                boolean isId;
                if(DbType.H2 == dbType){
                    isId = h2PkColumns.contains(columnName);
                }else{
                    String key = results.getString(dbQuery.fieldKey());
                    if (DbType.DB2 == dbType) {
                        isId = StringUtils.isNotEmpty(key) && "1".equals(key);
                    } else {
                        isId = StringUtils.isNotEmpty(key) && "PRI".equals(key.toUpperCase());
                    }
                }

                // 处理ID
                if (isId && !haveId) {
                    field.setKeyFlag(true);
                    if (DbType.H2 == dbType || dbQuery.isKeyIdentity(results)) {
                        field.setKeyIdentityFlag(true);
                    }
                    haveId = true;
                } else {
                    field.setKeyFlag(false);
                }
                // 自定义字段查询
                String[] fcs = dbQuery.fieldCustom();
                if (null != fcs) {
                    Map<String, Object> customMap = new HashMap<>(fcs.length);
                    for (String fc : fcs) {
                        customMap.put(fc, results.getObject(fc));
                    }
                    field.setCustomMap(customMap);
                }
                // 处理其它信息
                field.setName(columnName);
                field.setType(results.getString(dbQuery.fieldType()));
                field.setPropertyName(strategyConfig, processName(field.getName(), strategy));
                field.setColumnType(dataSourceConfig.getTypeConvert().processTypeConvert(globalConfig, field.getType()));
                field.setComment(results.getString(dbQuery.fieldComment()));
                if (strategyConfig.includeSuperEntityColumns(field.getName())) {
                    // 跳过公共字段
                    commonFieldList.add(field);
                    continue;
                }
                // 填充逻辑判断
                List<TableFill> tableFillList = getStrategyConfig().getTableFillList();
                if (null != tableFillList) {
                    // 忽略大写字段问题
                    tableFillList.stream().filter(tf -> tf.getFieldName().equalsIgnoreCase(field.getName()))
                            .findFirst().ifPresent(tf -> field.setFill(tf.getFieldFill().name()));
                }
                fieldList.add(field);
            }
            results.close();
            preparedStatement.close();
        } catch (SQLException e) {
            System.err.println("SQL Exception：" + e.getMessage());
        }
        tableInfo.setFields(fieldList);
        tableInfo.setCommonFields(commonFieldList);
        return tableInfo;
    }

    /**
     * 处理字段名称
     *
     * @return 根据策略返回处理后的名称
     */
    private String processName(String name, NamingStrategy strategy) {
        return processName(name, strategy, strategyConfig.getFieldPrefix());
    }


    /**
     * 处理表/字段名称
     *
     * @param name 名称
     * @param strategy 策略
     * @param prefix 前缀
     * @return 根据策略返回处理后的名称
     */
    private String processName(String name, NamingStrategy strategy, String[] prefix) {
        boolean removePrefix = false;
        if (prefix != null && prefix.length >= 1) {
            removePrefix = true;
        }
        String propertyName;
        if (removePrefix) {
            if (strategy == NamingStrategy.underline_to_camel) {
                // 删除前缀、下划线转驼峰
                propertyName = NamingStrategy.removePrefixAndCamel(name, prefix);
            } else {
                // 删除前缀
                propertyName = NamingStrategy.removePrefix(name, prefix);
            }
        } else if (strategy == NamingStrategy.underline_to_camel) {
            // 下划线转驼峰
            propertyName = NamingStrategy.underlineToCamel(name);
        } else {
            // 不处理
            propertyName = name;
        }
        return propertyName;
    }


    private StrategyConfig getStrategyConfig() {
        return strategyConfig;
    }
}
