'use strict';

// Foundation for Apps
//
// We use this Gulpfile to assemble the documentation, run unit tests,
// and deploy changes to the live documentation and CDN.
//
// The tasks are grouped into these categories:
//   1. Libraries
//   2. Variables
//   3. Cleaning files
//   4. Copying files
//   5. Stylesheets
//   6. JavaScript
//   7. Testing
//   8. Server
//   9. Deployment
//  10. Default tasks

// 1. LIBRARIES
// - - - - - - - - - - - - - - -

var gulp        = require('gulp'),
    $           = require('gulp-load-plugins')(),
    rimraf      = require('rimraf'),
    runSequence = require('run-sequence'),
    modRewrite  = require('connect-modrewrite'),
    routes      = require('./node_modules/angular-base-apps/bin/gulp-dynamic-routing'),
    merge       = require('merge-stream'),
    octophant   = require('octophant'),
    Server      = require('karma').Server;

// 2. VARIABLES
// - - - - - - - - - - - - - - -
var production = false;

var paths = {
  html: {
    base: [
      './client/index.html'
    ],
    templates: [
      './client/**/*.html',
      '!./client/index.html'
    ]
  },
  sass: {
    loadPaths: [
      'scss',
      'client/assets/scss'
    ],
    testPaths: [
      'scss',
      'client/assets/scss',
      'bower_components/bootcamp/dist'
    ]
  },
  javascript: {
    libs: [
      'bower_components/fastclick/lib/fastclick.js',
      'bower_components/viewport-units-buggyfill/viewport-units-buggyfill.js',
      'bower_components/tether/tether.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/hammerjs/hammer.js'
    ],
    app: [
      'client/**/*.js',
      'client/app.js'
    ]
  }
};

// 3. CLEANIN' FILES
// - - - - - - - - - - - - - - -

// Clean build directory
gulp.task('clean', function(cb) {
  rimraf('./build', cb);
});

// Clean the dist directory
gulp.task('clean:dist', function(cb) {
  rimraf('./dist', cb);
});

// Clean the routes file
gulp.task('clean:templates', function(cb) {
  rimraf('./build/assets/js/routes.js', cb);
});

// 4. COPYING FILES
// - - - - - - - - - - - - - - -

// Copy static files (but not the Angular templates, Sass, or JS)
gulp.task('copy', function() {
  var merged = merge();

  merged.add(gulp.src(paths.html.base, {
    base: './client/'
  })
    .pipe(gulp.dest('build')));

  merged.add(gulp.src('./node_modules/angular-base-apps/iconic/**/*')
    .pipe(gulp.dest('build/assets/img/iconic/')));

  return merged;
});

// Copy page templates and generate routes
gulp.task('copy:templates', ['clean:templates', 'javascript'], function() {
  return gulp.src(paths.html.templates, {
    base: './client/'
  })
    .pipe(routes({
      angular: true,
      path: 'build/assets/js/routes.js',
      root: 'client'
    }))
    .pipe(gulp.dest('./build'))
  ;
});

// 5. STYLESHEETS
// - - - - - - - - - - - - - - -

// Inject styles for docs-specific libraries
gulp.task('css', ['sass'], function() {
  var dirs = [
    'build/assets/css/app.css'
  ];
  return gulp.src(dirs)
    .pipe($.concat('app.css'))
    .pipe(gulp.dest('build/assets/css'))
  ;
});

// Compile stylesheets
gulp.task('sass', function() {
  var merged = merge();

  merged.add(gulp.src('client/assets/scss/app.scss')
    .pipe($.sass({
      includePaths: paths.sass.loadPaths,
      outputStyle: 'nested',
      errLogToConsole: true
    }))
    .pipe($.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'ie >= 10', 'iOS >= 7', 'Safari >= 7', 'Opera >= 25']
    }))
    .pipe($.if(production, $.minifyCss()))
    .pipe(gulp.dest('./build/assets/css/')));

  return merged;
});

// 6. JAVASCRIPT
// - - - - - - - - - - - - - - -

// Compile Foundation JavaScript
gulp.task('javascript', function() {
  var merged = merge();

  merged.add(gulp.src(paths.javascript.libs)
    .pipe($.if(production, $.uglify()))
    .pipe($.concat('base-apps-dep.js'))
    .pipe(gulp.dest('./build/assets/js/')));

  merged.add(gulp.src(paths.javascript.app)
    .pipe($.ngAnnotate())
    .pipe($.if(production, $.uglify()))
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('./build/assets/js/')));

  return merged;
});

