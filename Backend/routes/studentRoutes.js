const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Student } = require('../models');

function verifyToken(req, res, next) {
  const token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['x-access-token'];
  if (!token) return res.status(403).send('Token requerido');

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).send('Token inválido');
  }
}



router.get('/', verifyToken, async (req, res) => {
  const students = await Student.findAll();
  res.render('students', { students, token: req.query.token });
});

const isValidToken = /^[a-zA-Z0-9-_]+$/.test(req.body.token);
if (!isValidToken) return res.status(400).send('Token inválido');
res.redirect('/students?token=' + req.body.token);

router.post('/delete/:id', verifyToken, async (req, res) => {
  await Student.destroy({ where: { id: req.params.id } });
  res.redirect('/students?token=' + req.body.token);
});

module.exports = router;
