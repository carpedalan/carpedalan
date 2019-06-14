import path from 'path';

import cors from 'cors';
import express from 'express';
import winston from 'winston';
import expressWinston from 'express-winston';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import expbhs from 'express-handlebars';
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';
import swaggerUi from 'swagger-ui-express';

import initialize from '../api-v1/initialize';

import router from './routes';
import {
  assets,
  cdnDomain,
  ci,
  isDev,
  isProd,
  nodeEnv,
  pgDatabase,
  pgHost,
  pgPassword,
  pgPort,
  pgUser,
  port,
  sessionSecret,
  ssl,
  assetDomain,
} from './config';

const app = express();
let clientAssets = false;
if (isProd) {
  const manifest = require('../dist/manifest.json'); // eslint-disable-line global-require,import/no-unresolved
  clientAssets = assets.map(asset => manifest[asset]);
}

// V important
const customHeader = (req, res, next) => {
  res.setHeader('x-powered-by', 'Carpe Dalan');
  next();
};

const corsOptions = {
  origin: ['http://local.carpedalan.com', /\.local\.carpedalan\.com$/],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

export const setup = () => {
  // Connect to DB pool
  const pool = new pg.Pool({
    host: pgHost,
    user: pgUser,
    password: pgPassword,
    database: pgDatabase,
    port: pgPort,
    ...(ssl ? { ssl: true } : {}),
  });
  const PgSession = connectPgSimple(session);
  const store = new PgSession({ pool });
  app.set('trust proxy', 1);

  // Setup handlebar view engine
  const viewConfig = {
    extname: '.hbs',
    layoutsDir: path.resolve(__dirname),
    partialsDir: path.resolve(__dirname),
  };
  app.enable('view cache');
  app.engine('hbs', expbhs(viewConfig));
  app.set('view engine', 'hbs');
  app.set('views', viewConfig.layoutsDir);
  // static assets
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: /');
  });
  app.use('/dist', express.static('dist'));
  app.use('/public', express.static('public'));
  app.use('/sw.js', express.static('server/sw.js'));

  // Setup app to parse cookies and POST requests
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors(corsOptions));
  // V important
  app.use(customHeader);
  // Set up session store
  app.use(
    session({
      store,
      key: 'user_sid',
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        maxAge: 10000 * 60 * 60 * 24 * 30 * 6,
        secure: false,
        http: true,
      },
    }),
  );
  // Winston error logger
  app.use(
    expressWinston.errorLogger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
        winston.format.prettyPrint(),
      ),
    }),
  );

  const openApiDoc = initialize(app);
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(null, {
      swaggerUrl: '/v1/api-docs',
    }),
  );

  // Use dev and hot webpack middlewares
  if (isDev) {
    const { applyWebpackMiddleware } = require('./middlewares'); // eslint-disable-line global-require
    applyWebpackMiddleware(app);
  }

  // express-winston logger BEFORE the router
  if (isProd) {
    const { Loggly } = require('winston-loggly-bulk'); // eslint-disable-line global-require
    const loggly = new Loggly({
      token: '49a65f8a-56e0-4025-818d-e3f064e6ef01',
      subdomain: 'carpedalan',
      tags: ['Winston-NodeJS'],
      json: true,
    });

    winston.add(loggly);
    winston.log('info', 'Logger starting');

    app.use(
      expressWinston.logger({
        expressFormat: true,
        transports: [
          new winston.transports.Console(),
          new winston.transports.Loggly({
            token: '49a65f8a-56e0-4025-818d-e3f064e6ef01',
            subdomain: 'carpedalan',
            tags: ['Winston-NodeJS'],
            json: true,
          }),
        ],
      }),
    );
  }
  // Define routes
  router(app, openApiDoc);

  if (isProd) {
    const Sentry = require('@sentry/node'); // eslint-disable-line
    Sentry.init({
      dsn: 'https://c5f5ee9e1c904e618af3e609d3fdd7d2@sentry.io/1380082',
    });
    app.use(Sentry.Handlers.errorHandler());
  }

  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars,prettier/prettier

    res.status(500).render('index', {
      layout: false,
      isProd,
      session: req.session ? JSON.stringify(req.session) : 'false',
      assetDomain,
      meta: JSON.stringify({
        status: 500,
        cdn: cdnDomain,
        ci,
        nodeEnv,
        error: err,
      }),
      clientAssets,
    });
  });
  return { app, store, pool, openApiDoc };
  // return { app };
};

export const start = expressApp => {
  expressApp.listen(port);
};

export const stop = expressApp => expressApp.close();
