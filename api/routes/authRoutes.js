const express = require('express');
const jwt = require('jsonwebtoken');
const { expressjwt: jwtMiddleware } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
require('dotenv').config();

const router = express.Router();

const checkJwt = jwtMiddleware({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

router.get('/login', (req, res) => {
  res.redirect(`https://${process.env.AUTH0_DOMAIN}/authorize?response_type=code&client_id=${process.env.AUTH0_CLIENT_ID}&redirect_uri=${process.env.AUTH0_CALLBACK_URL}&scope=openid profile email`);
});

router.get('/callback', async (req, res) => {
  const code = req.query.code;
  const tokenResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.AUTH0_CALLBACK_URL
    })
  });
  const tokens = await tokenResponse.json();
  const userInfo = jwt.decode(tokens.id_token);

  // Store tokens in session or cookie
  req.session.tokens = tokens;

  res.redirect('/');
});

router.get('/logout', (req, res) => {
  req.session = null;
  res.redirect(`https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${process.env.AUTH0_CALLBACK_URL}`);
});

module.exports = router;
