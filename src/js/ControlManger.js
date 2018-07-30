/**
 *  封装的这个模块，就是为了next 和 prev两个方法来做了封装，让其返回一个currentIndex值，来选择播放的音乐。
 */

(function ($, root) {
    
    function ControlManager(len) {
        this.index = 0;
        this.len = len;
    }

    ControlManager.prototype = {
        prev: function () {
            return this.getIndex(-1);
        },
        next: function () {
            return this.getIndex(1);
        },
        getIndex: function (val) {
            var index = this.index;
            var len = this.len;
            var curIndex = (index + len + val) % len;
            // (2 + 3 + 1) % 3 = 0
            // (0 + 3 - 1) % 3 = 2
            // 给当前的index赋值。
            this.index = curIndex;
            console.log(this.index);
            return curIndex;
        }
    }

    root.ControlManager = ControlManager;
// 注意这里传入player依赖的时候，我们要使用这种方式来完成兼容，要不然这个值为undefined不是{}无法添加属性。
})(window.Zepto, window.player || (window.player = {}));