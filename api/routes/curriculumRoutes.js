const express = require('express');
const { expressjwt: jwtMiddleware } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const CurriculumItem = require('../models/CurriculumItem');
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

router.get('/', checkJwt, async (req, res) => {
  try {
    const curriculumItems = await CurriculumItem.find();
    res.send(curriculumItems);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put('/:id', checkJwt, async (req, res) => {
  try {
    const item = await CurriculumItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    websocket.broadcast({ type: 'UPDATE', data: item });
    res.send(item);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
