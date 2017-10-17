'use strict';

var gulp = require('gulp');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var through2 = require('through2');

var transport = nodemailer.createTransport(smtpTransport({
  host: 'smtp.office365.com',
  port: '587',
  tls: { ciphers: 'SSLv3' },
  auth: {
    user: "subhashree.ramanathan@syncfusion.com",
    pass: "Shree123$"
  }
}));

var message = {
  from: 'subhashree.ramanathan@syncfusion.com',
  to: ' subhashree.ramanathan@syncfusion.com',
  subject: 'Angular sample browser testing',
  html: ""
};


var ts = require('gulp-typescript');
var tsProject = ts.createProject('src/tsconfig.json', {
  typescript: require('typescript')
});
gulp.task('start', function () {
  var tsResult = gulp.src("e2e/**/*.ts")
    .pipe(tsProject());

  return tsResult.js.pipe(gulp.dest('./e2e'));
});

gulp.task('mail', function (done) {
  return gulp.src('./e2e/chrome-test-report.html')
    .pipe(through2.obj(function (file, enc, callback) {
      var html = file.contents.toString();
      html = "Hi Everyone,<br><br>Please find the Angular testing report from below. <br>" + html + "<br><br><br>Regards,<br> Web Automation Team";
      message.html = html;
      transport.sendMail(message, function (error) {
        if (error) {
          console.log('Error occured');
          console.log(error.message);
          return;
        }
        console.log('Message sent successfully!');
        process.exit()
      });
    }))
})
