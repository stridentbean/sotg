var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'krogothgantry@gmail.com',
    pass: 'garbagepassword'
  }
});

var mailOptions = {
  from: 'SOTG <krogothgantry@gmail.com>',
  to: 'loktakwah@gmail.com',
  subject: 'Hello',
  text: 'Hello world'
};

module.exports = {
  transporter: transporter,
  options: mailOptions
};


