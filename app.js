const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');
const mailgunTransport = require('nodemailer-mailgun-transport')
const HttpStatus = require('http-status-codes');
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

app.use(function (req, res, next) {
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
  emailClient = nodemailer.createTransport(transport)
  sendText(req.body.emailTo, '"' + req.body.nameFrom + '" <' + req.body.emailFrom + '>', 'Reporte de ' + req.body.nameFrom + ' - ' + req.body.date, req.body.report)
    .then(() => {
      // Email sent successfully
      console.log("SUCCESS " + Date.now());
      res.status(HttpStatus.OK).send({response:'success'});
    })
    .catch((err) => {
      // Error sending email
      console.log("ERROR ", err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
          error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
        });
    })
});

function sendText(to, from, subject, text) {
  return new Promise((resolve, reject) => {
    this.emailClient.sendMail({
      from: from,
      to,
      subject,
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