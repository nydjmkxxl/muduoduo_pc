(function ($) {
    'use strict'

    //#region _____有关购物车的计算 
    var $cartDropdown = $('.cart-dropdown');
    $cartDropdown.on('cartDropdown-show', function (e, i, $elem, dropdownObj) {

        var cartLayer = $cartDropdown.find('.dropdown-layer');
        cartLayer.on('loaded', function (_, bool) {
                // 空购物车
            var empty = $('.cart-dropdown .empty'),
                // 有商品购物车
                full = $('.cart-dropdown .full'),
                fOnce = full.data('once'),
                eOnce = empty.data('once'),
                cartLayer = $('.cart-dropdown .dropdown-layer'),
                // layer层共计数量
                num = full.find('.total .num');
                
            if(bool) {
                // 头部购物车的商品数量
                var goodsN = $('#jsNum'),
                // 每个item项加起来的共计数量
                itemNum = full.find('.item .count').text().length,
                // 商品共计价格
                price = full.find('.total .price'),
                // 每个item项的商品数量
                count = full.find('.item .count'),
                // 每个item项的商品单价
                countPrice = full.find('.item .countPrice'),
                // 获取点击删除的元素
                itemDel = full.find('.item .del'),
                // 订单总计金额
                totalPrice = 0 ,
                cartLayer = $('.cart-dropdown .dropdown-layer');
                // 计算总共价格
                for(var i=0, len=itemNum; i<len; i++) {
                    totalPrice += ( $(countPrice[i]).text() * $(count[i]).text() );
                }
                // 设置总共金额
                price.text(totalPrice);
                // 设置顶部购物车数量
                goodsN.text(itemNum);
                // 设置底部总计数量
                num.text(itemNum);


                if(Boolean(num.text())) {
                    // console.log('显示');
                    if(!fOnce) { cartLayer.height(full.height()); fOnce = full.data('once', true); }
                    
                    full.show();
                    empty.hide();
                }else{
                    // console.log('隐藏');
                    if(!eOnce) { cartLayer.height(empty.height()); eOnce = empty.data('once', true); }
                    
                    full.hide();
                    empty.show();
                }


                // 删除商品事件
                full.on('click', '.del' ,function () {
                    var $this = $(this),
                        index = itemDel.index(this);
                    // 清除点击的商品
                    $this.parents('.item').hide().empty();
                    // 删除订单 数量减掉
                    itemNum--;
                    if(itemNum == 0) {
                        if(!eOnce) { cartLayer.height(empty.height()); eOnce = empty.data('once', true); }
                        full.hide().empty();
                        empty.show();
                    }
                    goodsN.text(itemNum);
                    num.text(itemNum);
                    // 删除订单 价格减掉
                    var delPrice = $(countPrice[index]).text() * $(count[index]).text();
                    // 对价格进行取数并赋值
                    price.text(Math.round((price.text() - delPrice)*100)/100);
                })
            }
        })
    })
    //#endregion

    //#region _____电梯计算
    var elevator = {},
        $win = $(window),
        timer = null;

        elevator.$elevator = $("#elevator");
        elevator.$elevator.items = elevator.$elevator.find('.elevator-item');;
    // 得到可视区内的楼层
    elevator.whichFloor = function () {
        var $layers = $('.layer'),
            // 初始为-1；
            num = -1;
        // 遍历满足元素offset().top高度高于滚动条的高度 那么index要减1 得到可视区范围的楼层号
        $layers.each(function (index, elem) {
            // 当前楼层的offset().top
            var floorData = layerData[index];
            // 条件都不满足 情况下 返回循环结束的最后索引
            num = index;
            // 遍历哪个元素的上边沿比滚动条大，那就说明大的那个元素索引-1就是出现在可视区范围的元素
            if($win.scrollTop() + $win.height() / 2 < floorData.offsetTop) {
                
                num = index -1;
                return false;
            }

        })
        return num ;//0 1 2
    };
    // console.log(elevator.whichFloor());
    // 设置相应的楼层css
    function setElevator() {
        var num = elevator.whichFloor();
        if(num === -1) {//hide
            elevator.$elevator.fadeOut();
        }else{//show
            elevator.$elevator.fadeIn();

            elevator.$elevator.items.removeClass('elevator-active');
            elevator.$elevator.items.eq(num).addClass('elevator-active');

        }
    }

    $win.on('scroll resize', function () {
        if(timer) clearTimeout(timer);
        timer = setTimeout(setElevator, 200);
    })

    // 电梯item点击事件
    var target = null;
    elevator.$elevator.on('click', '.elevator-item', function () {
        var height = 0;
        // var index = elevator.$elevator.items.index(this);
        var index = $(this).index();// 0 1 2


        if( target === index) return ;
        target = index;

        // 一
        $('html, body').animate({
            scrollTop : layerData[index].offsetTop
        })

        // 二
        // height = layerData[index].offsetTop;
        // $win.scrollTop(height);
    });
    //#endregion
    
    //#region _____测栏滚动条 
    var $top = $("#goTop");
    $top.on('click', function () {
        $('html, body').animate({
                    scrollTop : 0
                })
        });
    //#endregion
    

















}(jQuery))

