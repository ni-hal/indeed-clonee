/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');

const app = express();

const expressSwagger = require('express-swagger-generator')(app);

// all middlewares
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Max-Age', '3600');
  res.header('Vary', 'Origin');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  next();
});

app.use(cors({
  origin: true,
  credentials: false,
  optionsSuccessStatus: 200
}));

app.use('/auth', authRoutes);

const options = {
  swaggerDefinition: {
    info: {
      description: 'Authentication Server for Uber Eats',
      title: 'Authentication Server',
      version: '1.0.0',
    },
    host: 'localhost:7000',
    produces: ['application/json'],
    schemes: ['http'],
  },
  // eslint-disable-next-line no-undef
  basedir: __dirname,
  files: ['./routes/**/*.js'], // Path to the API handle folder
};

expressSwagger(options);

module.exports = app;
