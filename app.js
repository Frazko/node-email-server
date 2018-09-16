const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');
const mailgunTransport = require('nodemailer-mailgun-transport')
if (process.env.NODE_ENV !== 'production') require('dotenv').config({
  silent: process.env.NODE_ENV === 'production'
})


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

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
      <li>NameFrom: ${req.body.nameFrom}</li>
      <li>EmailFrom: ${req.body.emailFrom}</li>
      <li>NameTo: ${req.body.nameTo}</li>
      <li>EmailTo: ${req.body.emailTo}</li>
      <li>Message: ${req.body.message}</li>
    </ul>
  `;


  emailClient = nodemailer.createTransport(transport)
  sendText('fmurillo@gmail.com', '"Frazko" <fmurillo@gmail.com>', 'YEY!', 'Doing something great!!!\n' + output)
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


app.listen(process.env.PORT, () => console.log('Server Started...'));