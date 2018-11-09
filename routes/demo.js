var express = require('express');
var router = express.Router();
var crypto = require('crypto');

function getRandomNonce() {
  const nonceLength = 32;
  return crypto.randomBytes(Math.ceil(nonceLength * 3 / 4)).toString('base64');
};


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
  const cspNonce = getRandomNonce();
  const csp = "script-src 'report-sample' 'nonce-" + cspNonce + "' 'unsafe-inline' 'strict-dynamic'  https://www.google-analytics.com https://*.googleapis.com https: http: 'unsafe-eval' 'self'; object-src none; base-uri 'self'";

  res.set('Content-Security-Policy', csp);

  res.render('page-with-xss-and-googleapis-and-nonce', { name: req.param('name'), cspNonce: cspNonce });
});

module.exports = router;
