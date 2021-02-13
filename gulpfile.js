// ======================= Gulp4Start ========================
// ================== oleghatsko@gmail.com ===================
// ver 1.0.3

var gulpv = 4,
	syntax        = 'scss', // Syntax: sass or scss;
	is_use_timestamp = 1, // 
	local_server      = 0, // Is local server
	local_server_url  = 'http://local.loc:8888', // Local server url
	debag_gen = 0,

	gulp          = require('gulp'),
	gutil         = require('gulp-util' ),
	sass          = require('gulp-sass'),
	browserSync   = require('browser-sync').create(),
	concat        = require('gulp-concat'),
	uglify        = require('gulp-uglify'),
	cleancss      = require('gulp-clean-css'),
	rename        = require('gulp-rename'),
	autoprefixer  = require('gulp-autoprefixer'),
	notify        = require('gulp-notify'),
	imagemin      = require('gulp-imagemin'),
	rsync         = require('gulp-rsync'),
	fs            = require('fs'),

	critical      = require('critical');
	createFile    = require('create-file'),
	sourcemaps    = require('gulp-sourcemaps'),
	del           = require('del'),
	clean         = require('gulp-clean'),
	file          = require('gulp-file'),
	path          = require('path'), 
	through       = require('through2'),
	//gulpIgnore    = require('gulp-ignore'),
	gulpif        = require('gulp-if'),
	beautify      = require('gulp-beautify'),
	prettify      = require('gulp-jsbeautifier'),
	filesize      = require('gulp-filesize'),
	root_src      = path.resolve(__dirname)+'/',
	counter = 1,
	gen_ver_step = 5,

	build_url = 'app/build/',
	output_css_url = build_url,
	output_css_name = 'styles.min',
	output_js_url =  build_url,
	output_js_name = 'scripts.min',
	timestamp = Math.round(+new Date()/1000),
	time_range = timestamp;
	project_create_time_file = 'app/build/create_time.txt';

function styles_min(){
	styles(true);
}
function styles(is_min){
	if(is_min == undefined){
		is_min = false;
	}
	counter++;
	if(counter > gen_ver_step){
		write_new_timestamp();
		counter = 0;
	}
	return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
	.pipe(gulpif(debag_gen, sourcemaps.init()))
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename(output_css_name+'.css')) //{ suffix: '.min', prefix : '' }
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(gulpif(is_min, cleancss( {level: { 2: { specialComments: 0 } } }))) // Opt., comment out when debugging
	.pipe(gulpif(debag_gen, prettify(), sourcemaps.write({includeContent: false})))
	.pipe(gulp.dest(output_css_url))
	.pipe(filesize())
	.pipe(browserSync.stream());
}
function get_scripts(){
	return [
		'app/libs/jquery/dist/jquery.min.js',
		
		//'app/libs/perfect-scrollbar-master/dist/perfect-scrollbar.min.js',
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
		'app/libs/slick/slick.js',
		'app/libs/vanilla-lazyload-master/dist/lazyload.min.js',
		//'app/libs/_lazy.js',
		'app/js/functions.js',
		'app/js/common.js', // Always at the end
	];
}
function scripts_min(){
	scripts(true);
}
function scripts(is_min){
	if(is_min == undefined){
		is_min = false;
	}
	counter++;
	if(counter > gen_ver_step){
		write_new_timestamp();
		counter = 0;
	}
	return gulp.src(get_scripts())
	.pipe(gulpif(is_min ,uglify())) //можно выключить для ускорения
	.pipe(concat(output_js_name+'.js'))
	.pipe(gulpif(debag_gen, beautify()))
	.pipe(gulp.dest(output_js_url))
	.pipe(filesize())
	.pipe(browserSync.reload({ stream: true }));
}
function critical_scripts(){
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/js/critical.js'
	])
	.pipe(uglify()) //можно выключить для ускорения
	.pipe(concat('critical.min.js'))
	.pipe(gulpif(debag_gen, beautify()))
	.pipe(gulp.dest(output_js_url))
	.pipe(filesize())
	.pipe(browserSync.reload({ stream: true }));
}

