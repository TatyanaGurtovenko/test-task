let project_folder = 'dist';
let src_folder = 'src';

let path = {
  build: {
    html: project_folder + '/',
    css: project_folder + '/css/',
    js: project_folder + '/js/',
    img: project_folder + '/img/',
    fonts: project_folder + '/fonts/',
  },
  src: {
    html: src_folder + '/*.html',
    css: src_folder + '/scss/style.scss',
    js: src_folder + '/js/script.js',
    img: src_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
    fonts: src_folder + '/fonts/*.ttf',
    pug: src_folder + '/pug/*.pug'
  },
  watch: {
    html: src_folder + '/**/*.html',
    css: src_folder + '/scss/**/*.scss',
    js: src_folder + '/js/**/*.js',
    img: src_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
    fonts: src_folder + '/fonts/*.ttf',
    pug: src_folder + '/pug/**/*.pug'
  },
  clean: './' + project_folder + '/'
}

let { src, dest } = require('gulp'), gulp = require('gulp'), browsersync = require('browser-sync').create(), fileinclude = require('gulp-file-include'), del = require('del'), scss = require('gulp-sass'), autoprefixer = require('gulp-autoprefixer'), group_media = require('gulp-group-css-media-queries'), clean_css = require('gulp-clean-css'), pug_html = require('gulp-pug');

  


function browserSync(){
  browsersync.init({
    server: {
      baseDir: './' + project_folder + '/'
    },
    port: 3000,
    notify: false
  })
}
function html(){
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function images(){
  return src(path.src.img)
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

function pug(){
  return src(path.src.pug)
    .pipe(pug_html())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function css(){
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: 'expanded'
      })
    )
    .pipe(
      group_media()
    )
    .pipe(
      autoprefixer({
        overrideBrowserList: ['last 5 versions'],
        cascade: true
      })
    )
    .pipe(clean_css())
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}
function js(){
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

function watchFiles(){
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.pug], pug);
}

function clean(){
  return del(path.clean)
}

let build = gulp.series(clean, gulp.parallel(js,css,html,pug,images));
let watch = gulp.parallel(build,watchFiles,browserSync);

exports.images = images;
exports.js = js;
exports.css = css;
exports.html = build;
exports.build = build;
exports.pug = build;
exports.watch = watch;
exports.default = watch;
