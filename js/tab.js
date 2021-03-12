
//#region _____slide-fade-switch

(function ($) {
    'use strict'
    //NAME:1.图片-display-opacity-left  2.左右箭头-事件 3.小圆点-事件 
    //CALLER-METHOD:$(xx).sfMultiple({})
    //EXPLAIN: fadeIn/Out  slideIn/Out
    // _init() slide() fade() auto() pause()

    function Tab($elem, option) {
        // container
        this.$elem = $elem;
        this.option = option;
        this.contents = this.$elem.find('.content');
        this.items = this.$elem.find('.head-item');
        this.itemsLen = this.items.length;
        this.curIndex = this.getCorrectIndex(this.option.activeIndex) || 0;
        this.timer = null;
        this._init();
    }

    Tab.prototype._init = function () {
        var self = this,
            timer = null;

        // 头部右侧文字底部箭头初始状态
        this.items.removeClass('head-item-active').eq(this.curIndex).addClass('head-item-active');
        // 主体显示状态初始化
        this.contents.eq(this.curIndex).show();
        // trigger
            this.$elem.trigger('toggle-show', [this.curIndex, this.contents[this.curIndex], this]);

        // 主体showHide模块初始化
        this.contents.showHide(this.option);
        // bind event
        this.option.event = this.option.event === 'click'? 'click': 'mouseenter';
        
        this.$elem.on(this.option.event, '.head-item', function () {
            var elem = this;
            if(self.option.delay) {
                if(timer) clearTimeout(timer);
                timer = setTimeout(function () {
                    self.toggle(self.items.index(elem));
                }
                , self.option.delay);

            }else {
                self.toggle(self.items.index(elem));
            }

        });

        this.contents.on('show shown hide hidden' ,function (e) {
            self.$elem.trigger('toggle-' + e.type, [self.contents.index(this), this, self]);
        })

        // 自动执行
        if(this.option.interval && !isNaN(this.option.interval)) {
            this.auto();
        }
        
        if(this.option.interval && !isNaN(this.option.interval)) {
            this.$elem.hover($.proxy(this.pause, this), $.proxy(this.auto, this));
        }

    };

    // 切换事件
    Tab.prototype.toggle = function (index) {
        var self = this;
        if(this.curIndex === index) return ;
            
        // this.items.eq(index).hover(function () {
            // self.selfTimer = setInterval(function () {
                self.contents.eq(self.curIndex).showHide('hide');
                self.contents.eq(index).showHide('show');

                self.items.eq(self.curIndex).removeClass('head-item-active');
                self.items.eq(index).addClass('head-item-active');

                self.curIndex = index;
            // }, this.option.delay);
        // }, function () {
            // clearInterval(self.selfTimer);
        // })


        

    };

    // 自动切换
    Tab.prototype.auto = function () {
        var self = this;
        if(this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(function () {
            self.toggle(self.getCorrectIndex(self.curIndex+1));
        }, self.option.interval);
    };

    // 暂停
    Tab.prototype.pause = function () {
        if(this.timer) clearInterval(this.timer);
        this.timer = null;
    };


    // 纠正索引
    Tab.prototype.getCorrectIndex = function (index) {
        if(isNaN(index)) return 0; 

        if(index < 0) {
            index = this.itemsLen -1;
        }else if(index > this.itemsLen -1) {
            index = 0;
        }
        return index;
    };
    
    Tab.default = {
        event : 'mouseenter',// click
        css3 : false,
        js : false,
        animation : 'fade',
        activeIndex : 0,
        interval : 0,
        delay : 0

    };

    $.fn.extend({
        tab : function (option) {
            return this.each(function () {
                var $this = $(this),
                    mode = $this.data('Tab'),
                    options = $.fn.extend({}, Tab.default, $this.data(), typeof option == 'object'? option : {});

                if(!mode) {
                    $this.data('Tab', mode = new Tab($this, options));
                }

                if(typeof mode[option] === 'function') {
                    mode[option]();
                }
            })
        }
    })
        
}(jQuery))

//#endregion