function write_new_timestamp(){
	if(is_use_timestamp){
		var add_text = "",
			time_create = 0,
			is_exists_file = false;
		timestamp = Math.round(+new Date()/1000);

		try {
			fs.accessSync(project_create_time_file);
			// the file exists
			//console.log('file exists');
			is_exists_file = true;
			time_create = fs.readFileSync(project_create_time_file, "utf8");
			//console.log(fs.readFileSync(project_create_time_file, "utf8"));
		}catch(e){
			// the file doesn't exists
			//console.log('file doesnt exists');
			time_create = timestamp-1;
			createFile(project_create_time_file, time_create, function (err) {
				if(err != undefined)
				console.log(err);
			});
		}

		time_range = timestamp-time_create;
		console.log('New timestamp: '+time_range);

		// if(!local_server){
		// 	css_js_ver_update();
		// }
		
		var file_content = "<?php\ndefine('STYLES_TIMESTAMP', '"+(time_range)+"');\n";
		
		return del([build_url+'ver.php'], {force: true}).then(paths => {
			createFile(build_url+'ver.php', file_content, function (err) {
				if(err != undefined)
				console.log(err);// file either already exists or is now created (including non existing directories) 
			});
		});
	}else{
		return true;
	}
}
function css_js_ver_update(){ //new
	console.log('html ver updated');
	return gulp.src('app/*.html')//["header.php"]
	.pipe(
		replace(/cache_v=\d+/g, function() {
			return "cache_v=" + time_range;
		})
	)
	.pipe(gulp.dest(root_src+'app/'));
}
function watch3(){
	gulp.watch('app/'+syntax+'/**/*.'+syntax+'', ['styles']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js', 'app/js/functions.js'], ['js']);
	gulp.watch(['app/js/critical.js'], ['critical_scripts']);
	gulp.watch('app/*.html', browserSync.reload);
}
function watch4(){
	gulp.watch('app/'+syntax+'/**/*.'+syntax+'', styles);
	gulp.watch(['libs/**/*.js', 'app/js/common.js', 'app/js/functions.js'], scripts);
	//gulp.watch(['app/js/critical.js'], critical_scripts);
	gulp.watch('app/*.html').on('change', browserSync.reload);
}
gulp.task('styles', styles);
gulp.task('js', scripts);
gulp.task('deploy', gulp.series(scripts_min, styles_min, write_new_timestamp, css_js_ver_update));
gulp.task('browser-sync', function() {
	if(local_server == 1){
		return browserSync.init({
			proxy: local_server_url,
			notify: false,
			open: true,
			//reloadOnRestart: true,
		});
	}else{
		return browserSync.init({
			server: {
				baseDir: 'app'
			},
			notify: false,
			open: true,
		});
	}
});

if(gulpv == 4){
	gulp.task('default', gulp.parallel(watch4, 'browser-sync'), write_new_timestamp);
	//gulp.task('default', gulp.parallel('watch', 'styles', 'js', 'browser-sync', 'write_new_timestamp'));
}else{
	gulp.task('watch', ['styles', 'js', 'browser-sync'], watch3);
	gulp.task('default', ['watch']);
}

gulp.task('mass_image_min', function() {
    return gulp.src('app/img/**',) // берем любые файлы в папке и ее подпапках
    .pipe(imagemin()) // оптимизируем изображения для веба
    .pipe(gulp.dest('app/img_min/')) // результат пишем по указанному адресу
});


//================= for svg sprite ===============>>>
var rimraf = require('rimraf'),
	//pug = require('gulp-pug'),
	//sass = require('gulp-sass'),
	gulpSequence = require('gulp-sequence'),
	inlineimage = require('gulp-inline-image'),
	svgSprite = require('gulp-svg-sprite'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio'),
	replace = require('gulp-replace'),
	plumber = require('gulp-plumber'),
	pngquant = require('imagemin-pngquant'),
	assetsDir = 'app/',
	outputDir = 'dist/',
	buildDir = 'build/',
	svgSassDir = 'svg_sass',
	svgDir = 'svg';
	//imagemin = require('gulp-imagemin'),
	//const path = require('path');
// ================>>> for svg sprite ===================

//const path = require('path');
gulp.task('svgSpriteBuild', function () {
	return gulp.src(assetsDir + svgDir +'/icons/*.svg')
	// minify svg
	.pipe(svgmin({
		js2svg: {
			pretty: true
		}
	}))
	// remove all fill and style declarations in out shapes
	.pipe(cheerio({
		run: function ($) {
			$('[fill]').removeAttr('fill');
			$('[stroke]').removeAttr('stroke');
			$('[style]').removeAttr('style');
		},
		parserOptions: {xmlMode: true}
	}))
	// cheerio plugin create unnecessary string '&gt;', so replace it.
	.pipe(replace('&gt;', '>'))
	// build svg sprite
	.pipe(svgSprite({
		mode: {
			symbol: {
				sprite: "../sprite.svg",
				render: {
					scss: {
						dest:'../../../'+svgSassDir+'/_sprite.scss',
						template: assetsDir + svgSassDir+"/templates/_sprite_template.scss"
					}
				},
				example: true
			}
		}
	}))
	.pipe(gulp.dest(assetsDir + svgDir + '/sprite/'));
});

//copy sprite.svg
gulp.task('copySprite', function () {
	return gulp.src(outputDir + svgDir + '/sprite/sprite.svg')
	.pipe(plumber())
	.pipe(gulp.dest(buildDir + svgDir + '/sprite/'))
});
//clean build folder
gulp.task('cleanBuildDir', function (cb) {
	rimraf(buildDir, cb);
});
//minify images
gulp.task('imgBuild', function () {
	return gulp.src([outputDir + svgDir + '/**/*', '!' + outputDir + svgDir + '/sprite/**/*'])
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest(buildDir + svgDir + '/'))
});
// ================>>> for svg sprite ===================

// gulp.task('rsync', function() {
// 	return gulp.src('app/**')
// 	.pipe(rsync({
// 		root: 'app/',
// 		hostname: 'username@yousite.com',
// 		destination: 'yousite/public_html/',
// 		// include: ['*.htaccess'], // Includes files to deploy
// 		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
// 		recursive: true,
// 		archive: true,
// 		silent: false,
// 		compress: true
// 	}))
// });

// alias
gulp.task('svg', gulp.parallel('svgSpriteBuild')); //alias
gulp.task('php', write_new_timestamp); //alias
gulp.task('time', css_js_ver_update); //alias