// 7. SERVER
// - - - - - - - - - - - - - - -

gulp.task('server:start', function() {
  $.connect.server({
    root: './build',
    middleware: function() {
      return [
        modRewrite(['^[^\\.]*$ /index.html [L]'])
      ];
    }
  });
});

gulp.task('server:start:dist', function() {
  $.connect.server({
    root: './dist',
    middleware: function() {
      return [
        modRewrite(['^[^\\.]*$ /index.html [L]'])
      ];
    }
  });
});

// 9. DISTRIBUTION BUILD
// - - - - - - - - - - - - - - -

gulp.task('copy:dist', function() {
  var merged = merge();

  // copy app
  merged.add(gulp.src([
    "./build/**/*.html",
    "./build/assets/fonts/**/*",
    "./build/assets/img/**/*",
    "./build/assets/css/app.css",
    "./build/assets/js/app.js",
    "./build/assets/js/base-apps-dep.js",
    "./build/assets/js/routes.js",
    "./build/assets/js/templates.js"
  ], {
    base: "./build"
  })
    .pipe(gulp.dest('./dist')));

  return merged;
});

// 10. NOW BRING IT TOGETHER
// - - - - - - - - - - - - - - -

gulp.task('production:enable', function(cb) { production = true; cb(); });

// Build the documentation once
gulp.task('build', function(cb) {
  runSequence('clean', ['copy', 'css', 'javascript', 'copy:templates'], function() {
    cb();
  });
});

gulp.task('build:dist', function(cb) {
  runSequence('clean:dist', 'production:enable', 'build', 'copy:dist', function() {
    cb();
  });
});

// Build the documentation, start a test server, and re-compile when files change
gulp.task('default', ['build', 'server:start'], function() {

  // Watch static files
  gulp.watch(paths.html.base, ['copy']);

  // Watch Angular templates
  gulp.watch(paths.html.templates, ['copy:templates']);

  // Watch Angular partials
  gulp.watch(paths.html.partials, ['copy:partials']);

  // Watch Sass
  gulp.watch(['./client/assets/scss/**/*', './scss/**/*'], ['css']);

  // Watch JavaScript
  gulp.watch(paths.javascript.app, ['javascript']);
});

// Build the documentation, start a test server, and re-compile when files change
gulp.task('default:dist', ['build:dist', 'server:start:dist'], function() {

  // Watch static files
  gulp.watch(paths.html.base, ['copy', 'copy:dist']);

  // Watch Angular templates
  gulp.watch(paths.html.templates, ['copy:templates', 'copy:dist']);

  // Watch Angular partials
  gulp.watch(paths.html.partials, ['copy:partials', 'copy:dist']);

  // Watch Sass
  gulp.watch(['./client/assets/scss/**/*', './scss/**/*'], ['css', 'copy:dist']);

  // Watch JavaScript
  gulp.watch(paths.javascript.app, ['javascript', 'copy:dist']);
});

gulp.task('bump:patch', function() { return bump('patch'); });
gulp.task('bump:minor', function() { return bump('minor'); });
gulp.task('bump:major', function() { return bump('major'); });

gulp.task('publish:patch', ['build:dist', 'bump:patch'], function() { return publish(); });
gulp.task('publish:minor', ['build:dist', 'bump:minor'], function() { return publish(); });
gulp.task('publish:major', ['build:dist', 'bump:major'], function() { return publish(); });

gulp.task('publish:ghpages', function() {
  return gulp.src('./dist/**/*')
    .pipe($.ghPages());
});

function bump(importance) {
  // get all the files to bump version in
  return gulp.src(['./package.json', './bower.json'])
    // bump the version number in those files
    .pipe($.bump({type: importance}))
    // save it back to filesystem
    .pipe(gulp.dest('./'));
}

function publish() {
  return gulp.src(['./package.json', './bower.json', './dist/**/*'])
    // commit the changes
    .pipe($.git.commit('bump version'))
    // read only one file to get the version number
    .pipe($.filter('package.json'))
    // **tag it in the repository**
    .pipe($.tagVersion());
}
