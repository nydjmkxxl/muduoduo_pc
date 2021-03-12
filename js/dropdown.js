(function ($) {
    'use strict'
    //NAME:caller of xx-dropdown Construtor
    //CALLER-METHOD: $('xx).dropdown(options)/$('xx).dropdown('show/hide')
    //EXPLAIN:click or hover、delay、
        
    //#region _____Constructor 
    function Dropdown($elem, option) {
        this.$elem = $elem;
        this.options = option;
        this.$other = this.$elem.siblings(`.${this.options.active}-dropdown`);
        this.$layer = this.$elem.find('.dropdown-layer');
        this.$li = this.$layer.find('li');
        this.activeClass = this.options.active + '-active';
        this.init();

    }
    //#endregion

    //#region _____prototype 
    Dropdown.prototype.init = function () {
        var self = this;

        // 订阅后发送
        this.$layer.on('show shown hide hidden' , function (e) {
            console.log(`${self.options.active}Dropdown-` + e.type);    
            self.$elem.trigger(`${self.options.active}Dropdown-` + e.type, [self.$elem.index(),self.$elem, self]);

        })
        // 初始化showHide模块
        this.$layer.showHide(this.options);
        // click or hover 情况
        if(this.options.event === 'click') {
            // 当父级元素被点击
            this.$elem.on('click', function () {
                // 添加xx-active和显示layer层
                self.show();

                // 当前显示其余隐藏
                self.$other.each(function (_, val) {
                    var $val = $(val),
                        $layer = $val.find('.dropdown-layer');
                    $val.removeClass(self.activeClass);
                    $layer.showHide('hide');
                })

                return false;
            })
            
            $(document).on('click', $.proxy(this.hide, this));
            
        }else{
            this.$elem.hover($.proxy(this.show, this), $.proxy(this.hide, this));
        }
        // layer层item被点击后隐藏父、子元素
        // console.log(this.options.disappear);
        if(this.options.disappear) {
            // console.log("pass");
            // console.log(this.$li);
            this.$li.on('click', function () {
                self.hide();
                return false;
            });
        }

    };

    Dropdown.prototype.show = function () {
        var self = this;

        function _show() {
            self.$elem.addClass(self.activeClass);
            self.$layer.showHide('show');
        }

        if(this.options.delay) {
            this.timer = setTimeout(function () {
                _show();
            },this.options.delay);
        }else{
                _show();
        }


    };

    Dropdown.prototype.hide = function () {
        // 存在定时器时 隐藏动作删除存在的定时器
        if(this.options.delay) clearTimeout(this.timer);
        this.$elem.removeClass(this.activeClass);
        this.$layer.showHide('hide');

    };
    //#endregion

    //#region _____arguments 
    Dropdown.default = {
        silent : true,
        css3 : false,
        js : false,
        event : 'click',//click
        animation : 'fade',
        delay : 0,
        active : ''
    }
    //#endregion

    //#region _____EXTEND 
    $.fn.extend({
        dropdown : function (option) {
            return this.each(function () {
                var $this = $(this),
                    dropdownObj = $this.data('dropdownObj'),
                    options = $.fn.extend({}, Dropdown.default, typeof option === 'object' && option);
                    if(!dropdownObj) {
                    $this.data('dropdownObj', dropdownObj = new Dropdown($this, options));
                }

                if(typeof dropdownObj[option] === 'function' ) {
                    dropdownObj[option]();
                }

            })
        }
    })
    //#endregion

}(jQuery))