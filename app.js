const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');
const mailgunTransport = require('nodemailer-mailgun-transport')
require('dotenv').config()


// Configure transport options
const mailgunOptions = {
  auth: {
    api_key: process.env.MAILGUN_ACTIVE_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  }
}
const transport = mailgunTransport(mailgunOptions)

const app = express();

// view engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
  console.log(req.body);
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;


  emailClient = nodemailer.createTransport(transport)
  sendText('fmurillo@gmail.com', '"Frazko" <fmurillo@gmail.com>', 'YEY!', 'Doing something great!!!\n'+output)
    .then(() => {
      // Email sent successfully
      console.log("SUCCESS");
    })
    .catch(() => {
      // Error sending email
      console.log("ERROR");
    })

});

function sendText(to, from, subject, text) {
  return new Promise((resolve, reject) => {
    this.emailClient.sendMail({
      from: from,
      to,
      subject,
      text: 'Hello world?', // plain text body
      html: text // html body
    }, (err, info) => {
      if (err) {
        reject(err)
      } else {
        resolve(info)
      }
    })
  })
}


app.listen(3000, () => console.log('Server Started...'));