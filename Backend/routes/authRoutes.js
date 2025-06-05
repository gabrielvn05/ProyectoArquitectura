const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

// Mostrar el formulario de login
router.get('/', (req, res) => {
  res.render('login');
});

// Procesar login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).send('Credenciales inválidas');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send('Credenciales inválidas');
    }

    // Crear token
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

    // Si login exitoso, renderiza la pantalla de inicio
    res.render('inicio', { user, token });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
