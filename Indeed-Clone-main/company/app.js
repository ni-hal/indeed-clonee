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

const app = express();

const expressSwagger = require('express-swagger-generator')(app);
const cors = require('cors');
const validate = require('./util/authValidator');

const employerRouter = require('./routes/employer.route');
const companyRouter = require('./routes/company.route');
const jobRouter = require('./routes/alljobs.route');
const mediaRouter = require('./routes/media.route');
// const { getRedisResponseMiddleware, getRedisRequestMiddleware } = require('./util/redis');

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
      description: 'Company Information Server for Indeed',
      title: 'Company Information Server',
      version: '1.0.0',
    },
    host: 'localhost:7001',
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

// app.use(getRedisRequestMiddleware('company')); // Disabled for local development
// app.use(getRedisResponseMiddleware('company')); // Disabled for local development

app.use('/employers', employerRouter); // Temporarily disabled auth for testing
app.use('/companies', companyRouter); // Temporarily disabled auth for testing
app.use('/jobs', jobRouter);
app.use('/media', getAuthMiddleware(validate), mediaRouter);

module.exports = app;
