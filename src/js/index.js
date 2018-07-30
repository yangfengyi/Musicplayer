var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body);
var index = 0;
var songList;
var controlManager;
var audio = new root.AudioControl();    // 封装了音乐组件的对象audio(并非audio)
/**
 * 下面的自写控件的点击事件
 */
function bindClick() {
    /**
     * 自定义事件控制音乐的播放,可以通过事件后面的参数来实现事件的传参。记住自定义事件的事件处理函数第一个参数
     * 是事件对象。
     */
    $scope.on('play:change', function (event, index) {
        // 在触发音频改变的时候就要渲染总时间了
        audio.getAudioSource(songList[index].audio);
        if (audio.status === "play") { // 请求回来资源的时候，只有他是在播放状态的时候才播放。
            audio.play();
            root.process.start();      // root.process.start()方法执行了两次就会多开一个定时器
        } else if(audio.status === "pause") {
            audio.pause();             // 在加载的时候如果是pause状态就没有必要调用stop了。
            root.process.stop();
        }
        root.render(songList[index]);
        root.process.renderAllTime(songList[index].duration);
        root.process.update(0);                 // 每次加载歌曲的时候都要update一下，让其从0开始播放
    })

    /**
     * 点击上一首 (使用jQuery来操作事件委托的时候必须必须要使用合理的选择器 ==> '.prev-btn');
     */
    $scope.on('click', '.prev-btn', function () {
        // 使用了封装的方法对象(controlManager) 来获取当前的index值，来获取当前播放的应该是哪一个音乐
        var pIndex = controlManager.prev();
        // root.render(songList[index]);
        $scope.trigger('play:change', pIndex);
    })

    /**
     * 点击下一首
     */
    $scope.on('click', '.next-btn', function () {
        var nIndex = controlManager.next();
        $scope.trigger('play:change', nIndex);
        console.log(audio.status);
    })

    /**
     * 点击list
     */
    $scope.on('click', '.list-btn', function () {
        $scope.find('.list').css({
            'display': 'block'
        })
    })
    $scope.on('click', '.close', function () {
        $scope.find('.list').css({
            'display': 'none'
        })
    })

    /**
     * 点击喜欢按钮
     */
    // 为paly-btn绑定的事件,在点击的时候，资源已经请求回来了，所以这里不需要用play:change事件来加载资源。
    $scope.on('click', '.play-btn', function () {
        console.log(audio.status);
        if (audio.status === "play") {
            audio.pause();
            console.log(audio.status);
            root.process.stop();
        } else {
            audio.play();
            root.process.start();
        }
        console.log($(this));       // 在jQuery的事件委托当中,$(this)就是当前的dom的jQuery对象。
        $scope.find('.play-btn').toggleClass('pause');
    })
}

function listControl (data){
    $scope.find('.list-item').on('click', function (){
        var index = $(this).index();
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        audio.getAudioSource(data[index].audio);
        root.render(data[index]);
        audio.play();
        root.process.renderAllTime(data[index].duration);
        root.process.update(0);
        root.process.start();
        $scope.find('.play-btn').addClass('pause');
    })
}

/**
 * 进度条的拖拽事件
 */
function bindTouch () {
    var $slider = $scope.find('.slider-pointer');
    var offset = $scope.find('.pro-wrapper').offset();
    var width = offset.width;
    var left = offset.left;
    $slider.on('touchstart', function () {
        audio.pause();
        root.process.stop();
        $scope.find('.play-btn').removeClass('pause');
    }).on('touchmove', function (e) {
        var x = e.changedTouches[0].clientX;
        var tPercent = (x - left) / width;
        if(tPercent < 0 ) {
            tPercent = 0;
        } 
        if(tPercent > 1) {
            tPercent = 1;
        }
        root.process.update(tPercent);
        var tCurDuration = songList[controlManager.index].duration;
        var tCurTime = tPercent * tCurDuration;
        audio.playTo(tCurTime);       // 根据当前时间跳转
    }).on('touchend', function (e) {
        $scope.find('.play-btn').addClass('pause');
    })
}
bindTouch();

/**
 * 请求资源函数，这里是整个功能的出发点，是整个功能声明状态的起始位置。
 * @param {*} url 获取资源的url
 */
function getData(url) {
    $.ajax({
        type: "GET",
        url,
        success: (data) => {
            root.render(data[0]);
            songList = data;
            bindClick();
        // 数据加载回来就初始化controlManager实例,controlManager中封装了获取当前应该渲染那条数据的方法
            controlManager = new root.ControlManager(data.length);
            $scope.trigger("play:change", 0);
            root.renderList(data);
            listControl(data);
        },
        error: (err) => {
            console.log(err);
        }
    })
}

getData("../mock/data.json");