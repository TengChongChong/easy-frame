package com.frame.easy.modular.sample.controller;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.lang.Console;
import cn.hutool.poi.excel.sax.handler.RowHandler;
import com.baomidou.mybatisplus.core.exceptions.MybatisPlusException;
import com.frame.easy.modular.sys.model.SysDict;
import com.frame.easy.modular.sys.service.SysDictService;
import com.frame.easy.result.Tips;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 测试类
 * @author tengchong
 */
@Controller
public class TestController {

    @Autowired
    private SysDictService sysDictService;

    @RequestMapping(value="/test")
    @ResponseBody
    public Tips testException(){
//        ExcelUtil.readBySax("/Users/tengchong/Downloads/导出数据示例-2019-04-26.xlsx", 2, createRowHandler());
//
////        ExcelReader reader = ExcelUtil.getReader("/Users/tengchong/Downloads/test.xlsx");
////        List<List<Object>> readAll = reader.read();
//        System.out.println("读取成功");
        SysDict sysDict = sysDictService.getDictByCode("dataSource", "");
        throw new MybatisPlusException("错了");
//        return Tips.getSuccessTips(1/0);
    }
    private boolean save(List<Object[]> dataList){
        System.out.println("保存数据:" + DateUtil.now() + dataList.size());
        return true;
    }

    private RowHandler createRowHandler() {
        return new RowHandler() {
            List<Object[]> dataList = new ArrayList<>();
            @Override
            public void handle(int sheetIndex, int rowIndex, List<Object> rowlist) {
                Object[] row = Arrays.copyOf(rowlist.toArray(), rowlist.size());
                dataList.add(row);
                if(rowlist.size() == 100){
                    save(dataList);
                    dataList.clear();
                }
                Console.log("[{}] [{}] {}", sheetIndex, rowIndex, rowlist);
            }
        };
    }
}
