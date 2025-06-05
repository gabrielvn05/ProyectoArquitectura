const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcrypt');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const { sequelize, User } = require('./models');

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend'));
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/', authRoutes);
app.use('/students', studentRoutes);

async function createAdminUser() {
  try {
    const existingUser = await User.findOne({ where: { email: 'admin@admin.com' } });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        email: 'admin@admin.com',
        password: hashedPassword
      });
      console.log('Usuario admin creado');
    } else {
      console.log('Usuario admin ya existe');
    }
  } catch (error) {
    console.error('Error creando el usuario admin:', error);
  }
}

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    createAdminUser();
  });
});
