/**
 *  gulp的配置文件
 *  gulp是以流pipe的机制来处理任务的，这里的读和写就是对流的操作
 *  检查、打包、压缩
 *  将我们写的文件放到服务器下, gulp根据环境变化来控制打包过程，并且浏览器能够自动刷新
 *  四个api:
 *  1. gulp.src()  读文件
 *  2. gulp.dest()  写文件
 *  3. gulp.task()  创建任务,并执行任务
 *  4. gulp.watch()  监听
 */

// 开发环境要使用的gulp
var gulp = require('gulp');
// 压缩html
var htmlClean = require('gulp-htmlclean');
// 压缩图片
var imagemin = require('gulp-imagemin');
// 压缩js
var uglify = require('gulp-uglify');
// 去掉js当中的调试语句
var strip = require('gulp-strip-debug');
// 将js文件进行拼接，减少http请求的次数,这里插件需要制定一个main.js文件名
var concat = require('gulp-concat');
// 从less文件转成css文件
var less = require('gulp-less');
// 通过使用下面的两个插件来实现即添加前缀也压缩代码
var postcss = require('gulp-postcss');
// 自动添加前缀的插件
var autoprefixer = require('autoprefixer');
// 压缩css代码
var cssnano = require('cssnano');
// 模拟服务器的插件
var connect = require('gulp-connect');

//  这个环境需要自己先配置,配置的时候等号的两边不能有空格。
//  开发环境:  $ export NODE_ENV=development
//  生产环境:  $ export NODE_ENV=production
//  开发环境和生产环境的判断
//  该环境配置好了之后，我们就可以使用这个相当于变量的值来控制我们的打包过程了
console.log(process.env.NODE_ENV == "development"); //true
console.log(process.env.NODE_ENV == "production");  //false
// 此时这个值为true

// 取一个变量来控制所有的这些东西
var devMode = ( process.env.NODE_ENV == "development" );
var folder = {
    src: "src/",   // 开发目录文件夹
    dist: "dist/"  // 检查、压缩、打包后放入的目录文件夹
}

// 创建任务=>取出任务=》操作任务=》放入任务=》执行任务
gulp.task("html", function () {
    var page = gulp.src(folder.src + "html/*")
    // 自动刷新
    .pipe(connect.reload())
    if (!devMode) {
        page.pipe(htmlClean())
    }
    page.pipe(gulp.dest(folder.dist + "html/"))
})

gulp.task('images', function () {
    gulp.src(folder.src + "images/*")
        .pipe(connect.reload())    
        .pipe(imagemin())
        .pipe(gulp.dest(folder.dist + "images/"))
})

gulp.task("js", function () {
    var page = gulp.src(folder.src + 'js/*')
            .pipe(connect.reload())    
    if (!devMode) {
        page
            .pipe(strip())
            // 参数为拼接放入的文件当中
            // .pipe(concat("main.js"))
            .pipe(uglify())
    }
    page.pipe(gulp.dest(folder.dist + 'js/'))
})

gulp.task("css", function () {
    var options = [autoprefixer(), cssnano()]
    var page = gulp.src(folder.src + "css/*")
        .pipe(connect.reload())    
        .pipe(less())
    if (!devMode) {
        page.pipe(postcss(options))
    }
    page.pipe(gulp.dest(folder.dist + "css/"))
})

// 监听文件的变化
gulp.task("watch", function () {
    gulp.watch(folder.src + "html/*", ["html"])
    gulp.watch(folder.src + "css/*", ["css"])
    gulp.watch(folder.src + "js/*", ['js'])
    gulp.watch(folder.src + "images/*", ['images'])
})

// 服务器的配置，使用gulp中的gulp-connect,  模拟简易的服务器的插件
gulp.task("server", function () {
    connect.server({
        port: "8090",
        // 开启自动刷新
        livereload: true
    })
})


// 创建默认的任务队列，就是我们每次只有gulp一下就行，不用输入任务名称
gulp.task("default", ["html", "images", "js", "css", "watch", "server"]);








