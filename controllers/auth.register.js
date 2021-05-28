const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../model/user');
const checkPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
const checkEmail =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const checkName = /^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
const routes = require('../routes/user.routes');

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password: plainTextPassword } = req.body;

  if (!firstName.match(checkName)) {
    res
      .status(500)
      .send({ message: 'First Name cannot contain numbers or symbols' });
    return;
  }
  if (!lastName.match(checkName)) {
    res
      .status(500)
      .send({ message: 'Last Name cannot contain numbers or symbols' });
    return;
  }

  if (!plainTextPassword.match(checkPassword)) {
    res.status(500).send({
      message:
        'The password should be between 6 to 20 characters and it must contain at least one number, one uppercase and one lowercase letter',
    });
    return;
  }
  if (!email.match(checkEmail)) {
    res.status(500).send({ message: 'Invalid email address' });
    return;
  }
  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const createUser = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    console.log('User created successfully', createUser);
    return res.redirect('/');
  } catch (error) {
    if (error.code === 11000) {
      return await res.status(500).send({ message: 'Email already in use' });
    }
    throw error;
  }
});

module.exports = router;
