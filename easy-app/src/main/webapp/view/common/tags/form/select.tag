@/*
    属性说明:
    name         : label名称
    id           : select的id
    class        : class
    value        : 默认值
    required     : 必填
    validateRule : 表单验证
    dataDictType : 字典类型
    validate     : 验证 true/false
    other        : 其他属性(支持多个,用空格隔开)
    tips         : 提示文字
    readonly     : 只读
    disabled     : 禁用
@*/

@validateRule = null;
@elementType = "text";
@if(isNotEmpty(validate)){
    @validateRule = validate;
@}

@if(isNotEmpty(required) && "true" == required){
    @if(validateRule == null){
        @validateRule = "required ";
    @}else{
        @validateRule = validateRule + " required";
    @}
@}

@if(isNotEmpty(type)){
    @elementType = type;
@}

<div class="form-group row">
    <label class="col-form-label col-4" for="${id}">
        @if(isNotEmpty(required) && 'true' == required){
        <span class="required">*</span>
        @}
        ${name}：
        @if(isNotEmpty(tips)){
        <i data-toggle="kt-tooltip" data-placement="top" data-original-title="${tips}" class="flaticon-questions-circular-button"></i>
        @}
    </label>
    <div class="col-8">
        <select class="form-control select-picker ${class!}" id="${id}" name="${id}" ${validateRule!} data-dict-type="${dataDictType!}" ${other!} data-value="${value!}"
                @if(isNotEmpty(readonly)){
                readonly="${readonly}"
                @}
                @if(isNotEmpty(disabled)){
                disabled="${disabled}"
                @}
        >
            ${tagBody!}
        </select>
    </div>
</div>
