(function ($, W) {
    'use strict'
    //NAME:get correct transitionend
    //CALLER-METHOD:transition.end/transition.isSupport
    //EXPLAIN:for perfect
    W.transition = W.transition || {};
    transition.end = false;
    transition.isSupport = false;
    
    var transitionObj = {
            transition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            MozTransition: 'transitionend',
            WebkitTransition: 'webkitTransitionEnd',
    }

    for(var prop in transitionObj) {
        if(document.body.style[prop] !== undefined) {
            transition.end = transitionObj[prop];
            transition.isSupport = true;
            break ;
        }
    }
}(jQuery, window))