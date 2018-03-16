/**
 * Main application routes
 */

'use strict';

//import errors from './components/errors';
//import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/bakerys', require('./api/bakery'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth').default);
  app.use(function(err, req, res, next) {
    let myError = {
      status: 500,
      message: err.message || 'Internal server error'
    };
    switch (err.name) {
    case 'UnauthorizedError':
      myError = {
        status: 401,
        message: 'invalid token...'
      };
      break;
    case 'ValidationError':
      myError.status = 422;
      break;
    default:
      console.log('debug ==> ', err);
      break;
    }
    return res.status(myError.status).send(myError);
  });
  /*
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the app.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/app.html`));
    });
    */
}
