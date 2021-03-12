
//#region _____slide-fade-switch

(function ($) {
    'use strict'
    function SlideStartEnd($elem, option) {
        // container
        this.$elem = $elem;
        this.option = option;
        this.content = this.$elem.find('.content');
        this.items = this.$elem.find('.item');
        this.itemsLen = this.items.length;
        this.arrows = this.$elem.find('.arrow');
        this.dots = this.$elem.find('.dot');
        this.curIndex = this.getCorrectIndex(this.option.activeIndex) || 0;
        this.timer = null;
        this._init();
    }

    SlideStartEnd.prototype._init = function () {
        var self = this;
        // 小圆点初始状态
        this.dots.removeClass('dot-active').eq(this.curIndex).addClass('dot-active');
        // 切换模式不同状态
        if(this.option.animation === 'slideStartEnd') {
            // 添加slide切换方式的类名
            this.$elem.addClass('slideStartEnd');
            // move init
            this.content.move(this.option);
            // this.to就变成了了slide方法
            this.to = this._slide;
            // 获取图片宽度
            this.itemWidth = this.items.eq(0).width();
            // 整体移动索引*图片宽度
            this.content.css('left', -1*this.curIndex*this.itemWidth);

            if(this.option.loop) {
                this.content.append(this.items.eq(0).clone());
                this.transitionClass = this.content.hasClass('transition') ? 'transition' : '';
                this.itemsLen ++;
            }

        }

        if(this.option.interval && !isNaN(this.option.interval)) this.auto();
        
        // 事件
        this.$elem
        .hover($.proxy(this.pause, this), $.proxy(this.auto, this))
        .on('click', '.prev', function () {
            // 当前的上一个显示
            self.to(self.getCorrectIndex(self.curIndex-1), 1);
        })
        .on('click', '.next', function () {
            // 当前的下一个显示
            self.to(self.getCorrectIndex(self.curIndex+1), -1);
        })
        .on('click', '.dot', function () {
            // 小圆点点击事件
            self.to(self.getCorrectIndex(self.dots.index(this)));
        });
    };
    SlideStartEnd.prototype._slide = function (index, direction) {//index = this.curIndex+1/-1为指定即将要显示
        var self =this;
        if(this.curIndex === index) return ;
        // 利用move模块移动left值 0 ~ > ——————index 0 1 2 3 4 5
        this.content.move('x', -1*index*this.itemWidth);
            // 同步索引值
            this.curIndex = index;
        if(this.option.loop && direction) {
            if(direction < 0) {//next
                if(index === 0) {
                    this.content.removeClass(this.transitionClass).css('left', 0);
                    this.curIndex = index = 1;
                    setTimeout(function () {
                        self.content.addClass(self.transitionClass).move('x', -1*index*self.itemWidth);
                        // self.content.addClass(self.transitionClass).css('left', self.itemWidth);
                    }, 20);
                };
            }else{//prev 
                if(index === this.itemsLen-1) {
                    this.content.removeClass(this.transitionClass).css('left',  -1*index*this.itemWidth);
                    this.curIndex = index = this.itemsLen-2;
                    setTimeout(function () {
                        self.content.addClass(self.transitionClass).move('x', -1*index*self.itemWidth);
                        // self.content.addClass(self.transitionClass).css('left', self.itemWidth);
                    }, 20);
                }
            }
            // 将索引集合的多余索引减掉
            // console.log(index, '图片');
            index = this.getCorrectIndex(index, this.itemsLen-1);
            // console.log(index, '圆点');
        }
        // console.log(index);
        // 激活小圆点 index ——————0 1 2 3 4 //到第五个就显示不了了 ，
        this.dotActive(index);


    };
    SlideStartEnd.prototype.dotActive = function (index) {
        this.dots
        .removeClass('dot-active')
        .eq(index)
        .addClass('dot-active'); 
    }
    SlideStartEnd.prototype.getCorrectIndex = function (index, maxIndex) {
        maxIndex = maxIndex || this.itemsLen;
        // console.log("getCorrectIndex","传入", index);
        if(isNaN(index)) return 0; 
        if(index < 0) {
            index = maxIndex -1;
        }else if(index > maxIndex -1) {
            index = 0;
        }
        // console.log("getCorrectIndex","纠正", index);
        return index;
    };
    SlideStartEnd.prototype.auto = function () {
        var self = this;
        if(this.timer) clearInterval(this.timer);
        this.timer = setInterval(function () {
            // var next = $(self.arrows[1]);
            // console.log(next);
            self.to(self.getCorrectIndex(self.curIndex+1));
            // next.trigger('click');
        }, this.option.interval)

    };
    SlideStartEnd.prototype.pause = function () {
        if(this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        };

    };
    SlideStartEnd.default = {
        css3 : false,
        js  : false,
        // 模式
        animation : 'fade',//slide
        // 主动选择要显示的那张
        activeIndex : 0,
        // 间隔时间
        interval : 2000,
        loop : false
    };
    $.fn.extend({
        slideStartEnd : function (option) {
            return this.each(function () {
                var $this = $(this),
                    mode = $this.data('SlideStartEnd'),
                    options = $.fn.extend({}, SlideStartEnd.default, $this.data(), typeof option == 'object'? option : {});

                if(!mode) {
                    $this.data('SlideStartEnd', mode = new SlideStartEnd($this, options));
                }

                if(typeof mode[option] === 'function') {
                    mode[option]();
                }
            })
        }
    })
        
}(jQuery))

//#endregion




