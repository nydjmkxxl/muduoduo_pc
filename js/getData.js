(function ($) {
    'use strict'

    //#region _____站点导航下拉事件      请求数据
    var $mineDropdown = $('.mine-dropdown');
    $mineDropdown.on('mineDropdown-show', function (e, i, $elem, dropdownObj) {
        // console.log(e.type, i ,$elem, dropdownObj);
        var $mineLayer = $(this).find('.dropdown-layer'),
            mineLink = $mineLayer.data('load'),
            loaded = $mineLayer.data('loaded'),
            help = $('#help'),
            html = '';

            if(!mineLink) return ;

            if(!loaded) {
                // 添加临时加载图片
                $mineLayer.html('<li class="loading-pic"></li>')
                .css({
                    width: 72,
                    height: 72,
                });
                // 添加 html
                $.getJSON(mineLink, function (data, textStatus, jqXHR) {
                    // console.log(data);
                    // console.log('加载');
                    for(var i=0, mineLen = data.length; i<mineLen; i++) {
                        html += `<li><a href="${data[i].url}">${data[i].name}</a></li>`;
                    }
                    
                    help.html(html);

                    var width = help.width(),
                        height = help.height();

                    setTimeout(function () {
                        $mineLayer.width(width).height(height).html(html).find('li').width(width-10);

                        // layer层item被点击后隐藏父、子元素
                        if(dropdownObj.options.disappear) {
                            $mineLayer.find('li').on('click', function () {
                                dropdownObj.hide();
                                return false;
                            });
                        }
                    }, 500)

                    $mineLayer.data('loaded', true);

                });
            }
    });
    //#endregion

    //#region _____购物车下拉事件        请求数据
    var $cartDropdown = $('.cart-dropdown');
    $cartDropdown.on('cartDropdown-show', function (e, i, $elem, cartDropdown) {
        // console.log(e, i, $elem, cartDropdown);
    var $cartLayer = $(this).find('.dropdown-layer'),
        cartLink = $cartLayer.data('load'),
        loaded = $cartLayer.data('loaded'),
        help = $('#help'),
        html = `<div class="empty"><p><i class="icon empty-icon empty-icon-t">&#xe613;</i>
        <i class="icon empty-icon empty-icon-o">&#xe613;</i><i class="icon empty-icon">&#xe613;</i></p>
        <p><span>购物车没有商品<br />赶紧选购吧！</span></p></div><div class="full"><ul><li>最新加入的商品</li>`;

    if(!cartLink) return ;


    if(!loaded) {

        $cartLayer.html('<li class="loading-pic"></li>')
            .css({
                width: 355,
                height: 140,
            });
            // 添加 html
            $.getJSON(cartLink, function (data, textStatus, jqXHR) {
                // console.log(data);
                for(var i=0, cartLen = data.length; i<cartLen; i++) {
                    html += `<li class="item"><a href=""><img class="fl" src=${data[i].src} alt=""><span class="shopName">${data[i].name}<span/></a><i class="del hand">X</i><br />￥<i class="countPrice">${data[i].price}</i> x <i class="count" >${data[i].count}</i></li>`;
                
                }
                html += `<li class="total"><span>共<span class="num special ">0</span>件商品 共计￥<span class="price special ">0.00</span></span> <a href="#">去购物车</a></li></ul></div> `;
                
                help.html(html);

                var width = help.width() ;

                setTimeout(function () {
                    
                    $cartLayer.width(width+142).html(html);

                    $cartLayer.data('loaded', true);
                    $cartLayer.trigger('loaded', [true]);

                    // layer层item被点击后隐藏父、子元素
                    if(cartDropdown.options.disappear) {
                        $cartLayer.find('li').on('click', function () {
                            cartDropdown.hide();
                            return false;
                        });
                    }
                }, cartDropdown.options.loading);

                
                

            });
        }
    }) 
    //#endregion
    
    //#region _____搜索栏下拉事件        请求数据 
    var searchForm = $('#form'),
        $searchDropdown = $('.search-dropdown'),
        $inputText = $searchDropdown.find('.inputText'),
        $inputBtn = $searchDropdown.find('.search-btn'),
        help = $('#help'),
        $searchLayer = $searchDropdown.find('.dropdown-layer');
    $searchDropdown.on('searchDropdown-show', function (e, i, $elem, searchDropdownObj) {
        console.log(e.type);


        searchForm.on('submit', function () {
            if(!$.trim($inputBtn.val())) {
                return false;
            }
        })


        var a = 0;
        var timer = null;
        $inputText.on('input', function (e) {


            //#region _____ 
        var url = 'https://suggest.taobao.com/sug?code=utf-8&_ksTS=1600024269191_371&callback=jsonp372&k=1&area=c2c&bucketid=5&q=' + $.trim($inputText.val());

        if(timer) {
            clearTimeout(timer);
        };

        timer = setTimeout(function () {
         

            $.ajax({
                type: "POST",
                url: url,
                data: "data",
                dataType: "jsonp",
            }).done(function (data) {
                var html = '',
                    data = data.result;

                if(data.length > searchDropdownObj.options.len) { data.length = searchDropdownObj.options.len; }
                console.log(data);

                for(var i=0, len = data.length; i<len; i++) {
                    html += `<li>${data[i][0]}</li>`;
                }
    
                help.html(html);
    
                    var width = help.width() ,
                        height = help.height();
    
                $searchLayer.height(height).html(html);

                if(!data.length) {
                    $searchLayer.height(0).html(''); 
                    $searchLayer.css('border', 'none');
                    return ;
                }else{
                    $searchLayer.showHide('show');
                }
                
                var inputTextFn, layerHideFn;
                $searchLayer
                .off('mouseenter', inputTextFn)
                .off('click', layerHideFn)
                .on('mouseenter', 'li', inputTextFn = function (e) {
                    var $this = $(this);
                    $inputText.val($this.text());
    
                })
                .on('click', 'li', layerHideFn = function () {
                    var $this = $(this);
                    $inputText.val($this.text());
                    // console.log(searchForm);
                    $('#form').submit();
                })
    
                if(searchDropdownObj.options.disappear) {
                    $searchLayer.on('click', 'li', function () {
                        searchDropdownObj.hide();
                        return false;
                    });
                }
    
                if(len === 0) {
                    $searchLayer.height(0);
                    $searchLayer.css('border', 'none');
                }else{
                    $searchLayer.css('border', '1px solid #c3c3c3');
                }
    
                var inputSubmit ;
                $inputBtn.off('click', inputSubmit)
                .on('click', inputSubmit = function (e) {
                    // console.log(searchForm);
    
                    if($.trim($inputText.val()) == '') {
                        return false;
                    }


                    $('.search-btn').submit(function (e) { 
                        // console.log(e);
                        // window.location.url = 'https://suggest.taobao.com/sug?code=utf-8&_ksTS=1600024269191_371&callback=jsonp372&k=1&area=c2c&bucketid=5&q=' + $.trim($inputText.val());
                        // console.log("btn提交");
                        
                        // // e.preventDefault();
                        // return false;
                        $('#form').submit();
                        searchDropdownObj.hide();
                        
                    });
                    $('.search-btn').submit();
                    return false;
                }) 
                    
    
                $searchLayer.on('mouseleave', function () {
                    searchDropdownObj.hide();
                    return false;
                })
    
    
    
    
    
    
            }).fail(function (data) {

            }).always(function (data) {
                // console.log('总是');
            });


        }, searchDropdownObj.options.ajaxDelay)

            //#endregion


        })
    })
    //#endregion
    
    //#region _____主体商品分类          请求数据
   var $categoryDropdown = $('.category-dropdown');
   $categoryDropdown.on('categoryDropdown-show', function (e, i, $elem, categoryDropdownObj) {
    //    console.log(categoryDropdownObj);
       // console.log(e.type, i ,$elem, dropdownObj);
    //    console.log(e.type, "事件");
       var $categoryLayer = $(this).find('.dropdown-layer'),
           categoryLink = $categoryLayer.data('load'),
           loaded = $categoryLayer.data('loaded'),
           help = $('#help'),
           html = '';

           if(!categoryLink) return ;

           if(!loaded) {
               // 添加临时加载图片
               $categoryLayer.html('<li class="loading-pic"></li>');

               // 添加 html

               $.getJSON(categoryLink, function (data, textStatus, jqXHR) {
                //    console.log(data, '数据');

                   for(var i=0, categoryLen = data.length; i<categoryLen; i++) {
                       html += `<dl class="fl">
                                    <dt class="fl"><a href="#">${data[i].title}<a/><i class="layer-line">|</i></dt>
                                    <dd class="fl">` ;
                                    
                        for(var j=0, iLen=data[i].items.length; j<iLen; j++) {

                            // if(j == 6 || j == 14 || j == 21) { html += '<br />'; }

                            html += `<a href="#" class="layer-text">${data[i].items[j]}</a>` ;

                            

                        }
                        
                        html += `</dd></dl>`;
                    }
                       setTimeout(function () {
                        $categoryLayer.html(html)
                       }, categoryDropdownObj.options.loading);

                   $categoryLayer.data('loaded', true);

               });
           }
   });
   //#endregion

    //#region _____主体banner图          请求数据
   (function ($) {
       'use strict'
       var $mainBanner = $('.container'), 
       load,
       loadedItemNum = 0,
       loadedTotal = $mainBanner.find('.item').length,
       items = {};
   //    $mainBanner.on('move moved', function (e, index, elem) {
   //     console.log(e.type, index);
   //    })
   // $mainBanner.on('slide-show slide-shown slide-hide slide-hidden', function (e, index, elem, SlideFadeSwitchObj) {
   // 接受show触发事件，然后出发加载事件
   $mainBanner.on('slide-show fade-show switch-show', load = function (e, index, elem, SlideFadeSwitchObj) {
       // console.log(e.type, index);
       if(items[index] !== 'loaded') {
           // 如果没加载那就就触发加载事件
           $mainBanner.trigger('loadItem', [index, elem, SlideFadeSwitchObj]);
       }
  });
   // 加载事件完成触发一个全部加载完成事件
   $mainBanner.on('loadItem', function (e, index, elem, SlideFadeSwitchObj) {
       var $img = $(elem).find('.slide-img');
       // if(!$imgLoaded) {

           loading($img.data('src'), function (url) {
               // console.log($img.data('src'));
               setTimeout(function () {
                   $img.removeClass('load-pic');
                   $img.attr('src', url);
                   items[index] = 'loaded';
                   loadedItemNum++;
                   if(loadedItemNum === loadedTotal) {
                       // $mainBanner.off('slide-show fade-show switch-show', load);
                       // 全部加载完成触发一个all-loaded
                       $mainBanner.trigger('all-loaded')
                   }
               }, SlideFadeSwitchObj.option.interval-1000)
               // console.log(index, 'loaded');
           }, function (url) {
               // 重新加载
               // 备用图片                    
               setTimeout(function () {
                   $img.removeClass('load-pic');
                   $img.attr('src', '../img/focus-slider/2.jpg');
                   items[index] = 'loaded';
                   loadedItemNum++;
               }, SlideFadeSwitchObj.option.interval-1000)
           });
       // }

       function loading(url, imgLoaded, imgfailed) {
           // console.log(url);
           var image = new Image();

           image.src= url;

           image.onload = function () {
               if(typeof imgLoaded === 'function') {
                   imgLoaded(url);
               }
           }
           image.onerror = function () {
               if(typeof imgfailed === 'function') {
                   imgfailed(url);
               }
           }
       }
   })
   // 接受事件后，解除加载事件
   $mainBanner.on('all-loaded', function (e) {
    //    console.log("all-loaded");
       $mainBanner.off('slide-show fade-show switch-show', load);
   })

           
   }(jQuery))
   //#endregion

    //#region _____today                 请求数据
    ;(function ($) {
        'use strict'
        var $today = $('.today-container'), 
        load,
        loadedItemNum = 0,
        loadedTotal = $today.find('.item').length,
        items = {};
    //    $today.on('move moved', function (e, index, elem) {
    //     console.log(e.type, index);
    //    })
    // $today.on('slide-show slide-shown slide-hide slide-hidden', function (e, index, elem, SlideFadeSwitchObj) {
    // 接受show触发事件，然后出发加载事件
    $today.on('slide-show fade-show switch-show', load = function (e, index, elem, SlideFadeSwitchObj) {
    // console.log(e.type, index);
    if(items[index] !== 'loaded') {
        // 如果没加载那就就触发加载事件
        $today.trigger('loadItem', [index, elem, SlideFadeSwitchObj]);
    }
    });
    // 加载事件完成触发一个全部加载完成事件
    $today.on('loadItem', function (e, index, elem, SlideFadeSwitchObj) {
    var $img = $(elem).find('.slide-img');
    // if(!$imgLoaded) {
            loading($img.data('src'), function (url) {
                // console.log($img.data('src'));
                setTimeout(function () {
                    for(var i=0, len=loadedTotal+1; i<len; i++) {
                        var url = $($img[i]).data('src');
                        // console.log(url);
                        $($img[i]).removeClass('loading-pic');
                        $($img[i]).attr('src', url);
                    }
                    
                    items[index] = 'loaded';
                    loadedItemNum++;
                    if(loadedItemNum === loadedTotal) {
                        // $today.off('slide-show fade-show switch-show', load);
                        // 全部加载完成触发一个all-loaded
                        $today.trigger('all-loaded')
                    }
                }, SlideFadeSwitchObj.option.interval-1000)
                // console.log(index, 'loaded');
            }, function (url) {
                // 重新加载
                // 备用图片                    
                setTimeout(function () {
                    $img.removeClass('load-pic');
                    $img.attr('src', '../img/focus-slider/2.jpg');
                    items[index] = 'loaded';
                    loadedItemNum++;
                }, SlideFadeSwitchObj.option.interval-1000)
            });
        // }

    function loading(url, imgLoaded, imgfailed) {
        // console.log(url);
        var image = new Image();

        image.src= url;

        image.onload = function () {
            if(typeof imgLoaded === 'function') {
                imgLoaded(url);
            }
        }
        image.onerror = function () {
            if(typeof imgfailed === 'function') {
                imgfailed(url);
            }
        }
    }
    })
    // 接受事件后，解除加载事件
    $today.on('all-loaded', function (e) {
    // console.log("all-loaded");
    $today.off('slide-show fade-show switch-show', load);
    })
            
    }(jQuery))

    //#endregion

    //#region _____加载layer层          请求数据
    // ===============================加载 layer 文档结构===============================
    //#region _____ floor-data 
    var $layers = $('.layer');

    window.layerData = window.layerData || {};
    
    layerData = [{
        num: '1',
        text: '服装鞋包',
        tabs: ['大牌', '男装', '女装'],
        offsetTop: $layers.eq(0).offset().top,
        height: $layers.eq(0).height(),
        items: [
            [{
                name: '匡威男棒球开衫外套2015',
                price: 479
            }, {
                name: 'adidas 阿迪达斯 训练 男子',
                price: 335
            }, {
                name: '必迈BMAI一体织跑步短袖T恤',
                price: 159
            }, {
                name: 'NBA袜子半毛圈运动高邦棉袜',
                price: 65
            }, {
                name: '特步官方运动帽男女帽子2016',
                price: 69
            }, {
                name: 'KELME足球训练防寒防风手套',
                price: 4999
            }, {
                name: '战地吉普三合一冲锋衣',
                price: 289
            }, {
                name: '探路者户外男士徒步鞋',
                price: 369
            }, {
                name: '羽绒服2015秋冬新款轻薄男士',
                price: 399
            }, {
                name: '溯溪鞋涉水鞋户外鞋',
                price: 689
            }, {
                name: '旅行背包多功能双肩背包',
                price: 269
            }, {
                name: '户外旅行双肩背包OS0099',
                price: 99
            }],
            [{
                name: '匡威男棒球开衫外套2015',
                price: 479
            }, {
                name: 'adidas 阿迪达斯 训练 男子',
                price: 335
            }, {
                name: '必迈BMAI一体织跑步短袖T恤',
                price: 159
            }, {
                name: 'NBA袜子半毛圈运动高邦棉袜',
                price: 65
            }, {
                name: '特步官方运动帽男女帽子2016',
                price: 69
            }, {
                name: 'KELME足球训练防寒防风手套',
                price: 4999
            }, {
                name: '战地吉普三合一冲锋衣',
                price: 289
            }, {
                name: '探路者户外男士徒步鞋',
                price: 369
            }, {
                name: '羽绒服2015秋冬新款轻薄男士',
                price: 399
            }, {
                name: '溯溪鞋涉水鞋户外鞋',
                price: 689
            }, {
                name: '旅行背包多功能双肩背包',
                price: 269
            }, {
                name: '户外旅行双肩背包OS0099',
                price: 99
            }],
            [{
                name: '匡威男棒球开衫外套2015',
                price: 479
            }, {
                name: 'adidas 阿迪达斯 训练 男子',
                price: 335
            }, {
                name: '必迈BMAI一体织跑步短袖T恤',
                price: 159
            }, {
                name: 'NBA袜子半毛圈运动高邦棉袜',
                price: 65
            }, {
                name: '特步官方运动帽男女帽子2016',
                price: 69
            }, {
                name: 'KELME足球训练防寒防风手套',
                price: 4999
            }, {
                name: '战地吉普三合一冲锋衣',
                price: 289
            }, {
                name: '探路者户外男士徒步鞋',
                price: 369
            }, {
                name: '羽绒服2015秋冬新款轻薄男士',
                price: 399
            }, {
                name: '溯溪鞋涉水鞋户外鞋',
                price: 689
            }, {
                name: '旅行背包多功能双肩背包',
                price: 269
            }, {
                name: '户外旅行双肩背包OS0099',
                price: 99
            }]
        ]
    }, {
        num: '2',
        text: '个护美妆',
        tabs: ['热门', '国际大牌', '国际名品'],
        offsetTop: $layers.eq(1).offset().top,
        height: $layers.eq(1).height(),
        items: [
            [{
                name: '韩束红石榴鲜活水盈七件套装',
                price: 169
            }, {
                name: '温碧泉八杯水亲亲水润五件套装',
                price: 198
            }, {
                name: '御泥坊红酒透亮矿物蚕丝面膜贴',
                price: 79.9
            }, {
                name: '吉列手动剃须刀锋隐致护',
                price: 228
            }, {
                name: 'Mediheal水润保湿面膜',
                price: 119
            }, {
                name: '纳益其尔芦荟舒缓保湿凝胶',
                price: 39
            }, {
                name: '宝拉珍选基础护肤旅行四件套',
                price: 299
            }, {
                name: '温碧泉透芯润五件套装',
                price: 257
            }, {
                name: '玉兰油多效修护三部曲套装',
                price: 199
            }, {
                name: 'LOREAL火山岩控油清痘洁面膏',
                price: 36
            }, {
                name: '百雀羚水嫩倍现盈透精华水',
                price: 139
            }, {
                name: '珀莱雅新柔皙莹润三件套',
                price: 99
            }],
            [{
                name: '韩束红石榴鲜活水盈七件套装',
                price: 169
            }, {
                name: '温碧泉八杯水亲亲水润五件套装',
                price: 198
            }, {
                name: '御泥坊红酒透亮矿物蚕丝面膜贴',
                price: 79.9
            }, {
                name: '吉列手动剃须刀锋隐致护',
                price: 228
            }, {
                name: 'Mediheal水润保湿面膜',
                price: 119
            }, {
                name: '纳益其尔芦荟舒缓保湿凝胶',
                price: 39
            }, {
                name: '宝拉珍选基础护肤旅行四件套',
                price: 299
            }, {
                name: '温碧泉透芯润五件套装',
                price: 257
            }, {
                name: '玉兰油多效修护三部曲套装',
                price: 199
            }, {
                name: 'LOREAL火山岩控油清痘洁面膏',
                price: 36
            }, {
                name: '百雀羚水嫩倍现盈透精华水',
                price: 139
            }, {
                name: '珀莱雅新柔皙莹润三件套',
                price: 99
            }],
            [{
                name: '韩束红石榴鲜活水盈七件套装',
                price: 169
            }, {
                name: '温碧泉八杯水亲亲水润五件套装',
                price: 198
            }, {
                name: '御泥坊红酒透亮矿物蚕丝面膜贴',
                price: 79.9
            }, {
                name: '吉列手动剃须刀锋隐致护',
                price: 228
            }, {
                name: 'Mediheal水润保湿面膜',
                price: 119
            }, {
                name: '纳益其尔芦荟舒缓保湿凝胶',
                price: 39
            }, {
                name: '宝拉珍选基础护肤旅行四件套',
                price: 299
            }, {
                name: '温碧泉透芯润五件套装',
                price: 257
            }, {
                name: '玉兰油多效修护三部曲套装',
                price: 199
            }, {
                name: 'LOREAL火山岩控油清痘洁面膏',
                price: 36
            }, {
                name: '百雀羚水嫩倍现盈透精华水',
                price: 139
            }, {
                name: '珀莱雅新柔皙莹润三件套',
                price: 99
            }]
        ]
    }, {
        num: '3',
        text: '手机通讯',
        tabs: ['热门', '品质优选', '新机尝鲜'],
        offsetTop: $layers.eq(2).offset().top,
        height: $layers.eq(2).height(),
        items: [
            [{
                name: '摩托罗拉 Moto Z Play',
                price: 3999
            }, {
                name: 'Apple iPhone 7 (A1660)',
                price: 6188
            }, {
                name: '小米 Note 全网通 白色',
                price: 999
            }, {
                name: '小米5 全网通 标准版 3GB内存',
                price: 1999
            }, {
                name: '荣耀7i 海岛蓝 移动联通4G手机',
                price: 1099
            }, {
                name: '乐视（Le）乐2（X620）32GB',
                price: 1099
            }, {
                name: 'OPPO R9 4GB+64GB内存版',
                price: 2499
            }, {
                name: '魅蓝note3 全网通公开版',
                price: 899
            }, {
                name: '飞利浦 X818 香槟金 全网通4G',
                price: 1998
            }, {
                name: '三星 Galaxy S7（G9300）',
                price: 4088
            }, {
                name: '华为 荣耀7 双卡双待双通',
                price: 1128
            }, {
                name: '努比亚(nubia)Z7Max(NX505J)',
                price: 728
            }],
            [{
                name: '摩托罗拉 Moto Z Play',
                price: 3999
            }, {
                name: 'Apple iPhone 7 (A1660)',
                price: 6188
            }, {
                name: '小米 Note 全网通 白色',
                price: 999
            }, {
                name: '小米5 全网通 标准版 3GB内存',
                price: 1999
            }, {
                name: '荣耀7i 海岛蓝 移动联通4G手机',
                price: 1099
            }, {
                name: '乐视（Le）乐2（X620）32GB',
                price: 1099
            }, {
                name: 'OPPO R9 4GB+64GB内存版',
                price: 2499
            }, {
                name: '魅蓝note3 全网通公开版',
                price: 899
            }, {
                name: '飞利浦 X818 香槟金 全网通4G',
                price: 1998
            }, {
                name: '三星 Galaxy S7（G9300）',
                price: 4088
            }, {
                name: '华为 荣耀7 双卡双待双通',
                price: 1128
            }, {
                name: '努比亚(nubia)Z7Max(NX505J)',
                price: 728
            }],
            [{
                name: '摩托罗拉 Moto Z Play',
                price: 3999
            }, {
                name: 'Apple iPhone 7 (A1660)',
                price: 6188
            }, {
                name: '小米 Note 全网通 白色',
                price: 999
            }, {
                name: '小米5 全网通 标准版 3GB内存',
                price: 1999
            }, {
                name: '荣耀7i 海岛蓝 移动联通4G手机',
                price: 1099
            }, {
                name: '乐视（Le）乐2（X620）32GB',
                price: 1099
            }, {
                name: 'OPPO R9 4GB+64GB内存版',
                price: 2499
            }, {
                name: '魅蓝note3 全网通公开版',
                price: 899
            }, {
                name: '飞利浦 X818 香槟金 全网通4G',
                price: 1998
            }, {
                name: '三星 Galaxy S7（G9300）',
                price: 4088
            }, {
                name: '华为 荣耀7 双卡双待双通',
                price: 1128
            }, {
                name: '努比亚(nubia)Z7Max(NX505J)',
                price: 728
            }]
        ]
    }, {
        num: '4',
        text: '家用电器',
        tabs: ['热门', '大家电', '生活电器'],
        // offsetTop: $layers.eq(3).offset().top,
        // height: $layers.eq(3).height(),
        items: [
            [{
                name: '暴风TV 超体电视 40X 40英寸',
                price: 1299
            }, {
                name: '小米（MI）L55M5-AA 55英寸',
                price: 3699
            }, {
                name: '飞利浦HTD5580/93 音响',
                price: 2999
            }, {
                name: '金门子H108 5.1套装音响组合',
                price: 1198
            }, {
                name: '方太ENJOY云魔方抽油烟机',
                price: 4390
            }, {
                name: '美的60升预约洗浴电热水器',
                price: 1099
            }, {
                name: '九阳电饭煲多功能智能电饭锅',
                price: 159
            }, {
                name: '美的电烤箱家用大容量',
                price: 329
            }, {
                name: '奥克斯(AUX)936破壁料理机',
                price: 1599
            }, {
                name: '飞利浦面条机 HR2356/31',
                price: 665
            }, {
                name: '松下NU-JA100W 家用蒸烤箱',
                price: 1799
            }, {
                name: '飞利浦咖啡机 HD7751/00',
                price: 1299
            }],
            [{
                name: '暴风TV 超体电视 40X 40英寸',
                price: 1299
            }, {
                name: '小米（MI）L55M5-AA 55英寸',
                price: 3699
            }, {
                name: '飞利浦HTD5580/93 音响',
                price: 2999
            }, {
                name: '金门子H108 5.1套装音响组合',
                price: 1198
            }, {
                name: '方太ENJOY云魔方抽油烟机',
                price: 4390
            }, {
                name: '美的60升预约洗浴电热水器',
                price: 1099
            }, {
                name: '九阳电饭煲多功能智能电饭锅',
                price: 159
            }, {
                name: '美的电烤箱家用大容量',
                price: 329
            }, {
                name: '奥克斯(AUX)936破壁料理机',
                price: 1599
            }, {
                name: '飞利浦面条机 HR2356/31',
                price: 665
            }, {
                name: '松下NU-JA100W 家用蒸烤箱',
                price: 1799
            }, {
                name: '飞利浦咖啡机 HD7751/00',
                price: 1299
            }],
            [{
                name: '暴风TV 超体电视 40X 40英寸',
                price: 1299
            }, {
                name: '小米（MI）L55M5-AA 55英寸',
                price: 3699
            }, {
                name: '飞利浦HTD5580/93 音响',
                price: 2999
            }, {
                name: '金门子H108 5.1套装音响组合',
                price: 1198
            }, {
                name: '方太ENJOY云魔方抽油烟机',
                price: 4390
            }, {
                name: '美的60升预约洗浴电热水器',
                price: 1099
            }, {
                name: '九阳电饭煲多功能智能电饭锅',
                price: 159
            }, {
                name: '美的电烤箱家用大容量',
                price: 329
            }, {
                name: '奥克斯(AUX)936破壁料理机',
                price: 1599
            }, {
                name: '飞利浦面条机 HR2356/31',
                price: 665
            }, {
                name: '松下NU-JA100W 家用蒸烤箱',
                price: 1799
            }, {
                name: '飞利浦咖啡机 HD7751/00',
                price: 1299
            }]
        ]
    }, {
        num: '5',
        text: '电脑数码',
        tabs: ['热门', '电脑/平板', '潮流影音'],
        // offsetTop: $layers.eq(4).offset().top,
        // height: $layers.eq(4).height(),
        items: [
            [{
                name: '戴尔成就Vostro 3800-R6308',
                price: 2999
            }, {
                name: '联想IdeaCentre C560',
                price: 5399
            }, {
                name: '惠普260-p039cn台式电脑',
                price: 3099
            }, {
                name: '华硕飞行堡垒旗舰版FX-PRO',
                price: 6599
            }, {
                name: '惠普(HP)暗影精灵II代PLUS',
                price: 12999
            }, {
                name: '联想(Lenovo)小新700电竞版',
                price: 5999
            }, {
                name: '游戏背光牧马人机械手感键盘',
                price: 499
            }, {
                name: '罗技iK1200背光键盘保护套',
                price: 799
            }, {
                name: '西部数据2.5英寸移动硬盘1TB',
                price: 419
            }, {
                name: '新睿翼3TB 2.5英寸 移动硬盘',
                price: 849
            }, {
                name: 'Rii mini i28无线迷你键盘鼠标',
                price: 349
            }, {
                name: '罗技G29 力反馈游戏方向盘',
                price: 2999
            }],
            [{
                name: '戴尔成就Vostro 3800-R6308',
                price: 2999
            }, {
                name: '联想IdeaCentre C560',
                price: 5399
            }, {
                name: '惠普260-p039cn台式电脑',
                price: 3099
            }, {
                name: '华硕飞行堡垒旗舰版FX-PRO',
                price: 6599
            }, {
                name: '惠普(HP)暗影精灵II代PLUS',
                price: 12999
            }, {
                name: '联想(Lenovo)小新700电竞版',
                price: 5999
            }, {
                name: '游戏背光牧马人机械手感键盘',
                price: 499
            }, {
                name: '罗技iK1200背光键盘保护套',
                price: 799
            }, {
                name: '西部数据2.5英寸移动硬盘1TB',
                price: 419
            }, {
                name: '新睿翼3TB 2.5英寸 移动硬盘',
                price: 849
            }, {
                name: 'Rii mini i28无线迷你键盘鼠标',
                price: 349
            }, {
                name: '罗技G29 力反馈游戏方向盘',
                price: 2999
            }],
            [{
                name: '戴尔成就Vostro 3800-R6308',
                price: 2999
            }, {
                name: '联想IdeaCentre C560',
                price: 5399
            }, {
                name: '惠普260-p039cn台式电脑',
                price: 3099
            }, {
                name: '华硕飞行堡垒旗舰版FX-PRO',
                price: 6599
            }, {
                name: '惠普(HP)暗影精灵II代PLUS',
                price: 12999
            }, {
                name: '联想(Lenovo)小新700电竞版',
                price: 5999
            }, {
                name: '游戏背光牧马人机械手感键盘',
                price: 499
            }, {
                name: '罗技iK1200背光键盘保护套',
                price: 799
            }, {
                name: '西部数据2.5英寸移动硬盘1TB',
                price: 419
            }, {
                name: '新睿翼3TB 2.5英寸 移动硬盘',
                price: 849
            }, {
                name: 'Rii mini i28无线迷你键盘鼠标',
                price: 349
            }, {
                name: '罗技G29 力反馈游戏方向盘',
                price: 2999
            }]
        ]
    }];
    
    //#endregion
    // f为要创建的楼层，初始值为 0；
    // 创建html文档
    function buildLayer(f) {
        var html = '';
            html += `<div class="wrap">`;
            html += buildLayerHead(f, layerData);
            html += buildLayerBody(f, layerData);
            html += `</div>`;
        return html ;
    }
    // 添加文档
    // $layers.eq(0).html(buildLayer(0));
    // $layers.eq(1).html(buildLayer(1));
    // $layers.eq(2).html(buildLayer(2));
    // 创建头部html
    function buildLayerHead(f, layerData) {
        var html = '';
            html += `<div class="layer-head">
                        <h2 class="head-left fl">
                            <span class="left-num">${layerData[f].num}</span>
                            <span class="left-tit">${layerData[f].text}</span>
                        </h2>
                        <ul class="head-right fr">;
                            <li class="fl"><a href="javascript:;" class="head-item">${layerData[f].tabs[0]}</a></li>
                            <li class="dividing heade-item fl">|</li>
                            <li class="fl"><a href="javascript:;" class="head-item">${layerData[f].tabs[1]}</a></li>
                            <li class="dividing heade-item fl">|</li>
                            <li class="fl"><a href="javascript:;" class="head-item">${layerData[f].tabs[2]}</a></li>
                        </ul>
                    </div>`;
        return html ;
    }
    // 创建躯体html
    function buildLayerBody(f, layerData) {
        var html = '';

        html += `<div class="layer-body">`;
        for(var i=0, len=layerData[0].tabs.length; i<len; ++i) {
            html += `<ul class="content">`;
            for(var j=0, jLen=layerData[f].items[i].length; j<jLen; ++j) {
                // console.log(layerData[f].items[i][j].name);
                html += `<li class="body-item fl">
                            <p class="body-item-pic"><a href="#"><img class="layer-img" data-src="../img/floor/${f+1}/${i+1}/${j+1}.jpg" src="../img/floor/loading.gif"></a></p>
                            <p class="body-item-name "><a href="#" class="hover">${layerData[f].items[i][j].name}</a></p>
                            <p class="body-item-price">￥${layerData[f].items[i][j].price}</p>
                        </li>`;

            }
            html += `</ul>`;
        }
        html += `</div>`;
        
        return html ;

    }
    // 是否在可视区
    var $win = $(window);
    var $doc = $(document);
    function isVisible($elem) {
        //  元素上边线刚要出现的那一个刻                元素下边线消失的那一刻
        return $win.height() + $win.scrollTop() > $elem.offset().top && $win.scrollTop() < $elem.offset().top + $elem.height();

    }

    // 加载楼层
    function loadLayer() {
        var loadFn,
        loadedItemNum = 0,
        layerLen = $layers.length;

        $doc.on('layerFloor-show', loadFn = function (e, index, elem) {

            var isLoaded = $(elem).data('isLoaded');
            if(!isLoaded) {
                // 如果没加载那就就触发加载事件
                $doc.trigger('layerFloor-loadPic', [index, elem]);
            }
        }); 

        // 加载事件完成触发一个全部加载完成事件
        $doc.on('layerFloor-loadPic', function (e, index, elem) {
                var html = buildLayer(index),
                $elem = $(elem);

                // setTimeout(function () {
                        var sureLoaded = $(elem).data('isLoaded');
                        if( sureLoaded ) return ;
                        $(elem).data('isLoaded', true);
                        loadedItemNum++;
                // }, toggleObj.option.dela)

                if(loadedItemNum === layerLen) {
                    $doc.trigger('layerFloor-show-end')
                    // $win.off('scroll resize', needShow);
                }

                setTimeout(function () {
                    $elem.html(html);
                    $elem.tab({
                        event : 'mouseenter',// click mouseenter
                        css3 : false,
                        js : false,
                        animation : 'fade',
                        activeIndex : 0,
                        // 自动播放间隔
                        interval : 0,
                        // 反应间隔
                        delay : 0,
                        // 模拟加载延迟
                        dela : 1000
                    });



                }, 1000)
        });

        // 接受事件后，解除加载事件
        $doc.on('layerFloor-show-end', function (e) {
            // console.log('over');
            $layers.off('layerFloor-show', loadFn);
            $win.off('scroll resize', needShow);
        })


    }

    function needShow(elem) {
        // console.log('show');
        // 在可视区范围返回true
        $layers.each(function (index, elem) {
            if(isVisible($(elem))) {    
                // console.log((index + 1) + 'floor见到了');
                $doc.trigger('layerFloor-show', [index, elem]);
                
            }
        });
    }

    $win.on('scroll resize', needShow);

    loadLayer();
    needShow();


    //#endregion

    //#region _____ 楼层图片加载         请求数据
    // ===============================加载 layer中的 图片===============================
    (function ($) {
        'use strict'
        var loadFnU,
        loadedItemNum = 0;
        $layers.on('toggle-show', loadFnU = function (e, index, elem, toggleObj) {
            var contentLen = $layers.find('.content').length;
            var isLoaded = $(elem).data('isLoaded');
            if(!isLoaded) {
                // 如果没加载那就就触发加载事件
                $layers.trigger('layer-loadPic', [index, elem, toggleObj]);
            }
        }); 

        // 加载事件完成触发一个全部加载完成事件
        $layers.on('layer-loadPic', function (e, index, elem, toggleObj) {
            var imgs = $(elem).find('.layer-img'),
                len = $(elem).find('.layer-img').length,
                url;

            for(var i=0; i<len; i++) { 
                url = $(imgs[i]).data('src');
                layerLoad(i, url, function (i, url) {
                    var contentLen = $layers.find('.content').length;
                    setTimeout(function () {
                        $(imgs[i]).attr('src', url);
                        if(i === len-1) {
                            var sureLoaded = $(elem).data('isLoaded');
                            if( sureLoaded ) return ;
                            $(elem).data('isLoaded', true);

                            loadedItemNum++;
                            if(loadedItemNum === 9) {
                                console.log("layer解绑");
                                console.log(loadedItemNum,contentLen);
                                $layers.trigger('end');
                                // console.log("解绑");
                            }
                        }

                    }, toggleObj.option.dela)

                }, function (i, url) {
                    // 重新加载
                    // 备用图片                    
                    imgs.attr('src', '../img/floor/placeholder.png');
                });
            }

            function layerLoad(i, url, imgLoaded, imgfailed) {
                // console.log(url);
                var image = new Image();
                image.src= url;
    
                image.onload = function () {
                    if(typeof imgLoaded === 'function') {
                        imgLoaded(i, url);
                    }
                }
                image.onerror = function () {
                    if(typeof imgfailed === 'function') {
                        imgfailed(i, url);
                    }
                }
            } 

        });

        // 接受事件后，解除加载事件
        $layers.on('end', function (e) {
            $layers.off('toggle-show', loadFnU);
        })
            
    }(jQuery))
    //#endregion

    //#region _____friend-link & footer 加载       请求数据 
    var page = {};
    page.$friend = $('#friend-link');
    page.$footer = $('#footer');
    page.pageFriendData = [
        {
            num : '0',
            title : '消费者保障',
            items : ['保障范围', '退货退款流程', '服务中心', '更多特色服务' ]
        },{
            num : '1',
            title : '新手上路',
            items : ['新手专区', '消费提示', '交易安全', '24小时在线帮助', '免费开店' ]
        },{
            num : '2',
            title : '付款方式',
            items : ['快捷支付', '信用卡', '余额宝', '蜜蜂花呗', '货到付钱' ]
        },{
            num : '3',
            title : '新手上路',
            items : ['新手专区', '消费提示', '交易安全', '24小时在线帮助', '免费开店' ]
        }
    ];
    page.pageFooterData = [
        {
            link : [
                '关于慕多多',
                '合作伙伴',
                '营销中心',
                '廉政举报',
                '联系客服',
                '开放平台',
                '诚征英才',
                '联系我们',
                '网站地图',
                '法律声明',
                '知识产权'
            ],
            right : '&copy; 2020 imooc.com All Rights Reserved'
        }
    ];
    // 创建友情链接html
    page.createFriend = function () {
        var html = '';
        html = `<div class="wrap container">`;
        for(var i=0, len=page.pageFriendData.length; i<len; ++i) {
            html += `<dl class=" fl">
                        <dt>${page.pageFriendData[i].title}</dt>`;
            for(var j=0, jLen=page.pageFriendData[i].items.length; j<jLen; ++j ) {
                html += `<dd><a href="#">${page.pageFriendData[i].items[j]}</a></dd>`;
            }
            html += `</dl>`;
        }
        html += `</div>`;
        return html ;
    };

    // 创建所有权
    page.createFooter = function () {
        var html ='';
        html = `<div class="wrap"><p>`;
        for(var i=0, len=page.pageFooterData[0].link.length; i<len; ++i) {
            html += `<a href="#">${page.pageFooterData[0].link[i]}</a>`;
        }
        html += `</p><p>${page.pageFooterData[0].right}</p></div>`;
        return html ;
    };
    // html加载时机
    page.pageFriendData.height = page.$friend.offset().top;
    // window事件监听
    page.load = null;
    $win.on('scroll resize', page.load = function () {
        if($win.scrollTop() > page.pageFriendData.height || $win.scrollTop() + $win.height() > page.pageFriendData.height) {
            setTimeout(function () {
                page.$friend.html(page.createFriend());
                page.$footer.html(page.createFooter());
                page.$friend.data('loaded', true);
            }, 1000)
        }
        if(page.$friend.data('loaded')) {
            $win.off('scroll resize', page.load);
            console.log('解绑了');
        }
    })
    //#endregion

}(jQuery))


