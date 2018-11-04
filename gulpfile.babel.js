import gulp from 'gulp';
import responsive from 'gulp-responsive';
import del from 'del';
import runSequence from 'run-sequence';

// Create responsive images for jpg files
gulp.task('jpg-images', function() {
  return gulp.src('images/**/*.jpg')
    .pipe(responsive({
      // Resize all jpg images to three different sizes: 300, 600 and 800
      '**/*.jpg': [{
        width: 800,
        quality: 70,
        rename: { suffix: '-lg'}
      }, {
        width: 600,
        quality: 50,
        rename: { suffix: '-md'}
      }, {
        width: 300,
        quality: 30,
        rename: { suffix: '-sm'}
      }]
    },))
    .pipe(gulp.dest('img/'));
});

// Just copy any other images to img folder
gulp.task('other-images', function() {
  return gulp.src(['!images/**/*.jpg', 'images/**/*.*'])
    .pipe(gulp.dest('img/'));
});

// clean img folder
gulp.task('clean', function(done) {
  return del(['img/'], done);
});

// Run this task for your images.
gulp.task("images", function(done) {
  runSequence(
    'clean',
    ['jpg-images','other-images'],
    done
  );
});