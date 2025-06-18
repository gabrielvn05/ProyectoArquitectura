const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("Intentando loguear:", email);

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("Usuario no encontrado");
      return res.render('login', { error: 'Credenciales inválidas' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Contraseña incorrecta");
      return res.render('login', { error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    console.log("Login exitoso");
    res.render('inicio', { user, token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('register', { error: 'Por favor complete todos los campos.' });
  }

  try {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.render('register', { error: 'El correo ya está registrado.' });
    }

    await User.create({ email, password });

    res.redirect('/');
  } catch (error) {
    console.error('Error al registrar:', error);
    res.render('register', { error: 'Error interno, intente más tarde.' });
  }
});


module.exports = router;
