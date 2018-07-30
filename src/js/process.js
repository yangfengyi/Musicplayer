(function ($, root) {
    var $scope = $(document.body);
    var curDuration;
    var frameId;
    var lastPercent = 0;
    var startTime;
    var key = true;
    
    /**
     * 格式化时间格式,我们获取的资源当中的事件是s为单位的，用formatTime函数来将其转换成 00:00的格式。
     * @param {*} time 我们希望格式化的时间（s）
     */
    function formatTime(time){
        time = Math.round(time);
        var minute =  Math.floor(time / 60);    // 获取总时间的分
        var second = time - minute * 60;        // 获取剩余的秒数
        if(minute < 10) {
            minute = '0' + minute;
        }
        if(second < 10) {
            second = '0' + second;
        }
        return minute + ':' + second;
    }

    /**
     * 在加载了歌曲资源之后，渲染进度条当中的总时长
     * @param {*} duration 当前歌曲的总时长
     */
    function renderAllTime (duration){
        lastPercent = 0;
        curDuration = duration;           
        var allTime = formatTime(duration);
        $scope.find('.all-time').text(allTime);
    }

    /**
     * 根据start函数函数当中实时状态的percent来更新当前的播放时间、当前进度条的位置。
     */
    function update(percent) {
        // 更新已经播放的时间
        var curTime = percent * curDuration;
        curTime = formatTime(curTime);
        $scope.find('.cur-time').html(curTime);
        // 更新进度条的位置
        $scope.find('.pro-top').css({
            "transform": 'translateX(' + (percent - 1) * 100 + '%)' 
        })
    }

    /**
     * 音乐开始播放的时候调用，用来开始requestAnimationFrame，用来记录时间，并用此时间和总的duration时间
     * 求百分比，算出当前的播放时间。
     * 这里有个重置的lastPercent是上次停止播放的时候的百分比状态。
     */
    function start () {
        startTime = new Date().getTime();
        frame();
        function frame () {
            cancelAnimationFrame(frameId);          // 每次执行这个方法之前先清除定时器
            var currentTime = new Date().getTime();
            var percent = lastPercent + (currentTime - startTime) / (curDuration * 1000);
            if(percent < 1) {
                //使用requestAnimationFrame来让它一直动,requestAnimationFrame是1s监听60次的
                frameId = requestAnimationFrame(frame); 
                update(percent);
                console.log(frameId);
            } else {
                cancelAnimationFrame(frameId);
                key = false;
            }
        }
    }

    /**
     * 音乐停止的时候调用次函数，用来清除requestAnimationFrame，并且记录此时的播放时间，在下次播放的时候
     * 重置这个时间（而不是0）
     */
    function stop () {
        var stopTime = new Date().getTime();
        lastPercent = lastPercent + (stopTime - startTime) / (curDuration * 1000);
        console.log(frameId);
        cancelAnimationFrame(frameId);
    }

    /**
     * 暴露接口
     */
    root.process = {
        renderAllTime : renderAllTime,
        update: update,
        start: start,
        stop: stop
    }
})(window.Zepto, window.play || (window.player = {}));