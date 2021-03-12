
//#region _____slide-fade-switch

(function ($) {
    'use strict'
    //NAME:1.图片-display-opacity-left  2.左右箭头-事件 3.小圆点-事件 
    //CALLER-METHOD:$(xx).sfMultiple({})
    //EXPLAIN: fadeIn/Out  slideIn/Out
    // _init() slide() fade() auto() pause()

    function SlideFadeSwitch($elem, option) {
        // container
        this.$elem = $elem;
        this.option = option;
        this.content = this.$elem.find('.content');
        this.items = this.$elem.find('.item');
        this.itemsLen = this.items.length;
        this.arrows = this.$elem.find('.arrow');
        this.itemWidth = this.$elem.width();
        this.dots = this.$elem.find('.dot');
        this.curIndex = this.getCorrectIndex(this.option.activeIndex) || 0;
        this.timer = null;
        this._init();
    }

    SlideFadeSwitch.prototype._init = function () {
        var self = this;
        
        // 小圆点初始状态
        this.dots.removeClass('dot-active').eq(this.curIndex).addClass('dot-active');
        // 切换模式不同状态
        if(this.option.animation === 'slide') {//slide 方向- 左-1，右1 初始位置 left：0

            // 人为触发一次show事件
            this.$elem.trigger('slide-show', [this.curIndex, this.items[(this.curIndex)], this]);

            // 添加slide切换方式的类名
            this.$elem.addClass('slide');
            this.items.eq(this.curIndex).css('left', 0);

            // this.itemWidth = this.items.eq(0).width();
            

            this.items.move(this.option);
            // option = {css3: true, js: false, animation: "slide", activeIndex: 0, interval: 2000}

            this.itemClass = this.items.eq(0).hasClass('transition') ? 'transition' : '';

            // 订阅发送信息
            this.items.on('move moved', function (e) {
                var index = self.items.index(this);
                if(e.type === 'move') {
                    if(self.curIndex === index) {//如果相等，说明上一个thiscurIndex-hide//如果不相等，说明index-show还在移动
                        self.$elem.trigger('slide-hide', [index, this, self]);
                        // self.$elem.trigger('move', [index, this]);
                    }else{//如果不等于的话，说明index在做移动
                        self.$elem.trigger('slide-show', [index, this, self]);
                        // self.$elem.trigger('move', [index, this]);
                    }
                }else if(e.type === 'moved') {
                    if(self.curIndex === index) {//如果相等，说明index-shown显示完成了//如果不等于，说明this.curIndex-hidden上一个已经隐藏完成了
                        self.$elem.trigger('slide-shown', [index, this, self]);
                        // self.$elem.trigger('moved', [index, this]);
                    }else{//如果不等于，说明self.curIndex已经moved index还没有
                        self.$elem.trigger('slide-hidden', [index, this, self]);
                        // self.$elem.trigger('moved', [index, this]);
                    }
                }

            })

            // this.to就变成了了slide方法
            this.to = this._slide;
        }else if(this.option.animation === 'fade') {//fade
            // 人为触发一次show事件
            this.$elem.trigger('fade-show', [this.curIndex, this.items[(this.curIndex)], this]);

            // 添加fade切换方式的类名
            this.$elem.addClass('fade');
            // 指定图片显示
            this.items.eq(this.curIndex).show();
             // showHide 初始化状态
            this.content.showHide(this.option);
            // this.to就变成了fade方法
            this.to = this._fade;

            // send message 
            this.items.on(' show shown hide hidden', function (e) {
                self.$elem.trigger('fade-'+e.type, [self.items.index(this), this, self]);
            })

        }else{
            // 人为触发一次show事件
            this.$elem.trigger('switch-show', [this.curIndex, this.items[(this.curIndex)], this]);
            this.$elem.addClass('switch');

            this.items.hide().eq(this.curIndex).show();
            this.dots.removeClass('dot-active').eq(this.curIndex).addClass('dot-active');
            this.to = this._switch;
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
            //#region _____ 
            
            // // 获取点击圆点索引
            // var index = self.dots.index(this);

            // // 如果当前索引与指定索引一样，则不用执行下面代码
            // if(self.curIndex === index) return ;

            // if(self.option.animation === 'slide') {


            // }else if(self.option.animation === 'fade') {

            //     // 当前的图片，原点隐藏
            //     self.items.eq(self.curIndex).showHide('hide');
            //     self.dots.eq(self.curIndex).removeClass('dot-active');

            //     // 点击的图片，原点显示
            //     self.items.eq(index).showHide('show');
            //     self.dots.eq(index).addClass('dot-active');

            //     // 更新索引 
            //     self.curIndex = index;

            // }else{

            //     // 当前的图片，原点隐藏
            //     self.items.eq(self.curIndex).hide();
            //     self.dots.eq(self.curIndex).removeClass('dot-active');

            //     // 点击的图片，原点显示
            //     self.items.eq(index).show();
            //     self.dots.eq(index).addClass('dot-active');

            //     // 更新索引 
            //     self.curIndex = index;
                
            // }
            //#endregion
            
        });

    };
    // 初始状态完成后 —— 移出初始状态的图片，移入指定的图片，显示指定小圆点
    //1.确定方向，prev next 2.设置初始位置 3.当前滑出图片direction+width，圆点清除dot-active
    // 4.指定滑入图片0，圆点添加dot-active 5.同步索引值
    SlideFadeSwitch.prototype._slide = function (index, direction) {//index = this.curIndex+1/-1为指定即将要显示
        var self = this;
        if(this.curIndex === index) return ;

        
        // 1.确定滑入滑出的方向
        if(!direction) {//如果不存在direction 那么就说明是 —— 小圆点点击事件 
            if(this.curIndex < index) {//prev，向左滑出 <---
                direction = -1;
            }else{//this.curIndex > index //next， 向右滑出 --->
                direction = 1;
            }
        }
        // 2.设置指定图片滑入的初始位置
        this.items.eq(index).removeClass(this.itemClass).css('left', -1*direction*this.itemWidth);

        setTimeout(function () {

            // 激活小圆点
            self.dotActive(index);

            // 3.当前图片移出 小圆点移出 dot-active
            self.items.eq(self.curIndex).addClass(self.itemClass).move('x', direction*self.itemWidth);
            // self.items.eq(self.curIndex).addClass('transition').css('left', direction*self.itemWidth);
            // self.dots.eq(self.curIndex).removeClass('dot-active');

            // 4.指定图片移入 小圆点添加 dot-active 
            self.items.eq(index).addClass(self.itemClass).move('x', 0);
            // self.items.eq(index).addClass('transition').css('left', 0);
            // self.dots.eq(index).addClass('dot-active');

            // 5. 同步全局当前索引值
            self.curIndex = index;
        }, 20)

    };
    // 初始状态完成后 —— 隐藏初始状态的图片，显示指定的图片，显示指定小圆点
    SlideFadeSwitch.prototype._fade = function (index) {//index = this.curIndex+1/-1为指定即将要显示
        var self = this;
        if(this.curIndex === index) return ;

        // 当前图片隐藏
        this.items.eq(this.curIndex).showHide('hide');
        
        // 指定的图片显示
        this.items.eq(index).showHide('show');
        
        // 激活小圆点
        this.dotActive(index);

        // 做完动作，指定的图片索引将变为当前的索引
        this.curIndex = index;

    };
    // 初始状态完成后 —— 隐藏初始状态的图片，显示指定的图片，显示指定小圆点
    SlideFadeSwitch.prototype._switch = function (index) {//index = this.curIndex+1/-1为指定即将要显示
        var self = this;
        if(this.curIndex === index) return ;

        // 激活小圆点
        this.dotActive(index);

        // 隐藏初始状态的图片，小圆点
        this.$elem.trigger('switch-hide', [this.curIndex, this.items.eq(this.curIndex), this ]);

        this.items.eq(this.curIndex).hide();
        
        // this.dots.eq(this.curIndex).removeClass('dot-active');

        this.$elem.trigger('switch-hidden', [this.curIndex, this.items.eq(this.curIndex), this ]);

        this.$elem.trigger('switch-show', [index, this.items.eq(index) ,this ]);

        // 显示指定的图片，小圆点
        this.items.eq(index).show();
        // this.dots.eq(index).addClass('dot-active');

        this.$elem.trigger('switch-shown', [index, this.items.eq(index), this ]);


        // 做完动作，指定的图片索引将变为当前的索引
        this.curIndex = index;

        

    };

    SlideFadeSwitch.prototype.dotActive = function (index) {
        this.dots.eq(this.curIndex).removeClass('dot-active');
        this.dots.eq(index).addClass('dot-active'); 
    }

    SlideFadeSwitch.prototype.getCorrectIndex = function (index) {
        // console.log("getCorrectIndex","传入", index);
        if(isNaN(index)) return 0; 

        if(index < 0) {
            index = this.itemsLen -1;
        }else if(index > this.itemsLen -1) {
            index = 0;
        }
        // console.log("getCorrectIndex","纠正", index);
        return index;
    };

    SlideFadeSwitch.prototype.auto = function () {
        var self = this;
        if(this.timer) clearInterval(this.timer);
        this.timer = setInterval(function () {
            // var next = $(self.arrows[1]);
            // console.log(next);
            self.to(self.getCorrectIndex(self.curIndex+1), -1);
            // next.trigger('click');
        }, this.option.interval)

    };

    SlideFadeSwitch.prototype.pause = function () {
        if(this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        };

    };
    
    SlideFadeSwitch.default = {
        css3 : false,
        js  : false,
        // 模式
        animation : 'fade',//slide
        // 主动选择要显示的那张
        activeIndex : 0,
        // 间隔时间
        interval : 2000
    };

    $.fn.extend({
        slideFadeSwitch : function (option) {
            return this.each(function () {
                var $this = $(this),
                    mode = $this.data('SlideFadeSwitch'),
                    options = $.fn.extend({}, SlideFadeSwitch.default, $this.data(), typeof option == 'object'? option : {});

                if(!mode) {
                    $this.data('SlideFadeSwitch', mode = new SlideFadeSwitch($this, options));
                }

                if(typeof mode[option] === 'function') {
                    mode[option]();
                }
            })
        }
    })
        
}(jQuery))

//#endregion




