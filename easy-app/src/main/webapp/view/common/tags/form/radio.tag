@/*
    表单中radio标签中各个参数的说明:

    id      : radio id
    name    : radio 名称
    value   : radio 值
    checked : radio 选中的值
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
<label class="kt-radio">
    <input class="${class!}" type="radio" name="${name}" value="${value}" ${validateRule!}
           @if(isNotEmpty(checked) && isNotEmpty(value) && strUtil.toString(value) == strUtil.toString(checked)){
            checked
           @}
    > ${text}
    <span></span>
</label>
