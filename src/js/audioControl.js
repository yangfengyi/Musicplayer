(function ($, root) {
    function AudioControl() {
        this.audio = new Audio();
        this.status = "pause";
    }
    AudioControl.prototype = {
        play: function (){
            this.audio.play();
            this.status = "play";
        },
        pause: function () {
            this.audio.pause();
            this.status = "pause";
        },  
        getAudioSource: function (src) {
            this.audio.src = src;
            this.audio.load();  // 加载的方法
        },
        playTo: function (changeTime) {
            this.audio.currentTime = changeTime;
            this.play();
        }
    }
    root.AudioControl = AudioControl;
})(window.Zepto, window.player || (window.player = {}))