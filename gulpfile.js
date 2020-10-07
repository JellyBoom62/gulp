const { src, dest, series, parallel, watch } = require('gulp');
const browsersync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const scss = require('gulp-sass');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const webpHTML = require('gulp-webp-html');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fonter = require('gulp-fonter');
const cleancss = require('gulp-clean-css');
const gcmq = require('gulp-group-css-media-queries');
const rename = require('gulp-rename');

const source_folder = "app";
const project_folder = "dist";

let path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/img/",
		svg: project_folder + "/svg/",
		fonts: project_folder + "/fonts/"
	},
	src: {
		html: source_folder + "/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/img/**/*.{jpg,png,gij,ico,webp}",
		svg: source_folder + "/svg/*.svg",
		fonts: source_folder + "/fonts/*.ttf"
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/img/**/*.{jpg,png,gij,ico,webp}",
		svg: source_folder + "/svg/*.svg",
	},
	clean: "./" + project_folder + "/"
}

function browserSync() {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"
		},
		notify: false
	})
}

function html() {
	return src(path.src.html)
		.pipe(webpHTML())
		.pipe(dest("./" + path.build.html))
		.pipe(browsersync.stream())
}
function scripts() {
	return src(path.src.js)
		.pipe(dest("./" + path.build.js))
		.pipe(uglify())
		.pipe(rename({
			extname: ".min.js"
		})
		)
		.pipe(dest("./" + path.build.js))
		.pipe(browsersync.stream())
}
function css() {
	return src(path.src.css)
		.pipe(
			scss({
				outputStyle: "expanded"
			})
		)
		.pipe(gcmq())
		.pipe(autoprefixer({
			overrideBrowserslist: ["last 10 version"],
			grid: true
		}))
		.pipe(dest("./" + path.build.css))
		.pipe(cleancss())
		.pipe(rename({
			extname: ".min.css"
		})
		)
		.pipe(dest("./" + path.build.css))
		.pipe(browsersync.stream())
}
function images() {
	return src(path.src.img)
		.pipe(
			webp({
				quality: 70
			}))
		.pipe(dest("./" + path.build.img))
		.pipe(src("./" + path.src.img))
		.pipe(imagemin({
			interlaced: true,
			progressive: true,
			optimizationLevel: 3,
			svgoPlugins: [{ removeViewBox: false }]
		})
		)
		.pipe(dest("./" + path.build.img))
		.pipe(browsersync.stream())
}
function fonts() {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest("./" + path.build.fonts))
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest("./" + path.build.fonts))
}
function otf2ttf() {
	return src([source_folder + '/fonts/*.otf'])
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest("./" + source_folder + '/fonts/'))
}
function svg() {
	src(path.src.svg)
		.pipe(dest("./" + path.build.svg))
		.pipe(browsersync.stream())
}
function startWatch() {
	watch([path.watch.html], html)
	watch([path.watch.js], scripts)
	watch([path.watch.css], css)
	watch([path.watch.img], images)
	watch([path.watch.svg], svg)

}

function clean() {
	return del(path.clean);
}

exports.fonts = fonts;
exports.images = images;
exports.svg = svg;
exports.browserSync = browserSync;
exports.html = html;
exports.scripts = scripts;
exports.css = css;
exports.otf2ttf = otf2ttf;
exports.default = series(clean, parallel(html, css, scripts, images, svg, fonts, otf2ttf, browserSync, startWatch));

