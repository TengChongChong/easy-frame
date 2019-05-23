@/*
    表单中textarea框标签中各个参数的说明:
    name       : label名称
    id         : textarea的id
    required   : 必填
    validate   : 验证
    style      : 附加的css属性
    other      : 其他属性(支持多个,用空格隔开)
    tips       : 提示文字
    placeholder: 提示文字
    readonly   : 只读
    disabled   : 禁用
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
    <label class="col-form-label col-md-2 col-4" for="${id}">
        @if(isNotEmpty(required) && 'true' == required){
            <span class="required">*</span>
        @}
        ${name}：
        @if(isNotEmpty(tips)){
            <i data-toggle="kt-tooltip" data-placement="top" data-original-title="${tips}" class="flaticon-questions-circular-button"></i>
        @}
    </label>
    <div class="col-md-10 col-8">
        <textarea class="form-control" id="${id}" name="${id}" style="${style!}" placeholder="${placeholder!}" ${validateRule!}
                @if(isNotEmpty(readonly)){
                    readonly="${readonly}"
                @}
                @if(isNotEmpty(disabled)){
                    disabled="${disabled}"
                @}
        >${value!}</textarea>
    </div>
</div>
