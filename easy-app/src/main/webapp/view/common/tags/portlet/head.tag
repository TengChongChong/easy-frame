@/*
    属性说明:
    portlet head
    icon : 图标
    title: 标题
@*/
<div class="kt-portlet__head">
    <div class="kt-portlet__head-label">
        @if(isNotEmpty(icon)){
            <span class="kt-portlet__head-icon">
                <i class="${icon}"></i>
            </span>
        @}
        <h3 class="kt-portlet__head-title">
            ${title!}
        </h3>
    </div>
</div>