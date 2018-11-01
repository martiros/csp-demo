var express = require('express');
var router = express.Router();

router.get('/page-with-xss', function(req, res, next) {
  res.render('page-with-xss', { name: req.param('name') });
});

router.get('/csp-protection-for-basic-page', function(req, res, next) {
  res.set('Content-Security-Policy', `script-src 'self' ; object-src 'none';`);

  res.render('page-with-xss', { name: req.param('name') });
});

router.get('/insufficient-csp-protection', function(req, res, next) {
  res.set('Content-Security-Policy', `script-src 'self' https://www.google-analytics.com https://*.googleapis.com; object-src 'none';`);
  res.render('page-with-xss-and-googleapis', { name: req.param('name') });
});

router.get('/advanced-xss-protection', function(req, res, next) {
  res.set('Content-Security-Policy', `script-src 'self'; object-src 'none';`);

  res.render('page-with-xss-and-googleapis', { name: req.param('name') });
});

module.exports = router;
