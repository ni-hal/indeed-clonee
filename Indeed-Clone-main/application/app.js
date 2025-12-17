/* eslint-disable import/order */
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
// const acl = require('./acl');
const {
  getAuthMiddleware,
  getAccessMiddleware,
  getRedisRequestMiddleware,
  getRedisResponseMiddleware,
} = require('u-server-utils');

const applicationRouter = require('./routes/application.route');

const app = express();

const expressSwagger = require('express-swagger-generator')(app);
const cors = require('cors');
const validate = require('./util/authValidator');

// all middlewares
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(cors());

const options = {
  swaggerDefinition: {
    info: {
      description: 'Job Application Information Server for Indeed',
      title: 'Application Information Server',
      version: '1.0.0',
    },
    host: 'localhost:7003',
    produces: ['application/json'],
    schemes: ['http'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'JWT auth token',
      },
    },
  },
  // eslint-disable-next-line no-undef
  basedir: __dirname,
  files: ['./routes/**/*.js'], // Path to the API handle folder
};

expressSwagger(options);

// app.use(getAuthMiddleware(validate)); // Temporarily disabled for testing
// app.use(getRedisRequestMiddleware('application')); // Disabled for local development
// app.use(getRedisResponseMiddleware('application')); // Disabled for local development
// app.use(getAccessMiddleware(acl));

app.use('/applications', applicationRouter);

module.exports = app;
