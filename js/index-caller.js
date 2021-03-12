    
    // =============================站点导航下拉事件====================================
    var $mineDropdown = $('.mine-dropdown');
    $mineDropdown.dropdown({
        silent : false,
        css3 : true,
        js : false,
        event : 'hover',//click
        animation : 'fadeSlideUpDown',// 1.fade 2.slideUpDown 3.slideLeftRight 4.fadeSlideUpDown 5.fadeSlideLeftRight
        delay : 0,
        active : 'mine',
        // 点击item是否让layer层消失
        disappear : true 
    });

    // =============================购物车下拉事件====================================
    var $cartDropdown = $('.cart-dropdown');
    $cartDropdown.dropdown({
        silent : false,
        css3 : true,
        js : false,
        event : 'hover',//click
        animation : 'slideLeftRight',// 1.fade 2.slideUpDown 3.slideLeftRight 4.fadeSlideUpDown 5.fadeSlideLeftRight
        loading : 500,
        active : 'cart',
        disappear : false 
    });

    // =============================搜索栏下拉事件====================================
    var $searchDropdown = $('.search-dropdown');
    $searchDropdown.dropdown({
        silent : false,
        css3 : true,
        js : false,
        event : 'click',//click
        animation : 'slideUpDown',// 1.fade 2.slideUpDown 3.slideLeftRight 4.fadeSlideUpDown 5.fadeSlideLeftRight
        delay : 0,
        active : 'search',
        disappear : true,
        // 搜索下拉列表的展示个数
        len : 10,
        // ajxa请求延迟
        ajaxDelay : 0,
    });

    // =============================商品分类下拉事件====================================
    var $categoryDropdown = $('.category-dropdown');
    $categoryDropdown.dropdown({
        // silent : true,
        css3 : false,
        js : false,
        event : 'hover',//click
        animation : '',// 1.fade 2.slideUpDown 3.slideLeftRight 4.fadeSlideUpDown 5.fadeSlideLeftRight
        delay : 0,
        active : 'category',
        disappear : false,
        // 加载延迟
        loading : 600,
    });

    // =============================banner图轮播事件====================================
    var $mainBanner = $('.container');
    $mainBanner.slideFadeSwitch({
        css3 : true,
        js  : false,
        // 模式
        animation : 'fade',//slide fade switch
        // 主动选择要显示的那张
        activeIndex : 0,
        // 间隔时间
        interval : 3000
    })
    //#region _____ 
        // 头尾无缝功能插件
    // var $mainBanner = $('.container');
    // $mainBanner.slideStartEnd({
    //     css3 : true,
    //     js  : false,
    //     // 模式
    //     animation : 'slideStartEnd',
    //     // 主动选择要显示的那张
    //     activeIndex : 0,
    //     // 间隔时间
    //     interval : 4000,
    //     // 首位循环切换
    //     loop : true
    // })
    //#endregion

    // =============================today图轮播事件====================================
    var $today = $('.today-container');
    $today.slideFadeSwitch({
        css3 : true,
        js  : false,
        // 模式
        animation : 'slide',//slide fade switch
        // 主动选择要显示的那张
        activeIndex : 0,
        // 间隔时间
        interval : 3000
    });

    // =============================楼层切换事件====================================
    // var $layers = $('.layer');
    // $layers.tab({
    //     event : 'mouseenter',// click mouseenter
    //     css3 : false,
    //     js : false,
    //     animation : 'fade',
    //     activeIndex : 0,
    //     // 自动播放间隔
    //     interval : 0,
    //     // 反应间隔
    //     delay : 0,
    //     // 模拟加载延迟
    //     dela : 1000
    // });