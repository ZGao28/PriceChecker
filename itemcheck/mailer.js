var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'danthemanzspam@gmail.com',
    pass: 'zedisnew1'
  }
});

var mailOptions = {
  from: 'danthemanzspam@gmail.com',
  to: 'zgao016@uottawa.ca',
  subject: 'Price Track Item Update',
  text: 'Placeholder'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});