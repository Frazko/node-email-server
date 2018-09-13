var nodemailer = require('nodemailer');

// Create the transporter with the required configuration for Gmail
// change the user and pass !
var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: 'myemail@gmail.com',
    pass: 'myPassword'
  }
});

// setup e-mail data
var mailOptions = {
  from: '"Our Code World " <myemail@gmail.com>', // sender address (who sends)
  to: 'mymail@mail.com, mymail2@mail.com', // list of receivers (who receives)
  subject: 'Hello', // Subject line
  text: 'Hello world ', // plaintext body
  html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    return console.log(error);
  }

  console.log('Message sent: ' + info.response);
});