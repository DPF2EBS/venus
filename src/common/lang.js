//extend Array forEach
!Array.prototype.forEach && (Array.prototype.forEach = function (fn, context) {
    for (var i = 0, l = this.length; i < l; i++) {
        if (i in this) {
            fn && fn.call(context, this[i], i, this);
        }
    }
});