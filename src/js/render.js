(function ($, root) {
    var $scope = $(document.body);

    /**
     * 渲染歌曲信息的函数
     * @param {*} info 
     */
    function renderInfo(info) {
        var html = '<div class="song-name">' + info.song +'</div>\
            <div class="singer-name">' + info.singer +'</div>\
            <div class="album-name">' + info.album +'</div>'
        $scope.find('.song-info').html(html);
    }

    /**
     * 渲染歌曲图片和背景图片(对歌曲图片高斯模糊，并将body背景设置成高斯模糊的图片);
     * @param {*} src 图片资源地址
     */
    function renderImg (src) {
        var img = new Image();
        img.src = src;
        img.onload = function () {  // 预加载了解一下
           // 高斯模糊的用法,接受两个参数，一个是需要被模糊的图片和一个加上模糊背景的元素
           root.blurImg(img, $scope);
           $scope.find('.song-img img').attr('src', src);
       }
    }

    /**
     * 更具数据中isLike数据来渲染喜欢图标
     * @param {*} isLike 数据当中是否喜欢(true, false)
     */
    function renderIsLike(isLike) {
        if (isLike) {
            // 没有使用if else来动态切换css（url状态）而是通过添加类名，使用权重方式来改变状态。
            $scope.find('.like-btn').addClass('liking');
        } else {
            $scope.find('.like-btn').removeClass('liking');
        }
    }

    /**
     * 这里是页面状态初始化的函数，在请求数据之后就能够更新页面的状态。
     * @param {*} data 请求回来的数据
     */
    root.render =  function (data) {
        renderInfo(data);
        renderImg(data.image);
        renderIsLike(data.isLike);
    }
})(window.Zepto, window.player || (window.player = {}));
// 通过window.player来暴露函数(挂载的方式)