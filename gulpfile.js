var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var autoPrefixer = require('gulp-autoprefixer');
//if node version is lower than v.0.1.2
//require('es6-promise').polyfill();
var cssComb = require('gulp-csscomb');
var cmq = require('gulp-merge-media-queries');
var cleanCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var cache = require('gulp-cache');
var notify = require('gulp-notify');
//var imagemin = require('gulp-imagemin');
// var imageminPngquant = require('imagemin-pngquant');
// var imageminZopfli = require('imagemin-zopfli');
// var imageminMozjpeg = require('imagemin-mozjpeg'); //need to run 'brew install libpng'
// var imageminGiflossy = require('imagemin-giflossy');
var csslint = require('gulp-csslint');

/*
npm install --save-dev gulp-plumber gulp-rename gulp-autoprefixer gulp-csscomb gulp-merge-media-queries gulp-clean-css gulp-uglify gulp-concat gulp-notify gulp-csslint gulp-cache
*/
gulp.task('clear', () =>
    cache.clearAll()
);

gulp.task('css', () =>
    gulp.src(['css//**/*.css'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(autoPrefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))

        .pipe(cssComb())
        .pipe(cmq({log:true}))
        .pipe(csslint())
        .pipe(csslint.formatter())
        .pipe(concat('style-concat.css'))
        .pipe(gulp.dest('css/'))
        .pipe(rename({
            basename: "style",
            suffix: '.min'
        }))
        .pipe(cleanCss())
        .pipe(gulp.dest('css/'))
        .pipe(notify('css task finished'))
);
gulp.task('js',function(){
    gulp.src(['js//**/*.js'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(concat('js-concat.js'))
        .pipe(gulp.dest('js/'))
        .pipe(rename({
            basename: "main",
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('js/'))
          .pipe(notify('js task finished'))
});

gulp.task('html',function(){
    gulp.src(['html/**/*.html'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest('./'))
        .pipe(notify('html task finished'))
});

//compress all images
// gulp.task('imagemin', function() {
//     gulp.src(['images_orginal/'])
//         .pipe(cache(imagemin([
//             //png
//             imageminPngquant({
//                 speed: 1,
//                 quality: 98 //lossy settings
//             }),
//             imageminZopfli({
//                 more: true
//                 // iterations: 50 // very slow but more effective
//             }),
//             //gif
//             // imagemin.gifsicle({
//             //     interlaced: true,
//             //     optimizationLevel: 3
//             // }),
//             //gif very light lossy, use only one of gifsicle or Giflossy
//             imageminGiflossy({
//                 optimizationLevel: 3,
//                 optimize: 3, //keep-empty: Preserve empty transparent frames
//                 lossy: 2
//             }),
//             //svg
//             imagemin.svgo({
//                 plugins: [{
//                     removeViewBox: false
//                 }]
//             }),
//             //jpg lossless
//             imagemin.jpegtran({
//                 progressive: true
//             }),
//             //jpg very light lossy, use vs jpegtran
//             imageminMozjpeg({
//                 quality: 90
//             })
//         ])))
//         .pipe(gulp.dest('images/'));
// });

gulp.task('image',function(){
    gulp.src(['images_orginal/**/*'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))


        .pipe(cache(imagemin(
            [imageminPngquant(), imageminMozjpeg()],
            {verbose: true}
        )))

        .pipe(gulp.dest('images/'))
        .pipe(notify('image task finished'))
});

gulp.task('watch',function(){
    gulp.watch('js//**/*.js', gulp.series('js'));
    gulp.watch('css//**/*.css', gulp.series('css'));
    gulp.watch('html/**/*.html', gulp.series('html'));
    //gulp.watch('images_orginal/**/*', gulp.series('image'));
});


//gulp.task('default', gulp.parallel('clear', 'js', 'css', 'html', 'image'));
gulp.task('default', gulp.parallel('clear', 'css', 'js', 'html'));