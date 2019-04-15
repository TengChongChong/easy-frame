@/*
    select标签中各个参数的说明:
    name    : label名称
    id      : select的id
    class   : class
    value   : 默认值
    required: 必填
    validate: 验证
    other   : 其他属性(支持多个,用空格隔开)
    tips    : 提示文字
    size    : 尺寸
    readonly: 只读
    disabled: 禁用
@*/

@validateRule = null;
@elementClass = "form-control m-bootstrap-select m_selectpicker ";
@elementType = "text";
@labelClass = "control-label ";

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

@if(isNotEmpty(size)){
    @elementClass = elementClass + "form-control-" + size;
@}

@if(isNotEmpty(size)){
    @labelClass = labelClass + "control-label-" + size;
@}
@if(isNotEmpty(type)){
    @elementType = type;
@}

<div class="form-group row">
    <label class="col-4 ${labelClass}" for="${id}">
        @if(isNotEmpty(required) && 'true' == required){
        <span class="required">*</span>
        @}
        ${name}：
        @if(isNotEmpty(tips)){
        <i data-toggle="m-tooltip" data-placement="top" data-original-title="${tips}" class="flaticon-questions-circular-button"></i>
        @}
    </label>
    <div class="col-8">
        <select class="${elementClass} ${class!}" id="${id}" name="${id}" ${validateRule!} data-dict-type="${dataDictType!}" ${other!} data-value="${value!}"
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
