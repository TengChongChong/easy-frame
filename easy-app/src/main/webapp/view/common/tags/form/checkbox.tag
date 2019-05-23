@/*
    表单中checkbox标签中各个参数的说明:

    id      : checkbox id
    name    : checkbox 名称
    value   : checkbox 值
    checked : checkbox 选中的值
    required: 必填
    validate: 验证
    class   : 附加的class属性
@*/
@validateRule = null;

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
<label class="kt-checkbox">
    <input class="${class!}" type="checkbox" name="${name}" value="${value}" ${validateRule!} ${other!}
           @if(isNotEmpty(checked) && isNotEmpty(value) && strUtil.toString(value) == strUtil.toString(checked)){
            checked
           @}
    > ${text}
    <span></span>
</label>
