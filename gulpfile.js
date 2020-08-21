const gulp = require('gulp');
const { series } = require('gulp');
const fs = require('fs');
const path = require('path');
const glob = require("glob");
const inject = require('gulp-inject'); // append/prepend/wrap/before/after/beforeEach/afterEach/replace
const rename = require('gulp-rename'); // rename a file in stream
const flatten = require('gulp-flatten'); // remove from folders
const zip = require('gulp-zip'); // make a ZIP
const rimraf = require('rimraf'); // delete a folder that contains files

const htmlFiles = glob.sync('./src/fragments/*.html'); // get list of fragments from folder

function defaultTask(cb) {

    gulp.watch([
        './src/**/*.*'
    ], buildForTesting).on('end', function() {console.log('test')});

    cb();
}

/************************************************************************************
 * setup the basic project structure
 * @param cb
 */
function setup(cb) {
    // create fragments folder
    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./src/fragments'));

    // create images folder
    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./src/images/template'));

    // create template folder
    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./src/template'));

    // create build folder
    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./build'));

    // create dist folder
    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./dist'));

    // create template file
    fs.writeFile('./src/template/template.html', '<html>[make a template]</html>', cb);
}


/*************************************************************************************
 * Create new fragment
 * @param cb
 */
function fragment(cb) {

    if (arg.new === undefined) {
        console.log("\x1b[31m%s\x1b[0m", 'EXAMPLE: > gulp fragment --new "Fragment name"');
        cb();
        return;
    }

    let fragName = arg.new.replace(/ /g, "-");

    fs.writeFile('./src/fragments/' + fragName + '.html', '<tr>\r\n    <td>[add your fragment content here]</td>\r\n</tr>', cb);

    // create fragment folder
    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./src/images/' + fragName));
}


/*************************************************************************************
 * Build as single html file with fragments embedded for browser-based testing
 * @param cb
 */
function buildForTesting(cb) {

    rimraf('./build', function () {  });

    setTimeout(function () {

        gulp.src('./src/template/*.html')
            .pipe(inject(gulp.src(['./src/fragments/*.html']), {
                starttag: '<!-- inject:{{path}} -->',
                relative: true,
                transform: function(filepath, file) {
                    //console.log(filepath);
                    return file.contents.toString('utf8');
                }
            }))
            .pipe(gulp.dest('./build'))
            .on('end', function () {

                gulp.src('./src/images/**/*')
                    .pipe(flatten())
                    .pipe(gulp.dest('./build/images/'))
                    .on('end', function () {

                        cb();

                    });

            });

    }, 500)

}

/*************************************************************************************
 * Package template and fragments ready for upload to Vault
 * @param cb
 */
function packageForDistribution(cb) {

    // delete everything in dist folder
    rimraf('./dist', function () {  });

    /******************************************************************
    * 1, main template html and images folder (inside images.zip)
    * 2, fragment and images folder (inside images.zip) for each fragment
    */

    // delay to give rimraf time to do its delete!
    setTimeout(function () {

        // #1 TEMPLATE

        console.log("\x1b[31m%s\x1b[0m", '\nProcessing template...');

        gulp.src('./src/template/*.html')
            .pipe(rename('index.html'))
            .pipe(gulp.dest('./dist/template'))
            .on('end', function () {

                // copy images temporarily to distribution folder for packaging
                gulp.src('./src/images/template/**')
                    .pipe(gulp.dest('./dist/template/images'))
                    .on('end', function () {

                        // zip the images folder (folder needs to be in the zip, not just the images)
                        gulp.src(['./dist/template/**', '!./dist/template/*.html'])
                            .pipe(zip('images.zip'))
                            .pipe(gulp.dest('./dist/template'))
                            .on('end', function() {

                                // remove dist/images folder
                                rimraf('./dist/template/images', function () {  });

                            });
                    });
            });

        // #2 FRAGMENTS

        let fragCnt = htmlFiles.length;
        console.log("\x1b[31m%s\x1b[0m", '\nProcessing fragments (x' + fragCnt + '):');

        htmlFiles.forEach(function (htmlFile) {
            console.log(' - ' + path.basename(htmlFile, ''));

            gulp.src(htmlFile)
                .pipe(rename(function (path) {path.basename = 'index'}))
                .pipe(gulp.dest('./dist/' + path.basename(htmlFile, '.html')))
                .on('end', function () {

                    // copy images temporarily to distribution folder for packaging
                    gulp.src('./src/images/' + path.basename(htmlFile, '.html') + '/**')
                        .pipe(gulp.dest('./dist/' + path.basename(htmlFile, '.html') + '/images'))
                        .on('end', function () {

                            // zip the images folder (folder needs to be in the zip, not just the images)
                            gulp.src(['./dist/' + path.basename(htmlFile, '.html') + '/**', '!./dist/' + path.basename(htmlFile, '.html') + '/*.html'])
                                .pipe(zip('images.zip'))
                                .pipe(gulp.dest('./dist/' + path.basename(htmlFile, '.html')))
                                .on('end', function() {

                                    // remove dist/images folder
                                    rimraf('./dist/' + path.basename(htmlFile, '.html') + '/images', function () {  });

                                });
                        });
                });

            fragCnt --;
            if (fragCnt === 0) {
                console.log('');
                cb();
            }
        });

    }, 500)

}

exports.default = defaultTask;

exports.setup = setup;

exports.fragment = fragment;

exports.build = buildForTesting;

exports.dist = packageForDistribution;


// fetch command line arguments
const arg = (argList => {

    let arg = {}, a, opt, thisOpt, curOpt;
    for (a = 0; a < argList.length; a++) {

        thisOpt = argList[a].trim();
        opt = thisOpt.replace(/^\-+/, '');

        if (opt === thisOpt) {

            // argument value
            if (curOpt) arg[curOpt] = opt.replace(/([^a-z0-9_-]+)/gi, ' ').trim();
            curOpt = null;

        }
        else {

            // argument name
            curOpt = opt;
            arg[curOpt] = true;

        }

    }

    return arg;

})(process.argv);
