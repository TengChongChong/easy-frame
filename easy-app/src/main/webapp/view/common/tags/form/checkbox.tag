@/*
    属性说明:
    id           : radio id
    name         : radio 名称
    value        : radio 值
    checked      : radio 选中的值
    required     : 必填  true/false
    validateRule : 表单验证
    validate     : 验证
    class        : 附加的class属性
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
