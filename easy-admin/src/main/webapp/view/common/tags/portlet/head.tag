@/*
    portlet head
    icon : 图标
    title: 标题
@*/

<div class="m-portlet__head">
    <div class="m-portlet__head-caption">
        <div class="m-portlet__head-title">
            @if(isNotEmpty(icon)){
                <span class="m-portlet__head-icon">
                    <i class="${icon}"></i>
                </span>
            @}
            <h3 class="m-portlet__head-text">
                ${title!}
            </h3>
        </div>
    </div>
</div>
