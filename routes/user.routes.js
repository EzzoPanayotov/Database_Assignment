const express = require('express');
const router = express.Router();
const Article = require('../model/article');
const User = require('../model/user');

router.get('/', async (req, res) => {
  const articles = await Article.find();
  const users = await User.findOne();
  res.render('index', { title: 'Home', articles: articles, users: users });
});
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});
router.get('/logout', (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
});
router.get('/newArticle', (req, res) => {
  res.render('newArticle', { title: 'New Article', article: new Article() });
});
router.get('/editArticles/:id', async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render('editArticles', { title: 'Edit', article: article });
});
router.get('/:id', async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (article == null) res.redirect('/');
  res.render('showArticles', { title: 'Show Article', article: article });
});

module.exports = router;
