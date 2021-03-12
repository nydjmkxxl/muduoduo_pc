(function ($) {
    'use strict'
    //NAME:
    //CALLER-METHOD:
    //EXPLAIN:DOWATH
        

    var Silent = function ($elem, option) {
            this.$elem = $elem;
            this.options = option;
            this.dots = this.$elem.find('.dot');
            this.content = this.$elem.find('.content');
            this.items = this.$elem.find('.item');
            this.imgs = this.$elem.find('img');
            this.len = this.items.length;
            this.dotIndex = this.options.dotOn || 0;
            this.itemIndex = this.options.itemActive || 0;
            this.direction = 1;
            this.timer = null;
            this.init();
            this.auto();

    };
    // 初始化
    Silent.prototype.init = function () {
        var self = this;
        
        this._showHide(this.getCorrectIndex(this.dotIndex), this.getCorrectIndex(this.itemIndex));
        // ============================================方式三
        // this.content.removeClass('transition');                                        
       // ============================================方式二  
        this.items
        .addClass('opa transition')
        .eq(this.getCorrectIndex(this.itemIndex))
        .removeClass('opa transition');    

        this.$elem
        .hover($.proxy(this.pause, this), $.proxy(this.auto, this) )
        .on('click', '.next', function () {
            self.next();
        })
        .on('click', '.prev', function () {
            self.prev();
        })
        .on('click', '.dot', function () {
            var index = $(this).index();
            self._showHide(index, index);
        });
    };

    // 显示隐藏
    Silent.prototype._showHide = function (dotIndex, itemIndex) {

        this.dots.eq(dotIndex).addClass('dot-on').siblings().removeClass('dot-on'); //S//C
        
        // console.log(itemIndex);
        // ============================================方式一   
        // this.items.eq(itemIndex).show().siblings().hide();                                        //     silent
        // ============================================方式二  
        this.items.eq(itemIndex).show().siblings().hide(); 
        this.items.eq(itemIndex).removeClass('opa').siblings().addClass('opa');//PPP                   //     CSS   fadeIn
        // ============================================方式三
        // this.items.eq(itemIndex).showHide('show').siblings().showHide('hide');                               //     showHide模块 不太行
        // ============================================方式四
        // this.items.eq(itemIndex).fadeIn().siblings().hide();                                   //     jQury   fadeIn
        // 更新索引
        this.dotIndex = dotIndex;
        this.itemIndex = itemIndex;
    };

    // 变更
    Silent.prototype.toMove = function (direction) {
        if(direction == 1) {
            this.dotIndex ++;
            this.itemIndex ++;
            // console.log(this.dotIndex, this.itemIndex, "next原始值");
            this._showHide(this.getCorrectIndex(this.dotIndex), this.getCorrectIndex(this.itemIndex));
        }else{
            this.dotIndex --;
            this.itemIndex --;
            // console.log(this.dotIndex, this.itemIndex, "prev原始值");
            this._showHide(this.getCorrectIndex(this.dotIndex), this.getCorrectIndex(this.itemIndex));
        }
    };
    // 前一张
    Silent.prototype.prev = function () {
        this.direction = -1;
        this.toMove(this.direction);
    };
    // 后一张
    Silent.prototype.next = function () {
        this.direction = 1;
        this.toMove(this.direction);

    };
    // index
    Silent.prototype.getCorrectIndex = function (index) {
        if(index > this.len-1) {
            index = 0;
        }else if(index < 0){
            index = this.len-1;
        }
        return index;
    };
    Silent.prototype.auto = function () {
        var self = this;
       
        if(this.timer) clearTimeout(this.timer);

        this.timer = setInterval(function () {
            self.next();
        }, self.options.delay);

    }
    Silent.prototype.pause = function () {
        if(this.timer) clearTimeout(this.timer); 
    }
//#region _____测试模块 
var $banner = $('.main-banner');
var option = {
    dotOn : 0,
    itemActive : 0,
    delay : 2000
}
var silent = new Silent($banner, option);
//#endregion

}(jQuery))