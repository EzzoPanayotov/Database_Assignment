const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const secret = require('../config/auth.config');
const routes = require('../routes/user.routes');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.status(404).send({ message: 'Invalid email/password' });
  }
  const maxAge = 3 * 24 * 60 * 60;
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      secret.MY_SECRET,
      {
        expiresIn: maxAge,
      }
    );
    if (res.status(302)) {
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      });
      return res.redirect('/');
    }
  }
  return res.status(401).send({ message: 'Invalid email/password' });
});

module.exports = router;
