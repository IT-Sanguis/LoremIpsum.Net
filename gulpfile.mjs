import gulp from "gulp";
import plumber from "gulp-plumber";
import sourcemap from "gulp-sourcemaps";
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import posthtml from "gulp-posthtml";
import htmlmin from "gulp-htmlmin";
import include from "posthtml-include";
import svgstore from "gulp-svgstore";
import csso from "gulp-csso";
import rename from "gulp-rename";
import { deleteAsync } from 'del';
import imagemin, {mozjpeg, optipng, svgo} from "gulp-imagemin";
import webp from "imagemin-webp";
import extReplace from "gulp-ext-replace";
import { create as bsCreate } from "browser-sync";
const browserSync = bsCreate();
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import terser from "gulp-terser";
import concat from "gulp-concat";

const style = () => {
  return gulp.src("./source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("./build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("./build/css"))
    .pipe(browserSync.stream());
}


const clean = () => {
  return deleteAsync ("build");
}


const cleanHTML = () => {
  return deleteAsync ("build/*.html");
}


const cleanJS = () => {
  return deleteAsync ("build/js");
}

const cleanPHP = () => {
  return deleteAsync ("build/*.php");
}

const copy = () => {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/libs/**",
    "source/*.html",
    "source/*.php",
    "source/docs/**",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
}


const html = () => {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
}


const js = () => {
  return gulp.src("source/js/**/*.js")
    .pipe(sourcemap.init())
    .pipe(concat('main.js'))
    .pipe(gulp.dest("build/js"))
    .pipe(terser())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/js"));
}


const php = () => {
  return gulp.src("source/*.php")
    .pipe(gulp.dest("build/"))
}

const images = () => {
  return gulp.src(["source/img/**/*.{png,jpg,svg}"])
    .pipe(imagemin([
      optipng({ optimizationLevel: 5 }),
      mozjpeg({ quality: 85, progressive: true }),
      // jpegtran({progressive: true}),
      svgo()
    ]))
    .pipe(gulp.dest("build/img"));
}


const sprite = () => {
  return gulp.src("source/img/sprite/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img/sprite"));
}


const exportWebP = () => {
  return gulp.src(["build/img/**/*.{png,jpg}", "!build/img/favicons/**/*"])
    .pipe(imagemin([
      webp({
        quality: 85
      })
    ]))
    .pipe(extReplace(".webp"))
    .pipe(gulp.dest("build/img"));
}

const server = () => {
  browserSync.init({
    server: {
      baseDir: "build"
    },
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
}

const reload = () => {
  browserSync.reload();
}

const watchTask = () => {
  gulp.watch("source/sass/**/*.scss", style);
  gulp.watch("source/*.html").on("change", updateHTML);
  gulp.watch("source/js/**/*.js").on("change", updateJS);
  gulp.watch("source/*.php").on("change", updatePHP);
}


export const build = gulp.series(clean, copy, style, js, images, sprite, exportWebP, html);
const updateHTML = gulp.series(cleanHTML, html, reload);
const updateJS = gulp.series(cleanJS, js, reload);
const updatePHP = gulp.series(cleanPHP, php, reload);

// export.build = build;
export default gulp.series(build, gulp.parallel(server, watchTask));
