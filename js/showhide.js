(function ($) {
    'use strict'
    //NAME:style of show or hide
    //CALLER-METHOD:show/hide()
    //EXPLAIN: silent/css3/js _ fade slideUpDown slideLeftRight fadeSlideUpDown fadeSlideLeftRight
    //#region _____world function


    // li获取高度 文本设置center就不会固定显示
    function liInit($elem) {
        var li = $elem.find('li');
        if(li.length) {
            $elem.show();
            li.width(li.width());
            $elem.hide();
        }
    }
    // 箭头旋转角度初始化，不然结束不旋转
    function arrowRotate($elem) {

        var arrowI = $elem.parent().find('.dropdown-arrow');
        // console.log(arrowI);
        // console.log($elem);
        arrowI.addClass('rotate-init');
    }

    function init($elem, initCallback) {
        arrowRotate($elem);
        if($elem.is(':hidden')) {
            $elem.data('status', 'hidden');
            if (typeof initCallback === 'function') initCallback();
        }else{
            $elem.data('status', 'shown');
        }
    }
    function show($elem, showCallback) {
        if($elem.data('status') === 'show') return ;
        if($elem.data('status') === 'shown') return ;
        $elem.data('status', 'show').trigger('show');
        showCallback();
    }
    function hide($elem, hideCallback) {
        if($elem.data('status') === 'hide') return ;
        if($elem.data('status') === 'hidden') return ;
        $elem.data('status', 'hide').trigger('hide');
        hideCallback();
    }
    //#endregion

    //#region _____silent 
    var silent = {
        init : init,//function ($elem) { init ($elem)},
        show : function ($elem) {
            show($elem, function () {
                $elem.show();
                $elem.data('status', 'shown').trigger('shown');
            })
        },
        hide : function ($elem) {
            hide($elem, function () {
                $elem.hide();
                $elem.data('status', 'hidden').trigger('hidden');
            })
        }
    };
    //#endregion
    
    //#region _____css3 
    var css3 = {
            _init : function ($elem, className) {
                $elem.addClass('transition');
                liInit($elem);
                arrowRotate($elem);
                init($elem, function () {
                    $elem.addClass(className);
                })
            },
            _show : function ($elem, className) {
                show($elem, function () {
                    $elem.off(transition.end).one(transition.end, function () {
                        $elem.data('status', 'shown').trigger('shown');
                    });
                    $elem.show();
                    setTimeout(function () {
                        $elem.removeClass(className);
                    }, 20)
                   
                })
            },
            _hide :function ($elem, className) {
                hide($elem, function () {
                    $elem.off(transition.end).one(transition.end, function () {
                        $elem.hide();
                        $elem.data('status', 'hide').trigger('hidden');
                    })
                    setTimeout(function () {
                        $elem.addClass(className);
                    },70)
                });     
                
                
            },
            fade : {
                init : function ($elem) {
                    css3._init($elem, 'fadeOut');
                },
                show : function ($elem) {
                    css3._show($elem, 'fadeOut')
                },
                hide :function ($elem) {
                    css3._hide($elem, 'fadeOut');
                }
            },
            slideUpDown : {
                init : function ($elem) {
                    $elem.height($elem.height());
                    css3._init($elem, 'slideUpDown');
                },
                show : function ($elem) {
                    css3._show($elem, 'slideUpDown');
                },
                hide : function ($elem) {
                    css3._hide($elem, 'slideUpDown');
                }
            },
            slideLeftRight : {
                init : function ($elem) {
                    $elem.width($elem.width());
                    css3._init($elem, 'slideLeftRight');
                },
                show : function ($elem) {
                    css3._show($elem, 'slideLeftRight');
                },
                hide : function ($elem) {
                    css3._hide($elem, 'slideLeftRight');
                }
            },
            fadeSlideUpDown : {
                init : function ($elem) {
                    $elem.height($elem.height());
                    css3._init($elem, 'fadeOut slideUpDown');
                },
                show : function ($elem) {
                    css3._show($elem, 'fadeOut slideUpDown');
                },
                hide : function ($elem) {
                    css3._hide($elem, 'fadeOut slideUpDown');
                }
            },
            fadeSlideLeftRight : {
                init : function ($elem) {
                    $elem.width($elem.width());
                    css3._init($elem, 'slideLeftRight fadeOut');
                },
                show : function ($elem) {
                    css3._show($elem, 'slideLeftRight fadeOut');
                },
                hide : function ($elem) {
                    css3._hide($elem, 'slideLeftRight fadeOut');
                }
            }

        };
    //#endregion

    //#region _____js 
    var js = {
            _init : function ($elem) {
                $elem.removeClass('transition');
                // if($gyrate) {$gyrate.addClass('gyrate-init transition');}
                // if($elem.is(':hidden')) {
                //     $elem.data('status', 'hidden');
                // }else{
                //     $elem.data('status', 'shown');
                // }
                init($elem);
            },
            _i_init : function ($elem, options) {
                liInit($elem);
                arrowRotate($elem);
                $elem.removeClass('transition');
                // var styleArr = ['width' ,'padding-top' ,'padding-bottom' ,'margin-top' ,'margin-bottom'];
                // styleArr.forEach(function (val, i) {
                //     styleArr[val] = $elem.css(val);
                // })
                // console.log(styleArr);
                var style = options;
                for(var prop in style) {
                    style[prop] = $elem.css(prop);
                }
                $elem.data('style', style);
                if($elem.is(':hidden')) {
                    $elem.data('status', 'hidden');
                    var option = $elem.data('style'),
                        obj = {};
                    for(var attr in option) {
                       obj[attr] = attr;
                    }
                    for(var p in obj) {
                        obj[p] = 0;
                    }
                    $elem.data('animateInit', obj);
                    $elem.css(obj);

                }else{
                    $elem.data('status', 'shown');
                }
            },
            _show : function ($elem, type) {
                // if($elem.data('status') === 'show') return ;
                // if($elem.data('status') === 'shown') return ;
                // $elem.data('status', 'show').trigger('show');
                // if($gyrate) {$gyrate.addClass('gyrate');}
                show($elem, function () {
                    $elem.stop()[type](function () {
                        $elem.data('status', 'shown').trigger('shown');
                    });
                })
                
            },
            _i_show : function ($elem) {
                // if($elem.data('status') === 'show') return ;
                // if($elem.data('status') === 'shown') return ;
                // $elem.data('status', 'show').trigger('show');
                // if($gyrate) {$gyrate.addClass('gyrate');}
                show($elem, function () {
                    $elem.show().stop().animate($elem.data('style'), function () {
                        $elem.data('status', 'shown').trigger('shown');
                    });
                })
            },
            _hide : function ($elem, type) {
                // if($elem.data('status') === 'hide') return ;
                // if($elem.data('status') === 'hidden') return ;
                // $elem.data('status', 'hide').trigger('hide');
                // if($gyrate) {$gyrate.removeClass('gyrate');}
                hide($elem, function () {
                    $elem.stop()[type](function () {
                        $elem.data('status', 'hidden').trigger('hidden');
                    });
                })
            },
            _i_hide :function ($elem) {
                // if($elem.data('status') === 'hide') return ;
                // if($elem.data('status') === 'hidden') return ;
                // $elem.data('status', 'hide').trigger('hide');
                // if($gyrate) {$gyrate.removeClass('gyrate');}
                hide($elem, function () {
                    $elem.stop().animate($elem.data('animateInit'), function () {
                        $elem.hide();
                        $elem.data('status', 'hidden').trigger('hidden');
                    });
                })
            },
        fade : {
            init : function ($elem) { js._init($elem)},
            show : function ($elem) {
                js._show($elem, 'fadeIn');

            },
            hide : function ($elem) {
                js._hide($elem, 'fadeOut');
            }
        },
        slideUpDown : {
            init : function ($elem) { js._init($elem)},
            show : function ($elem) {
                js._show($elem, 'slideDown');
            },
            hide : function ($elem) {
                js._hide($elem, 'slideUp');
            }
        },
        slideLeftRight : {
            init : function ($elem) {
                js._i_init($elem, {'width':'val','padding-top':'val','padding-bottom':'val','margin-top':'val','margin-bottom':'val'});    
            },
            show : function ($elem) {
                js._i_show($elem);
            },
            hide : function ($elem) {
                js._i_hide($elem);
            }
        },
        fadeSlideUpDown : {
            init : function ($elem) {
                js._i_init($elem, {'opacity':'val', 'height':'val','padding-top':'val','padding-bottom':'val','margin-top':'val','margin-bottom':'val'})
            },
            show : function ($elem) {
                js._i_show($elem);
            },
            hide : function ($elem) {
                js._i_hide($elem);
            }
        },
        fadeSlideLeftRight : {
            init : function ($elem) {
                js. _i_init($elem, {'opacity':'val', 'width':'val','padding-top':'val','padding-bottom':'val','margin-top':'val','margin-bottom':'val'});
            },
            show : function ($elem) {
                js._i_show($elem);
            },
            hide : function ($elem) {
                js._i_hide($elem);
            }
        }
    };
    //#endregion
    
    //#region _____test 
        // var $box = $('.box');
        // var $show = $('.btn0');
        // var $hide = $('.btn1');
        // var $gyrate = $('.icon-on')
        // css3.slideLeftRight.init($box);
        // $show.on('click', function () {
        //    css3.slideLeftRight.show($box);
        // })
        // $hide.on('click', function () {
        //    css3.slideLeftRight.hide($box);
        // })
        // $box.on('show shown hide hidden', function (e) {
        //     console.log(e.type);
        // })

    //     var $box = $('.mine-layer');
    //     var $show = $('.btn0');
    //     var $hide = $('.btn1');
    //     var $gyrate = $('.icon-on');
    //    js.fadeSlideLeftRight.init($box);
    //     $show.on('click', function () {
    //         js.fadeSlideLeftRight.show($box);
    //     })
    //     $hide.on('click', function () {
    //         js.fadeSlideLeftRight.hide($box);
    //     })
    //     $box.on('show shown hide hidden', function (e) {
    //         console.log(e.type);
    //     })
    //#endregion

    //#region _____default arguments 
    var defalut = {
        silent : false,
        css3 : true,
        js : false,
        animation: 'fade', /* fade slideUpDown slideLeftRight ... */
    }
    //#endregion

    // #region _____arrange 
    
    function showHide($elem, options) {
        var modular = null;
        if(options.css3 && transition.isSupport) {
            modular = css3[options.animation] || css3[defalut.animation];
        }else if(options.js) {
            modular = js[options.animation] || js[defalut.animation];
        }else{
            modular = silent;
        }
        modular.init($elem);
        return {
            show : $.proxy(modular.show, this, $elem),
            hide : $.proxy(modular.hide, this, $elem)
        }
    }
    //#endregion
    
    //#region _____EXTEND
    $.fn.extend({
        showHide : function (option) {
            return this.each(function () {
                var $this = $(this),
                    showHideObj = $this.data('showHideObj'),
                    options = $.fn.extend({}, defalut, typeof option === 'object' && option);
                if(!showHideObj) {
                    $this.data('showHideObj', showHideObj = showHide($this, options));
                }

                if(typeof showHideObj[option] === 'function') {
                    showHideObj[option]();
                }

            })
        }
    })    
    //#endregion

}(jQuery))